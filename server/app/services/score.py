from app.utils.importance import IMPORTANT_NAMES, IMPORTANT_FILES, IMPORTANT_EXTENSIONS
import os

def score_file(file_name:str, ext: str, rel_path: str) -> int:
    score = 0

    name = file_name.lower()

    if name in IMPORTANT_FILES:
        score += 100

    for keyword in IMPORTANT_NAMES:
        if keyword in name:
            score += 50
    
    if ext in IMPORTANT_EXTENSIONS:
        score += 20

    depth = rel_path.count(os.sep)
    if depth == 0:
        score += 30
    elif depth == 1:
        score += 20
    elif depth == 2:
        score += 10
    else:
        score += 0

    return score