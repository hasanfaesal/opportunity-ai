<script setup>
import { computed } from 'vue'

import OpportunityRankedListItem from '@/components/opportunity/OpportunityRankedListItem.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  selectedId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const normalizedItems = computed(() => {
  return props.items
    .filter(item => item && typeof item.id === 'string')
    .map(item => ({
      ...item,
      score_breakdown: item.score_breakdown || {}
    }))
    .sort((left, right) => {
      const leftScore = Number.isFinite(left.score_breakdown?.final_score) ? left.score_breakdown.final_score : 0
      const rightScore = Number.isFinite(right.score_breakdown?.final_score) ? right.score_breakdown.final_score : 0
      return rightScore - leftScore
    })
})

function selectItem(id) {
  emit('select', id)
}
</script>

<template>
  <aside class="opportunity-ranked-list" aria-label="Ranked opportunities">
    <UiEmptyState
      v-if="!normalizedItems.length"
      title="No ranked items"
      description="Run an analysis from the input page to populate this list."
    />
    <ul v-else class="list">
      <li v-for="(item, index) in normalizedItems" :key="item.id" class="list-item">
        <OpportunityRankedListItem
          :item="item"
          :rank="index + 1"
          :selected="item.id === props.selectedId"
          @select="selectItem"
        />
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.opportunity-ranked-list {
  min-height: 20rem;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-3);
}

.list-item {
  margin: 0;
}
</style>
