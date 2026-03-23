import requests as req
import subprocess
import os
from app.services.parse import MAX_FILES, MAX_UNZIPPED_SIZE_MB
from app.utils.blacklist import LARGE_REPO_BLACKLIST

# Verify if the repository is accessible
def repo_exists(url:str) -> bool:
    if url in LARGE_REPO_BLACKLIST:
        return False

    try:
        res = req.head(url, allow_redirects=True, timeout=5)
        if res.status_code < 400:
            return True

        # fallback
        res = req.get(url, timeout=5)
        return res.status_code < 400

    except:
        return False

# Temporarily clone the repository for analysis    
def clone_repository(url:str, temp_dir: str) -> str:
    subprocess.run(
        [
            "git", "clone",
            "--depth", "1",          
            "--single-branch",       
            "--no-tags",             
            url,
            temp_dir
        ],
        check=True,
        timeout=25
    )
    return temp_dir

# Verify that the cloned repository is within size and file count limits
def verify_repository(repo_path: str) -> tuple[bool, str | None]:
    total_size = 0
    total_files = 0

    for root, dirs, files in os.walk(repo_path):
        if ".git" in dirs:
            dirs.remove(".git")

        for file in files:
            total_files += 1
            total_size += os.path.getsize(os.path.join(root, file))

            size_mb = total_size / (1024 * 1024) # Convert bytes to megabytes

            if size_mb > MAX_UNZIPPED_SIZE_MB:
                return False, f"Repository too large ({round(size_mb,2)} MB)"

            if total_files > MAX_FILES:
                return False, f"Too many files ({total_files})"

    return True, None