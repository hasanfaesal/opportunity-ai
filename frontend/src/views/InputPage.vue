<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAnalyzeInbox } from '@/composables/useAnalyzeInbox'
import UiErrorState from '@/components/ui/UiErrorState.vue'
import UiLoadingState from '@/components/ui/UiLoadingState.vue'
import InputErrorSummary from '@/components/input/InputErrorSummary.vue'
import StudentProfileSection from '@/components/input/StudentProfileSection.vue'
import EmailBatchSection from '@/components/input/EmailBatchSection.vue'

const router = useRouter()
const { status, error, analyzeInbox } = useAnalyzeInbox()

const model = reactive({
  profile: {
    degree_program: '',
    semester: 1,
    cgpa: null,
    skills: [],
    interests: [],
    preferred_opportunity_types: [],
    preferred_locations: [],
    financial_need: false,
    experience_summary: ''
  },
  emails: []
})

const fieldErrors = ref({})
const submitErrors = ref([])

const isLoading = computed(() => status.value === 'loading')
const hasRequestError = computed(() => status.value === 'error' && !!error.value)

function validateForm() {
  const nextFieldErrors = {}
  const globalErrors = []

  if (!model.profile.degree_program.trim()) {
    nextFieldErrors.degree_program = 'Degree program is required'
  }

  if (!Number.isInteger(model.profile.semester) || model.profile.semester < 1) {
    nextFieldErrors.semester = 'Semester must be a positive whole number'
  }

  if (
    model.profile.cgpa !== null &&
    (!(typeof model.profile.cgpa === 'number') || Number.isNaN(model.profile.cgpa) || model.profile.cgpa < 0 || model.profile.cgpa > 4)
  ) {
    globalErrors.push('CGPA must be between 0.00 and 4.00 when provided')
  }

  if (!Array.isArray(model.profile.skills) || model.profile.skills.length === 0) {
    nextFieldErrors.skills = 'Add at least one skill'
  }

  if (!Array.isArray(model.profile.interests) || model.profile.interests.length === 0) {
    nextFieldErrors.interests = 'Add at least one interest'
  }

  if (!Array.isArray(model.profile.preferred_opportunity_types) || model.profile.preferred_opportunity_types.length === 0) {
    nextFieldErrors.preferred_opportunity_types = 'Select at least one preferred opportunity type'
  }

  if (!model.profile.experience_summary.trim()) {
    nextFieldErrors.experience_summary = 'Experience summary is required'
  }

  if (!Array.isArray(model.emails) || model.emails.length < 5 || model.emails.length > 15) {
    nextFieldErrors.emails = 'Email batch must contain between 5 and 15 emails'
    globalErrors.push('Provide between 5 and 15 emails before submitting')
  }

  model.emails.forEach((email, index) => {
    const rowNumber = index + 1
    if (!email.subject || !email.subject.trim()) {
      globalErrors.push(`Email ${rowNumber} is missing subject`)
    }
    if (!email.body || !email.body.trim()) {
      globalErrors.push(`Email ${rowNumber} is missing body`)
    }
  })

  fieldErrors.value = nextFieldErrors
  submitErrors.value = globalErrors

  return Object.keys(nextFieldErrors).length === 0 && globalErrors.length === 0
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    const requestPayload = {
      profile: {
        ...model.profile,
        degree_program: model.profile.degree_program.trim(),
        skills: model.profile.skills.map(item => item.trim()).filter(Boolean),
        interests: model.profile.interests.map(item => item.trim()).filter(Boolean),
        preferred_locations: model.profile.preferred_locations.map(item => item.trim()).filter(Boolean),
        experience_summary: model.profile.experience_summary.trim()
      },
      emails: model.emails.map(email => ({
        id: email.id,
        source_type: email.source_type,
        subject: (email.subject || '').trim(),
        sender: (email.sender || '').trim(),
        body: (email.body || '').trim()
      }))
    }

    await analyzeInbox(requestPayload)
    router.push('/results')
  } catch {
    submitErrors.value = ['We could not analyze your inbox right now. Please try again.']
  }
}

function retryRequest() {
  handleSubmit()
}
</script>

<template>
  <main class="input-page">
    <header class="page-head">
      <h1>Opportunity Inbox Input</h1>
      <p>Fill your student profile and add 5-15 emails for analysis.</p>
    </header>

    <InputErrorSummary :errors="submitErrors" />

    <UiErrorState
      v-if="hasRequestError"
      title="Inbox analysis failed"
      :message="error?.message || 'Please try again in a moment.'"
      @retry="retryRequest"
    />

    <form class="input-form" @submit.prevent="handleSubmit">
      <StudentProfileSection v-model="model.profile" :field-errors="fieldErrors" />

      <EmailBatchSection v-model="model.emails" :field-errors="fieldErrors" />

      <div class="actions">
        <UButton type="submit" color="primary" :loading="isLoading" :disabled="isLoading">
          {{ isLoading ? 'Analyzing...' : 'Analyze Inbox' }}
        </UButton>
      </div>

      <UiLoadingState
        v-if="isLoading"
        message="Analyzing emails and ranking opportunities..."
      />
    </form>
  </main>
</template>

<style scoped>
.input-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-8);
  display: grid;
  gap: var(--space-4);
}

.page-head h1 {
  margin: 0;
  font-size: 1.7rem;
  color: var(--color-text-primary);
}

.page-head p {
  margin: var(--space-2) 0 0;
  color: var(--color-text-secondary);
}

.input-form {
  display: grid;
  gap: var(--space-4);
}

.actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .input-page {
    padding: var(--space-4);
  }

  .actions {
    justify-content: stretch;
  }
}
</style>
