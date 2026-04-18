<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

</script>

<template>
  <div class="site-shell not-found-wrap">
    <div class="not-found-card">
      <p class="eyebrow">Not found</p>
      <h1>404</h1>
      <p>Sorry, this page does not exist or was moved.</p>
      <div class="not-found-actions">
        <button class="btn-secondary" @click="goBack">Go Back</button>
        <RouterLink class="btn-primary" to="/">Go Home</RouterLink>
      </div>
    </div>
  </div>
</template>
