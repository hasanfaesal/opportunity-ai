<script setup>
import { computed } from 'vue'

import UiBadge from '@/components/ui/UiBadge.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

function normalizeStatus(status) {
  if (status === 'done' || status === 'in_progress' || status === 'todo') return status
  return 'todo'
}

const normalizedItems = computed(() => {
  return props.items
    .filter(item => item && typeof item.task === 'string' && item.task.trim())
    .map(item => ({
      task: item.task.trim(),
      status: normalizeStatus(item.status)
    }))
})

function statusLabel(status) {
  if (status === 'done') return 'Done'
  if (status === 'in_progress') return 'In progress'
  return 'To do'
}

function statusTone(status) {
  if (status === 'done') return 'success'
  if (status === 'in_progress') return 'warning'
  return 'neutral'
}
</script>

<template>
  <div class="checklist-status-list">
    <p v-if="!normalizedItems.length" class="empty-text">No checklist provided.</p>
    <ul v-else class="list">
      <li v-for="item in normalizedItems" :key="`${item.status}-${item.task}`" class="list-item">
        <span class="task">{{ item.task }}</span>
        <UiBadge :tone="statusTone(item.status)" :label="statusLabel(item.status)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-2);
}

.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
}

.task {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.empty-text {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
