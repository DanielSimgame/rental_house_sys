<template>
  <div class="edit-house__container w-full mx-auto px-5">
    <!--    顶部标题栏-->
    <div class="w-full grid grid-cols-5">
      <TopTitle class="col-span-4" text="房源信息"/>
      <div class="landlord__btn col-span-1 flex flex-col justify-center items-center">
        <el-link
            :underline="false"
            @click="onSubmitHandler"
            class="query-btn inline-flex w-full h-14 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
        >
          <span class="text-2xl flex flex-row justify-center items-center">
            <el-icon>
              <Edit/>
            </el-icon>
            <span class="ml-3">保存并发布</span>
          </span>
        </el-link>
      </div>
    </div>

    <!--    房源信息-->
    <el-divider content-position="left" direction="horizontal">
      <h2 class="text-2xl">不动产信息</h2>
    </el-divider>
    <el-form class="mx-auto" v-model="editHouseDTO.value">

      <el-tooltip effect="dark" content="修改房源时不允许修改行政区信息" placement="top-start">
        <el-form-item label="地区" prop="region">
          <el-col :span="3">
            <el-select
                ref="provinceSelector"
                v-model="editHouseDTO.address.province"
                placeholder="省/直辖市/自治区"
                :disabled="true"
            >
              <el-option
                  :label="editHouseDTO.address.province"
                  :value="editHouseDTO.address.province"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="3">
            <el-select
                ref="provinceSelector"
                v-model="editHouseDTO.address.city"
                placeholder="城市"
                :disabled="true"
            >
              <el-option
                  :label="editHouseDTO.address.city"
                  :value="editHouseDTO.address.city"
              ></el-option>
            </el-select>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="3">
            <el-select
                ref="provinceSelector"
                v-model="editHouseDTO.address.cityProper"
                placeholder="区/县/州"
                :disabled="true"
            >
              <el-option
                  :label="editHouseDTO.address.cityProper"
                  :value="editHouseDTO.address.cityProper"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-tooltip>

      <el-form-item label="地址" prop="address">
        <el-input
            v-model="editHouseDTO.address.street"
            maxlength="100"
            show-word-limit
            placeholder="街道 - 道路 - 门牌号">
        </el-input>
      </el-form-item>

      <el-form-item label="描述" prop="title">
        <el-input
            v-model="editHouseDTO.title"
            maxlength="20"
            show-word-limit
            placeholder="5到20字的房源标题">
        </el-input>
      </el-form-item>

      <el-form-item label="配置" prop="spec">
        <el-checkbox
            ref="checkbox"
            v-for="(item, index) in labels"
            :key="index"
            v-model="editHouseDTO.allocation[item.name]"
            :label="item.text"
            size="large"
            border
        />
      </el-form-item>
    </el-form>

    <!--    图片上传/房源简介-->
    <el-divider content-position="left" direction="horizontal">
      <h2 class="text-2xl">房源简介</h2>
    </el-divider>
    <el-form v-model="editHouseDTO.description">
      <el-form-item label="简介" prop="description">
        <el-input
            v-model="editHouseDTO.description"
            type="textarea"
            maxlength="400"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入房源简介（例如：房源小区位置，周围是否有公共交通，房源楼层，最近的学校、超市、医院等信息，或者是上一栏配置中未提及的事物。请不要填写您的手机号、微信等联系方式或敏感信息）"></el-input>
      </el-form-item>
    </el-form>

    <!--    房间列表-->
    <el-divider content-position="left" direction="horizontal">
      <h2 class="text-2xl">房间列表</h2>
    </el-divider>
    <div
        class="room-list__wrap grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-5"
    >
      <div
          class="room-list__item mx-auto overflow-hidden relative group w-64 bg-white border-slate-200 border hover:bg-indigo-600 rounded-xl p-5 md:p-3 hover:shadow-xl text-black hover:text-white hover:-translate-y-1 transition-all"
          v-for="(item, index) in editHouseDTO.roomList"
          :key="index"
      >
        <div class="flex flex-col items-center">
          <div class="flex items-center">
            <img
                class="mb-2 rounded-xl md:w-80 lg:w-96 xl:w-96 2xl:w-96"
                :src="(editHouseDTO.roomList[index].pictureUrlList.length === 0) ? houseImg : item.pictureUrlList[0]"
                alt
            />
            <!-- :src="(item.pictureUrlList.length === 0) ? houseImg : item.pictureUrlList[index]" -->
          </div>

          <div class="flex items-center my-2 w-52">
            <el-input
                v-model="editHouseDTO.roomList[index].description"
                placeholder="房间描述（如：南卧）"
                class="w-full"
                required
            ></el-input>
          </div>

          <div class="flex items-center my-2 w-52">
            <el-input
                v-model="editHouseDTO.roomList[index].size"
                placeholder="面积"
                class="w-full"
                required
            ></el-input>
            <span class="text-gray-500 group-hover:text-white ml-1">㎡</span>
          </div>

          <div class="items-center my-2 w-52 grid grid-cols-3 gap-2">
            <el-input
                v-model="editHouseDTO.roomList[index].price"
                placeholder="价格"
                class="col-span-2"
                required
            ></el-input>
            <span class="text-gray-500 group-hover:text-white">元/月</span>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {reactive} from "vue"
import {Edit} from '@element-plus/icons-vue'
import TopTitle from '@/components/TopTitle.vue'
import houseImg from '@/assets/images/roomPic.jpg'
import {useRoute, useRouter} from "vue-router"
import RequestUtil from "@/utils/RequestUtil";
import NotificationUtil, {msgType} from "@/utils/NotificationUtil";

const route = useRoute();
const router = useRouter();

// let pageData = reactive({
//   editHouseDTO: {
//     address: {
//       city: null,
//       cityProper: null,
//       latitude: 39.90,
//       longitude: 116.38,
//       province: "",
//       street: ""
//     },
//     allocation: {
//       airConditioner: false,
//       balcony: false,
//       centralHeating: false,
//       fridge: false,
//       gasStove: false,
//       microwaveOven: false,
//       separateBathroom: false,
//       television: false,
//       wardroe: false,
//       washingMachine: false,
//       waterHeater: false,
//       wifi: false
//     },
//     description: "",
//     id: null,
//     roomList: [
//       {
//         description: "",
//         pictureUrlList: [],
//         price: 0,
//         roomId: null,
//         size: 0,
//         tenement: {
//           detail: null,
//           gender: "",
//           id: null,
//           name: "",
//           portrait: ""
//         }
//       }
//     ],
//     title: ""
//   }
// })

let editHouseDTO = reactive({
  address: {
    city: null,
    cityProper: null,
    latitude: 39.90,
    longitude: 116.38,
    province: "",
    street: ""
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
    wifi: false
  },
  description: "",
  id: null,
  roomList: [
    {
      description: "",
      pictureUrlList: [],
      price: 0,
      roomId: null,
      size: 0,
      tenement: {
        detail: null,
        gender: "",
        id: null,
        name: "",
        portrait: ""
      }
    }
  ],
  title: ""
})

// 房产配置标签
const labels = reactive({
  airConditioner: {
    name: 'airConditioner',
    text: '空调'
  },
  balcony: {
    name: 'balcony',
    text: '阳台'
  },
  centralHeating: {
    name: 'centralHeating',
    text: '中央空调'
  },
  fridge: {
    name: 'fridge',
    text: '冰箱'
  },
  gasStove: {
    name: 'gasStove',
    text: '煤气灶'
  },
  microwaveOven: {
    name: 'microwaveOven',
    text: '微波炉'
  },
  separateBathroom: {
    name: 'separateBathroom',
    text: '独立卫生间'
  },
  television: {
    name: 'television',
    text: '电视'
  },
  wardroe: {
    name: 'wardroe',
    text: '衣柜'
  },
  washingMachine: {
    name: 'washingMachine',
    text: '洗衣机'
  },
  waterHeater: {
    name: 'waterHeater',
    text: '热水器'
  },
  wifi: {
    name: 'wifi',
    text: 'Wi-Fi'
  }
})

console.log('Query house id', route.query.houseId)

/**
 * @function onSubmitHandler
 * @description 提交表单
 */
const onSubmitHandler = () => {
  // console.log(editHouseDTO)
  RequestUtil.postEditHouse(editHouseDTO)
      .then(res => {
        NotificationUtil.Notify('发布成功', {
          type: msgType.SUCCESS,
          title: '提示'
        })
        router.push({
          path: '/house/detail',
          query: {
            id: res.id
          }
        })
        // console.log(res)
      })
      .catch(err => {
        NotificationUtil.Notify('发布失败' + err, {
          type: msgType.ERROR,
          title: '提示'
        })
        // console.log(err)
      })
}

if (route.query.houseId !== undefined) {
  RequestUtil.getSingleHouse(route.query.houseId).then(res => {
    // console.log(res)
    Object.assign(editHouseDTO, res)
    // console.log('editHouseDTO', editHouseDTO)
  })
}

// onMounted(() => {})
</script>

<style scoped>
.el-checkbox {
  margin-bottom: 10px;
}
</style>
