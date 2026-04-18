import responseGolden from '@/mocks/analyze-inbox.response.golden.json'
import responseIncomplete from '@/mocks/analyze-inbox.response.incomplete.json'
import { normalizeAnalyzeInboxRequest, normalizeAnalyzeInboxResponse } from './adapter'

/**
 * @typedef {import('./contract').OpportunityService} OpportunityService
 */

const DEFAULT_FIXTURES = {
  golden: responseGolden,
  incomplete: responseIncomplete
}

function createAbortError() {
  const error = new Error('The operation was aborted')
  error.name = 'AbortError'
  return error
}

function wait(ms, signal) {
  if (ms <= 0) return Promise.resolve()

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError())
      return
    }

    const timeoutId = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)

    function onAbort() {
      clearTimeout(timeoutId)
      cleanup()
      reject(createAbortError())
    }

    function cleanup() {
      signal?.removeEventListener('abort', onAbort)
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value)
  return JSON.parse(JSON.stringify(value))
}

function pickDelayMs(baseDelayMs, jitterMs) {
  const safeBase = Math.max(0, Number(baseDelayMs) || 0)
  const safeJitter = Math.max(0, Number(jitterMs) || 0)
  if (safeJitter === 0) return safeBase

  const offset = Math.floor(Math.random() * (safeJitter * 2 + 1)) - safeJitter
  return Math.max(0, safeBase + offset)
}

function shouldThrowError(forceError, errorRate) {
  if (forceError) return true
  const safeRate = Math.min(1, Math.max(0, Number(errorRate) || 0))
  return Math.random() < safeRate
}

function createMockError() {
  const error = new Error('Mock opportunity service simulated an error')
  error.code = 'MOCK_SERVICE_ERROR'
  return error
}

export function createMockOpportunityService(options = {}) {
  const {
    delayMs = 600,
    delayJitterMs = 250,
    scenario = 'golden',
    errorRate = 0,
    forceError = false,
    fixtures = DEFAULT_FIXTURES
  } = options

  async function analyzeInbox(requestPayload, { signal } = {}) {
    normalizeAnalyzeInboxRequest(requestPayload)

    if (signal?.aborted) {
      throw createAbortError()
    }

    await wait(pickDelayMs(delayMs, delayJitterMs), signal)

    if (shouldThrowError(forceError, errorRate)) {
      throw createMockError()
    }

    const rawResponse = fixtures[scenario] || fixtures.golden || responseGolden
    return normalizeAnalyzeInboxResponse(clone(rawResponse))
  }

  /** @type {OpportunityService} */
  const service = {
    mode: 'mock',
    analyzeInbox
  }

  return service
}

export const mockOpportunityService = createMockOpportunityService()

export default mockOpportunityService
