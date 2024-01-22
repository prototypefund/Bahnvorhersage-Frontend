import 'bootstrap/js/dist/collapse'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { default as dayjs } from 'dayjs'
import { default as duration } from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {}
})

const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
