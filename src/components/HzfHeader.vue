<template>
  <el-affix class="shadow-md" offset-top="0">
    <div class="bg-white grid grid-cols-12">
      <div class="logo-container my-auto px-5 group 2xl:col-span-1 xl:col-span-1 lg:col-span-2 md:col-span-2 sm:col-span-2">
        <router-link to="/" class="relative">
          <img class="logo w-16 h-16 top-0.5 translate-y-4 z-30" :src="logoImg" alt="合租系统Logo" />
          <div class="logo-tip w-fit lg:w-16 pl-2 pr-3 z-20 -translate-y-6 group-hover:translate-x-16 opacity-0 group-hover:opacity-100 transition-all ease-in-out font-bold text-md">首页</div>
        </router-link>
      </div>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 2xl:col-span-8 xl:col-span-7 lg:col-span-5 md:col-span-4 sm:col-span-4">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
      </div>
      <div
        class="user-info__container group min-w-fit grid grid-cols-3 px-5 2xl:col-span-3 xl:col-span-4 lg:col-span-5 md:col-span-6 sm:col-span-6"
        v-if="userInfo.name !== '' ? true : false"
      >
        <!-- <div
                class="user-info__card bg-white hover:bg-indigo-600 text-black hover:text-white px-4 py-4 rounded-xl cursor-pointer flex flex-row items-center transition-all ease-in-out hover:shadow-lg"
                @click="onUserCardClick"
            >
                <div class="portrait rounded-full overflow-hidden">
                    <img :src="userInfo.portrait" alt="头像" width="40" height="40" />
                </div>
                <p class="mx-2">{{ userInfo.name }}</p>
        </div>-->
        <div class="flex flex-col justify-center items-center">
          <UserCard :user-info="userInfo" @click="onUserCardClick" :size="'large'" />
        </div>
        <div class="w-full flex flex-row justify-around items-center" v-if="userInfo.role === 1">
          <el-tooltip content="点击进入管理面板">
            <el-link @click="onAdminLinkClick">管理员</el-link>
          </el-tooltip>
        </div>
        <div class="w-full flex flex-row justify-around items-center" v-else>
          <span>用户</span>
          <el-button type="primary" class="2xl:w-fit">成为业主</el-button>
        </div>
        <div class="flex flex-col justify-center items-center">
          <el-button @click="onLogoutClick" plain>退出</el-button>
        </div>
      </div>
    </div>
  </el-affix>
</template>

<script>
import { reactive, watch, computed } from "vue"
import store from "@/store"
import User from '@/utils/User';
import router from "../router";
import { goAdmin } from '@/utils/RouterUtil';
import NotificationUtil from "../utils/NotificationUtil";
import logoImg from '@/assets/images/logo.png';
import UserCard from './UserCard.vue';

export default {
  name: "HzfHeader",
  setup() {
    let userInfo = reactive({
      name: "",
      role: "",
      portrait: ""
    });
    const userInfoListener = computed(() => { return store.state.userInfo; });
    const getUserRole = computed(() => {
      const getter = store.getters.getRoleInUserInfo;
      if (getter === 1) {
        return "管理员";
      }
      else if (getter === 0) {
        return "用户";
      }
      else {
        return "未登录";
      }
    });
    watch(userInfoListener, (newVal) => {
      userInfo.name = newVal.name;
      userInfo.role = newVal.role;
      userInfo.portrait = newVal.portrait;
    }, { immediate: true, deep: true });
    /**
     * @function onLogoutClick
     * @description 点击退出登录
     */
    const onLogoutClick = () => {
      store.commit("clearUserInfo");
      User.delToken();
      NotificationUtil.Notify("退出登录成功", { type: "success", title: "退出登录" });
      router.push("/login");
      window.location.reload();
    }
    /**
     * @function onAdminLinkClick
     * @description 点击进入管理面板
     */
    const onAdminLinkClick = () => {
      goAdmin()
    }
    /**
     * @function onUserCardClick
     * @description 点击用户卡片
     */
    const onUserCardClick = () => {
      router.push("/user")
    };
    return {
      logoImg,
      userInfo,
      onLogoutClick,
      onAdminLinkClick,
      onUserCardClick,
    };
  },
  components: { UserCard }
}
</script>

<style scoped>
.logo {
  height: 60px;
}
.logo-tip {
  font-style: italic;
  transition-duration: 300ms;
}
</style>