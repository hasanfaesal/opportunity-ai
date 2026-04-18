<script setup>
import { reactive } from 'vue'

const model = reactive({
  name: '',
  email: '',
  organization: '',
  message: ''
})

function submitContact() {
  window.alert(`Thanks, ${model.name || 'there'}! We received your request and will reply soon.`)
}
</script>

<template>
  <section class="site-shell page-intro">
    <p class="eyebrow">Contact</p>
    <h1>Talk to our product team.</h1>
    <p>Need custom deployment, institutional onboarding, or API integration support? Send us details.</p>
  </section>

  <section class="site-shell section-block">
    <form class="contact-form" @submit.prevent="submitContact">
      <label>
        <span>Name</span>
        <input v-model="model.name" type="text" required />
      </label>
      <label>
        <span>Email</span>
        <input v-model="model.email" type="email" required />
      </label>
      <label>
        <span>Organization</span>
        <input v-model="model.organization" type="text" />
      </label>
      <label>
        <span>Message</span>
        <textarea v-model="model.message" rows="5" required />
      </label>
      <button class="btn-primary" type="submit">Send Message</button>
    </form>
  </section>
</template>
