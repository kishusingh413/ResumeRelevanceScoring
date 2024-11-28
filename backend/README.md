## Backend

This document provides a comprehensive overview of the backend system designed for extraction, processing and scoring resumes based on job descriptions and roles.

### APIs and Utilities

| Function      | Description                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| /create_task  | Creates a task and provides an authentication token.                                                                                       |
| /upload_files | Uploads resume files (PDF format only) and associates them with a task.                                                                    |
| /process_task | Attaches job descriptions, analyzes resumes, and scores them based on relevance to provided 'role' and 'job description'.                  |
| auth          | Custom authentication middleware that validates the access token provided with each request. Ensures only authorized access to tasks.      |
| extraction    | Performs text extraction from resumes (from text or image) using PyMuPDF & PLI and segments the resume details.                            |
| scoring       | Utilizes the OpenAI API to calculates relevance scores for projects, professional experiences, and overall score based on job description. |

### Data Flow

- **Input:** Resumes in PDF format.
- **Processing:** Text extraction, OCR (if needed), JSON structuring, relevance scoring.
- **Output:** JSON object containing structured resume details with relevance scores.

### Design and Approach

- **Flexibility:** Designed to handle various resume formats and content structures.
- **Scalability:** Engineered for efficient processing of multiple resumes simultaneously.
- **Cost-Effectiveness:** Minimizes API calls to external services.

### Models and Technologies Used

| Component            | Description                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| PyMuPDF              | Efficient PDF text extraction.                                                                             |
| Pytesseract & Pillow | OCR capabilities for image-based PDFs.                                                                     |
| OpenAI GPT-3         | Utilized for natural language processing tasks, including content extraction and relevance scoring.        |
| Django & DRF         | Provides the RESTful API and backend application framework.                                                |
| SQLite               | Used for development simplicity and to avoid external dependencies like PostgreSQL for this demonstration. |
| Docker               | Containerization for consistency and simplified deployment.                                                |

### Best Practices & Optimizations

- **Secure API Key Storage:** Utilizes environment variables for API keys.
- **Modular Code Structure:** Facilitates maintenance and scalability.
- **Dockerization:** Ensures consistent environments and simplifies deployment.
- **Prompt Engineering:** Designed to reduce token usage and improve response parsing.
- **Batch Processing:** Minimizes API calls by processing multiple items in a single request.
- **Caching:** Reuses scoring results for common roles and technologies.
