<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical"
        :default-active="route.name"
        text-color="#fff"
    >
        <router-link to="/user/rentin">
            <el-menu-item index="UserRentIn">
                <el-icon>
                    <checked />
                </el-icon>
                <span>我的租赁</span>
            </el-menu-item>
        </router-link>
        <router-link to="/user/rentout">
            <el-menu-item index="UserRentOut">
                <el-icon>
                    <document />
                </el-icon>
                <span>我的房源</span>
            </el-menu-item>
        </router-link>
        <router-link to="/user/information">
            <el-menu-item index="Settings">
                <el-icon>
                    <setting />
                </el-icon>
                <span>个人资料</span>
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script setup>
import { Checked, Document, Setting } from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

</script>

<style>
ul {
    border: none !important;
}
</style>