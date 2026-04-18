from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class StudentProfile(BaseModel):
    major: str
    year: int
    interests: List[str]
    skills: List[str]
    gpa: Optional[float] = None


class EmailInput(BaseModel):
    subject: str
    sender: str
    body: str


class EmailBatch(BaseModel):
    emails: List[EmailInput]
    profile: StudentProfile


class Opportunity(BaseModel):
    is_opportunity: bool
    opportunity_type: Optional[str] = None
    deadline: Optional[str] = None
    eligibility: Optional[List[str]] = None
    required_docs: Optional[List[str]] = None
    application_link: Optional[str] = None
    contact_email: Optional[str] = None
    raw_email: str
    confidence: float


class RankedOpportunity(BaseModel):
    opportunity: Opportunity
    score: float
    fit_score: float
    urgency_score: float
    completeness_score: float
    reasoning: str
    next_steps: List[str]


class RankRequest(BaseModel):
    opportunities: List[Opportunity]
    profile: StudentProfile
