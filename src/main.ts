import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import { LightTheme } from '@/utils/light'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: LightTheme,
    options: {
      darkModeSelector: 'light',
      prefix: 'p',
    },
  },
})

app.mount('#app')
