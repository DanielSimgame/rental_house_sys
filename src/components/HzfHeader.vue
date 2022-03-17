<template>
    <div class="bg-white shadow flex flex-row justify-between">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">{{ $route.meta.title }}</h1>
        </div>
        <div class="user-info-container">
            <p>名字 {{ userInfo.name }}</p>
        </div>
    </div>
</template>

<script>
import { reactive } from "vue"
import store from "../store"

export default {
    name: "HzfHeader",
    setup() {
        let userInfo = reactive({
            name: '',
            role: ''
        })
        store.watch(state => state.userInfo, (newVal) => {
            userInfo.name = newVal.name
            userInfo.role = newVal.role
            console.log(userInfo)
        })
        return {
            userInfo,
        }
    }
}
</script>