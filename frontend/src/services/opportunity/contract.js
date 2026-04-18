/**
 * @typedef {import('@/types/opportunity').AnalyzeInboxRequest} AnalyzeInboxRequest
 * @typedef {import('@/types/opportunity').AnalyzeInboxResponse} AnalyzeInboxResponse
 */

/**
 * @typedef {Object} AnalyzeInboxOptions
 * @property {AbortSignal} [signal]
 */

/**
 * @typedef {Object} OpportunityService
 * @property {'mock' | 'http'} mode
 * @property {(requestPayload: AnalyzeInboxRequest, options?: AnalyzeInboxOptions) => Promise<AnalyzeInboxResponse>} analyzeInbox
 */

export {}
