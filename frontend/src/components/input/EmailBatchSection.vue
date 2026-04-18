<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  fieldErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const pastedText = ref('')
const parseError = ref('')

const emailRows = computed(() => props.modelValue || [])
const emailCount = computed(() => emailRows.value.length)

const qualitySummary = computed(() => {
  const missingSubject = emailRows.value.filter(email => !email.subject || !email.subject.trim()).length
  const missingBody = emailRows.value.filter(email => !email.body || !email.body.trim()).length
  return {
    missingSubject,
    missingBody
  }
})

function updateEmails(nextEmails) {
  emit('update:modelValue', nextEmails)
}

function normalizeEmailRow(raw, index, sourceType = 'paste') {
  const row = raw && typeof raw === 'object' ? raw : {}
  return {
    id: typeof row.id === 'string' && row.id.trim() ? row.id.trim() : `email-${Date.now()}-${index + 1}`,
    source_type: sourceType,
    subject: typeof row.subject === 'string' ? row.subject.trim() : '',
    sender: typeof row.sender === 'string' ? row.sender.trim() : '',
    body: typeof row.body === 'string' ? row.body.trim() : ''
  }
}

function parsePastedEmails(text) {
  const trimmed = text.trim()
  if (!trimmed) return []

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed.map((entry, index) => normalizeEmailRow(entry, index, 'paste'))
    if (parsed && Array.isArray(parsed.emails)) {
      return parsed.emails.map((entry, index) => normalizeEmailRow(entry, index, 'paste'))
    }
    throw new Error('JSON must be an array of emails or an object with an emails array')
  }

  return trimmed
    .split(/\n\s*\n/g)
    .map(block => block.trim())
    .filter(Boolean)
    .map((body, index) => {
      const firstLine = body.split('\n')[0] || ''
      return {
        id: `email-${Date.now()}-${index + 1}`,
        source_type: 'paste',
        subject: firstLine.slice(0, 80) || `Pasted Email ${index + 1}`,
        sender: '',
        body
      }
    })
}

function parseCsvEmails(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(item => item.trim().toLowerCase())
  const subjectIndex = headers.indexOf('subject')
  const senderIndex = headers.indexOf('sender')
  const bodyIndex = headers.indexOf('body')

  if (subjectIndex === -1 || bodyIndex === -1) {
    throw new Error('CSV needs at least subject and body columns')
  }

  return lines.slice(1).map((line, index) => {
    const cols = line.split(',').map(item => item.trim())
    return normalizeEmailRow(
      {
        id: `email-${Date.now()}-${index + 1}`,
        subject: cols[subjectIndex] || '',
        sender: senderIndex >= 0 ? cols[senderIndex] || '' : '',
        body: cols[bodyIndex] || ''
      },
      index,
      'upload'
    )
  })
}

function addFromPaste() {
  parseError.value = ''

  try {
    const parsed = parsePastedEmails(pastedText.value)
    if (!parsed.length) {
      parseError.value = 'No emails found in pasted input'
      return
    }

    updateEmails([...emailRows.value, ...parsed])
    pastedText.value = ''
  } catch (error) {
    parseError.value = error.message || 'Could not parse pasted emails'
  }
}

async function onUploadChange(event) {
  parseError.value = ''
  const [file] = event.target.files || []
  if (!file) return

  try {
    const rawText = await file.text()
    let parsed = []

    if (file.name.toLowerCase().endsWith('.json')) {
      parsed = parsePastedEmails(rawText).map((row, index) => normalizeEmailRow(row, index, 'upload'))
    } else if (file.name.toLowerCase().endsWith('.csv')) {
      parsed = parseCsvEmails(rawText)
    } else {
      throw new Error('Only .json and .csv files are supported')
    }

    if (!parsed.length) {
      parseError.value = 'No rows were parsed from uploaded file'
      return
    }

    updateEmails([...emailRows.value, ...parsed])
  } catch (error) {
    parseError.value = error.message || 'Failed to parse uploaded file'
  } finally {
    event.target.value = ''
  }
}

function updateRow(index, field, value) {
  const next = [...emailRows.value]
  next[index] = {
    ...next[index],
    [field]: value
  }
  updateEmails(next)
}

function removeRow(index) {
  updateEmails(emailRows.value.filter((_, rowIndex) => rowIndex !== index))
}
</script>

<template>
  <section class="emails-section">
    <h2>Email Batch</h2>
    <p class="batch-meta">
      Total emails: {{ emailCount }} (required: 5-15)
    </p>

    <div class="input-panels">
      <div class="panel">
        <label>
          <span>Paste emails (JSON or plain blocks)</span>
          <textarea
            v-model="pastedText"
            rows="7"
            placeholder="Paste an array of email objects or plain email text blocks"
            :aria-invalid="Boolean(parseError)"
            :aria-describedby="parseError ? 'email-parse-error' : undefined"
          ></textarea>
        </label>
        <UButton type="button" color="primary" variant="solid" @click="addFromPaste">Add from Paste</UButton>
      </div>

      <div class="panel upload-panel">
        <label>
          <span>Upload .json or .csv</span>
          <input type="file" accept=".json,.csv" @change="onUploadChange" />
        </label>
        <p class="hint">CSV header example: subject,sender,body</p>
      </div>
    </div>

    <p v-if="parseError" id="email-parse-error" class="parse-error">{{ parseError }}</p>
    <p v-if="props.fieldErrors.emails" id="email-count-error" class="parse-error">{{ props.fieldErrors.emails }}</p>
    <p class="quality-summary">
      Quality checks: missing subjects {{ qualitySummary.missingSubject }}, missing bodies {{ qualitySummary.missingBody }}
    </p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Subject</th>
            <th>Sender</th>
            <th>Body</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(email, index) in emailRows" :key="email.id">
            <td>{{ email.id }}</td>
            <td>{{ email.source_type }}</td>
            <td>
              <input
                :value="email.subject"
                type="text"
                :aria-invalid="!email.subject || !email.subject.trim()"
                @input="updateRow(index, 'subject', $event.target.value)"
              />
            </td>
            <td>
              <input
                :value="email.sender"
                type="text"
                @input="updateRow(index, 'sender', $event.target.value)"
              />
            </td>
            <td>
              <textarea
                :value="email.body"
                rows="3"
                :aria-invalid="!email.body || !email.body.trim()"
                @input="updateRow(index, 'body', $event.target.value)"
              ></textarea>
            </td>
            <td>
              <UButton type="button" color="error" variant="soft" size="xs" @click="removeRow(index)">
                Remove
              </UButton>
            </td>
          </tr>
          <tr v-if="!emailRows.length">
            <td colspan="6" class="empty">No emails added yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.emails-section {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
}

h2 {
  margin: 0;
  font-size: var(--font-size-lg);
}

.input-panels {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.panel {
  display: grid;
  gap: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-subtle);
  padding: var(--space-3);
}

label {
  display: grid;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

textarea,
input[type='text'],
input[type='file'] {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.65rem;
  font: inherit;
  color: var(--color-text-primary);
  background: #fff;
}

textarea {
  resize: vertical;
}

.hint {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.parse-error {
  margin: 0;
  color: var(--color-danger-fg);
  font-size: var(--font-size-sm);
}

.batch-meta,
.quality-summary {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 820px;
}

th,
td {
  border: 1px solid var(--color-border);
  padding: var(--space-2);
  vertical-align: top;
  text-align: left;
  font-size: var(--font-size-sm);
}

thead th {
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
}

.empty {
  text-align: center;
  color: var(--color-text-muted);
}
</style>
