import os
from dotenv import load_dotenv
import anthropic
import json
import re

load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY")

client = anthropic.Anthropic()

def codebase_analysis(prompt: str):

    message = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1500,
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ],
)

    response = message.content[0].text
    result = extract_json(response)

    if "components" in result:
      result["components"] = clean_response_components(result["components"])
    
    result["components"] = result["components"][:10]

    return result

def extract_json(text: str):
    # Remove markdown code blocks (```json ... ```)
    text = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to extract JSON object from text
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return {"error": "Invalid JSON from LLM", "raw": text}

def clean_response_components(components):
    seen = set()
    cleaned = []

    for comp in components:
        name = comp.get("name")
        desc = comp.get("description")

        if not name or not desc:
            continue

        if name not in seen:
            seen.add(name)
            cleaned.append({
                "name": name.strip(),
                "description": desc.strip()
            })

    return cleaned