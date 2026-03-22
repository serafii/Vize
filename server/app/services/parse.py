import os
import shutil
import zipfile
from fastapi import UploadFile

MAX_UNZIPPED_SIZE_MB = 50
MAX_FILES = 2000

IGNORED_DIRS = {
    "node_modules", ".git", "__pycache__", "dist", "build", ".next", ".venv"
}

IGNORED_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg",
    ".exe", ".dll", ".so",
    ".zip", ".tar", ".gz"
}


# Validate the zip file before extracting to ensure it doesn't exceed size or file count limits
def validate_zip(file: UploadFile) -> tuple[bool, str | None]:
    total_size = 0
    total_files = 0

    if not file.filename.endswith(".zip"):
        return False, "Only .zip files are allowed"

    with zipfile.ZipFile(file.file, 'r') as zip_ref:
        for info in zip_ref.infolist():
            total_size += info.file_size
            total_files += 1

    size_mb = total_size / (1024 * 1024) # Convert bytes to megabytes

    if size_mb > MAX_UNZIPPED_SIZE_MB:
        return False, f"Zip too large ({round(size_mb,2)} MB)"

    if total_files > MAX_FILES:
        return False, f"Too many files ({total_files})"

    return True, None

# Walk through the directory and count files, directories, and total size while ignoring irrelevant files and directories
def parse_directory(directory:str) -> dict:
    total_files = 0
    total_dirs = 0
    total_size = 0

    for root, dirs, files in os.walk(directory):

        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith(".")]

        total_dirs += len(dirs)
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in IGNORED_EXTENSIONS:
                continue
            if file.startswith("."):
                continue

            file_path = os.path.join(root, file)

            total_files += 1
            total_size += os.path.getsize(file_path)
        
    total_size = total_size / (1024 * 1024) # Convert bytes to megabytes
    total_size = round(total_size, 2)

    return {"total_files": total_files, "total_dirs": total_dirs, "total_size": total_size}

def cleanup_directory(upload_dir: str):
    try:
        shutil.rmtree(upload_dir)
    except Exception as e:
        print("Cleanup error:", e)

def safe_extract(zip_ref: zipfile.ZipFile, path: str):
    os.makedirs(path, exist_ok=True)

    for member in zip_ref.infolist():
        member_path = os.path.join(path, member.filename)
        if not os.path.abspath(member_path).startswith(os.path.abspath(path)):
            raise Exception("Unsafe zip file")

    zip_ref.extractall(path)
