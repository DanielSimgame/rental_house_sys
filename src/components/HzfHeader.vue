<template>
    <div class="bg-white shadow flex flex-row justify-between">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
        </div>
        <div class="user-info-container" v-if="userInfo.name !== '' ? true : false">
            <p>名字 {{ userInfo.name }}</p>
            <p>角色 {{ userInfo.role === 1 ? '管理员' : '用户' }}</p>
            <el-button @click="onLogoutClick">退出登录</el-button>
        </div>
    </div>
</template>

<script>
import { reactive, watch, computed } from "vue"
import store from "@/store"
import User from '@/utils/User';
import router from "../router";
import NotificationUtil from "../utils/NotificationUtil";


export default {
    name: "HzfHeader",
    setup() {
        let userInfo = reactive({
            name: '',
            role: ''
        })

        const userInfoListener = computed(() => { return store.state.userInfo })
        const getUserRole = computed(() => {
            const getter = store.getters.getRoleInUserInfo
            if(getter === 1) {
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
        }, { immediate: true, deep: true })

        const onLogoutClick = () => {
            store.commit('clearUserInfo')
            User.delToken()
            NotificationUtil.Notify('退出登录成功')
            router.push('/login')
            window.location.reload()
        }

        return {
            userInfo,
            onLogoutClick
        }
    }
}
</script>