<template>
  <div class="results-page">
    <h1>Ranked Opportunities</h1>
    <button @click="$router.push('/')">Back</button>
    <div v-if="results.length === 0" class="no-results">No opportunities found</div>
    <div v-else class="cards">
      <div v-for="(item, idx) in results" :key="idx" class="card">
        <div class="card-header">
          <span class="type">{{ item.opportunity.opportunity_type || 'Opportunity' }}</span>
          <span class="score" :class="getScoreClass(item.score)">{{ (item.score * 100).toFixed(0) }}</span>
        </div>
        <div class="scores">
          <span>Fit: {{ (item.fit_score * 100).toFixed(0) }}</span>
          <span>Urgency: {{ (item.urgency_score * 100).toFixed(0) }}</span>
          <span>Complete: {{ (item.completeness_score * 100).toFixed(0) }}</span>
        </div>
        <p class="reasoning">{{ item.reasoning }}</p>
        <div class="next-steps">
          <strong>Next Steps:</strong>
          <ul>
            <li v-for="(step, i) in item.next_steps" :key="i">{{ step }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const results = ref([])

onMounted(() => {
  results.value = window.opportunityResults || []
})

function getScoreClass(score) {
  if (score >= 0.7) return 'high'
  if (score >= 0.4) return 'medium'
  return 'low'
}
</script>

<style scoped>
.results-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
}
.no-results {
  text-align: center;
  color: #666;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #fafafa;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.type {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: #2563eb;
}
.score {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
.score.high { background: #22c55e; color: white; }
.score.medium { background: #f59e0b; color: white; }
.score.low { background: #ef4444; color: white; }
.scores {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.reasoning {
  margin: 0.5rem 0;
}
.next-steps ul {
  margin: 0;
  padding-left: 1.25rem;
}
</style>