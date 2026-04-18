import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import FeaturesPage from '@/views/FeaturesPage.vue'
import PricingPage from '@/views/PricingPage.vue'
import AboutPage from '@/views/AboutPage.vue'
import ContactPage from '@/views/ContactPage.vue'
import InputPage from '@/views/InputPage.vue'
import ResultsPage from '@/views/ResultsPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: LandingPage
  },
  {
    path: '/features',
    name: 'Features',
    component: FeaturesPage
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage
  },
  {
    path: '/input',
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
    name: 'NotFound',
    component: NotFoundPage
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})
