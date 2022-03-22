<template>
  <div class="container mx-auto p-5">
    <div class="house-detail__top shadow-xl grid grid-cols-3 p-5 mb-5 border rounded-xl">
      <div class="house-detail__top-item col-span-2 row-span-3 mr-5">
        <img class="w-full object-cover rounded-xl" :src="roomPic" alt/>
      </div>
      <!-- 面板只能放三个房间信息，超出会宽度溢出 -->
      <div class="house-detail__top-item">
        <h1 class="text-2xl font-bold">{{ roomTitle }}</h1>
        <h1 class="text-4xl text text-orange-500">¥{{ roomPrice }}元/月</h1>
        <div class="flex items-center mt-1">
          <span class="text-gray-400 mr-4">房东</span>
          <UserCardVue :userInfo="houseCreator" size="large"/>
        </div>
        <div class="house-detail__specs flex items-center mt-1 mb-2">
          <span class="text-gray-400 w-16">配置</span>
          <div class="house-info__tags grid-flow-row grid-cols-5">
            <el-tag
                v-for="(obj, i) in labels"
                :key="i"
                v-show="obj.enable"
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
                class="house-detail__room flex flex-col justify-center text-center"
                v-for="item1 in roomList"
                :key="item1.roomId"
            >
              <span>{{ item1.description }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">面积</span>
          <div class="house-detail__areas w-full grid grid-cols-3">
            <div
                class="house-detail__area flex flex-col justify-center text-center"
                v-for="item2 in roomList"
                :key="item2.roomId"
            >
              <span class="text-3xl">{{ item2.size }}㎡</span>
            </div>
          </div>
        </div>
        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">租金</span>
          <div class="house-detail__areas w-full grid grid-cols-3">
            <div
                class="house-detail__area flex flex-col justify-center text-center"
                v-for="item3 in roomList"
                :key="item3.roomId"
            >
              <span class="text-3xl">{{ item3.price }}元</span>
            </div>
          </div>
        </div>

        <div class="flex items-center mb-5">
          <span class="text-gray-400 w-16">室友</span>
          <div class="house-detail__roommates w-full grid grid-cols-3">
            <div
                class="house-detail__roomate flex flex-row justify-center items-center"
                v-for="(item4) in roomList"
                :key="item4.roomId"
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
                class="house-detail__roomate flex flex-row justify-center items-center"
                v-for="(item4) in roomList"
                :key="item4.roomId"
            >
              <el-radio
                  v-model="rentRoomId"
                  :label="item4.roomId"
                  size="large"
                  :disabled="item4.tenement !== null"
              >{{ item4.roomId }}号房
              </el-radio>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <el-link
              :underline="false"
              @click="onJoinRentClick"
              :disabled="!roomAvailable"
              class="query-btn inline-flex mt-5 w-full h-20 px-5 py-3 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
          >
            <span class="text-2xl" v-if="roomAvailable">加入合租</span>
            <span class="text-2xl" v-else>此房源已满</span>
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
// import TopTitleVue from '@/components/TopTitle.vue';
import UserCardVue from '@/components/UserCard.vue';
import roomPic from "@/assets/images/roomPic.jpg"
import RequestUtil from '@/utils/RequestUtil';
import {useRoute, useRouter} from 'vue-router';
import {onMounted, reactive, ref, watch} from 'vue';
import NotificationUtil, {msgType} from '@/utils/NotificationUtil';

const route = useRoute()
const router = useRouter()

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

let rentRoomId = ref(1)
let roomAvailable = ref(true)

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

RequestUtil.getSingleHouse(id.value)
    .then(res => {
      console.log(res)
      houseInfo.value = res
      houseLocation.value = houseInfo.value.address.province + houseInfo.value.address.city + houseInfo.value.address.cityProper + houseInfo.value.address.street
      roomDesc.value = houseInfo.value.description ? houseInfo.value.description : `这套位于${houseInfo.value.address.street}的房源属于抢手房源。共有21栋楼。在小区内可以看到全天执勤的安保人员。
        有出租车位。该小区共有4个出入口。房源所在楼栋距离地铁站站比较近。小区配套成熟，有健身广场，
        篮球场，网球场，饮水站，快递柜，花园。楼栋概况 小区是2017年建的，楼栋外立面较新。单元无门禁。
        楼栋总高45层。3梯4户，楼道安静不嘈杂，上下班高峰期不用等电梯。楼道卫生由小区负责，有专人清扫。
        房源概况 这间4居室的05卧面积较大，无论是一个人住还是情侣合住都是不错的选择。房源位于9层，卧室朝南，冬暖夏凉。
        有独立阳台，可以摆放绿植，让房间绿意满满。厨房有窗户，光线好。公用卫生间有窗户，异味更容易排出。
        装修亮点 卧室的装修以灰、粉色为主，营造出简约低调的居室氛围。房间为环保装修，板材结实耐用。
        且配备了国内外一线品牌家电，品质安全有保障。`
      roomPrice.value = houseInfo.value.roomList[0].price
      roomTitle.value = houseInfo.value.title
      roomAddress.value = houseInfo.value.address
      houseCreator.value = houseInfo.value.creator
      roomAllocation.value = houseInfo.value.allocation
      // 只展示前三个房源
      roomList.value = houseInfo.value.roomList.slice(0, 3)
      if (roomList.value[0].tenement && roomList.value[1].tenement && roomList.value[2].tenement) {
        // 满人了
        roomAvailable.value = false
      }
      // console.log(houseInfo)
    })

/**
 * @function setTagChinese
 * @description 设置标签中文
 */
const setTagChinese = () => {
  // 如果houseInfo.allocation中的属性为真值，则设置labels中对应对象的enable属性为真值
  for (let key in roomAllocation.value) {
    // console.log(key)
    // props.houseInfo.allocation[key] ? labels[key].enable = true : false

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
        // console.log(res)
        NotificationUtil.Notify('加入合租成功！正在前往个人中心。', {title: '成功', type: msgType.SUCCESS})
        setTimeout(() => {
          clearTimeout(1500)
          router.push('/user/rentin')
        }, 1500)
      })
      .catch(err => {
        // console.log(err)
        NotificationUtil.Notify('出错了，请联系工作人员。' + err, {title: '错误', type: msgType.ERROR})
      })
}

watch(() => roomAllocation.value, (val) => {
  setTagChinese()
})

onMounted(() => {
  if (id.value === "" || null || undefined) {
    router.push('/')
  }
  setTagChinese()
})
</script>

<style>
</style>
