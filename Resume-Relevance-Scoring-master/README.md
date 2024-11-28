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

1. **Clone the Repository**: Clone the project's GitHub repository to your local machine.
2. **Configure Environment Variables**: Rename \`.env.example\` to \`.env\` and update the values according to your setup for both frontend and backend.
3. **Docker Compose**: Navigate to the project directory and run \`docker compose up --build\` to start the application.
4. **Access Web Interface**: Open \`http://localhost:3000\` in your browser to use the application.

