<template>
    <div class="admin-layout bg-gray-50">
        <el-container>
            <el-aside class="admin-aside" width="200px">
                <AdminAsideMenuVue />
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, watch } from "vue-demi";
import { useRouter, useRoute } from "vue-router";
import AdminAsideMenuVue from "../../components/AdminAsideMenu.vue";

const router = useRouter()
const route = useRoute()
router.push("/admin/dashboard")

// onMounted(() => {
// })
</script>

<style>
.admin-aside {
    height: calc(100vh - 85.5px);
    background-color: #545c64;
}
</style>