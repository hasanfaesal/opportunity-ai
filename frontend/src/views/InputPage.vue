<template>
  <div class="input-page">
    <h1>Opportunity Pipeline</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Major</label>
        <input v-model="profile.major" type="text" placeholder="e.g. Computer Science" required />
      </div>
      <div class="form-group">
        <label>Year (1-4)</label>
        <input v-model.number="profile.year" type="number" min="1" max="4" required />
      </div>
      <div class="form-group">
        <label>Interests (comma-separated)</label>
        <input v-model="interestsStr" type="text" placeholder="e.g. AI, ML, Web Dev" />
      </div>
      <div class="form-group">
        <label>Skills (comma-separated)</label>
        <input v-model="skillsStr" type="text" placeholder="e.g. Python, JS, React" />
      </div>
      <div class="form-group">
        <label>GPA (optional)</label>
        <input v-model.number="profile.gpa" type="number" step="0.01" min="0" max="4" />
      </div>
      <div class="form-group">
        <label>Emails (one per line)</label>
        <textarea v-model="emailsStr" rows="6" placeholder="Paste your emails here..."></textarea>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Processing...' : 'Find Opportunities' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { extractAndRank } from '@/api/http'

const router = useRouter()
const loading = ref(false)

const profile = reactive({
  major: '',
  year: 2,
  interests: [],
  skills: [],
  gpa: null
})

const interestsStr = ref('')
const skillsStr = ref('')
const emailsStr = ref('')

async function handleSubmit() {
  loading.value = true
  try {
    profile.interests = interestsStr.value.split(',').map(s => s.trim()).filter(s => s)
    profile.skills = skillsStr.value.split(',').map(s => s.trim()).filter(s => s)

    const emails = emailsStr.value.split('\n').filter(e => e.trim()).map(line => {
      const parts = line.split('|')
      return {
        subject: parts[0]?.trim() || '',
        sender: parts[1]?.trim() || 'unknown@example.com',
        body: parts.slice(1).join('|').trim() || line
      }
    })

    const results = await extractAndRank(emails, profile)
    window.opportunityResults = results
    router.push('/results')
  } catch (err) {
    console.error(err)
    alert('Failed to process: ' + err.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #9ca3af;
}
</style>