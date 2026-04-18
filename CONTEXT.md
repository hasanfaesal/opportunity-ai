# Opportunity Inbox Copilot - Context

## Goal

Build an AI-powered system that helps students triage opportunity emails (scholarships, internships, competitions, fellowships, admissions) and decide what to act on first.

## Must-Have Capabilities

- Accept 5-15 English emails (paste/upload).
- Accept a structured student profile (form-based).
- Detect whether each email is a real opportunity (`is_opportunity`).
- Extract structured fields from noisy email text:
  - opportunity type
  - deadline
  - eligibility
  - required documents
  - application/contact info
- Rank opportunities from highest to lowest priority.
- Show evidence-backed reasons and an actionable checklist.

## Architecture (With Data Layer)

1. **Input Layer (Vue.js)**
   - Profile form
   - Email batch input

2. **API Layer (FastAPI)**
   - Receives validated JSON payloads
   - Orchestrates AI extraction + scoring

3. **Data Layer (Postgres - Primary Database)**
   - Stores profiles, email batches, extracted opportunities, evidence snippets, and ranking outputs
   - Uses typed columns for ranking-critical fields (deadline, score, type)
   - Uses JSONB for flexible extraction metadata/evidence details

4. **AI Processing Layer (FastAPI + LLM)**
   - Opportunity detection
   - Structured extraction into strict JSON schema

5. **Scoring & Ranking Layer (Deterministic)**
   - `fit_score`
   - `urgency_score`
   - `completeness_score`
   - Weighted final score + sorted ranking

6. **Output Layer (Vue.js)**
   - Ranked list
   - Why-this-rank breakdown
   - Urgency and next-step checklist

## Database Decision

### Use Postgres as the default (recommended)

- Postgres should be the source of truth for hackathon MVP.
- It supports deterministic, reproducible ranking and easy demo auditability.
- It works well for relational queries across profiles, deadlines, and scores.

### Use Redis only if needed (optional)

- Cache repeated LLM extraction results.
- Track short-lived job status or rate limits.
- Support async queue workflows.

If you must choose one now: **use Postgres only**.

## JSON Payload Contract (Frontend-Backend Team Boundary)

- Use JSON for all core request/response contracts.
- Enforce strict schemas with FastAPI/Pydantic and expose OpenAPI docs.
- Keep stable field names and versioned endpoints (for example, `/api/v1/...`).
- Return structured JSON errors for validation failures.
- Exception: file upload can use `multipart/form-data`, but processing metadata/results should still be JSON.

## Minimal JSON Shapes

### Request: process inbox

```json
{
  "student_profile": {
    "degree": "BSc CSE",
    "semester": 6,
    "cgpa": 3.72,
    "skills": ["python", "vue"],
    "interests": ["ai", "backend"],
    "preferred_types": ["internship", "scholarship"],
    "preferred_locations": ["remote", "bangladesh"],
    "financial_need": true,
    "experience_level": "mid"
  },
  "emails": [
    {
      "id": "email_001",
      "subject": "AI Internship Program 2026",
      "sender": "careers@example.org",
      "body": "...raw email text...",
      "received_at": "2026-04-18T10:10:00Z"
    }
  ]
}
```

### Response: ranked opportunities

```json
{
  "opportunities": [
    {
      "source_email_id": "email_001",
      "is_opportunity": true,
      "opportunity_type": "internship",
      "deadline": "2026-04-28",
      "eligibility": ["CSE students", "CGPA >= 3.5"],
      "required_documents": ["CV", "transcript"],
      "apply_link": "https://example.org/apply",
      "contact": {
        "email": "hr@example.org",
        "phone": "+8801XXXXXXXXX"
      },
      "evidence": {
        "deadline_snippet": "Apply before April 28, 2026",
        "eligibility_snippet": "Open for CSE students with CGPA 3.5+"
      },
      "scores": {
        "fit_score": 0.86,
        "urgency_score": 0.92,
        "completeness_score": 0.88,
        "final_score": 0.88
      },
      "why_ranked": "Strong profile match and near deadline",
      "checklist": [
        "Update CV",
        "Collect transcript",
        "Submit application"
      ]
    }
  ]
}
```

## Deterministic Scoring Rule

- Keep ranking formula explicit and visible in demo.
- Example: `final_score = 0.5 * fit + 0.3 * urgency + 0.2 * completeness`.
- Return per-component scores so judges can trace ranking decisions.

## Build Priorities (Hackathon)

1. Finalize JSON request/response schema first.
2. Implement Postgres schema and ingest endpoint.
3. Build AI extraction endpoint returning strict JSON.
4. Implement deterministic scoring and persist results.
5. Integrate Vue UI with API and show explainable ranked output.
