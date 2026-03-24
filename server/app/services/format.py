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
You are a senior software engineer analyzing a real-world codebase.

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

{snippet}

====================
TASK
====================
Analyze this codebase and provide return the result in STRICT JSON format.

The JSON must follow this EXACT structure:

{{
  "purpose": "Clear practical description of what the system does",
  "technologies": ["Only key technologies/frameworks/libraries that are central to the project and affect its behavior"],
  "architecture": "Describe system structure AND key design choices (e.g., monolithic, microservices, etc.). Important patterns or design principles used",
  "system_flow": "[Each item is a step representing a key stage in the data flow through the system, including processing steps, interactions, and transformations]",
  "components": [
    {{
      "name": "Core system component (backend service, API layer, processing module, or architecture-level unit)",
      "description": "Explain what it does AND include relevant internal logic or processing (how it works)"
    }}
  ]
}}

====================
STRICT RULES
====================
RELEVANCE:
- ONLY include components that affect system behavior, data flow, or architecture
- DO NOT include  UI-only components
- DO NOT include trivial or obvious files/components

COMPONENT QUALITY:
- A component is a core system unit responsible for processing, data handling, or system behavior
- Components must represent meaningful parts of the system 
- Components must be ordered by importance to the system and should be relevant
- DO NOT repeat components
- Each component description MUST include some insight into logic, processing, or responsibility
- Avoid vague descriptions like "handles data" — explain HOW

LOGIC & ALGORITHMS:
- Infer and describe important processing logic where possible
- Include how data is transformed, validated, or processed
- If algorithms or decision logic exist, briefly explain how they work
- Do NOT invent logic that is not supported by the snippets

ARCHITECTURE:
- Go beyond naming the pattern — explain how the code is actually structured

SYSTEM FLOW:
- MUST be a step-by-step array (input → processing → output)
- DO NOT use numbers inside the array
- Include meaningful internal steps, not just high-level flow

AVOID GENERIC OUTPUT:
- Do NOT produce generic summaries
- Do NOT repeat the same idea across fields
- Be concise but information-dense

OUTPUT:
- Return ONLY valid JSON. No text or explanations outside the JSON structure.
- Be concise and accurate
- Some files may be incomplete or truncated. Do not assume missing details
- Every part of the output must provide insight, not surface-level information
- DO NOT hallucinate missing features or details
"""
    return prompt