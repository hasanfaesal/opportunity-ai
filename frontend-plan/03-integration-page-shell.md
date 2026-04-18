# Step 3: Integration into Page Shell

## Objective
Assemble all parallel outputs into one coherent end-to-end flow with predictable state management.

## Why this step is sequential
- Track outputs become valuable only after orchestration connects input, service call, and output rendering.
- Integration is the first true product-level validation pass.

## Scope
- Create or finalize the main page/container.
- Wire submission flow from Input UI to Service Adapter.
- Connect response to ranked list and detail panel.
- Add route/state behavior for selected opportunity and retry.

## State Model (recommended)
Use a single source of truth for request lifecycle:
- `idle`
- `validating`
- `loading`
- `success`
- `error`

Additional state:
- submitted profile snapshot
- submitted email batch snapshot
- ranked result collection
- selected opportunity id
- warning messages and recoverable issues

## Integration Tasks
- Mount Input and Output components in one shell.
- Connect submit action to `OpportunityService` method.
- Implement loading transitions and disable duplicate submit.
- Render success data and fallback views.
- Preserve list and detail synchronization on selection changes.

## Deliverables
- Main workflow page that runs from input to ranked results.
- Stable state transitions with no dead-end UI state.
- Clear error recovery (retry and edit input paths).

## Integration Checklist
- [ ] Submit button only active on valid form and email count range.
- [ ] API/request errors surface user-safe messages.
- [ ] Empty/no-opportunity result is handled with guidance text.
- [ ] List selection always updates details panel correctly.
- [ ] Data survives minor UI navigation where expected.

## Acceptance Criteria
- A user can complete one full journey without refreshing the page.
- Error, loading, and success states are all visibly testable.
- No contract mismatch errors with Step 1 fixtures.

## Handoff to Step 4
Once base integration is stable, add explainability depth and reranking interaction without reworking core orchestration.
