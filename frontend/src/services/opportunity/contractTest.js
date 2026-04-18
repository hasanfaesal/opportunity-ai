import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { createHttpOpportunityService } from './httpService.js'
import { createMockOpportunityService } from './mockService.js'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

async function readJson(path) {
  const content = await readFile(resolve(process.cwd(), path), 'utf-8')
  return JSON.parse(content)
}

async function run() {
  const requestFixture = await readJson('src/mocks/analyze-inbox.request.golden.json')
  const responseFixture = await readJson('src/mocks/analyze-inbox.response.golden.json')

  const mockService = createMockOpportunityService({
    delayMs: 0,
    delayJitterMs: 0,
    scenario: 'golden',
    fixtures: { golden: responseFixture }
  })

  const httpService = createHttpOpportunityService({
    transport: async () => clone(responseFixture)
  })

  const [mockResult, httpResult] = await Promise.all([
    mockService.analyzeInbox(clone(requestFixture)),
    httpService.analyzeInbox(clone(requestFixture))
  ])

  assert(mockResult && typeof mockResult === 'object', 'Mock result should be an object')
  assert(httpResult && typeof httpResult === 'object', 'HTTP result should be an object')
  assert(Array.isArray(mockResult.items), 'Mock items should be an array')
  assert(Array.isArray(httpResult.items), 'HTTP items should be an array')
  assert(
    JSON.stringify(mockResult) === JSON.stringify(httpResult),
    'Mock and HTTP services should return identical normalized payloads'
  )

  console.log('Opportunity service contract parity check passed.')
}

run().catch(error => {
  console.error(`Opportunity service contract parity check failed: ${error.message}`)
  process.exit(1)
})
