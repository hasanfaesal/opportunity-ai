# Step 5: Backend Adapter Swap

## Objective
Replace mock data flow with real FastAPI integration while preserving UI behavior and component contracts.

## Entry Condition
Steps 1-4 are complete and all UI paths run using mock adapter.

## Scope
- Implement real HTTP adapter matching shared service interface.
- Map backend response to frontend normalized models.
- Keep all backend-specific logic inside adapter layer.

## Integration Strategy
- Do not refactor UI components for backend details.
- Keep `OpportunityService` as the only dependency boundary.
- Add explicit mapping and fallback for nullable/optional fields.

## Tasks
- Create `ApiOpportunityService` implementation.
- Wire environment-based service selection (mock vs api).
- Add request timeout and retry policy (lightweight).
- Add mapping for backend warnings and partial extraction cases.
- Validate score/evidence/checklist fields against UI expectations.

## Deliverables
- Real API call path functional in dev environment.
- Adapter mapping file with tested normalization logic.
- Error handling for network and server response failures.

## Checklist
- [ ] API base URL configuration exists and is documented.
- [ ] Auth header strategy is defined if needed.
- [ ] Response mapping handles unknown enum values safely.
- [ ] Deadlines parse correctly into UI urgency display.
- [ ] Adapter can fallback to mock mode for demo safety.

## Acceptance Criteria
- Same user flow works in both mock and API modes.
- No direct backend shape assumptions leak into UI components.
- Contract mismatches fail gracefully with visible diagnostics.

## Handoff to Step 6
Once API mode is stable, finalize reliability, polish, and demo readiness.
