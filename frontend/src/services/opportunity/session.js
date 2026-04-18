import { normalizeAnalyzeInboxResponse } from './adapter'

const STORAGE_KEY = 'opportunity.analyzeInbox.latestResponse'

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function saveAnalyzeInboxResponse(response) {
  if (!canUseSessionStorage()) return

  try {
    const normalized = normalizeAnalyzeInboxResponse(response)
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY)
  }
}

export function loadAnalyzeInboxResponse() {
  if (!canUseSessionStorage()) return null

  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY)
    if (!value) return null

    return normalizeAnalyzeInboxResponse(JSON.parse(value))
  } catch {
    return null
  }
}

export function clearAnalyzeInboxResponse() {
  if (!canUseSessionStorage()) return
  window.sessionStorage.removeItem(STORAGE_KEY)
}
