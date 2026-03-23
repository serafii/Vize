import zipfile
from fastapi import APIRouter, Form, File, UploadFile
from app.services.parse import parse_directory, validate_repository, validate_zip, cleanup_directory, safe_extract
from app.services.format import format_analysis_input
from app.processing.analysis import codebase_analysis
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
        upload_dir = f"uploaded_codebase_{uuid.uuid4().hex}"
        os.makedirs(upload_dir, exist_ok=True)
    
    if url:
        # Will be added after the file upload logic is implemented
       return {"success": True, "type": "url", "message": "URL logic to be implemented"}
    elif file:
        # Validate the zip file before extracting
        is_valid, error_message = validate_zip(file)
        if not is_valid:
            return {"success": False, "message": error_message}

        # Extract the zip file and proceed to parse files if the size is acceptable

        with zipfile.ZipFile(file.file, 'r') as zip_ref:
            safe_extract(zip_ref, upload_dir)

        file.file.seek(0)

        # Parse the extracted directory and clean up afterward
        try:
            parse_result = parse_directory(upload_dir)
            
            valid, error = validate_repository(parse_result)

            if not valid:
                return {
                    "success": False,
                    "error": error
                }

            codebase_analysis_prompt = format_analysis_input(parse_result)

            # Prompt the LLM with the formatted codebase analysis input and return the response
            result = codebase_analysis(codebase_analysis_prompt)
        except ValueError as ve:
            return {
                "success": False,
                "error": str(ve)
            }
        finally:
            cleanup_directory(upload_dir)

        return {
        "success": True,
        "type": "file",
        "filename": file.filename,
        "data": parse_result,
        "analysis": result
    }