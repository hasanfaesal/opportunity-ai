<script setup>
import { computed } from 'vue'

import ChecklistStatusList from '@/components/opportunity/ChecklistStatusList.vue'
import ScoreIndicators from '@/components/opportunity/ScoreIndicators.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import { normalizeScore, toTitleCaseLabel } from '@/types/opportunity'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const extraction = computed(() => props.item?.extraction || {})
const scores = computed(() => props.item?.score_breakdown || {})
const contactInfo = computed(() => extraction.value?.application_contact_info || {})

const title = computed(() => {
  if (typeof extraction.value.title === 'string' && extraction.value.title.trim()) return extraction.value.title
  if (typeof extraction.value.organization === 'string' && extraction.value.organization.trim()) {
    return `Update from ${extraction.value.organization}`
  }
  return 'Untitled item'
})

const typeLabel = computed(() => toTitleCaseLabel(extraction.value.opportunity_type || 'other'))
const finalScore = computed(() => normalizeScore(scores.value?.final_score))
const fitScore = computed(() => normalizeScore(scores.value?.fit_score))

const deadlineLabel = computed(() => {
  const value = extraction.value?.deadline
  if (!value || typeof value !== 'string') return 'Not specified'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Not specified'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(parsed)
})

const eligibility = computed(() => {
  const list = extraction.value?.eligibility_conditions
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const requiredDocuments = computed(() => {
  const list = extraction.value?.required_documents
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const links = computed(() => {
  const list = contactInfo.value?.links
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const emails = computed(() => {
  const list = contactInfo.value?.emails
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const phones = computed(() => {
  const list = contactInfo.value?.phones
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const warnings = computed(() => {
  const list = props.item?.warnings
  return Array.isArray(list) ? list.filter(item => typeof item === 'string' && item.trim()) : []
})

const evidenceEntries = computed(() => {
  const evidence = props.item?.evidence
  if (!evidence || typeof evidence !== 'object') return []

  return Object.entries(evidence)
    .map(([key, snippets]) => {
      const normalizedSnippets = Array.isArray(snippets)
        ? snippets
            .filter(snippet => snippet && typeof snippet.snippet === 'string' && snippet.snippet.trim())
            .map(snippet => ({
              snippet: snippet.snippet,
              source_hint:
                typeof snippet.source_hint === 'string' && snippet.source_hint.trim()
                  ? snippet.source_hint
                  : null
            }))
        : []

      return {
        key,
        label: toTitleCaseLabel(key),
        snippets: normalizedSnippets
      }
    })
    .filter(entry => entry.snippets.length > 0)
})

const checklist = computed(() => {
  const list = props.item?.action_checklist
  return Array.isArray(list) ? list : []
})

const isOpportunity = computed(() => extraction.value?.is_opportunity === true)
</script>

<template>
  <section class="opportunity-details-panel" aria-label="Opportunity details">
    <UiEmptyState
      v-if="!props.item"
      title="Select an item"
      description="Choose an opportunity from the ranked list to inspect details and checklist."
    />

    <article v-else class="panel-card">
      <header class="panel-header">
        <div class="header-text">
          <h2 class="panel-title">{{ title }}</h2>
          <p class="panel-subtitle">
            {{ extraction.organization || 'Organization unavailable' }}
          </p>
        </div>
        <div class="header-badges">
          <UiBadge :tone="isOpportunity ? 'info' : 'neutral'" :label="isOpportunity ? typeLabel : 'Non-opportunity'" />
          <UiBadge tone="success" :label="`Final ${finalScore}%`" />
        </div>
      </header>

      <section class="section-block">
        <h3 class="section-title">Score indicators</h3>
        <p class="section-meta">Fit score: {{ fitScore }}%</p>
        <ScoreIndicators :score-breakdown="scores" />
      </section>

      <section class="section-block">
        <h3 class="section-title">Timeline</h3>
        <p class="content-text">{{ deadlineLabel }}</p>
      </section>

      <section class="section-block">
        <h3 class="section-title">Eligibility</h3>
        <ul v-if="eligibility.length" class="text-list">
          <li v-for="item in eligibility" :key="item">{{ item }}</li>
        </ul>
        <p v-else class="content-muted">No eligibility conditions extracted.</p>
      </section>

      <section class="section-block">
        <h3 class="section-title">Required documents</h3>
        <ul v-if="requiredDocuments.length" class="text-list">
          <li v-for="doc in requiredDocuments" :key="doc">{{ doc }}</li>
        </ul>
        <p v-else class="content-muted">No required documents extracted.</p>
      </section>

      <section class="section-block">
        <h3 class="section-title">Application and contact</h3>
        <div class="contact-grid">
          <div>
            <p class="contact-heading">Links</p>
            <ul v-if="links.length" class="text-list compact">
              <li v-for="link in links" :key="link">
                <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
              </li>
            </ul>
            <p v-else class="content-muted">None provided.</p>
          </div>
          <div>
            <p class="contact-heading">Emails</p>
            <ul v-if="emails.length" class="text-list compact">
              <li v-for="email in emails" :key="email">{{ email }}</li>
            </ul>
            <p v-else class="content-muted">None provided.</p>
          </div>
          <div>
            <p class="contact-heading">Phones</p>
            <ul v-if="phones.length" class="text-list compact">
              <li v-for="phone in phones" :key="phone">{{ phone }}</li>
            </ul>
            <p v-else class="content-muted">None provided.</p>
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">Why ranked here</h3>
        <p class="content-text">{{ props.item.ranking_reason || 'No ranking reason provided.' }}</p>
      </section>

      <section class="section-block">
        <h3 class="section-title">Action checklist</h3>
        <ChecklistStatusList :items="checklist" />
      </section>

      <section class="section-block">
        <h3 class="section-title">Evidence snippets</h3>
        <div v-if="evidenceEntries.length" class="evidence-grid">
          <div v-for="entry in evidenceEntries" :key="entry.key" class="evidence-card">
            <p class="contact-heading">{{ entry.label }}</p>
            <ul class="text-list compact">
              <li v-for="snippet in entry.snippets" :key="`${entry.key}-${snippet.snippet}`">
                <span>{{ snippet.snippet }}</span>
                <span v-if="snippet.source_hint" class="hint">({{ snippet.source_hint }})</span>
              </li>
            </ul>
          </div>
        </div>
        <p v-else class="content-muted">No evidence snippets available.</p>
      </section>

      <section v-if="warnings.length" class="section-block">
        <h3 class="section-title">Warnings</h3>
        <ul class="text-list compact">
          <li v-for="warning in warnings" :key="warning">{{ warning }}</li>
        </ul>
      </section>
    </article>
  </section>
</template>

<style scoped>
.opportunity-details-panel {
  min-height: 20rem;
}

.panel-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  padding: var(--space-6);
  display: grid;
  gap: var(--space-5);
}

.panel-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-4);
}

.panel-title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
}

.panel-subtitle {
  margin: var(--space-1) 0 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.header-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: flex-start;
}

.section-block {
  display: grid;
  gap: var(--space-2);
}

.section-title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}

.section-meta {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.content-text {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.content-muted {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.text-list {
  margin: 0;
  padding-left: 1.25rem;
  color: var(--color-text-primary);
  display: grid;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
}

.text-list.compact {
  gap: 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.contact-heading {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.evidence-grid {
  display: grid;
  gap: var(--space-3);
}

.evidence-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-page);
  padding: var(--space-3);
  display: grid;
  gap: var(--space-2);
}

.hint {
  color: var(--color-text-muted);
  margin-left: var(--space-1);
}

@media (max-width: 720px) {
  .panel-card {
    padding: var(--space-4);
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
