import fitz  # PyMuPDF
import openai
import tiktoken
import os
import time
import pytesseract
from PIL import Image

# Configure pytesseract path
# pytesseract.pytesseract.tesseract_cmd = r'<path_to_your_tesseract_executable>'
# e.g., on Windows, it might look like: C:\Program Files\Tesseract-OCR\tesseract.exe
# e.g., on Linux, it might look like: pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'
pytesseract.pytesseract.tesseract_cmd = os.getenv('TESSERACT_CMD', 'tesseract')

# Configure OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    if len(text) < 40:
        text = ocr_pdf(doc)
    return text

def ocr_pdf(doc):
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text += pytesseract.image_to_string(img)
    return text

def query_gpt(prompt):
    max_retries = 3
    retry_delay = 25
    try_count = 0

    encoding = tiktoken.encoding_for_model(os.getenv('GPT_MODEL'))
    prompt_tokens = len(encoding.encode(prompt))
    max_completion_tokens = int(os.getenv('GPT_MODLE_CONTEXT_WINDOW')) - prompt_tokens 

    while try_count < max_retries:
        try:
            response = openai.completions.create(
                model=os.getenv('GPT_MODEL'),
                prompt=prompt,
                temperature=0.5,
                max_tokens=min(2048, max_completion_tokens),
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            return response.choices[0].text.strip()
        except Exception as e:
            print(f"Error processing prompt: {str(e)}")
            print(f"\nRetrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
            try_count += 1

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
                    "duration_months": Duration
                }
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
                    "duration_months": Duration
                }
            }
        ],
        "college": {
            "name": "College Name",
            "branch": "Branch",
            "degree": "Degree",
            "cgpa": CGPA,
            "start": "month,yyyy",
            "end": "month,yyyy"
        }
    }

    Directly parse and structure the resume text into this JSON format, ensuring all fields are accurately filled with the provided data or marked as 'N/A' for string and 0 for number if unavailable."""

    extracted_text = query_gpt(prompt + "\n\nResume Text:\n" + text)
    return extracted_text

def extract_details(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    resume_details = extract_from_gpt(text)
    
    start_index = resume_details.find('{')
    end_index = resume_details.rfind('}')
    resume_details = resume_details[start_index:end_index+1]
    return resume_details
