<script setup>
const featureGroups = [
  {
    title: 'Inbox Intelligence',
    points: [
      'Classifies opportunity vs non-opportunity emails with explicit is_opportunity output.',
      'Extracts opportunity type, deadline, eligibility, documents, and apply details.',
      'Stores evidence snippets for transparent verification.'
    ]
  },
  {
    title: 'Deterministic Prioritization',
    points: [
      'Weighted ranking: fit, urgency, and completeness with visible component scores.',
      'Stable sorting behavior for repeatable demos and operations.',
      'Ranking logic designed for judge-friendly auditability.'
    ]
  },
  {
    title: 'Production Foundation',
    points: [
      'FastAPI JSON contracts with strict schema validation.',
      'Postgres as source of truth with typed ranking columns + JSONB evidence.',
      'Composable Vue workflows from profile + email input to explainable results.'
    ]
  }
]
</script>

<template>
  <section class="site-shell page-intro">
    <p class="eyebrow">Capabilities</p>
    <h1>A full triage engine, not just a parser.</h1>
    <p>
      The platform combines extraction, scoring, and explainable output so students and advisors can act with confidence.
    </p>
  </section>

  <section class="site-shell section-block">
    <div class="card-grid three-col">
      <article v-for="group in featureGroups" :key="group.title" class="feature-card">
        <h2>{{ group.title }}</h2>
        <ul class="feature-list">
          <li v-for="point in group.points" :key="point">{{ point }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
