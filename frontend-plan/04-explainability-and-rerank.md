# Step 4: Explainability and Rerank Interaction

## Objective
Make ranking transparent and actionable so users and judges can trust decisions and understand what to do next.

## Why this step matters
- `CONTEXT.md` emphasizes deterministic ranking and evidence-backed reasons.
- This is a key scoring differentiator in demo and rubric alignment.

## Scope
- Score breakdown presentation per opportunity.
- Evidence snippets mapped to extracted fields.
- Action checklist rendering per opportunity.
- Quick reranking interaction when profile preference changes.

## Explainability Requirements
- Show component scores clearly:
  - fit
  - urgency
  - completeness/confidence
  - final weighted score
- Show scoring weights used in final score.
- Show source evidence snippets (not just generated summaries).
- Highlight missing/uncertain fields and their impact on score.

## Rerank Interaction (differentiator)
- User changes one or more profile preferences.
- System recomputes ranking (mocked or real adapter path).
- UI highlights what changed:
  - moved up/down items
  - score deltas
  - brief rationale update

## Deliverables
- Explainability panel/section per item.
- Evidence map UI tied to extracted fields.
- Action checklist UI with clear next actions.
- Rerank trigger flow and updated ordering visualization.

## Implementation Checklist
- [ ] Add score breakdown component reusable across list/detail contexts.
- [ ] Add evidence snippet component with truncation and expand behavior.
- [ ] Add checklist component with ordered tasks.
- [ ] Add rerank controls and state diff markers.
- [ ] Ensure explainability still works in low-data cases.

## Acceptance Criteria
- A reviewer can understand "why this is ranked here" without verbal explanation.
- Rerank interaction visibly changes order when preferences change.
- Evidence and checklist are present for each valid opportunity.

## Handoff to Step 5
After explainability is stable with mocks, proceed to backend adapter swap with minimal UI changes.
