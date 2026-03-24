from app.utils.importance import (
    IMPORTANT_FILES_CORE, 
    IMPORTANT_FILES_INFRA, 
    IMPORTANT_FILES_CONFIG,
    IMPORTANT_NAMES_CORE, 
    IMPORTANT_NAMES_SUPPORTING,
    IMPORTANT_EXTENSIONS_SOURCE, 
    IMPORTANT_EXTENSIONS_DATA
)
import os

def score_file(file_name:str, ext: str, rel_path: str) -> int:
    score = 0
    name = file_name.lower()

    if name in IMPORTANT_FILES_CORE:
        score += 200
    elif name in IMPORTANT_FILES_INFRA:
        score += 150
    elif name in IMPORTANT_FILES_CONFIG:
        score += 100

    if any(keyword in name for keyword in IMPORTANT_NAMES_CORE):
        score += 60
    
    if any(keyword in name for keyword in IMPORTANT_NAMES_SUPPORTING):
        score += 30
    
    if ext in IMPORTANT_EXTENSIONS_SOURCE:
        score += 40
    elif ext in IMPORTANT_EXTENSIONS_DATA:
        score += 20

    depth = rel_path.count(os.sep)
    if depth <= 1:
        score += 25
    elif depth <= 3:
        score += 20
    else:
        score += 10

    if "src/" in rel_path or "app/" in rel_path or "lib/" in rel_path or "core/" in rel_path:
        score += 20
    
    if "test/" in rel_path or "tests/" in rel_path or "__tests__/" in rel_path or "spec/" in rel_path:
        score -= 30
    
    if "docs/" in rel_path or "examples/" in rel_path or "samples/" in rel_path:
        score -= 20
    
    return max(0, score)

