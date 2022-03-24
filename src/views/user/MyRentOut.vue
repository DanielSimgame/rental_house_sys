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
              <Plus/>
            </el-icon>
            <span class="ml-3">发布房源</span>
          </span>
        </el-link>
      </div>
    </div>


    <div class="rent__info-wrap w-full">
      <!--    正常加载-->
      <div v-if="!isEmptyList && !isLoading" class="house-list__wrap grid grid-cols-4 gap-5">
        <MyRealEstateInfoCardVue
            class="sm:mx-auto cursor-pointer"
            v-for="(item) in myRealEstateList.value"
            :key="item.id"
            :house-info="item"/>
      </div>

      <!--    加载中-->
      <div v-else-if="isLoading" class="house-list-container flex flex-col justify-center items-center py-16">
        <div class="error-text text-6xl font-bold leading-tight text-gray-900">
          <p class="text-9xl mb-5">
            <el-icon class="is-loading">
              <Loading/>
            </el-icon>
          </p>
          <p>加载中</p>
          <p>Loading</p>
        </div>
      </div>

      <!--      空列表-->
      <div v-else-if="isEmptyList" class="border rounded-xl p-5 bg-white">
        <div
            class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center"
        >
          <div class="error-text text-6xl font-bold leading-tight text-gray-900">
            <p class="text-9xl mb-10">空</p>
            <p>您暂时未发布房源</p>
            <p>Your real property list is empty</p>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup>
import store from "@/store";
import {Plus, Loading} from "@element-plus/icons-vue"
import {useRoute, useRouter} from "vue-router";
import {computed, reactive, ref, watch} from 'vue';
// import Notification, {msgType} from '@/utils/basic/Notification';
import RequestUtil, {getHouseListType} from '@/utils/RequestUtil';
// import User from '@/utils/User'
// import
import TopTitle from '@/components/TopTitle.vue'
import MyRealEstateInfoCardVue from "@/components/MyRealEstateInfoCard.vue";
// import HouseInfoCardVue from "@/components/HouseInfoCard.vue";

const route = useRoute();
const router = useRouter();

// pageData存放动态刷新的数据
let pageData = reactive({
  userId: ''
})
let isEmptyList = ref(true)
let isLoading = ref(true)
let myRealEstateList = reactive([])

/**
 * @function getHouseList
 * @description 以当前用户id获取房源列表
 * @param {number} pageNum 页码
 * @param {number} pageSize 每页数量
 * */
const getRealEstateList = (pageNum = 0, pageSize = 10) => {
  // console.log(pageData.userId)
  RequestUtil.getHouseList(getHouseListType.GET_BY_USER, pageNum, pageSize, {userId: pageData.userId})
      .then(res => {
        // console.log('res', res)
        myRealEstateList.value = res
        myRealEstateList.value.length === 0 ? isEmptyList.value = true : isEmptyList.value = false
        // console.log('myRealEstateList', myRealEstateList.value)
      })
      .finally(() => {
        isLoading.value = false
      })
}

// 监听Store中的用户信息.用户id变化
const userInfoListener = computed(() => {
  return store.state.userInfo
})
watch(userInfoListener, (newVal) => {
  if (newVal !== '' || null || undefined) {
    pageData.userId = newVal.id
    getRealEstateList()
  }
}, {immediate: true, deep: true})

/**
 * @function onNewHouseClick
 * @description 点击发布房源按钮
 */
const onNewHouseClick = () => {
  router.push({
    name: "NewHouse",
  })
}

/**
 * @function onHouseInfoClick
 * @description 点击房源信息卡片
 * @param {number} houseId 房源id
 * */
const onHouseInfoClick = (houseId) => {
  router.push({
    path: '/house/detail',
    query: {
      id: houseId
    }
  })
}

</script>

<style>

</style>
