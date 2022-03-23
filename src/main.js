import { createApp } from 'vue'
import './tailwind.css'
import App from './App.vue'
import router from './router'
import store from './store'


// element-plus customized scss
// import './assets/scss/element/index.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(router).use(store).use(ElementPlus)
app.mount('#app')
