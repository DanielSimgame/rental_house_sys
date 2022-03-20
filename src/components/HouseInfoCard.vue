<template>
  <div
    class="house-info-card group sm:w-80 md:w-80 lg:w-96 xl:w-96 2xl:w-96 bg-white border-slate-200 hover:border-indigo-600 border-2 
    hover:bg-indigo-600 rounded-xl p-5 md:p-3 hover:shadow-xl text-black hover:text-white hover:-translate-y-1 transition-all"
  >
    <img class="mb-2 rounded-xl md:w-80 lg:w-96 xl:w-96 2xl:w-96" :src="imgUrl" alt />
    <span class="house-info__name">
      <strong>{{ houseInfo.title }}</strong>
    </span>
    <div class="house-info__info grid grid-cols-3">
      <div
        class="col-span-2 text-black text-opacity-40 group-hover:text-white text-sm flex flex-col"
      >
        <span>{{ houseInfo.roomList[0].size }}㎡</span>
        <span>{{ houseInfo.address.street }}</span>
      </div>
      <span
        class="col-span-1 text-2xl text-orange-500 group-hover:text-red-400 text-right"
      >¥{{ houseInfo.roomList[0].price }}/月</span>
      <div class="house-info__tags col-span-2 grid-flow-row grid-cols-5">
        <el-tag
          v-for="(obj, i) in labels"
          :key="i"
          v-show="obj.enable"
          class="house-info__tag w-fit mr-2 mt-2"
          size="default"          
        >{{ obj.text }}</el-tag>
      </div>
      <div class="house-info__landlord col-span-1">
        <UserCard :user-info="houseInfo.creator" size="default" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import houseImg from '@/assets/images/roomPic.jpg'
import UserCard from './UserCard.vue';

const imgUrl = ref(houseImg)
const tagColors = ['', 'success', 'info', 'warning', 'danger']
const labels = reactive({
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

let props = defineProps({
  houseInfo: {
    type: Object,
    default: () => {
      return {
        address: {
          province: '',
          city: '',
          cityProper: '',
          street: '',
          longitude: 116.38,
          latitude: 39.90,
        },
        allocation: {
          airConditioner: false,
          balcony: false,
          centralHeating: false,
          fridge: false,
          gasStove: false,
          microwaveOven: false,
          separateBathroom: false,
          television: false,
          wardroe: false,
          washingMachine: false,
          waterHeater: false,
          wifi: false,
        },
        creator: {
          id: '',
          name: '',
          gender: '',
          portrait: '',
          detail: ''
        },
        id: '',
        roomList: [{
          description: '',
          pictureUrlList: [],
          price: 1000,
          roomId: 1,
          size: 15.5,
          tenement: {
            id: '',
            name: '',
            gender: '',
            detail: '',
            portrait: '',
          },
        }],
        title: ''
      }
    },
  },
})

onMounted(() => {
  setTagChinese()
})

/**
 * @function setTagChinese
 * @description 设置标签中文
 */
const setTagChinese = () => {
  // 如果houseInfo.allocation中的属性为真值，则设置labels中对应对象的enable属性为真值
  for (let key in props.houseInfo.allocation) {
    // props.houseInfo.allocation[key] ? labels[key].enable = true : false
    if (props.houseInfo.allocation[key]) {
      labels[key].enable = true
    } else {
      labels[key].enable = false
    }
  }
}

watch(() => props.houseInfo, (val) => {
    setTagChinese()
})

/**
 * @function getTagColor
 * @description 获取标签颜色
 * @param {number} index 标签索引下标
 *           :type="getTagColor(i)"
 */
// const getTagColor = (index) => {
//   if (index >= 5 && index < 10) {
//     getTagColor(index - 5);
//   } else {
//     return tagColors[index % 5]
//   }
//   return tagColors[index]
// }
</script>

<style>
.house-info-card {
  /* width: 380px; */
  min-height: 430px;
  display: inline-block;
  box-sizing: border-box;
}
</style>