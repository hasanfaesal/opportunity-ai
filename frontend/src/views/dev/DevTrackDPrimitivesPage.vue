<script setup>
import ChecklistStatusList from '@/components/opportunity/ChecklistStatusList.vue'
import ScoreIndicators from '@/components/opportunity/ScoreIndicators.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiErrorState from '@/components/ui/UiErrorState.vue'
import UiLoadingState from '@/components/ui/UiLoadingState.vue'

const checklist = [
  { task: 'Collect transcript', status: 'todo' },
  { task: 'Update CV', status: 'in_progress' },
  { task: 'Submit application', status: 'done' }
]

const scoreBreakdown = {
  urgency_score: 84,
  completeness_score: 61
}
</script>

<template>
  <main class="dev-page">
    <h1>Dev Track D - UI Primitives</h1>

    <div class="row">
      <UiBadge tone="neutral" label="Neutral" />
      <UiBadge tone="info" label="Info" />
      <UiBadge tone="success" label="Success" />
      <UiBadge tone="warning" label="Warning" />
      <UiBadge tone="danger" label="Danger" />
    </div>

    <UiLoadingState message="Loading preview" />
    <UiErrorState title="Error preview" message="This is a preview error" />
    <UiEmptyState title="Empty preview" description="No data available in this section." />
    <ScoreIndicators :score-breakdown="scoreBreakdown" />
    <ChecklistStatusList :items="checklist" />
  </main>
</template>

<style scoped>
.dev-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}

.row {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
</style>
