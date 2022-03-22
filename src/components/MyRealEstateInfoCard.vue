<template>
  <div
      class="house-info-card relative overflow-hidden group sm:w-80 md:w-80 lg:w-96 xl:w-96 2xl:w-96 bg-white border-slate-200 hover:border-indigo-600 border
    hover:bg-indigo-600 rounded-xl p-5 md:p-3 hover:shadow-xl text-black hover:text-white hover:-translate-y-1 transition-all"
  >
    <!--    右上角菜单-->
    <el-popover placement="bottom" :width="150" trigger="hover">
      <template #reference>
        <div
            class="room-list__item-func-wrap absolute top-0 right-0 w-6 cursor-pointer bg-orange-600
        transition-all hover:scale-150 hover:-translate-x-1 hover:translate-y-1">
          <el-button
              type="text"
              size="small"
              class="room-list__item-func text-white font-bold right-5"
              title="菜单"
          >
            <el-icon>
              <MoreFilled/>
            </el-icon>
          </el-button>
        </div>
      </template>
      <div class="house-info__func-menu flex flex-col justify-center items-center">
        <div>
          <el-button type="text" @click="onHouseEditClick">
            <el-icon>
              <Edit/>
            </el-icon>
            编辑
          </el-button>
        </div>
        <div>
          <el-button type="text" @click="onHouseDeleteClick">
            <el-icon>
              <Delete/>
            </el-icon>
            下架
          </el-button>
        </div>
        <transition name="el-zoom-in-top">
          <div v-show="showDeleteConfirm">
            <el-button size="small" type="primary" @click="onHouseDeleteCancel">
              取消
            </el-button>
            <el-button size="small" type="text" @click="onHouseDeleteConfirm">
              确定
            </el-button>
          </div>
        </transition>
      </div>
    </el-popover>


    <img class="mb-2 rounded-xl md:w-80 lg:w-96 xl:w-96 2xl:w-96" :src="imgUrl" alt
         @click="onHouseClick(houseInfo.id)"/>
    <span class="house-info__name">
      <strong>{{ houseInfo.title }}</strong>
    </span>
    <div class="house-info__info grid grid-cols-3">
      <div
          class="col-span-2 text-black text-opacity-40 group-hover:text-white text-sm flex flex-col"
      >
        <span>{{ houseInfo.roomList[0].size }}㎡</span>
        <span>{{ houseInfo.address.street }}</span>
        <span>{{ houseInfo.address.province + houseInfo.address.city + houseInfo.address.cityProper }}</span>
      </div>
      <span
          class="col-span-1 text-2xl text-orange-500 group-hover:text-red-400 text-right"
      >¥{{ houseInfo.roomList[0].price }}/月</span>
      <div v-if="myTenants.length > 0" class="house-info__tenants-wrap col-span-6 mt-5">
        <span class="text-center">租客</span>
        <div class="house-info__tenants grid grid-cols-3 gap-5">
          <UserCardVue
              v-for="item in myTenants"
              :key="item.id"
              class="border"
              :user-info="item"
              size="default"
          />
        </div>
      </div>
      <div v-else-if="myTenants.length === 0" class="house-info__tenants-wrap mt-5">
        <span class="text-center">租客</span>
        <div class="house-info__tenants">
          <span class="text-center text-xl font-black">暂无租客</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {MoreFilled, Delete, Edit} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from "vue-router"
import houseImg from '@/assets/images/roomPic.jpg'
import UserCardVue from './UserCard.vue'
import RequestUtil from "@/utils/RequestUtil";
import NotificationUtil, {msgDuration, msgType} from "@/utils/NotificationUtil";

const route = useRoute();
const router = useRouter();

let showDeleteConfirm = ref(false);

const imgUrl = ref(houseImg)
// 该房产下的租户
let myTenants = ref([])

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
  isAdmin: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  if (props.houseInfo.roomList.length > 0) {
    props.houseInfo.roomList.forEach(room => {
      if (room.tenement) {
        myTenants.value.push(room.tenement)
      }
    })
  }
})

/**
 * @function onHouseEditClick
 * @description 点击菜单编辑按钮
 * */
const onHouseEditClick = () => {
  let editMode = props.isAdmin ? '/admin/houseedit' : '/user/houseedit'
  router.push({
    path: editMode,
    query: {
      houseId: props.houseInfo.id
    }
  })
}

/**
 * @function onHouseDeleteClick
 * @description 点击菜单删除按钮
 * */
const onHouseDeleteClick = () => {
  showDeleteConfirm.value = true
}

/**
 * @function onHouseDeleteConfirm
 * @description 点击删除确认按钮
 * */
const onHouseDeleteConfirm = () => {
  RequestUtil.getDeleteHouse(props.houseInfo.id)
      .then(() => {
        NotificationUtil.Notify('下架房源成功！', {
          type: msgType.SUCCESS,
          duration: msgDuration.LONG,
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(err => {
        NotificationUtil.Notify('下架房源失败！' + err.responseText, {
          type: msgType.ERROR,
          duration: msgDuration.LONG,
        })
      })
}

/**
 * @function onHouseDeleteCancel
 * @description 点击删除取消按钮
 * */
const onHouseDeleteCancel = () => {
  showDeleteConfirm.value = false
}

/**
 * @function onHouseClick
 * @param {string} id
 * @description 点击房源后跳转到详情页
 */
const onHouseClick = id => {
  router.push({
    path: "/house/detail",
    query: {
      id: id
    }
  })
}

</script>

<style>
.house-info-card {
  /* width: 380px; */
  min-height: 430px;
  display: inline-block;
  box-sizing: border-box;
}

.room-list__item-func-wrap {
  border-bottom-left-radius: 40%;
}

.room-list__item-func {
  transform: translate(5px, -1px);
  color: #fff;
}
</style>
