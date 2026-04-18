<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Please fix these issues before submitting:'
  },
  errors: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <UAlert
    v-if="props.errors.length"
    class="input-error-summary"
    color="error"
    variant="soft"
    :title="props.title"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <template #description>
      <ul class="error-list">
        <li v-for="(errorText, index) in props.errors" :key="`${errorText}-${index}`">
          {{ errorText }}
        </li>
      </ul>
    </template>
  </UAlert>
</template>

<style scoped>
.error-list {
  margin: 0;
  padding-left: 1.25rem;
  display: grid;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
}
</style>
