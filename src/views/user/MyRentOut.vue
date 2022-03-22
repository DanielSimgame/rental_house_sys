<template>
  <div class="rent__wrap px-5">
    <div class="w-full grid grid-cols-6 gap-5">
      <TopTitle class="col-span-5" text="我发布的房源"/>
      <div class="flex flex-col col-span-1 justify-center items-center">
        <el-link
            :underline="false"
            @click="onNewHouseClick"
            class="new-house-btn inline-flex w-full h-14 items-center justify-center rounded-md
                border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white
                transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none">
          <span class="text-2xl col-span-1 flex flex-row justify-center items-center text-white">
            <el-icon>
              <Plus />
            </el-icon>
            <span class="ml-3">发布房源</span>
          </span>
        </el-link>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Plus } from "@element-plus/icons-vue"
import { useRoute, useRouter } from "vue-router";
// import {computed, reactive, ref} from 'vue';
// import NotificationUtil, {msgType} from '@/utils/NotificationUtil';
// import RequestUtil from '@/utils/RequestUtil';
// import User from '@/utils/User'
import TopTitle from '@/components/TopTitle.vue'
import UserCardVue from '@/components/UserCard.vue';

const route = useRoute();
const router = useRouter();

/**
 * @function onNewHouseClick
 * @description 点击发布房源按钮
 */
const onNewHouseClick = () => {
  router.push({
    name: "NewHouse",
  })
}

</script>

<style>

</style>
