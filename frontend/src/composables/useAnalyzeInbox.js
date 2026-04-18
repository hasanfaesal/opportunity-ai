import { ref } from 'vue'
import opportunityService from '@/services/opportunity'
import {
  clearAnalyzeInboxResponse,
  loadAnalyzeInboxResponse,
  saveAnalyzeInboxResponse
} from '@/services/opportunity/session'

function normalizeError(error) {
  if (!error) return { code: 'UNKNOWN_ERROR', message: 'Unexpected error occurred' }
  if (error.name === 'AbortError') return { code: 'ABORTED', message: 'Request cancelled' }

  return {
    code: error.code || 'REQUEST_FAILED',
    message: error.message || 'Request failed',
    details: error.details
  }
}

export function useAnalyzeInbox(options = {}) {
  const service = options.service || opportunityService
  const status = ref('idle')
  const data = ref(loadAnalyzeInboxResponse())
  const error = ref(null)

  let activeController = null

  function cancel() {
    if (!activeController) return
    activeController.abort()
    activeController = null
  }

  function reset({ clearSession = false } = {}) {
    cancel()
    status.value = 'idle'
    error.value = null
    if (clearSession) {
      clearAnalyzeInboxResponse()
      data.value = null
      return
    }

    data.value = loadAnalyzeInboxResponse()
  }

  async function analyzeInbox(requestPayload) {
    cancel()
    activeController = new AbortController()
    status.value = 'loading'
    error.value = null

    try {
      const response = await service.analyzeInbox(requestPayload, {
        signal: activeController.signal
      })

      data.value = response
      saveAnalyzeInboxResponse(response)
      status.value = 'success'
      return response
    } catch (err) {
      const normalizedError = normalizeError(err)
      error.value = normalizedError
      status.value = normalizedError.code === 'ABORTED' ? 'cancelled' : 'error'
      throw err
    } finally {
      activeController = null
    }
  }

  return {
    status,
    data,
    error,
    analyzeInbox,
    reset,
    cancel
  }
}

export default useAnalyzeInbox
