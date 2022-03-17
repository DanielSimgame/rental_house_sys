<template>
  <div>
    <el-container>
      <el-header style="height: auto">
        <div class="bg-white shadow" v-if="$route.meta.title">
          <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
          </div>
        </div>
      </el-header>
      <el-main style="padding: 0">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import 'nprogress/nprogress.css';
import User from './utils/User';
import store from "./store";
import RequestUtil from "./utils/RequestUtil";

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
        if (r.isLogin) {
          store.commit('setUserRole', r.isAdmin ? 'admin' : 'user')
        }
      })
  }
};

onMounted(() => {
  // console.log(import.meta.env.VITE_APP_TITLE)
  initPage()
})
</script>