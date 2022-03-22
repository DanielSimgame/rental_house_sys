<template>
  <div class="admin-layout bg-gray-50">
    <el-container>
      <el-aside class="admin-aside" width="200px">
        <el-affix :offset="86">
          <AdminAsideMenuVue/>
        </el-affix>
      </el-aside>
      <el-main>

        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>

      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import AdminAsideMenuVue from "../../components/AdminAsideMenu.vue";

const router = useRouter()
const route = useRoute()
router.push("/admin/dashboard")

// onMounted(() => {
// })
</script>

<style>
.admin-aside {
  min-height: calc(100vh - 85.5px);
  background-color: #545c64;
}
</style>
