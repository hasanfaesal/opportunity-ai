export const SCORE_MIN = 0
export const SCORE_MAX = 100

export const OPPORTUNITY_TYPES = [
  'scholarship',
  'internship',
  'competition',
  'fellowship',
  'admission',
  'conference',
  'workshop',
  'other'
] as const

export const CHECKLIST_STATUS = ['todo', 'in_progress', 'done'] as const

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number]
export type ChecklistStatus = (typeof CHECKLIST_STATUS)[number]
export type EmailSourceType = 'paste' | 'upload'

export interface StudentProfile {
  degree_program: string
  semester: number
  cgpa: number | null
  skills: string[]
  interests: string[]
  preferred_opportunity_types: OpportunityType[]
  preferred_locations: string[]
  financial_need: boolean
  experience_summary: string
}

export interface EmailInput {
  id: string
  source_type: EmailSourceType
  subject: string
  sender: string
  body: string
}

export interface ApplicationContactInfo {
  links: string[]
  emails: string[]
  phones: string[]
}

export interface OpportunityExtraction {
  is_opportunity: boolean
  opportunity_type: OpportunityType | null
  title: string | null
  organization: string | null
  deadline: string | null
  eligibility_conditions: string[]
  required_documents: string[]
  application_contact_info: ApplicationContactInfo
}

export interface ScoreWeights {
  fit: number
  urgency: number
  completeness: number
}

export interface ScoreBreakdown {
  fit_score: number
  urgency_score: number
  completeness_score: number
  final_score: number
  weights: ScoreWeights
}

export interface EvidenceSnippet {
  snippet: string
  source_hint?: string
}

export type EvidenceMap = Record<string, EvidenceSnippet[]>

export interface ActionChecklistItem {
  task: string
  status: ChecklistStatus
}

export interface OpportunityItem {
  id: string
  extraction: OpportunityExtraction
  score_breakdown: ScoreBreakdown
  ranking_reason: string
  evidence: EvidenceMap
  action_checklist: ActionChecklistItem[]
  warnings: string[]
}

export interface AnalyzeInboxRequest {
  profile: StudentProfile
  emails: EmailInput[]
}

export interface AnalyzeInboxResponse {
  request_id: string
  generated_at: string
  items: OpportunityItem[]
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string | string[]>
}

const unknownTypeFallback: OpportunityType = 'other'

export function normalizeOpportunityType(rawType: string | null | undefined): OpportunityType {
  if (!rawType) return unknownTypeFallback

  const normalized = rawType.toLowerCase().trim()
  return (OPPORTUNITY_TYPES as readonly string[]).includes(normalized)
    ? (normalized as OpportunityType)
    : unknownTypeFallback
}

export function normalizeChecklistStatus(rawStatus: string | null | undefined): ChecklistStatus {
  if (!rawStatus) return 'todo'

  const normalized = rawStatus.toLowerCase().trim()
  return (CHECKLIST_STATUS as readonly string[]).includes(normalized)
    ? (normalized as ChecklistStatus)
    : 'todo'
}

export function normalizeScore(value: number | null | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return SCORE_MIN
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, value))
}

export function toTitleCaseLabel(value: string | null | undefined, fallback = 'Other'): string {
  if (!value || typeof value !== 'string') return fallback

  return value
    .split('_')
    .join(' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
