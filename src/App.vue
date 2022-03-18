<template>
  <div>
    <el-container>
      <el-header style="height: auto; padding-left: 0; padding-right: 0;">
        <!-- <div class="bg-white shadow" v-if="$route.meta.title">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
          </div>
        </div> -->
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
import User from './utils/User';
import store from "./store";
import RequestUtil from "./utils/RequestUtil";

import HzfHeader from './components/HzfHeader.vue';

// const title = ref('nmsl');

/**
 * @function initPage
 * @description 初始化页面
 */
const initPage = async () => {
  const token = User.getToken()
  if (token) {
    // 先让用户以user权限访问，再向后端请求权限
    store.commit('setUserRole', 'user')
    RequestUtil.getUserInfo(token)
      .then(r => {
        store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
        store.commit('setUserInfo', r)
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

:root {
  --el-color-primary: rgba(70, 70, 229, 1) !important;
  --el-button-disabled-bg-color: #464699 !important;
  --el-button-hover-bg-color: #4646ff !important;
}

.el-button:focus, .el-button:hover {
  background-color: #4650ff !important;
  color: #fff !important;
}

.el-button:active {
  background-color: #3f3fcf !important;
  color: #fff !important;
}

.el-button:disabled {
  background-color: #464699 !important;
  color: #fff !important;
}

</style>