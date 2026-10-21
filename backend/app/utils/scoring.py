import json

from .llm_client import complete, parse_json_object


def _summary_list(items, formatter):
    parts = []
    for item in items or []:
        if isinstance(item, dict):
            parts.append(formatter(item))
    return "; ".join(parts) or "None listed"


def generate_scoring_prompt(job_role, job_description, resume_details):
    projects_summary = _summary_list(
        resume_details.get("projects"),
        lambda proj: "Project titled '{title}' using {stack}.".format(
            title=proj.get("project_title") or "Untitled",
            stack=", ".join(proj.get("tech_stack") or []) or "unspecified tools",
        ),
    )
    experiences_summary = _summary_list(
        resume_details.get("professional_experience"),
        lambda exp: "Experience at {org} as a {role}.".format(
            org=exp.get("organization") or "an organization",
            role=exp.get("role") or "a role",
        ),
    )
    college = resume_details.get("college") or {}
    college_name = college.get("name") if isinstance(college, dict) else college

    return (
        f"Considering the job role of {job_role} with a focus on {job_description}, "
        f"evaluate the relevance of the following projects and professional experiences: "
        f"College: {college_name} "
        f"Projects: {projects_summary} "
        f"Experiences: {experiences_summary}. "
        "Assess each project and professional experience for their relevance to the job role and description. "
        "Provide a relevance score for projects on a scale from 0 (not relevant) to 5 (highly relevant), and for professional experiences on a scale from 0 to 10. "
        "The projects_scores array must have one number per project, in the same order. "
        "The experience_scores array must have one number per professional experience, in the same order. "
        "Conclude with an overall resume relevance score that reflects how well the entire resume aligns with the job role and description on a scale from 0 (not aligned) to 100 (highly aligned). "
        'Return JSON with this shape: {"projects_scores": [0, 3], "experience_scores": [5, 10], "relevance_score": 89}'
    )


def process_gpt_scoring_response(resume_details, scoring_data):
    project_scores = scoring_data.get("projects_scores") or []
    experience_scores = scoring_data.get("experience_scores") or []
    relevance_score = scoring_data.get("relevance_score") or 0

    for index, score in enumerate(project_scores):
        if index < len(resume_details["projects"]):
            resume_details["projects"][index]["relevancy"] = score

    for index, score in enumerate(experience_scores):
        if index < len(resume_details["professional_experience"]):
            resume_details["professional_experience"][index]["relevancy"] = score

    resume_details["relevance_score"] = relevance_score
    return resume_details


def score_resume_details(job_role, job_description, resume_details):
    if isinstance(resume_details, str):
        resume_details = json.loads(resume_details)
        if isinstance(resume_details, str):
            resume_details = json.loads(resume_details)

    prompt = generate_scoring_prompt(job_role or "", job_description or "", resume_details)
    scoring_text = complete(prompt, temperature=0.2, max_tokens=800)
    scoring_data = parse_json_object(scoring_text)
    return process_gpt_scoring_response(resume_details, scoring_data)
