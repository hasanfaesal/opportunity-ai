# Opportunity Contract (Step 1)

This contract is the frontend source of truth while backend integration is in progress.

## Field and Nullability Decisions
- Scores use `0-100` integer/float range.
- Unknown opportunity type maps to `other`.
- Unknown checklist status maps to `todo`.
- Nullable extraction fields use explicit `null` instead of missing keys.

## Date and Timezone Rule
- `deadline` uses ISO-8601 UTC format when available (for example `2026-05-01T23:59:59Z`).
- If deadline is unavailable or not parseable, set `deadline: null` and add a warning.

## Enum Values
- `OpportunityType`:
  - scholarship
  - internship
  - competition
  - fellowship
  - admission
  - conference
  - workshop
  - other
- `ChecklistStatus`:
  - todo
  - in_progress
  - done

## API DTO Contract
- Request: `AnalyzeInboxRequest`
  - `profile: StudentProfile`
  - `emails: EmailInput[]` (5-15 target range)
- Response: `AnalyzeInboxResponse`
  - `request_id`
  - `generated_at`
  - `items: OpportunityItem[]`

## Error Contract
- `ApiError`
  - `code`
  - `message`
  - `details?` field-level map

## Mapping Policy for Missing/Unknown Backend Fields
- Missing arrays become empty arrays.
- Missing optional strings become `null`.
- Unknown enums normalize to safe defaults (`other`, `todo`).
- Missing/invalid scores normalize into `0-100` range.
