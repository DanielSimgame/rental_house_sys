<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical"
      :default-active="route.name"
      text-color="#fff"
  >
    <router-link to="/admin/dashboard">
      <el-menu-item index="Dashboard">
        <el-icon>
          <checked/>
        </el-icon>
        <span>数据总览</span>
      </el-menu-item>
    </router-link>

    <router-link to="/admin/users">
      <el-menu-item index="DataManage">
        <el-icon>
          <document/>
        </el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </router-link>

    <router-link to="/admin/settings">
      <el-menu-item index="Settings">
        <el-icon>
          <setting/>
        </el-icon>
        <span>后台设置</span>
      </el-menu-item>
    </router-link>

  </el-menu>
</template>

<script setup>
import {Checked, Document, Setting} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router';

const router = useRouter();
const route = useRoute();

</script>

<style>
ul {
  border: none !important;
}
</style>
