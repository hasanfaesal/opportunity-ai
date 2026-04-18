<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'No items yet'
  },
  description: {
    type: String,
    default: 'Try changing filters or adding new data.'
  },
  announce: {
    type: String,
    default: ''
  }
})

const titleId = useId()
const rootClass = computed(() => 'ui-empty-state')
</script>

<template>
  <section :class="rootClass" :aria-labelledby="titleId">
    <div class="icon" aria-hidden="true">-</div>
    <h2 :id="titleId" class="title">{{ props.title }}</h2>
    <p class="description">{{ props.description }}</p>
    <p v-if="props.announce" class="sr-live-region" aria-live="polite" aria-atomic="true">
      {{ props.announce }}
    </p>
    <slot />
  </section>
</template>

<style scoped>
.ui-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8);
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-pill);
  background: var(--color-neutral-bg);
  color: var(--color-neutral-fg);
  font-weight: var(--font-weight-semibold);
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-tight);
}

.description {
  margin: 0;
  max-width: 40ch;
  font-size: var(--font-size-sm);
}
</style>
