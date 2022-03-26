<template>
  <div>
    <el-container>
      <el-header class="" style="height: auto; padding-left: 0; padding-right: 0;">
        <!-- <div class="bg-white shadow" v-if="$route.meta.title">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
          </div>
        </div>-->
        <hzf-header ></hzf-header>
      </el-header>
      <el-main style="padding: 0">
        <router-view />
      </el-main>
    </el-container>
    <el-dialog v-model="$store.state.app.chatView" title="聊天" width="800px" :modal="true" draggable destroy-on-close>
      <ChatView></ChatView>
<!--      <template #footer>-->
<!--      <span class="dialog-footer">-->
<!--        <el-button @click="$store.commit('setChatViewVisibility', false)">Cancel</el-button>-->
<!--        <el-button type="primary" @click="$store.commit('setChatViewVisibility', false)">-->
<!--          Confirm-->
<!--        </el-button>-->
<!--      </span>-->
<!--      </template>-->
    </el-dialog>
  </div>
</template>

<script setup>
import {onBeforeMount} from "vue";
import 'nprogress/nprogress.css';
import '@/assets/scss/nprogress/index.scss';
import '@/assets/scss/element/index.scss';
// import store from "./store";
import {useStore} from "vuex";
import RequestUtil from "./utils/RequestUtil";

import ChatView from "./views/chat/ChatView.vue";
import HzfHeader from './components/HzfHeader.vue';
import Notification, { msgType } from "./utils/basic/Notification";
import router from "./router";
// import {app} from "@/main";
// import VueNativeSock from "vue-native-websocket-vue3";
import User from "./utils/User";

const store = useStore();

/**
 * @function initPage
 * @description 初始化页面
 */
const initPage = async () => {

  // 以下代码导致无限403bug

  // 先将本地session中的信息写入store，再从后端获取用户信息并覆盖
  // const localUserInfo = User.getUserInfoInSession();
  // if (localUserInfo) {
  //   store.commit('setUserInfo', localUserInfo)
  // }

  // 以上代码导致无限403bug

  const token = User.getToken()
  if (token) {
    // 如有token则先让用户以user权限访问，再向后端请求权限
    store.commit('setUserRole', 'user')
    RequestUtil.getUserInfo(token)
      .then(r => {
        store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
        store.commit('setUserInfo', r)
        User.setUserInfoInSession(r)
      })
      .catch(e => {
        Notification.Notify('连接服务器失败，无法获取用户信息，请重新登录账号。', {
          type: msgType.ERROR,
          title: '出错',
          duration: 3000
        })
        store.commit("clearUserInfo");
        User.delToken();
        User.delUserInfoInSession();
        router.push("/login");
        window.location.reload();
      })
  }
};

onBeforeMount(() => {
  initPage();
});

// use(VueNativeSock, import.meta.env.VITE_WSS_URL)
</script>

<style>
.error-text {
  text-align: center;
  font-weight: bold;
  font-style: italic;
}
.top-title-text {
  font-weight: bold;
  font-style: italic;
}
.top-title-text::before {
  content: "";
  position: absolute;
  width: 5px;
  height: 100%;
  background-color: var(--el-color-primary);
  top: 0;
  left: 0;
  transform: skewX(-18deg);
}

</style>
