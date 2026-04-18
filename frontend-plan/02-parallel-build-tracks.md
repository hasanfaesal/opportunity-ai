# Step 2: Parallel Build Tracks

## Objective
Execute multiple frontend workstreams concurrently after contract finalization to maximize speed without integration conflicts.

## Entry Condition
Step 1 is complete and shared contract/types are available for all tracks.

## Parallel Tracks Overview

### Track A: Input Components
Build UI for collecting all required inputs.

Scope:
- Structured student profile form
- Email batch input (paste/upload)
- Field-level validation and user guidance

Deliverables:
- Form sections with clear grouping
- Validation errors and helper text
- Email preview list with count and simple quality checks

Done Criteria:
- Can submit valid profile + 5-15 emails to orchestration layer
- Invalid inputs are blocked with actionable messages

---

### Track B: Output Components
Build presentation layer for ranked opportunities and details.

Scope:
- Ranked list cards
- Per-item details panel/drawer
- Urgency and completeness indicators

Deliverables:
- Ranked list UI from mock response
- Detail view including requirements and contact/application info
- Score chips and urgency badges

Done Criteria:
- User can inspect each ranked item and see why it appears there
- Layout works on desktop and mobile breakpoints

---

### Track C: Data Adapter and Mock Service
Provide stable data source abstraction to avoid UI coupling to backend timing.

Scope:
- `OpportunityService` interface
- Mock implementation using fixtures from Step 1
- Request lifecycle handling contract

Deliverables:
- Service methods (for example `analyzeInbox(profile, emails)`)
- Mock response delay and error simulation options
- Consistent normalized output for UI

Done Criteria:
- UI can run fully with no backend dependency
- Swap to real backend can happen in one adapter location

---

### Track D: UX Foundation
Build reusable visual and interaction primitives.

Scope:
- Design tokens (color, spacing, typography)
- Shared components for loading, empty, error, and badges
- Accessibility basics (labels, contrast, focus states)

Deliverables:
- Token definitions and base styles
- Reusable status components and skeleton states
- Accessibility pass on key form and list interactions

Done Criteria:
- Pages have consistent visual language
- Critical paths are keyboard usable and readable

## Coordination Rules (important)
- Shared types import only from Step 1 contract source.
- No track may create private, conflicting DTO shapes.
- Use stub story/demo containers for independent development.
- Resolve naming conflicts immediately and update shared types once.

## Suggested Ownership Split
- Developer 1: Track A
- Developer 2: Track B
- Developer 3: Track C
- Developer 4: Track D

If fewer people are available, prioritize C first, then A and B, then D.

## Risks and Mitigation
- Risk: inconsistent field naming across tracks.
  - Mitigation: shared lint/type check and one contract owner.
- Risk: visual drift between components.
  - Mitigation: consume Track D primitives, avoid one-off styles.
- Risk: hidden backend assumptions.
  - Mitigation: keep all API coupling inside adapter only.

## Acceptance Criteria
- All tracks can be demoed independently against shared fixtures.
- No type duplication remains.
- Input and output views compile and run with mock service.

## Handoff to Step 3
Step 3 begins when all track deliverables pass done criteria and are ready to be assembled into a single end-to-end shell.
