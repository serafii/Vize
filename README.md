# VIZE Codebase Explainer

[https://vize-qzbg.onrender.com/](https://vize-qzbg.onrender.com/)

[![Python Version](https://img.shields.io/badge/python-3.11+-blue)](https://www.python.org/)  
[![Status](https://img.shields.io/badge/status-beta-yellow)]()

<img width="1894" height="910" alt="image" src="https://github.com/user-attachments/assets/e41ae0be-288e-4854-b328-2e0c51694708" />

AI-powered tool that analyzes and summarizes codebases to help developers quickly understand unfamiliar projects.

---

## Features

- Analyze uploaded codebases (ZIP, URL)
- Generate structured insights:
  - Project metadata
  - Technologies used
  - Architecture overview
  - System flow
  - Key components
- Detect dominant programming languages
- Safe processing (size limits, secure extraction, validation)
-

---

## How It Works

1. Upload a ZIP file or paste the repository URL
2. Validate and extract contents
3. Parse and filter relevant files
4. Send structured data to the LLM
5. Return analysis as JSON

---

## Tech Stack

- **Backend:** FastAPI, Python, asyncio
- **AI:** LLM (Anthropic Claude)
- **Frontend:** React, TypeScript, Vite
