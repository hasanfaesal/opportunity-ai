<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
]

const ctaLabel = computed(() => (route.path === '/input' ? 'Workspace Active' : 'Launch Workspace'))
const ctaTo = computed(() => '/input')

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <header class="site-header">
    <div class="site-shell header-inner">
      <RouterLink class="brand" to="/">
        <span class="brand-mark" aria-hidden="true">OI</span>
        <span class="brand-text">Opportunity Inbox</span>
      </RouterLink>

      <nav class="main-nav" aria-label="Primary navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'is-active': isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <RouterLink class="header-cta" :to="ctaTo">{{ ctaLabel }}</RouterLink>
    </div>
  </header>
</template>
