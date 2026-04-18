<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home-page">
    <h1>Welcome to MVP App</h1>
    <nav>
      <RouterLink to="/input">Opportunity Input</RouterLink>
      <RouterLink to="/list">Opportunity List</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.home-page {
  padding: 2rem;
}
nav {
  display: flex;
  gap: 1rem;
}
a {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 4px;
}
</style>