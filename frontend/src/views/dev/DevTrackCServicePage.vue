<script setup>
import requestFixture from '@/mocks/analyze-inbox.request.golden.json'
import UiErrorState from '@/components/ui/UiErrorState.vue'
import UiLoadingState from '@/components/ui/UiLoadingState.vue'
import { useAnalyzeInbox } from '@/composables/useAnalyzeInbox'
import opportunityService from '@/services/opportunity'

const { status, data, error, analyzeInbox, cancel, reset } = useAnalyzeInbox()

async function run() {
  await analyzeInbox(JSON.parse(JSON.stringify(requestFixture)))
}

function resetAll() {
  reset({ clearSession: true })
}
</script>

<template>
  <main class="dev-page">
    <h1>Dev Track C - Service</h1>
    <p>Service mode: {{ opportunityService.mode }}</p>

    <div class="actions">
      <UButton color="primary" @click="run">Run analyzeInbox</UButton>
      <UButton color="warning" variant="soft" @click="cancel">Cancel</UButton>
      <UButton color="neutral" variant="outline" @click="resetAll">Reset</UButton>
    </div>

    <UiLoadingState v-if="status === 'loading'" message="Running service request..." />
    <UiErrorState
      v-else-if="status === 'error'"
      title="Service call failed"
      :message="error?.message || 'Unknown error'"
      @retry="run"
    />

    <pre v-else-if="data" class="json">{{ JSON.stringify(data, null, 2) }}</pre>
  </main>
</template>

<style scoped>
.dev-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}

.actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.json {
  margin: 0;
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  overflow: auto;
  max-height: 420px;
}
</style>
