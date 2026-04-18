import { normalizeAnalyzeInboxRequest, normalizeAnalyzeInboxResponse } from './adapter'

/**
 * @typedef {import('./contract').OpportunityService} OpportunityService
 */

export function createHttpOpportunityService(options = {}) {
  async function defaultTransport(requestPayload, requestOptions) {
    const { postAnalyzeInbox } = await import('@/api/http')
    return postAnalyzeInbox(requestPayload, requestOptions)
  }

  const {
    requestAdapter = normalizeAnalyzeInboxRequest,
    responseAdapter = normalizeAnalyzeInboxResponse,
    transport = defaultTransport
  } = options

  async function analyzeInbox(requestPayload, { signal } = {}) {
    const normalizedRequest = requestAdapter(requestPayload)
    const rawResponse = await transport(normalizedRequest, { signal })
    return responseAdapter(rawResponse)
  }

  /** @type {OpportunityService} */
  const service = {
    mode: 'http',
    analyzeInbox
  }

  return service
}
