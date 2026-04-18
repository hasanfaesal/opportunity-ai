const SCORE_TONES = {
  high: 'success',
  medium: 'warning',
  low: 'danger'
}

const OPPORTUNITY_TYPE_TONES = {
  internship: 'info',
  scholarship: 'success',
  competition: 'warning',
  fellowship: 'info',
  admission: 'neutral'
}

const CHECKLIST_STATUS_TONES = {
  todo: 'neutral',
  in_progress: 'info',
  done: 'success'
}

export function getScoreTone(score) {
  const value = Number(score)

  if (Number.isNaN(value)) return 'neutral'
  if (value >= 80) return SCORE_TONES.high
  if (value >= 50) return SCORE_TONES.medium

  return SCORE_TONES.low
}

export function getOpportunityTypeTone(type) {
  if (!type) return 'neutral'
  return OPPORTUNITY_TYPE_TONES[String(type).toLowerCase()] || 'neutral'
}

export function getChecklistStatusTone(status) {
  if (!status) return 'neutral'
  return CHECKLIST_STATUS_TONES[String(status).toLowerCase()] || 'neutral'
}

export { SCORE_TONES, OPPORTUNITY_TYPE_TONES, CHECKLIST_STATUS_TONES }
