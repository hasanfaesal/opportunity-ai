import { getConfig } from '@/config'
import { createHttpOpportunityService } from './httpService'
import { createMockOpportunityService } from './mockService'

/**
 * @typedef {import('./contract').OpportunityService} OpportunityService
 */

export function createOpportunityService(options = {}) {
  const mode = options.mode || getConfig('opportunityServiceMode') || 'mock'

  if (mode === 'http') {
    return createHttpOpportunityService(options.http || {})
  }

  return createMockOpportunityService({
    scenario: getConfig('mockScenario'),
    delayMs: getConfig('mockDelayMs'),
    delayJitterMs: getConfig('mockDelayJitterMs'),
    errorRate: getConfig('mockErrorRate'),
    forceError: getConfig('mockForceError'),
    ...(options.mock || {})
  })
}

/** @type {OpportunityService} */
export const opportunityService = createOpportunityService()

export default opportunityService
