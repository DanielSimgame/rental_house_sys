<template>
  <div class="container mx-auto p-5">
    <div class="house-detail__top shadow-xl xl:grid xl:grid-cols-3 lg:flex lg:flex-row p-5 mb-5 border rounded-xl">
      <div class="house-detail__top-item col-span-2 row-span-3 lg:mr-5 md:mr-0">
        <img v-if="roomPics.length === 0" :src="roomPic" alt class="object-cover rounded-xl h-full w-full"/>
        <el-carousel v-else class="h-full w-full rounded-xl" height="576px" trigger="click">
          <el-carousel-item v-for="item in roomPics" :key="item">
            <el-image :src="item" class="w-full object-cover rounded-xl" lazy alt="">
              <template #error>
                <div class="image-slot">
                  <el-icon><IconPicture /></el-icon>
                </div>
              </template>
            </el-image>
<!--            <img :src="item" alt class="w-full object-cover rounded-xl"/>-->
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 面板只能放三个房间信息，超出会宽度溢出 -->
      <div class="house-detail__top-item">
        <h1 class="text-2xl font-bold">{{ roomTitle }}</h1>
        <h1 class="text-4xl text text-orange-500">¥{{ roomPrice }}元/月</h1>
        <div class="flex items-center mt-1">
          <span class="text-gray-400 mr-4">房东</span>
          <UserCardVue :userInfo="houseCreator" @click="onUserCardClick(houseCreator.id)" size="large"/>
        </div>
        <div class="house-detail__specs flex items-center mt-1 mb-2">
          <span class="text-gray-400 w-16">配置</span>
          <div class="house-info__tags grid-flow-row grid-cols-5">
            <el-tag
                v-for="(obj, i) in labels"
                v-show="obj.enable"
                :key="i"
                class="house-info__tag w-fit mr-2 mt-2"
                size="default"
            >{{ obj.text }}
            </el-tag>
          </div>
        </div>

        <h2 class="mb-5">
          <span class="text-gray-400 mr-4">位置</span>
          {{ houseLocation }}
        </h2>
        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">房间</span>
          <div class="house-detail__rooms w-full grid grid-cols-3">
            <div
                v-for="item1 in roomList"
                :key="item1.roomId"
                class="house-detail__room flex flex-col justify-center text-center"
            >
              <span>{{ item1.description }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">面积</span>
          <div class="house-detail__areas w-full grid grid-cols-3">
            <div
                v-for="item2 in roomList"
                :key="item2.roomId"
                class="house-detail__area flex flex-col justify-center text-center"
            >
              <span class="text-3xl">{{ item2.size }}㎡</span>
            </div>
          </div>
        </div>
        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">租金</span>
          <div class="house-detail__areas w-full grid grid-cols-3">
            <div
                v-for="item3 in roomList"
                :key="item3.roomId"
                class="house-detail__area flex flex-col justify-center text-center"
            >
              <span class="text-3xl">{{ item3.price }}元</span>
            </div>
          </div>
        </div>

        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">室友</span>
          <div class="house-detail__roommates w-full grid grid-cols-3">
            <div
                v-for="(item4) in roomList"
                :key="item4.roomId"
                class="house-detail__roomate flex flex-row justify-center items-center"
            >
              <div v-if="item4.tenement !== null" class="flex flex-col items-center">
                <span>室友{{ item4.roomId }}</span>
                <span>{{ item4.tenement.gender }}</span>
              </div>
              <div v-else class="text-center">无人</div>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="text-gray-400 w-16">租用</span>
          <div class="house-detail__roommates w-full grid grid-cols-3">
            <div
                v-for="(item4) in roomList"
                :key="item4.roomId"
                class="house-detail__roomate flex flex-row justify-center items-center"
            >
              <el-radio
                  v-model="rentRoomId"
                  :disabled="item4.tenement !== null"
                  :label="item4.roomId"
                  size="large"
              >{{ item4.roomId }}号房
              </el-radio>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <el-link
              :disabled="!roomAvailable"
              :underline="false"
              class="query-btn inline-flex mt-5 w-full h-20 px-5 py-3 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
              @click="onJoinRentClick"
          >
            <span v-if="roomAvailable" class="text-2xl">加入合租</span>
            <span v-else class="text-2xl">{{ roomDisabledFlag.msg }}</span>
          </el-link>
        </div>
      </div>
      <div class="house-detail__top-item"></div>
    </div>
    <div class>
      <span class="text-2xl">房源简介</span>
      <p class="text-gray-600 text-sm">编号：{{ id }}</p>
      <p class="my-5">{{ roomDesc }}</p>
    </div>
  </div>
</template>

<script setup>
import UserCardVue from '@/components/UserCard.vue';
import roomPic from "@/assets/images/roomPic.jpg"
import RequestUtil from '@/utils/RequestUtil';
import {Picture as IconPicture} from '@element-plus/icons-vue';
import {useRoute, useRouter} from 'vue-router';
import {onMounted, reactive, ref, watch} from 'vue';
import {useStore} from 'vuex';
import Notification, {msgDuration, msgType} from '@/utils/basic/Notification';

const route = useRoute()
const router = useRouter()
const store = useStore()
let thisUser = reactive({});

let id = ref(route.query.id)
let houseInfo = reactive({})
let houseLocation = ref('')
let roomDesc = ref('')
let roomPrice = ref('')
let roomTitle = ref('')
let roomAddress = ref({})
let houseCreator = ref({})
let roomAllocation = ref({})
let roomList = ref({})
let roomPics = ref([])

let rentRoomId = ref(1)
let roomAvailable = ref(true)
let roomDisabledFlag = ref({msg: '房屋已满'})

const descPlaceholder = "这套位房源属于抢手房源。共有21栋楼。在小区内可以看到全天执勤的安保人员。" +
    "有出租车位。该小区共有4个出入口。房源所在楼栋距离地铁站站比较近。小区配套成熟，有健身广场，" +
    "篮球场，网球场，饮水站，快递柜，花园。楼栋概况 小区是2017年建的，楼栋外立面较新。单元无门禁。" +
    "楼栋总高45层。3梯4户，楼道安静不嘈杂，上下班高峰期不用等电梯。楼道卫生由小区负责，有专人清扫。" +
    "房源概况 这间4居室的05卧面积较大，无论是一个人住还是情侣合住都是不错的选择。房源位于9层，卧室朝南，冬暖夏凉。" +
    "有独立阳台，可以摆放绿植，让房间绿意满满。厨房有窗户，光线好。公用卫生间有窗户，异味更容易排出。" +
    "装修亮点 卧室的装修以灰、粉色为主，营造出简约低调的居室氛围。房间为环保装修，板材结实耐用。" +
    "且配备了国内外一线品牌家电，品质安全有保障。"

let labels = reactive({
  airConditioner: {
    enable: true,
    text: '空调'
  },
  balcony: {
    enable: true,
    text: '阳台'
  },
  centralHeating: {
    enable: true,
    text: '中央空调'
  },
  fridge: {
    enable: true,
    text: '冰箱'
  },
  gasStove: {
    enable: true,
    text: '煤气灶'
  },
  microwaveOven: {
    enable: true,
    text: '微波炉'
  },
  separateBathroom: {
    enable: true,
    text: '独立卫生间'
  },
  television: {
    enable: true,
    text: '电视'
  },
  wardroe: {
    enable: true,
    text: '衣柜'
  },
  washingMachine: {
    enable: true,
    text: '洗衣机'
  },
  waterHeater: {
    enable: true,
    text: '热水器'
  },
  wifi: {
    enable: true,
    text: 'Wi-Fi'
  }
})

if (id.value && id.value !== '') {
  RequestUtil.getSingleHouse(id.value)
      .then(res => {
        // 房源信息应用
        houseInfo.value = res
        houseLocation.value = houseInfo.value.address.province + houseInfo.value.address.city + houseInfo.value.address.cityProper + houseInfo.value.address.street
        roomDesc.value = houseInfo.value.description ? houseInfo.value.description : descPlaceholder
        roomPrice.value = houseInfo.value.roomList[0].price
        roomTitle.value = houseInfo.value.title
        roomAddress.value = houseInfo.value.address
        houseCreator.value = houseInfo.value.creator
        roomAllocation.value = houseInfo.value.allocation
        // 只展示前三个房源
        roomList.value = houseInfo.value.roomList.slice(0, 3)

        // 判断房源是否已满员，以roomList数组中元素的tenement属性是否有值为判定
        switch (roomList.value.length) {
          case 1:
            roomAvailable.value = !roomList.value[0].tenement;
            break;
          case 2:
            roomAvailable.value = !(roomList.value[0].tenement && roomList.value[1].tenement);
            break;
          case 3:
            roomAvailable.value = !(roomList.value[0].tenement && roomList.value[1].tenement && roomList.value[2].tenement);
            break;
          default:
            roomAvailable.value = false;
            roomDisabledFlag.value.msg = '未知错误';
        }
        if (roomAvailable.value) {
          roomDisabledFlag.value.msg = '房间已满'
        }

        // 判断是否本用户名下房源
        if (store.getters.getUserInfo.id === houseInfo.value.creator.id) {
          roomAvailable.value = false
          roomDisabledFlag.value.msg = '房东无法自租用'
        }

        // 轮播图，ES6 数组拼接
        for (let roomListKey in roomList.value) {
          roomPics.value = [...roomPics.value, ...roomList.value[roomListKey].pictureUrlList]
        }

      })
      .catch((err) => {
        Notification.Notify(`获取房屋信息出错，请刷新重试。${err.message}`, {
          title: '出错',
          type: msgType.ERROR
        })
      })
} else {
  Notification.Notify('房源id为空，请检查网址是否正确。', {
    title: '错误',
    type: msgType.ERROR,
    duration: msgDuration.LONG
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
        .then(res => res.text())
        .then(r => {
          console.log(r)
          store.commit("setChatViewVisibility", true)
        })
  } else {
    store.commit('setChatViewVisibility', true)
  }
};

/**
 * @function setTagChinese
 * @description 设置标签中文
 */
const setTagChinese = () => {
  // 如果houseInfo.allocation中的属性为真值，则设置labels中对应对象的enable属性为真值
  for (let key in roomAllocation.value) {
    // 以下语句等价于下面的if语句
    labels[key].enable = !!roomAllocation.value[key];
    // 以上语句等价于以下语句

    // if (roomAllocation.value[key]) {
    //   labels[key].enable = true
    // } else {
    //   labels[key].enable = false
    // }
  }
}

/**
 * @function onJoinRentClick
 * @description 点击 加入合租
 */
const onJoinRentClick = () => {
  const houseId = houseInfo.value.id
  const selectedRoomId = rentRoomId.value
  // console.log('house id:', houseId, 'selected room id:', selectedRoomId)
  RequestUtil.getJoinRentHouse(houseId, selectedRoomId)
      .then(() => {
        Notification.Notify('加入合租成功！正在前往个人中心。', {title: '成功', type: msgType.SUCCESS})
        setTimeout(() => {
          clearTimeout(1500)
          router.push('/user/rentin')
        }, 1500)
      })
      .catch(err => {
        // console.log(err)
        Notification.Notify('出错了，请联系工作人员。' + err, {title: '错误', type: msgType.ERROR})
      })
}

watch(() => roomAllocation.value, (val) => {
  setTagChinese()
})

watch(() => store.getters.getUserInfo, (value => {
  console.log('store updated', value)
  if (value.id !== "") {
    thisUser = value
  }
}))

onMounted(() => {
  if (id.value === "" || null || undefined) {
    router.push('/')
  }
  setTagChinese()
})
</script>

<style>
</style>
