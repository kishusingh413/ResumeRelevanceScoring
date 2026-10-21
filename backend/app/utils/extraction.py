import os

import fitz
import pytesseract
from PIL import Image

from .llm_client import complete, parse_json_object

pytesseract.pytesseract.tesseract_cmd = os.getenv("TESSERACT_CMD") or "tesseract"


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    try:
        text = ""
        for page in doc:
            text += page.get_text()
        if len(text.strip()) < 40:
            text = ocr_pdf(doc)
        return text
    finally:
        doc.close()


def ocr_pdf(doc):
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        mode = "RGBA" if pix.n == 4 else "RGB"
        img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
        text += pytesseract.image_to_string(img)
    return text


def extract_from_gpt(text):
    prompt = """Transform the provided resume text into a JSON object strictly adhering to the format below. Use 'month,yyyy' for dates (e.g., May,2024) and express durations in months, keep descriptions concise, max 1-2 lines. Use 'N/A' for missing info. Only include the JSON output in your response.

    {
        "candidate_name": "Name",
        "email": "Email",
        "projects": [
            {
                "project_title": "Title",
                "short_description": "Description",
                "tech_stack": ["Technology"],
                "time_duration": {
                    "start": "month,yyyy",
                    "end": "month,yyyy",
                    "duration_months": 0
                },
                "relevancy": 0
            }
        ],
        "professional_experience": [
            {
                "role": "Role",
                "organization": "Organization",
                "short_description": "Description",
                "tech_stack": ["Technology"],
                "time_duration": {
                    "start": "month,yyyy",
                    "end": "month,yyyy",
                    "duration_months": 0
                },
                "relevancy": 0
            }
        ],
        "college": {
            "name": "College Name",
            "branch": "Branch",
            "degree": "Degree",
            "cgpa": 0,
            "start": "month,yyyy",
            "end": "month,yyyy"
        }
    }

    Directly parse and structure the resume text into this JSON format, ensuring all fields are accurately filled with the provided data or marked as 'N/A' for string and 0 for number if unavailable.

    Resume Text:
    """ + text
    return complete(prompt, temperature=0.2, max_tokens=4096)


def _as_list(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value and value != "N/A":
        return [value]
    return []


def _duration(value):
    value = value if isinstance(value, dict) else {}
    return {
        "start": value.get("start") or "N/A",
        "end": value.get("end") or "N/A",
        "duration_months": value.get("duration_months") or 0,
    }


def normalize_resume(data):
    if not isinstance(data, dict):
        raise ValueError("Extracted resume details were not a JSON object.")

    college = data.get("college") if isinstance(data.get("college"), dict) else {}
    projects = []
    for project in data.get("projects") or []:
        if not isinstance(project, dict):
            continue
        projects.append({
            "project_title": project.get("project_title") or "N/A",
            "short_description": project.get("short_description") or "N/A",
            "tech_stack": _as_list(project.get("tech_stack")),
            "time_duration": _duration(project.get("time_duration")),
            "relevancy": project.get("relevancy") or 0,
        })

    experiences = []
    for experience in data.get("professional_experience") or []:
        if not isinstance(experience, dict):
            continue
        experiences.append({
            "role": experience.get("role") or "N/A",
            "organization": experience.get("organization") or "N/A",
            "short_description": experience.get("short_description") or "N/A",
            "tech_stack": _as_list(experience.get("tech_stack")),
            "time_duration": _duration(experience.get("time_duration")),
            "relevancy": experience.get("relevancy") or 0,
        })

    return {
        "candidate_name": data.get("candidate_name") or "Unknown",
        "email": data.get("email") or "N/A",
        "projects": projects,
        "professional_experience": experiences,
        "college": {
            "name": college.get("name") or "N/A",
            "branch": college.get("branch") or "N/A",
            "degree": college.get("degree") or "N/A",
            "cgpa": college.get("cgpa") if college.get("cgpa") is not None else 0,
            "start": college.get("start") or "N/A",
            "end": college.get("end") or "N/A",
        },
        "relevance_score": data.get("relevance_score") or 0,
    }


def extract_details(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    if not text or not text.strip():
        raise ValueError(
            "Could not read any text from this PDF. Scanned resumes need the Tesseract language data installed in the backend container."
        )
    return normalize_resume(parse_json_object(extract_from_gpt(text)))
