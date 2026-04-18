# Step 1: Contract and Mock Schema

## Objective
Establish a stable frontend data contract before UI implementation so all later work can proceed with minimal rework.

## Why this step is first
- Every frontend surface in this project depends on payload shape: input form, ranking list, score breakdown, evidence, and checklist.
- Backend is being built in parallel, so we need a temporary source of truth to unblock frontend implementation now.

## Scope
- Define frontend domain models (TypeScript-first).
- Define API request/response DTOs for analysis and ranking flow.
- Define mock fixtures covering normal and edge cases.
- Define error and loading states at the data shape level.

## Required Domain Models (minimum)
- `StudentProfile`
  - degree/program
  - semester
  - cgpa
  - skills/interests
  - preferred opportunity type
  - location preferences
  - financial need
  - experience summary
- `EmailInput`
  - id
  - source type (`paste` or `upload`)
  - subject
  - sender
  - body
- `OpportunityItem`
  - `is_opportunity`
  - opportunity type
  - title
  - organization
  - deadline (`ISO string` or `null`)
  - eligibility conditions (`string[]`)
  - required documents (`string[]`)
  - application/contact info (links, emails, phone)
- `ScoreBreakdown`
  - `fit_score`
  - `urgency_score`
  - `completeness_score`
  - `final_score`
  - weights used in scoring
- `EvidenceMap`
  - per extracted field, include snippet text and optional source location marker
- `ActionChecklist`
  - ordered tasks per opportunity with status (`todo`, `in_progress`, `done`)

## API Contract Draft (frontend-facing)
- Analyze endpoint input:
  - profile + list of 5-15 emails
- Analyze endpoint output:
  - normalized list of parsed items
  - extracted fields
  - score breakdown
  - evidence snippets
  - action checklist
  - warnings for missing/uncertain fields
- Error shape:
  - code
  - user-safe message
  - optional field-level details

## Mock Fixture Requirements
Create fixtures for at least:
- Mixed batch: 8-10 emails (real opportunities + noise)
- Missing deadline
- Missing eligibility
- Multiple links and contacts
- Near-deadline urgency case
- Non-opportunity false positives/negatives candidate

## Deliverables
- Shared contract document in repo (this file + matching implementation notes)
- Type definitions file(s)
- Mock JSON fixtures aligned to DTOs
- Basic contract sanity check (manual or schema validation)

## Implementation Checklist
- [ ] Finalize field names and nullability rules.
- [ ] Decide date format and timezone handling rule.
- [ ] Define enum values for opportunity type and checklist status.
- [ ] Define score value range convention (for example `0-100`).
- [ ] Create at least one complete "golden" fixture and one incomplete fixture.
- [ ] Add a mapping policy for unknown/missing backend fields.

## Acceptance Criteria
- Frontend can render full flow using only mock data.
- No component needs undocumented fields.
- Contract supports all required outputs from `overview.md`.
- At least two edge-case fixtures render without UI crash.

## Handoff to Step 2
Step 2 starts only after this contract is stable. Parallel tracks must import shared types from this step and avoid redefining data shapes locally.
