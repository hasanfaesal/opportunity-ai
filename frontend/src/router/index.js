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
  ...(import.meta.env.DEV
    ? [
        {
          path: '/dev/track-a-input',
          name: 'DevTrackAInput',
          component: () => import('@/views/dev/DevTrackAInputPage.vue')
        },
        {
          path: '/dev/track-b-output',
          name: 'DevTrackBOutput',
          component: () => import('@/views/dev/DevTrackBOutputPage.vue')
        },
        {
          path: '/dev/track-c-service',
          name: 'DevTrackCService',
          component: () => import('@/views/dev/DevTrackCServicePage.vue')
        },
        {
          path: '/dev/track-d-primitives',
          name: 'DevTrackDPrimitives',
          component: () => import('@/views/dev/DevTrackDPrimitivesPage.vue')
        }
      ]
    : []),
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
