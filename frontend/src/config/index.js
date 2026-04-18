const ENV = import.meta.env

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false
  }
  return fallback
}

const config = {
  appName: ENV.VITE_APP_NAME || 'App',
  appTitle: ENV.VITE_APP_TITLE || 'Demo App',
  baseURL: ENV.VITE_BASE_URL || '/api',
  apiBase: ENV.VITE_API_BASE || 'http://localhost:3002',
  opportunityServiceMode: ENV.VITE_OPPORTUNITY_SERVICE_MODE || 'mock',
  mockScenario: ENV.VITE_MOCK_SCENARIO || 'golden',
  mockDelayMs: toNumber(ENV.VITE_MOCK_DELAY_MS, 600),
  mockDelayJitterMs: toNumber(ENV.VITE_MOCK_DELAY_JITTER_MS, 250),
  mockErrorRate: toNumber(ENV.VITE_MOCK_ERROR_RATE, 0),
  mockForceError: toBoolean(ENV.VITE_MOCK_FORCE_ERROR, false)
}

export function getConfig(key) {
  if (!key) return { ...config }
  return config[key]
}
