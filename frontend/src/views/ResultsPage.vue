<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import OpportunityDetailsPanel from '@/components/opportunity/OpportunityDetailsPanel.vue'
import OpportunityRankedList from '@/components/opportunity/OpportunityRankedList.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiErrorState from '@/components/ui/UiErrorState.vue'
import UiLoadingState from '@/components/ui/UiLoadingState.vue'
import { useAnalyzeInbox } from '@/composables/useAnalyzeInbox'

const router = useRouter()
const { data, status, error } = useAnalyzeInbox()

const items = computed(() => (Array.isArray(data.value?.items) ? data.value.items : []))
const selectedId = ref(null)

const selectedItem = computed(() => {
  if (!items.value.length) return null
  return items.value.find(item => item.id === selectedId.value) || items.value[0]
})

const generatedAtLabel = computed(() => {
  const rawDate = data.value?.generated_at
  if (!rawDate) return 'Unknown'

  const parsedDate = new Date(rawDate)
  if (Number.isNaN(parsedDate.getTime())) return 'Unknown'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsedDate)
})

const requestId = computed(() => data.value?.request_id || 'Unavailable')
const isLoading = computed(() => status.value === 'loading')
const isError = computed(() => status.value === 'error')
const errorMessage = computed(() => error.value?.message || 'Unable to load analyzed opportunities')

watch(
  items,
  nextItems => {
    if (!nextItems.length) {
      selectedId.value = null
      return
    }

    const hasSelected = nextItems.some(item => item.id === selectedId.value)
    if (!hasSelected) {
      selectedId.value = nextItems[0].id
    }
  },
  { immediate: true }
)

function handleRetry() {
  router.push('/')
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="results-page">
    <header class="page-header">
      <div>
        <h1 class="title">Ranked Opportunities</h1>
        <p class="meta">Request: {{ requestId }} · Generated: {{ generatedAtLabel }}</p>
      </div>
      <UButton type="button" color="neutral" variant="outline" @click="goBack">Back to input</UButton>
    </header>

    <UiLoadingState v-if="isLoading" message="Loading your ranked opportunities" />

    <UiErrorState
      v-else-if="isError"
      title="Results unavailable"
      :message="errorMessage"
      @retry="handleRetry"
    />

    <UiEmptyState
      v-else-if="!items.length"
      title="No opportunities found"
      description="Submit emails from the input page to generate ranked results."
    />

    <div v-else class="results-layout">
      <OpportunityRankedList
        :items="items"
        :selected-id="selectedItem?.id || null"
        @select="selectedId = $event"
      />
      <OpportunityDetailsPanel :item="selectedItem" />
    </div>
  </div>
</template>

<style scoped>
.results-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-8);
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  line-height: var(--line-height-tight);
}

.meta {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.results-layout {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: var(--space-6);
  align-items: start;
}

@media (max-width: 960px) {
  .results-page {
    padding: var(--space-6);
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .results-layout {
    grid-template-columns: 1fr;
  }
}
</style>
