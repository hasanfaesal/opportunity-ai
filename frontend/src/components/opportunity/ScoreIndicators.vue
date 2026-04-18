<script setup>
import { computed } from 'vue'
import { normalizeScore } from '@/types/opportunity'

const props = defineProps({
  scoreBreakdown: {
    type: Object,
    default: () => ({})
  },
  compact: {
    type: Boolean,
    default: false
  }
})

function scoreTone(value) {
  if (value >= 80) return 'success'
  if (value >= 50) return 'warning'
  return 'danger'
}

const indicators = computed(() => {
  const urgency = normalizeScore(props.scoreBreakdown?.urgency_score)
  const completeness = normalizeScore(props.scoreBreakdown?.completeness_score)

  return [
    {
      key: 'urgency',
      label: 'Urgency',
      value: urgency,
      tone: scoreTone(urgency)
    },
    {
      key: 'completeness',
      label: 'Completeness',
      value: completeness,
      tone: scoreTone(completeness)
    }
  ]
})
</script>

<template>
  <div class="score-indicators" :class="{ compact: props.compact }">
    <article v-for="indicator in indicators" :key="indicator.key" class="indicator">
      <div class="indicator-header">
        <span class="label">{{ indicator.label }}</span>
        <span class="value">{{ indicator.value }}%</span>
      </div>
      <div class="bar" role="progressbar" :aria-label="indicator.label" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="indicator.value">
        <span class="fill" :class="`tone-${indicator.tone}`" :style="{ width: `${indicator.value}%` }" />
      </div>
    </article>
  </div>
</template>

<style scoped>
.score-indicators {
  display: grid;
  gap: var(--space-3);
}

.score-indicators.compact {
  gap: var(--space-2);
}

.indicator {
  display: grid;
  gap: var(--space-1);
}

.indicator-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.value {
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.bar {
  height: 0.4rem;
  border-radius: var(--radius-pill);
  background: var(--color-neutral-bg);
  overflow: hidden;
}

.fill {
  display: block;
  height: 100%;
}

.tone-success {
  background: var(--color-success-fg);
}

.tone-warning {
  background: var(--color-warning-fg);
}

.tone-danger {
  background: var(--color-danger-fg);
}
</style>
