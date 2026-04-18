import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'
import '@/styles/normalize.css'
import '@/styles/index.css'
import 'uno.css'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router)
app.use(ui)
app.mount('#app')
