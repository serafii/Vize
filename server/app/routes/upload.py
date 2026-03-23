import zipfile
from fastapi import APIRouter, Form, File, UploadFile
from app.services.parse import parse_directory, validate_zip, cleanup_directory, safe_extract
import uuid

upload_router = APIRouter()


@upload_router.post("/analyze", tags=["upload"])
async def analyze_codebase(url: str = Form(None), file: UploadFile = File(None)):
    if not url and not file:
        return {"success": False, "message": "Provide URL or zip file"}
    
    upload_dir = f"uploaded_codebase_{uuid.uuid4().hex}"
    
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
            print(parse_result)
            
        finally:
            cleanup_directory(upload_dir)

        return {
        "success": True,
        "type": "file",
        "filename": file.filename,
        "data": parse_result
    }