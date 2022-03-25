import {createApp} from 'vue'
import './tailwind.css'
import App from './App.vue'
import router from './router'
import store from './store';
// import VueNativeSock from "vue-native-websocket-vue3"

// element-plus customized scss
// import './assets/scss/element/index.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueNativeSock from "vue-native-websocket-vue3"
// import User from "@/utils/User"
import Storage from "@/utils/basic/Storage";

const wsUrl = import.meta.env.VITE_WSS_URL

export const app = createApp(App)

app.use(store).use(router).use(ElementPlus)
app.mount('#app')

if (Storage.get("jwt") !== null) {
  app.use(VueNativeSock, `${wsUrl}/message/${Storage.get("jwt")}`, {
    store: store,
    format: 'json',
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    reconnectionDelayMax: 5000,
    autoConnect: true
  });
}
