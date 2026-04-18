<script setup>
import { RouterLink } from 'vue-router'

const highlights = [
  {
    title: 'Signal Detection',
    text: 'Separates real scholarships, internships, fellowships, and admissions from inbox noise.'
  },
  {
    title: 'Structured Extraction',
    text: 'Pulls deadline, eligibility, documents, and contact details with clear evidence snippets.'
  },
  {
    title: 'Deterministic Ranking',
    text: 'Transparent scoring blends fit, urgency, and completeness for auditable prioritization.'
  }
]

const stats = [
  { value: '5-15', label: 'Emails per batch' },
  { value: '3x', label: 'Faster triage flow' },
  { value: '100%', label: 'Score explainability' }
]
</script>

<template>
  <section class="hero-section">
    <div class="hero-grid site-shell">
      <div class="hero-copy">
        <p class="eyebrow">Enterprise AI for student ops</p>
        <h1 class="hero-title">Convert chaotic opportunity inboxes into ranked action plans.</h1>
        <p class="hero-lead">
          Opportunity Inbox Copilot analyzes noisy emails, extracts reliable application details, and ranks the best next moves.
          Built for institutions that need speed, consistency, and audit-ready logic.
        </p>
        <div class="hero-actions">
          <RouterLink class="btn-primary" to="/input">Launch Workspace</RouterLink>
          <RouterLink class="btn-secondary" to="/features">Explore Platform</RouterLink>
        </div>
      </div>

      <div class="hero-panel" aria-label="Scoring preview">
        <div class="panel-header">
          <p>Priority Intelligence</p>
          <span>Live Model</span>
        </div>
        <ul>
          <li>
            <span>AI Internship 2026</span>
            <strong>0.92</strong>
          </li>
          <li>
            <span>Merit Scholarship Track</span>
            <strong>0.88</strong>
          </li>
          <li>
            <span>Global Fellowship Batch</span>
            <strong>0.84</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="site-shell metrics-strip" aria-label="Platform metrics">
    <article v-for="stat in stats" :key="stat.label" class="metric-card">
      <p class="metric-value">{{ stat.value }}</p>
      <p class="metric-label">{{ stat.label }}</p>
    </article>
  </section>

  <section class="site-shell section-block" aria-label="Core capabilities">
    <header class="section-head">
      <p class="eyebrow">What makes it production-ready</p>
      <h2>Every ranking decision is fast, explainable, and reproducible.</h2>
    </header>
    <div class="card-grid three-col">
      <article v-for="item in highlights" :key="item.title" class="feature-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>

  <section class="site-shell section-block cta-block">
    <div>
      <p class="eyebrow">Start the full workflow</p>
      <h2>Go from raw inbox text to ranked checklists in one guided run.</h2>
    </div>
    <RouterLink class="btn-primary" to="/input">Analyze Inbox Now</RouterLink>
  </section>
</template>
