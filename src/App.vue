<template>
  <div>
    <el-container>
      <el-header style="height: auto; padding-left: 0; padding-right: 0;">
        <!-- <div class="bg-white shadow" v-if="$route.meta.title">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
          </div>
        </div>-->
        <hzf-header></hzf-header>
      </el-header>
      <el-main style="padding: 0">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import 'nprogress/nprogress.css';
import '@/assets/scss/element/index.scss';
import User from './utils/User';
import store from "./store";
import RequestUtil from "./utils/RequestUtil";

import HzfHeader from './components/HzfHeader.vue';
import Notification, { msgType } from "./utils/NotificationUtil";

// const title = ref('nmsl');

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
        // console.log(e)
        Notification.Notify('连接服务器失败，无法获取用户信息', {
          type: msgType.ERROR,
          title: '出错',
          duration: 3000
        })
      })
  }
};

onBeforeMount(() => {
  // if (User.isLogin()) {
  //   userInfo = User.getUserInfo();
  // }
  initPage();
});
</script>

<style lang="scss">
@use '@/assets/scss/nprogress/index.scss';
</style>

<style>
.error-text {
  text-align: center;
  font-weight: bold;
  font-style: italic;
}
</style>