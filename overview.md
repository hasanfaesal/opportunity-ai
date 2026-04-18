# Opportunity Inbox Copilot - Hackathon Overview

## Problem Understanding (What must be built)

The challenge is to build an AI-powered system that helps students process opportunity-related emails (scholarships, internships, competitions, fellowships, admissions, etc.) and decide what to act on first.

### Core required capabilities

- Accept **5-15 English emails** as input (paste/upload).
- Accept a **structured student profile** (form-based, not free text).
- Detect whether each email contains a **real opportunity**.
- Extract structured fields from messy language:
  - opportunity type
  - deadline
  - eligibility conditions
  - required documents
  - application/contact info (links, emails, phone)
- Produce a **personalized ranked list** from highest to lowest priority.
- Provide **evidence-backed reasons** for ranking.
- Highlight urgency and provide an actionable **next-step checklist**.

### Important technical expectation

The AI must do more than summarization. It should classify and extract structured data, while ranking should be driven by a **deterministic scoring engine** built by us.

---

## Rubric Understanding (How points are awarded)

- **Quality of Idea (30%)** - Creativity and originality
- **Implementation of Idea (30%)** - Technical execution and working quality
- **Potential Value to Businesses (20%)** - Practical/commercial potential
- **Potential Community Impact (20%)** - Positive social impact

### Key implication

To win, we must satisfy both:

1. Full problem compliance (functional prototype matching requirements)
2. Strong rubric narrative (originality, reliability, business value, impact)

---

## Build Strategy Decision

## Selected Strategy: **Hybrid (LLM extraction + deterministic ranking)**

This is our final approach because it best balances speed, robustness, explainability, and scoring potential.

### Why not LLM-only

- Fast to prototype, but often weak on deterministic ranking and explainability.
- Risks looking like a shallow summarization wrapper.

### Why not rules-only

- Deterministic, but brittle for messy/unstructured email language.
- Lower perceived AI depth and innovation.

### Why hybrid wins

- Uses AI where it helps most (classification + extraction from natural language).
- Uses deterministic scoring where judges expect rigor (personalized ranking formula).
- Easier to justify in Q&A with transparency and evidence.

---

## Tech Stack (Updated)

- **Frontend:** Vue.js
- **Backend/API:** FastAPI
- **AI layer:** LLM-assisted classification + structured extraction
- **Ranking engine:** deterministic scoring implemented in backend

---

## Proposed System Architecture

1. **Input Layer (Vue.js)**
   - Email batch input (paste/upload)
   - Structured student profile form

2. **AI Processing Layer (FastAPI + LLM)**
   - Opportunity detection (`is_opportunity`)
   - Structured extraction into strict JSON schema
   - Evidence snippet capture from source email text

3. **Scoring & Ranking Layer (FastAPI deterministic logic)**
   - `fit_score`: profile-opportunity fit
   - `urgency_score`: deadline proximity
   - `completeness_score`: extraction quality/field completeness
   - Weighted final score and sorted ranking

4. **Output Layer (Vue.js UI)**
   - Ranked opportunity list
   - Per-item breakdown: why ranked, urgency, requirements
   - Action checklist for next steps

---

## Scoring Blueprint (Deterministic)

Each opportunity gets a final score from weighted components:

- **Profile Fit** (degree/program, semester, CGPA, skills/interests, preferred type, location, financial need, experience)
- **Urgency** (days remaining to deadline; near deadlines prioritized)
- **Completeness/Confidence** (how complete and reliable extraction is)

The formula and weights should be visible in demo or pitch so judges can trust ranking decisions.

---

## Rubric-Aligned Demo Goals

### 1) Quality of Idea (30%)

- Show transformation: ignored inbox -> personalized action plan.
- Emphasize evidence-backed recommendations.
- Include at least one differentiator (e.g., quick reranking when profile preference changes).

### 2) Implementation (30%)

- Ensure a live end-to-end working flow with mixed emails (real + noise).
- Show robust parsing and fallback behavior for missing/incomplete fields.
- Keep ranking deterministic and transparent.

### 3) Business Value (20%)

- Position for university career/admissions/student offices.
- Communicate measurable value (reduced triage effort, increased applications submitted).
- Mention scale potential (department-level dashboards, integrations).

### 4) Community Impact (20%)

- Focus on students who miss opportunities due to overload.
- Highlight fairness via transparent “why this is ranked” logic.
- Mention accessibility and multilingual roadmap.

---

## Fast 6-Hour Execution Plan (Updated)

### Hour 1 - Foundation

- Initialize Vue.js frontend and FastAPI backend.
- Define API contracts and JSON schema.
- Build profile form + email input UI.

### Hour 2 - AI Extraction MVP

- Implement endpoint to classify opportunity vs noise.
- Extract key fields into structured schema.
- Add basic validation and error handling.

### Hour 3 - Deterministic Ranking Engine

- Implement fit/urgency/completeness scoring.
- Add weighted final score and sorting.
- Return score breakdown for each item.

### Hour 4 - Explainability + Actionability

- Add evidence snippets per extracted field.
- Generate per-opportunity “why it matters” and action checklist.

### Hour 5 - Demo Hardening

- Test on 8-10 mixed emails.
- Fix extraction edge cases and UI clarity issues.
- Polish ranking and urgency badges.

### Hour 6 - Pitch Prep

- Prepare 5-minute demo flow.
- Create concise architecture + rubric mapping slides.
- Rehearse Q&A (determinism, reliability, business case, impact).

---

## Pitch Flow (5 minutes)

1. Problem and pain (email overload, missed opportunities)
2. Live product walkthrough (input -> ranking -> evidence -> checklist)
3. How it works (hybrid AI + deterministic scoring)
4. Business value and community impact
5. Closing with expected outcomes and extensibility

---

## Common Failure Risks to Avoid

- Building only summarization/chat behavior without structured extraction.
- Ranking without deterministic logic or visible rationale.
- No evidence snippets from source text.
- Weak business/impact narrative.
- Unstable or incomplete live demo.

---

## Success Definition

By demo time, we should be able to reliably show:

- End-to-end working prototype in Vue.js + FastAPI
- AI-based opportunity detection + structured extraction
- Deterministic personalized ranking with clear score breakdown
- Evidence-backed reasoning and practical next-step checklist
- A pitch that directly maps each feature to rubric scoring categories
