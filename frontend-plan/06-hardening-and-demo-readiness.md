# Step 6: Hardening and Demo Readiness

## Objective
Ensure the frontend is stable, understandable, and presentation-ready for live judging conditions.

## Scope
- Reliability pass across all UI states.
- Visual and interaction polish.
- Performance and responsiveness checks.
- Demo narrative alignment to rubric categories.

## Hardening Focus Areas

### 1) Reliability and Edge Cases
- Empty result set (no opportunities found)
- Partial extraction (missing deadline, eligibility, or docs)
- Mixed-quality evidence snippets
- Slow network and request failure behavior

### 2) UX Clarity
- Improve copy for score explanations and warnings
- Ensure urgency and priority signals are instantly readable
- Reduce cognitive load in list/detail navigation

### 3) Responsive and Accessibility Pass
- Mobile and desktop layout verification
- Keyboard navigation for core actions
- Label, focus, and contrast sanity check

### 4) Demo Safety
- Keep fallback switch to mock mode
- Prepare deterministic sample dataset for live run
- Provide pre-selected scenario flow (best-case and edge-case)

## Deliverables
- Final QA checklist with pass/fail status.
- Polished UI states and interaction refinements.
- Demo runbook for 5-minute walkthrough.

## QA Checklist (minimum)
- [ ] Input validation works for under 5 and over 15 emails.
- [ ] Loading/error/empty/success states are all reachable and legible.
- [ ] Ranked order and score breakdown are consistent.
- [ ] Evidence snippets and checklist display correctly per item.
- [ ] Mobile view remains usable end-to-end.
- [ ] App can run in mock fallback if API is unavailable.

## Demo Runbook Outline
- Start with problem statement (email overload and missed opportunities).
- Show input of mixed emails and structured profile.
- Trigger analysis and show ranked output.
- Open one item to show score breakdown, evidence, and checklist.
- Change a profile preference and show reranking.
- Close with business value and community impact mapping.

## Acceptance Criteria
- End-to-end flow is stable enough for repeated live demos.
- Rubric-relevant features are visible without hidden steps.
- Team has fallback path for unstable backend conditions.

## Completion Condition
All six steps are complete when frontend can demonstrate the required outcomes from `overview.md` in both technical and pitch contexts.
