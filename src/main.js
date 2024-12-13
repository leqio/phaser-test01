import { createApp } from 'vue'
import 'normalize.css'
import App from './App.vue'
import pinia from './store/index.js'
import router from './router/index.js'

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');
