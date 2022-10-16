import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persist'

import './assets/main.scss'
import { consoleErrorMiddleware } from './utility/console-error.middleware'

const app = createApp(App)

app.config.errorHandler = consoleErrorMiddleware

app.use(createPinia().use(piniaPersist)).use(router).mount('#app')
