import './assets/main.scss';
// 饿了么缺失的css
import 'element-plus/theme-chalk/el-loading.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-message.css';

import { createApp } from 'vue';
// import { createPinia } from 'pinia';

import App from './App.vue'
// import router from './router'

const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

async function asyncRegister() {
    const createPinia = (await import('pinia')).createPinia
    app.use(createPinia())
    const router = (await import('@/router')).default
    app.use(router)
    app.mount('#app')
}

asyncRegister()
