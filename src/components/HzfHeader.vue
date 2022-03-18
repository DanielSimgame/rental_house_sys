<template>
    <div class="bg-white shadow flex flex-row justify-between">
        <div class="logo-container my-auto px-5">
            <router-link to="/">
                <img class="logo" :src="logoImg" alt="合租系统Logo" />
            </router-link>
        </div>
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
        </div>
        <div
            class="user-info__container min-w-fit flex flex-row justify-between items-center px-5"
            v-if="userInfo.name !== '' ? true : false"
        >
            <div
                class="user-info__card bg-white hover:bg-indigo-600 text-black hover:text-white px-4 py-4 rounded-xl cursor-pointer flex flex-row items-center transition-all ease-in-out hover:shadow-lg"
                @click="onUserCardClick"
            >
                <div class="portrait rounded-full overflow-hidden">
                    <img :src="userInfo.portrait" alt="头像" width="40" height="40" />
                </div>
                <p class="mx-2">{{ userInfo.name }}</p>
            </div>
            <p class="ml-2 mr-5">{{ userInfo.role === 1 ? '管理员' : '用户' }}</p>
            <el-button class="mx-2" @click="onLogoutClick" plain>退出登录</el-button>
        </div>
    </div>
</template>

<script>
import { reactive, watch, computed } from "vue"
import store from "@/store"
import User from '@/utils/User';
import router from "../router";
import NotificationUtil from "../utils/NotificationUtil";
import logoImg from '@/assets/images/logo.png';

export default {
    name: "HzfHeader",
    setup() {
        let userInfo = reactive({
            name: '',
            role: '',
            portrait: ''
        })

        const userInfoListener = computed(() => { return store.state.userInfo })
        const getUserRole = computed(() => {
            const getter = store.getters.getRoleInUserInfo
            if (getter === 1) {
                return '管理员'
            } else if (getter === 0) {
                return '用户'
            } else {
                return '未登录'
            }
        })

        watch(userInfoListener, (newVal) => {
            userInfo.name = newVal.name
            userInfo.role = newVal.role
            userInfo.portrait = newVal.portrait
        }, { immediate: true, deep: true })

        const onLogoutClick = () => {
            store.commit('clearUserInfo')
            User.delToken()
            NotificationUtil.Notify('退出登录成功', { type: 'success', title: '退出登录' })
            router.push('/login')
            window.location.reload()
        }

        const onUserCardClick = () => {
            router.push('/user')
        }

        return {
            logoImg,
            userInfo,
            onLogoutClick,
            onUserCardClick
        }
    }
}
</script>

<style scoped>
.logo{
    height: 60px;
}
</style>