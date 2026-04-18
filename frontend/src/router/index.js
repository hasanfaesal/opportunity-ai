import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '@/views/InputPage.vue'
import ResultsPage from '@/views/ResultsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Input',
    component: InputPage
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
