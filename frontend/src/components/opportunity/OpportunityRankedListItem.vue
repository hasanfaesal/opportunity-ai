<script setup>
import { computed } from 'vue'

import ScoreIndicators from '@/components/opportunity/ScoreIndicators.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import { normalizeScore, toTitleCaseLabel } from '@/types/opportunity'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const extraction = computed(() => props.item?.extraction || {})
const score = computed(() => normalizeScore(props.item?.score_breakdown?.final_score))
const isOpportunity = computed(() => extraction.value.is_opportunity === true)

const title = computed(() => {
  if (typeof extraction.value.title === 'string' && extraction.value.title.trim()) return extraction.value.title
  if (typeof extraction.value.organization === 'string' && extraction.value.organization.trim()) {
    return `${extraction.value.organization} update`
  }
  return 'Untitled email'
})

const typeLabel = computed(() => toTitleCaseLabel(extraction.value.opportunity_type || 'other'))

const tone = computed(() => {
  if (!isOpportunity.value) return 'neutral'
  if (score.value >= 80) return 'success'
  if (score.value >= 50) return 'warning'
  return 'danger'
})

const deadlineLabel = computed(() => {
  const deadline = extraction.value?.deadline
  if (!deadline || typeof deadline !== 'string') return 'Deadline unavailable'

  const parsed = new Date(deadline)
  if (Number.isNaN(parsed.getTime())) return 'Deadline unavailable'

  return `Due ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(parsed)}`
})

function onSelect() {
  emit('select', props.item.id)
}
</script>

<template>
  <button
    type="button"
    class="ranked-item"
    :class="{ selected: props.selected }"
    @click="onSelect"
  >
    <div class="top-row">
      <UiBadge tone="info" :label="`#${props.rank}`" />
      <UiBadge :tone="tone" :label="`${score}%`" />
    </div>

    <p class="title">{{ title }}</p>

    <div class="meta-row">
      <UiBadge :tone="isOpportunity ? 'info' : 'neutral'" :label="isOpportunity ? typeLabel : 'Non-opportunity'" />
      <span class="deadline">{{ deadlineLabel }}</span>
    </div>

    <ScoreIndicators :score-breakdown="props.item?.score_breakdown" compact />
  </button>
</template>

<style scoped>
.ranked-item {
  width: 100%;
  display: grid;
  gap: var(--space-3);
  text-align: left;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: border-color var(--motion-base) var(--easing-standard), box-shadow var(--motion-base) var(--easing-standard), transform var(--motion-fast) var(--easing-standard);
}

.ranked-item:hover {
  border-color: var(--color-focus);
  box-shadow: var(--shadow-sm);
}

.ranked-item.selected {
  border-color: var(--color-focus);
  box-shadow: var(--shadow-md);
}

.ranked-item:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.deadline {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}
</style>
