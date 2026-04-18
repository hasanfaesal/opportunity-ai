<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-shell footer-inner">
      <div>
        <p class="footer-title">Opportunity Inbox Copilot</p>
        <p class="footer-copy">AI triage for high-stakes student opportunities.</p>
      </div>

      <div class="footer-links" aria-label="Footer links">
        <RouterLink to="/features">Features</RouterLink>
        <RouterLink to="/pricing">Pricing</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/input">Try App</RouterLink>
      </div>

      <p class="footer-meta">© {{ year }} Opportunity Inbox. Built for hackathon delivery.</p>
    </div>
  </footer>
</template>
