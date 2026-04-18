<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Loading...'
  },
  polite: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div
    class="ui-loading-state"
    :aria-live="polite ? 'polite' : 'assertive'"
    aria-atomic="true"
  >
    <UProgress animation="carousel" />
    <p class="message">{{ props.message }}</p>
  </div>
</template>

<style scoped>
.ui-loading-state {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
}

.message {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}
</style>
