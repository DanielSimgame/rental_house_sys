<template>
  <div class="admin-dashboard__wrap px-5">

    <div class="w-full grid grid-cols-6 gap-5">
      <TopTitleVue class="col-span-4" text="房源数据"/>
      <transition name="el-fade-in-linear">
        <div class="text-center h-20 col-span-1" v-if="isSearched">
          <div class="text-xs">房源总数</div>
          <div class="h-16 text-3xl font-bold flex justify-center items-center">
            {{ userTotalHouses }}
          </div>
        </div>
      </transition>
      <transition name="el-fade-in-linear">
        <div class="text-center" v-if="isSearched && pageData.userId !== ''">
          <div class="text-xs">房东信息</div>
          <UserCardVue :user-info="landlordInfo" @click="onUserCardClick(landlordInfo.id)" size="large"/>
        </div>
      </transition>
    </div>

    <div class="dashboard__container flex flex-col w-full">
      <!--      搜索框-->
      <div class="search__wrap grid grid-cols-6 pb-5 gap-5">
        <el-input class="col-span-5" v-model="pageData.userId" size="large" clearable
                  placeholder="输入用户id搜索用户上架房源，留空则查询全部租户信息"></el-input>
        <el-button type="primary" size="large" @click="getRealEstateList(0, 20)">
          <el-icon>
            <Search/>
          </el-icon>
          <span class="ml-5 text-lg">搜索</span>
        </el-button>
      </div>

      <!--      搜索结果-->
      <div class="search__results-wrap w-full">
        <!--    正常加载-->
        <div v-if="!isEmptyList && !isLoading" class="house-list__wrap grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          <MyRealEstateInfoCardVue
            class="sm:mx-auto cursor-pointer"
            v-for="(item) in userHousesList.value"
            :key="item.id"
            :house-info="item"
            :is-admin="true"
          />
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
        <div v-else-if="isEmptyList" class="px-5">
          <div
              class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center"
          >
            <div class="error-text text-6xl font-bold leading-tight text-gray-900">
              <p class="text-9xl mb-10">空</p>
              <p>搜索结果为空</p>
              <p>The search result is empty</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// import roomPic from "@/assets/images/roomPic.jpg"
import TopTitleVue from '@/components/TopTitle.vue'
import UserCardVue from '@/components/UserCard.vue'
import {Search, Loading} from "@element-plus/icons-vue";
import MyRealEstateInfoCardVue from '@/components/MyRealEstateInfoCard.vue'
import {onMounted, reactive, ref} from "vue";
import RequestUtil, {getHouseListType} from "@/utils/RequestUtil";
import {useStore} from "vuex";

const store = useStore()
let thisUser = store.getters.getUserInfo;



// pageData存放动态刷新的数据
let pageData = reactive({
  userId: ''
})
let isEmptyList = ref(true)
let isLoading = ref(true)
let userHousesList = reactive([])
let userTotalHouses = ref(0)
let landlordInfo = ref({
  id: '',
  name: '',
  portrait: '',
})
let isSearched = ref(false)

/**
 * @function getHouseList
 * @description 以搜索框用户id获取房源列表
 * @param {number} pageNum 页码
 * @param {number} pageSize 每页数量
 * */
const getRealEstateList = (pageNum = 0, pageSize = 100) => {
  isLoading.value = true
  RequestUtil.getHouseList(getHouseListType.GET_BY_USER, pageNum, pageSize, {userId: pageData.userId})
      .then(res => {
        userHousesList.value = res
        if (userHousesList.value.length !== 0) {
          isEmptyList.value = false
          userTotalHouses.value = userHousesList.value.length
          isSearched.value = true
          landlordInfo.value = userHousesList.value[0].creator
        } else {
          isEmptyList.value = true
          isSearched.value = false
        }
      })
      .finally(() => {
        isLoading.value = false
      })
}

/**
 * @function onUserCardClick
 * @description 点击用户卡片，打开聊天窗口
 * @param {number} targetUserId 用户id
 */
const onUserCardClick = (targetUserId) => {
  // if not this user, open chat window and start chat with creator.id

  if (thisUser.id !== targetUserId) {
    RequestUtil.postSendMessage({
      receiverId: targetUserId,
      contain: `发起聊天:用户${thisUser.name}向您发起了聊天`,
      type: 'message'
    })
    store.commit("setChatViewVisibility", true)
  }
};

onMounted(() => {
  isLoading.value = false
})

</script>

<style>
</style>
