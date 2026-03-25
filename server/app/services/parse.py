import os
import shutil
import stat
import zipfile
import time
from fastapi import UploadFile
from app.utils.languages import KNOWN_LANGUAGES, IGNORED_DIRS, IGNORED_EXTENSIONS
from app.utils.importance import IMPORTANT_FILES_CORE
from app.services.score import score_file

MAX_UNZIPPED_SIZE_MB = 50
MAX_FILES = 2000
MAX_SNIPPETS = 12
MAX_CANDIDATES = 100
MIN_TOTAL_FILES = 1
MIN_CODE_FILES = 1

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

# Validate that the parsed file is a valid code repository
def validate_repository(parse_result: dict) -> tuple[bool, str | None]:
    total_files = parse_result.get("total_files", 0)
    languages = parse_result.get("languages", {})

    if total_files < MIN_TOTAL_FILES:
        return False, f"Repository too small ({total_files} files)"

    code_files = 0
    for lang, percentage in languages.items():
        if lang != "Other":
            # Convert percentage back to approximate count
            code_files += int((percentage / 100) * total_files)

    if code_files < MIN_CODE_FILES:
        return False, "Not enough code files detected"
    
    return True, None
    

# Walk through the directory and count files, directories, and total size while ignoring irrelevant files and directories
def parse_directory(directory:str) -> dict:
    total_files = 0
    total_dirs = 0
    total_size = 0

    language_frequency = {}
    candidates = []

    for root, dirs, files in os.walk(directory):

        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith(".")]

        total_dirs += len(dirs)

        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in IGNORED_EXTENSIONS or file.startswith("."):
                continue

            file_path = os.path.join(root, file)

            file_size = os.path.getsize(file_path)

            total_files += 1
            total_size += file_size
        
            # Count language frequency
            lang = KNOWN_LANGUAGES.get(ext, "Other")
            language_frequency[lang] = language_frequency.get(lang, 0) + 1

            is_known = ext in KNOWN_LANGUAGES
            is_important_file = file.lower() in IMPORTANT_FILES_CORE

            # Skip lesser known files to focus on main important files
            if not is_known and not is_important_file:
                continue

            # Skip very small files
            if file_size < 100:
                continue

            rel_path = os.path.relpath(file_path, directory)

            score = score_file(file, ext, rel_path)

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read(10_000)
                
                if len(content.strip()) < 50:
                    continue
                if len(candidates) < MAX_CANDIDATES:
                    candidates.append({
                        "path": rel_path,
                        "content": content,
                        "score": score
                })
                else: # Replace the worst candidate if the current file has a higher score
                    min_candidate = min(candidates, key=lambda x: x["score"])
                 
                    if score > min_candidate["score"]:
                        candidates.remove(min_candidate)
                        candidates.append({
                            "path": rel_path,
                            "content": content,
                            "score": score
                        })
            except Exception as e:
                print("Error reading file:", e)

            # END of file loop

    total_size = total_size / (1024 * 1024) # Convert bytes to megabytes
    total_size = round(total_size, 2)

    # Extract dominant languages and group the rest as "Other"

    sorted_langs = sorted(language_frequency.items(), key=lambda x: x[1], reverse=True)

    top_langs = 3
    dominant_languages = {}
    other_count = 0

    for i, (lang, count) in enumerate(sorted_langs):
        if i < top_langs and lang != "Other" and total_files > 0:
            dominant_languages[lang] = round((count / total_files) * 100, 2)
        else:
            other_count += count

    if other_count > 0:
        dominant_languages["Other"] = round((other_count / total_files) * 100, 2)

    # Get top code snippets based on candidate score
    sorted_candidates = sorted(candidates, key=lambda x: x["score"], reverse=True)
    snippets = sorted_candidates[:MAX_SNIPPETS]

    for s in snippets:
        s.pop("score", None)

    return {"total_files": total_files, "total_dirs": total_dirs, "total_size": total_size, "languages": dominant_languages, "snippets": snippets}

# Helper function to remove read-only files during cleanup on Windows
def remove_readonly(func, path, excinfo):
    # Change the file to writable and retry
    os.chmod(path, stat.S_IWRITE)
    func(path)

# Removes the temporary directory
def cleanup_directory(upload_dir: str):
    for _ in range(3):
        try:
            shutil.rmtree(upload_dir, onexc=remove_readonly)
            return
        except Exception:
            time.sleep(0.2)
    print("Cleanup error after retries:", upload_dir)

# Ensures that the zip file is safely extracted
def safe_extract(zip_ref: zipfile.ZipFile, path: str):
    os.makedirs(path, exist_ok=True)

    for member in zip_ref.infolist():
        member_path = os.path.join(path, member.filename)
        if not os.path.abspath(member_path).startswith(os.path.abspath(path)):
            raise Exception("Unsafe zip file")

    zip_ref.extractall(path)
