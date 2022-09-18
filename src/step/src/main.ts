import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { consoleErrorMiddleware } from './utility/console-error.middleware'

const app = createApp(App)

app.config.errorHandler = consoleErrorMiddleware

app.use(createPinia())
app.use(router)

app.mount('#app')
