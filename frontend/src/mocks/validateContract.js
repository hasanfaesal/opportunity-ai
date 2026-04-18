import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const mockFiles = [
  'src/mocks/analyze-inbox.request.golden.json',
  'src/mocks/analyze-inbox.response.golden.json',
  'src/mocks/analyze-inbox.response.incomplete.json'
]

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function readJson(path) {
  const content = await readFile(resolve(process.cwd(), path), 'utf-8')
  return JSON.parse(content)
}

function validateRequest(request) {
  assert(request && typeof request === 'object', 'Request must be an object')
  assert(request.profile && typeof request.profile === 'object', 'Request.profile is required')
  assert(Array.isArray(request.emails), 'Request.emails must be an array')
  assert(request.emails.length >= 5 && request.emails.length <= 15, 'Request.emails must contain 5-15 items')

  for (const email of request.emails) {
    assert(typeof email.id === 'string' && email.id.length > 0, 'Email.id is required')
    assert(email.source_type === 'paste' || email.source_type === 'upload', 'Email.source_type must be paste|upload')
    assert(typeof email.subject === 'string', 'Email.subject must be string')
    assert(typeof email.sender === 'string', 'Email.sender must be string')
    assert(typeof email.body === 'string', 'Email.body must be string')
  }
}

function validateResponse(response, responseName) {
  assert(response && typeof response === 'object', `${responseName}: response must be object`)
  assert(typeof response.request_id === 'string', `${responseName}: request_id must be string`)
  assert(typeof response.generated_at === 'string', `${responseName}: generated_at must be string`)
  assert(Array.isArray(response.items), `${responseName}: items must be array`)

  for (const item of response.items) {
    assert(typeof item.id === 'string', `${responseName}: item.id must be string`)
    assert(item.extraction && typeof item.extraction === 'object', `${responseName}: extraction required`)
    assert(typeof item.extraction.is_opportunity === 'boolean', `${responseName}: is_opportunity must be boolean`)
    assert(item.extraction.deadline === null || typeof item.extraction.deadline === 'string', `${responseName}: deadline must be string|null`)
    assert(Array.isArray(item.extraction.eligibility_conditions), `${responseName}: eligibility_conditions must be array`)
    assert(Array.isArray(item.extraction.required_documents), `${responseName}: required_documents must be array`)
    assert(item.extraction.application_contact_info && typeof item.extraction.application_contact_info === 'object', `${responseName}: application_contact_info required`)
    assert(Array.isArray(item.extraction.application_contact_info.links), `${responseName}: links must be array`)
    assert(Array.isArray(item.extraction.application_contact_info.emails), `${responseName}: emails must be array`)
    assert(Array.isArray(item.extraction.application_contact_info.phones), `${responseName}: phones must be array`)

    assert(item.score_breakdown && typeof item.score_breakdown === 'object', `${responseName}: score_breakdown required`)
    const scores = [
      item.score_breakdown.fit_score,
      item.score_breakdown.urgency_score,
      item.score_breakdown.completeness_score,
      item.score_breakdown.final_score
    ]
    for (const score of scores) {
      assert(typeof score === 'number', `${responseName}: score must be number`)
      assert(score >= 0 && score <= 100, `${responseName}: score must be in range 0-100`)
    }

    assert(item.score_breakdown.weights && typeof item.score_breakdown.weights === 'object', `${responseName}: weights required`)
    assert(typeof item.score_breakdown.weights.fit === 'number', `${responseName}: weight fit must be number`)
    assert(typeof item.score_breakdown.weights.urgency === 'number', `${responseName}: weight urgency must be number`)
    assert(typeof item.score_breakdown.weights.completeness === 'number', `${responseName}: weight completeness must be number`)

    assert(typeof item.ranking_reason === 'string', `${responseName}: ranking_reason must be string`)
    assert(item.evidence && typeof item.evidence === 'object', `${responseName}: evidence must be object`)
    assert(Array.isArray(item.action_checklist), `${responseName}: action_checklist must be array`)
    assert(Array.isArray(item.warnings), `${responseName}: warnings must be array`)
  }
}

async function run() {
  for (const path of mockFiles) {
    await readJson(path)
  }

  const request = await readJson('src/mocks/analyze-inbox.request.golden.json')
  const responseGolden = await readJson('src/mocks/analyze-inbox.response.golden.json')
  const responseIncomplete = await readJson('src/mocks/analyze-inbox.response.incomplete.json')

  validateRequest(request)
  validateResponse(responseGolden, 'analyze-inbox.response.golden.json')
  validateResponse(responseIncomplete, 'analyze-inbox.response.incomplete.json')

  console.log('Contract sanity check passed for Step 1 mock files.')
}

run().catch(error => {
  console.error(`Contract sanity check failed: ${error.message}`)
  process.exit(1)
})
