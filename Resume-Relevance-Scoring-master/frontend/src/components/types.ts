export type ResumeType = {
    id: string;
    candidate_name: string;
    email: string;
    relevance_score: number;
    file: string;
    projects: {
      project_title: string;
      short_description: string;
      tech_stack: string[];
      time_duration: {
        start: string;
        end: string;
        duration_months: number;
      };
      relevancy: number;
    }[];
    professional_experience: {
      role: string;
      organization: string;
      short_description: string;
      tech_stack: string[];
      time_duration: {
        start: string;
        end: string;
        duration_months: number;
      };
      relevancy: number;
    }[];
    college: {
      name: string;
      branch: string;
      degree: string;
      cgpa: number;
      start: string;
      end: string;
    };
  };