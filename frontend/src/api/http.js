import axios from 'axios'
import { getConfig } from '@/config'

const API_BASE = getConfig('apiBase') || 'http://localhost:3002'

const oppService = axios.create({
  baseURL: API_BASE,
  timeout: 12000
})

oppService.interceptors.response.use(
  response => response.data,
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

export async function extractOpportunities(emails, profile) {
  return oppService.post('/api/v1/opportunities/extract', { emails, profile })
}

export async function rankOpportunities(opportunities, profile) {
  return oppService.post('/api/v1/opportunities/rank', { opportunities, profile })
}

export async function extractAndRank(emails, profile) {
  return oppService.post('/api/v1/opportunities/extract-rank', { emails, profile })
}

export async function postAnalyzeInbox(requestPayload, { signal } = {}) {
  return oppService.post('/api/v1/opportunities/analyze-inbox', requestPayload, { signal })
}
