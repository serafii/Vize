# This function takes the parsed directory information and formats it
def format_analysis_input(parse_result: dict) -> str:
    try:
        total_files = parse_result["total_files"]
        total_dirs = parse_result["total_dirs"]
        total_size = parse_result["total_size"]
        language_frequency = parse_result["languages"]
        snippets = parse_result["snippets"]
    except KeyError:
        return "Invalid parse result format"

    metadata = {
        "total_files": total_files,
        "total_dirs": total_dirs,
        "total_size_mb": total_size,
        "dominant_languages": language_frequency
    }

    return write_input_to_prompt(metadata, snippets)

# This function formats the code snippets into a structured string for the prompt.
def format_snippets(snippets):
    formatted = []

    for snip in snippets:
        path = snip["path"].replace("\\", "/")
        content = snip["content"].strip()[:2000]  # Limit content to 2000 characters


        formatted.append(f"""
--------------------
File: {path}
--------------------
# Important snippet from repository
{content}
""")

    return "\n".join(formatted)

# This function formats the language distribution into a readable string.
def format_languages(languages):
    return ", ".join([f"{lang} ({perc}%)" for lang, perc in languages.items()])

# This function combines the metadata and code snippets into a structured prompt for analysis.
def write_input_to_prompt(metadata: dict, snippets: list) -> str:
    snippet = format_snippets(snippets)

    prompt= f"""
You are analyzing a software codebase repository.

====================
METADATA
====================
Total files: {metadata['total_files']}
Total directories: {metadata['total_dirs']}
Total size: {metadata['total_size_mb']} MB
Dominant languages: {format_languages(metadata['dominant_languages'])}

====================
CODE SNIPPETS
====================
The following are selected important files from a repository.
Each file contains a partial code snippet and may not represent the full content of the file.
\n{snippet}

====================
TASK
====================
Analyze this codebase and provide return the result in STRICT JSON format.

The JSON must follow this exact structure:

{{
  "purpose": "string",
  "technologies": ["string"],
  "architecture": "string",
  "system_flow": "string",
  "components": [
    {{
      "name": "string",
      "description": "string"
    }}
  ]
}}

Rules:
- Do not include any text outside the JSON
- Only use the provided information
- Be concise and accurate
- Do not repeat components
- Some files may be incomplete or truncated. Do not assume missing details
- The analysis should be understandable to someone with basic programming knowledge.
- The purpose of the analysis is to give a high-level overview of the codebase for developers who want to quickly understand what the project is about.
"""
    return prompt