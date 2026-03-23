import zipfile
from fastapi import APIRouter, Form, File, UploadFile
from app.services.parse import parse_directory, validate_repository, validate_zip, cleanup_directory, safe_extract
from app.services.format import format_analysis_input
from app.processing.analysis import codebase_analysis
from app.services.fetch import repo_exists, clone_repository, verify_repository
import uuid
import asyncio
import os

upload_router = APIRouter()

MAX_CONCURRENT_JOBS = 3
semaphore = asyncio.Semaphore(MAX_CONCURRENT_JOBS)

@upload_router.post("/analyze", tags=["upload"])
async def analyze_codebase(url: str = Form(None), file: UploadFile = File(None)):
    if not url and not file:
        return {"success": False, "message": "Provide URL or zip file"}
    
    async with semaphore:
        upload_dir = f"temp_{uuid.uuid4().hex}"
        os.makedirs(upload_dir, exist_ok=True)

        try:
            if url:
                # Verify that the repository exists
                if not repo_exists(url):
                    return {"success":False, "message":"Repository not found or too large"}
                    
                # Clone the repository and validate its contents
                try:
                    await asyncio.to_thread(clone_repository, url, upload_dir)
                except Exception:
                    return {"success": False, "message": "Failed to clone repository"}

                try:
                    valid, error = await asyncio.wait_for(asyncio.to_thread(verify_repository, upload_dir),timeout=10)
                except asyncio.TimeoutError:
                    return {"success": False, "message": "Repository too large or slow"}

                if not valid:
                    return {"success": False, "message": error}
                    
                try:
                    return await asyncio.wait_for(process_pipeline(upload_dir, "url", url),timeout=60)
                except asyncio.TimeoutError:
                    return {"success": False, "message": "Processing timed out"}
                
            elif file:
                # Validate the zip file before extracting
                is_valid, error_message = validate_zip(file)
                if not is_valid:
                    return {"success": False, "message": error_message}

                # Extract the zip file and proceed to parse files if the size is acceptable

                with zipfile.ZipFile(file.file, 'r') as zip_ref:
                    try:
                        await asyncio.wait_for(asyncio.to_thread(safe_extract, zip_ref, upload_dir),timeout=10)
                    except asyncio.TimeoutError:
                        return {"success": False, "message": "Extraction timed out"}

                file.file.seek(0)

                try:
                    return await asyncio.wait_for(process_pipeline(upload_dir, "file", file.filename),timeout=60)
                except asyncio.TimeoutError:
                    return {"success": False, "message": "Processing timed out"}
                
        except Exception as e:
            return {"success": False, "message": str(e)}
        finally:
            cleanup_directory(upload_dir)

async def process_pipeline(path: str, type: str, source: str):
    # Parse the extracted directory and clean up afterward
    try:
        parse_result = await asyncio.to_thread(parse_directory, path)
                
        valid, error = validate_repository(parse_result)

        if not valid:
            return {
                "success": False,
                "error": error
            }

        codebase_analysis_prompt = format_analysis_input(parse_result)

        # Prompt the LLM with the formatted codebase analysis input and return the response
        result = await asyncio.to_thread(codebase_analysis, codebase_analysis_prompt)
    except ValueError as ve:
        return {
            "success": False,
            "error": str(ve)
        }

    return {
        "success": True,
        "type": type,
        "source": source,
        "data": parse_result,
        "analysis": result
        }