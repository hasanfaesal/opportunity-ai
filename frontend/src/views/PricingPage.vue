<script setup>
const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/month',
    blurb: 'For hackathon demos and small cohorts.',
    points: ['Up to 100 analyzed emails/month', 'Core scoring and ranked output', 'Community support']
  },
  {
    name: 'Growth',
    price: '$49',
    cadence: '/month',
    blurb: 'For student teams and advisor offices.',
    points: ['Up to 2,500 analyzed emails/month', 'Priority queues and faster inference', 'Advanced result retention']
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    blurb: 'For institutions at scale.',
    points: ['Unlimited volume and SSO options', 'Dedicated support channel', 'Custom deployment constraints']
  }
]
</script>

<template>
  <section class="site-shell page-intro">
    <p class="eyebrow">Pricing</p>
    <h1>Scale from pilot to institution-wide deployment.</h1>
    <p>Choose a plan based on email volume, operational speed, and compliance requirements.</p>
  </section>

  <section class="site-shell section-block">
    <div class="card-grid three-col">
      <article v-for="plan in plans" :key="plan.name" class="pricing-card">
        <h2>{{ plan.name }}</h2>
        <p class="price-line">
          <span class="price">{{ plan.price }}</span>
          <span class="cadence">{{ plan.cadence }}</span>
        </p>
        <p>{{ plan.blurb }}</p>
        <ul class="feature-list">
          <li v-for="point in plan.points" :key="point">{{ point }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
