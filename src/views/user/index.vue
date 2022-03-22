<template>
  <div class="user-layout bg-gray-50">
    <el-container>
      <el-aside class="user-aside" width="200px">
        <el-affix :offset="86">
          <UserAsideMenuVue/>
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
import UserAsideMenuVue from "../../components/UserAsideMenu.vue";

const router = useRouter()
const route = useRoute()
router.push("/user/rentin")

</script>

<style>
.user-aside {
  /*height: 100%;*/
  min-height: calc(100vh - 85.5px);
  background-color: #545c64;
}
</style>
