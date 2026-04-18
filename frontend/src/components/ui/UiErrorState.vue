<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Something went wrong'
  },
  message: {
    type: String,
    default: 'Please try again in a moment.'
  }
})

const emit = defineEmits(['retry'])
</script>

<template>
  <section class="ui-error-state" role="alert" aria-live="assertive" aria-atomic="true">
    <UAlert :title="props.title" :description="props.message" color="error" variant="soft" />
    <UButton type="button" color="error" variant="solid" @click="emit('retry')">Retry</UButton>
    <slot />
  </section>
</template>

<style scoped>
.ui-error-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  width: 100%;
}
</style>
