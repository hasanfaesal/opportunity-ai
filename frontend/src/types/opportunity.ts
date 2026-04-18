export interface StudentProfile {
  major: string;
  year: number;
  interests: string[];
  skills: string[];
  gpa?: number;
}

export interface EmailInput {
  subject: string;
  sender: string;
  body: string;
}

export interface Opportunity {
  is_opportunity: boolean;
  opportunity_type?: string;
  deadline?: string;
  eligibility?: string[];
  required_docs?: string[];
  application_link?: string;
  contact_email?: string;
  raw_email: string;
  confidence: number;
}

export interface RankedOpportunity {
  opportunity: Opportunity;
  score: number;
  fit_score: number;
  urgency_score: number;
  completeness_score: number;
  reasoning: string;
  next_steps: string[];
}