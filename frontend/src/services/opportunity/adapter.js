import {
  normalizeChecklistStatus,
  normalizeOpportunityType,
  normalizeScore
} from '@/types/opportunity'

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function asNullableString(value) {
  return typeof value === 'string' ? value : null
}

function asBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function asNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function stringArray(value) {
  return asArray(value).filter(item => typeof item === 'string')
}

function normalizeSourceType(value) {
  return value === 'upload' ? 'upload' : 'paste'
}

export function normalizeAnalyzeInboxRequest(rawRequest = {}) {
  const request = rawRequest && typeof rawRequest === 'object' ? rawRequest : {}
  const profile = request.profile && typeof request.profile === 'object' ? request.profile : {}

  return {
    profile: {
      degree_program: asString(profile.degree_program),
      semester: Math.max(0, Math.trunc(asNumber(profile.semester, 0))),
      cgpa: typeof profile.cgpa === 'number' && Number.isFinite(profile.cgpa) ? profile.cgpa : null,
      skills: stringArray(profile.skills),
      interests: stringArray(profile.interests),
      preferred_opportunity_types: asArray(profile.preferred_opportunity_types)
        .map(type => normalizeOpportunityType(type))
        .filter(Boolean),
      preferred_locations: stringArray(profile.preferred_locations),
      financial_need: asBoolean(profile.financial_need, false),
      experience_summary: asString(profile.experience_summary)
    },
    emails: asArray(request.emails).map((email, index) => {
      const item = email && typeof email === 'object' ? email : {}
      return {
        id: asString(item.id, `email-${index + 1}`),
        source_type: normalizeSourceType(item.source_type),
        subject: asString(item.subject),
        sender: asString(item.sender),
        body: asString(item.body)
      }
    })
  }
}

function normalizeEvidence(rawEvidence) {
  if (!rawEvidence || typeof rawEvidence !== 'object') return {}

  return Object.fromEntries(
    Object.entries(rawEvidence).map(([key, snippets]) => {
      const normalizedSnippets = asArray(snippets)
        .map(snippet => {
          if (!snippet || typeof snippet !== 'object') return null
          if (typeof snippet.snippet !== 'string') return null

          return {
            snippet: snippet.snippet,
            ...(typeof snippet.source_hint === 'string' ? { source_hint: snippet.source_hint } : {})
          }
        })
        .filter(Boolean)

      return [key, normalizedSnippets]
    })
  )
}

export function normalizeAnalyzeInboxResponse(rawResponse = {}) {
  const response = rawResponse && typeof rawResponse === 'object' ? rawResponse : {}

  return {
    request_id: asString(response.request_id, 'req-local'),
    generated_at: asString(response.generated_at, new Date().toISOString()),
    items: asArray(response.items).map((item, index) => {
      const row = item && typeof item === 'object' ? item : {}
      const extraction = row.extraction && typeof row.extraction === 'object' ? row.extraction : {}
      const contact =
        extraction.application_contact_info && typeof extraction.application_contact_info === 'object'
          ? extraction.application_contact_info
          : {}
      const scoreBreakdown =
        row.score_breakdown && typeof row.score_breakdown === 'object' ? row.score_breakdown : {}
      const weights =
        scoreBreakdown.weights && typeof scoreBreakdown.weights === 'object' ? scoreBreakdown.weights : {}

      return {
        id: asString(row.id, `opp-${index + 1}`),
        extraction: {
          is_opportunity: asBoolean(extraction.is_opportunity, false),
          opportunity_type:
            extraction.opportunity_type === null || extraction.opportunity_type === undefined
              ? null
              : normalizeOpportunityType(extraction.opportunity_type),
          title: asNullableString(extraction.title),
          organization: asNullableString(extraction.organization),
          deadline: asNullableString(extraction.deadline),
          eligibility_conditions: stringArray(extraction.eligibility_conditions),
          required_documents: stringArray(extraction.required_documents),
          application_contact_info: {
            links: stringArray(contact.links),
            emails: stringArray(contact.emails),
            phones: stringArray(contact.phones)
          }
        },
        score_breakdown: {
          fit_score: normalizeScore(scoreBreakdown.fit_score),
          urgency_score: normalizeScore(scoreBreakdown.urgency_score),
          completeness_score: normalizeScore(scoreBreakdown.completeness_score),
          final_score: normalizeScore(scoreBreakdown.final_score),
          weights: {
            fit: asNumber(weights.fit, 0.5),
            urgency: asNumber(weights.urgency, 0.3),
            completeness: asNumber(weights.completeness, 0.2)
          }
        },
        ranking_reason: asString(row.ranking_reason),
        evidence: normalizeEvidence(row.evidence),
        action_checklist: asArray(row.action_checklist)
          .map(entry => {
            if (!entry || typeof entry !== 'object') return null
            if (typeof entry.task !== 'string') return null

            return {
              task: entry.task,
              status: normalizeChecklistStatus(entry.status)
            }
          })
          .filter(Boolean),
        warnings: stringArray(row.warnings)
      }
    })
  }
}
