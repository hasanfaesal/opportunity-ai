<script setup>
import { computed, ref } from 'vue'

import OpportunityDetailsPanel from '@/components/opportunity/OpportunityDetailsPanel.vue'
import OpportunityRankedList from '@/components/opportunity/OpportunityRankedList.vue'
import responseFixture from '@/mocks/analyze-inbox.response.golden.json'

const items = computed(() => responseFixture.items || [])
const selectedId = ref(items.value[0]?.id || null)

const selectedItem = computed(() => {
  if (!items.value.length) return null
  return items.value.find(item => item.id === selectedId.value) || items.value[0]
})
</script>

<template>
  <main class="dev-page">
    <h1>Dev Track B - Output</h1>
    <div class="layout">
      <OpportunityRankedList :items="items" :selected-id="selectedId" @select="selectedId = $event" />
      <OpportunityDetailsPanel :item="selectedItem" />
    </div>
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

.layout {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: var(--space-6);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
