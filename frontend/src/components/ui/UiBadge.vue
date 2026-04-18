<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: {
    type: String,
    default: 'neutral'
  },
  label: {
    type: String,
    default: ''
  }
})

const colorByTone = {
  neutral: 'neutral',
  info: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'error'
}

const badgeColor = computed(() => colorByTone[props.tone] || 'neutral')
</script>

<template>
  <UBadge :color="badgeColor" variant="soft" size="sm">
    <slot>{{ props.label }}</slot>
  </UBadge>
</template>
