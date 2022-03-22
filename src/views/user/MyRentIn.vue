<template>
  <div class="rent__wrap px-5">
    <div class="w-full grid grid-cols-6 gap-5">
      <TopTitle class="col-span-5" text="我租到的房源"/>
      <div class="flex flex-col col-span-1 justify-center items-center">
        <el-popover :visible="popupQuitRent" placement="left" width="200" v-if="pageData.myRentHouse">
          <span>请问您是否确认要退出合租？</span>
          <div class="popover-btns text-right mx-0 mt-5">
            <el-button size="small" type="primary" @click="popupQuitRent = false">取消</el-button>
            <el-button type="text" size="small" @click="onQuitRentCLick" :loading="quitBtnLoading">确认退出</el-button>
          </div>
          <template #reference>
            <el-link
                @click="popupQuitRent = true"
                :underline="false"
                class="quit-rent-btn inline-flex w-full h-14 items-center justify-center rounded-md
                border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white
                transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
            >
              <span class="text-2xl text-white">退出合租</span>
            </el-link>
          </template>
        </el-popover>
      </div>
    </div>

    <div class="rent__info-wrap w-full">
      <div v-if="pageData.myRentHouse" class="grid grid-cols-6 gap-5">
        <div class="row-span-3 col-span-5 border rounded-xl p-5 bg-white">
          <div class="rent__house-id mb-5">
            <span class="text-gray-500 mr-5">编号</span>
            <span>{{ pageData.houseId }}</span>
          </div>
          <div class="rent__location">
            <span class="text-gray-500 mr-5">地址</span>
            <span>{{ pageData.fullAddress }}</span>
          </div>
          <div class="rent__location">
            <span class="text-gray-500 mr-5">门牌</span>
            <span>{{ pageData.houseTitle }}</span>
          </div>
          <div class="rent__location">
            <span class="text-gray-500 mr-5">房间</span>
            <span>{{ pageData.myRoomId }}号房</span>
          </div>

        </div>
        <div class="col-span-1">
          <el-divider>
            <span class="text-lg">房东</span>
          </el-divider>
          <UserCardVue class="border" :user-info="myLandlord" size="large"/>
        </div>
        <div class="row-span-2">
          <el-divider>
            <span class="text-lg">室友</span>
          </el-divider>
          <UserCardVue
              v-for="(item, index) in myRoommates"
              :key="item.id"
              class="border"
              :class="index !== myRoommates.length - 1 ? 'mb-3' : ''"
              :user-info="item"
              size="large"
          />
        </div>
      </div>
      <div v-else class="border rounded-xl p-5 bg-white">
        <div
            class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center"
        >
          <div class="error-text text-6xl font-bold leading-tight text-gray-900">
            <p class="text-9xl mb-10">空</p>
            <p>您目前没有在合约内的租赁</p>
            <p>Your rent list is empty</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from 'vue';
import NotificationUtil, {msgType} from '@/utils/NotificationUtil';
import RequestUtil from '@/utils/RequestUtil';
import User from '@/utils/User'
import TopTitle from '@/components/TopTitle.vue'
import UserCardVue from '@/components/UserCard.vue';

let popupQuitRent = ref(false)
let quitBtnLoading = ref(false)
let myLandlord = ref({})
let myRoommates = ref([])
let pageData = reactive({
  myRoomId: null,
  myRentHouse: {},
  myAddress: {
    province: '',
    city: '',
    cityProper: '',
    street: '',
    longitude: 116.38,
    latitude: 39.9
  },
  fullAddress: computed(() => {
    return `${pageData.myAddress.province}${pageData.myAddress.city} ${pageData.myAddress.cityProper}${pageData.myAddress.street}`
  }),
  houseId: computed(() => {
    return pageData.myRentHouse.id
  }),
  houseTitle: computed(() => {
    return pageData.myRentHouse.title
  }),
})

/**
 * @function onQuitRentClick
 * @description 点击退出合租事件
 */
const onQuitRentCLick = () => {
  quitBtnLoading.value = true
  // console.log(pageData.myRentHouse.id, pageData.myRoomId)
  if (pageData.myRentHouse.id && pageData.myRoomId) {
    RequestUtil.getQuitRentHouse(pageData.myRentHouse.id, pageData.myRoomId)
        .then(res => {
          if (res.status === 200) {
            NotificationUtil.Notify('退出合租成功', {
              type: msgType.SUCCESS,
              title: '提示'
            })
            getUserRentInfo()
            // setTimeout(() => {
            //   window.location.href = '/'
            // }, 1000)
          } else {
            throw new Error('出错了' + res.status + res.data.message)
          }
        })
        .catch(err => {
          NotificationUtil.Notify(`退出合租失败，${JSON.stringify(err)}`, {
            type: msgType.ERROR,
            title: '错误'
          })
        })
        .finally(() => {
          popupQuitRent.value = false
          quitBtnLoading.value = false
        })
  } else {
    NotificationUtil.Notify('出错了，房源编号为空值，请刷新页面后重试。', {
      type: msgType.ERROR,
      title: '错误'
    })
  }

}

/**
 * @function getUserRentInfo
 * @description 获取用户合租信息
 * */
const getUserRentInfo = () => {
  RequestUtil.getUserInfo(User.getToken())
      .then(res => {
        // console.log(res)
        onSetRentInfo(res)
      })
      .catch(err => {
        console.log(err)
        NotificationUtil.Notify(`获取用户信息出错，请稍后重试或重新登录。错误信息：${err}`, {
          title: '错误',
          type: msgType.ERROR
        })
      })
}

/**
 * @function onSetRentInfo
 * @description 设置合租信息，此方法于fetch请求获得数据后执行
 * @param {Object} res 合租信息(Rent info)
 * */
const onSetRentInfo = (res = {rentedHouse: null}) => {
  // console.log('房屋信息', res)
  pageData.myRentHouse = res.rentedHouse
  if (res.rentedHouse !== null) {
    // 如果用户有租房，则将租房信息存入变量
    myLandlord.value = res.rentedHouse.creator
    res.rentedHouse.roomList.forEach(room => {
      if (room.tenement && room.tenement.id !== res.id) {
        myRoommates.value.push(room.tenement)
      } else {
        pageData.myRoomId = room.roomId
      }
    })
    pageData.myAddress = res.rentedHouse.address
  } else {
    myLandlord.value = null
  }
}

getUserRentInfo()

</script>

<style>
</style>
