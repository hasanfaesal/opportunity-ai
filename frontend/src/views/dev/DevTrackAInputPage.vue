<script setup>
import { reactive } from 'vue'

import EmailBatchSection from '@/components/input/EmailBatchSection.vue'
import InputErrorSummary from '@/components/input/InputErrorSummary.vue'
import StudentProfileSection from '@/components/input/StudentProfileSection.vue'
import requestFixture from '@/mocks/analyze-inbox.request.golden.json'

const model = reactive(JSON.parse(JSON.stringify(requestFixture)))
</script>

<template>
  <main class="dev-page">
    <h1>Dev Track A - Input</h1>
    <InputErrorSummary :errors="[]" />
    <StudentProfileSection v-model="model.profile" :field-errors="{}" />
    <EmailBatchSection v-model="model.emails" :field-errors="{}" />
  </main>
</template>

<style scoped>
.dev-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}
</style>
