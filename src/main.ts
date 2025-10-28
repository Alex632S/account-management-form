import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { MyPreset } from '@/utils/theme'
import '@/assets/styles/main.css'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
})
app.use(ToastService)
app.directive('tooltip', Tooltip)

app.mount('#app')
