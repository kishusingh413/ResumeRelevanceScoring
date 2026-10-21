## Updated README for Overall Project

This project streamlines the recruitment process by enabling employers to efficiently identify the most suitable candidates from a pool of resumes. It offers a web-based interface where employers can upload several resumes and input job descriptions. The system then processes these resumes, evaluates them for relevance to the specified job description, and displays the results in an accessible web interface. This solution leverages cutting-edge technology to extract, analyze, and score each resume's content, ensuring a smooth and effective candidate selection process.

### Features

- **Resume Upload**: Allows employers to upload multiple resumes for processing.
- **Job Description Input**: Enables input of detailed job descriptions to guide the analysis.
- **Relevance Scoring**: Analyzes and assigns relevance scores to resumes based on the job description.
- **Resume Management**: Facilitates adding or removing uploaded resumes.
- **Adjustable Relevancy Level**: Permits employers to adjust the relevancy threshold as needed.
- **Detailed Candidate Insights**: Provides insights into candidates' education, projects, and professional experiences, including detailed relevancy scores.
- **User-Friendly Web Interface**: Features a responsive interface modeled on the provided Figma design.

### Application Flow

```
+----------------+     +---------------+     +-----------------+     +-------------------+
|                |     |               |     |                 |     |                   |
| Web Interface  |---->|  Create Task  |---->|  Upload Resumes |---->|    Submit Job     |
| (Employer)     |     | (Generate ID) |     |  & Job Desc     |     |    Description    |
|                |     |               |     |                 |     |                   |
+----------------+     +---------------+     +-----------------+     +-------------------+
                                                                               |
                                                                               v
                                                                     +-------------------+
                                                                     |                   |
                                                                     |  Analyze & Score  |
                                                                     |   Resumes based   |
                                                                     | on Job Description|
                                                                     |                   |
                                                                     +-------------------+
                                                                               |
                                                                               v
                                                                    +----------------------+
                                                                    |                      |
                                                                    |   Display Results &  |
                                                                    |   Allow Adjustments  |
                                                                    |                      |
                                                                    +----------------------+
```

### Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Redux Toolkit, Axios, React-PDF, Lucide-react, served using Nginx.
- **Backend**: Django, SQLite for database management, PyMuPDF and PIL for resume analysis, and OpenAI API for intelligent text categorization.

### Quick Setup and Run Instructions

1. **Install Docker Desktop** and leave it running.
2. **Add an API key** in `backend/.env` as `API_KEY`. A Gemini key uses Gemini. An OpenAI key uses OpenAI. The site can open without this key, but submitting a job will fail until the key is set.
3. **Start the app** from this folder: `docker compose up --build`
4. **Open** `http://localhost:3000`

The frontend is published on port 3000 and proxies API calls to the backend on port 8000. You do not need Python or Node installed on the machine. After changing `backend/.env`, restart the backend with `docker compose up --build`.

