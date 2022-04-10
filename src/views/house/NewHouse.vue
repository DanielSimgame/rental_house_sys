<template>
  <div class="new-house__container w-full mx-auto py-10">
    <!--    顶部标题栏-->
    <div class="w-full grid grid-cols-5">
      <TopTitle class="col-span-4" text="房源信息"/>
      <div class="landlord__btn col-span-1 flex flex-col justify-center items-center">
        <el-link
            :underline="false"
            @click="onSubmitHandler"
            class="query-btn inline-flex w-full h-14 items-center justify-center
             rounded-md border border-transparent bg-indigo-600 text-base font-medium
             leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
        >
          <span class="text-2xl flex flex-row justify-center items-center">
            <el-icon>
              <Plus/>
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
    <el-form class="mx-auto" v-model="newHouseDTO.value">
      <el-form-item label="地区" prop="region">
        <el-col :span="3">
          <el-select
              ref="provinceSelector"
              v-model="newHouseDTO.address.province"
              placeholder="省/直辖市/自治区"
              :disabled="isProvinceDisabled"
              @change="onCitySelectChange"
          >
            <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaName"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="text-center" :span="1">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="3">
          <el-select
              ref="provinceSelector"
              v-model="newHouseDTO.address.city"
              placeholder="城市"
              :disabled="isProvinceDisabled"
              @change="onCitySelectChange"
          >
            <el-option
                v-for="item in cityList"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaName"
            ></el-option>
          </el-select>
        </el-col>
        <el-col class="text-center" :span="1">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="3">
          <el-select
              ref="provinceSelector"
              v-model="newHouseDTO.address.cityProper"
              placeholder="区/县/州"
              :disabled="isProvinceDisabled"
              @change="onCitySelectChange"
          >
            <el-option
                v-for="item in districtList"
                :key="item.id"
                :label="item.areaName"
                :value="item.areaName"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
            v-model="newHouseDTO.address.street"
            maxlength="100"
            show-word-limit
            placeholder="街道 - 道路 - 门牌号">
        </el-input>
      </el-form-item>
      <el-form-item label="描述" prop="title">
        <el-input
            v-model="newHouseDTO.title"
            maxlength="20"
            show-word-limit
            placeholder="5到20字的房源标题">
        </el-input>
      </el-form-item>
      <el-form-item label="配置" prop="spec">
        <el-checkbox
            ref="checkbox"
            @change="onCheckboxChange"
            v-for="(item, index) in labels"
            :key="index"
            v-model="newHouseDTO.allocation[item.name]"
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
    <el-form>
      <el-form-item label="简介" prop="description">
        <el-input
            v-model="newHouseDTO.description"
            type="textarea"
            maxlength="400"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
            :placeholder="descPlaceholder"></el-input>
      </el-form-item>
    </el-form>

    <!--    房间列表-->
    <el-divider content-position="left" direction="horizontal">
      <h2 class="text-2xl">房间列表</h2>
    </el-divider>
    <div
        class="room-list__wrap px-5 grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5"
    >
      <div
          class="room-list__item mx-auto overflow-hidden relative group w-full bg-white
          border-slate-200 border hover:bg-indigo-600 rounded-xl p-5 md:p-3 hover:shadow-xl
          text-black hover:text-white hover:-translate-y-1 transition-all"
          v-for="(item, index) in newHouseDTO.roomList"
          :key="index"
      >
        <div class="room-list__item-func-wrap z-50 cursor-pointer bg-orange-600 w-6 absolute top-0 right-0
        transition-all hover:scale-150 hover:-translate-x-1 hover:translate-y-1"
             @click="onRemoveRoomClick(index, newHouseDTO.roomList)">
          <el-button
              title="删除"
              type="text"
              size="small"
              class="room-list__item-func text-white font-bold right-0"
          >
            <el-icon>
              <CloseBold/>
            </el-icon>
          </el-button>
        </div>
        <div class="flex flex-col items-center">
          <div class="flex items-center">
            <img
                v-if="item.pictureUrlList.length > 0"
                class="mb-2 rounded-xl w-52 h-28"
                :src="item.pictureUrlList[0]"
                alt
            />

            <el-upload
                drag
                :action="`${$store.getters.getApiServer}/file/image`"
                :headers="{token: User.getToken()}"
                :show-file-list="false"
                accept="image/jpeg,image/jpg,image/png,image/bmp"
                :on-preview="onRoomPicPreview"
                :on-success="onRoomPicSuccess"
                :on-error="onRoomPicError"
                :before-upload="beforeRoomPicUpload(index)"
                v-else
                class="cursor-pointer text-center flex flex-col justify-center"
            >
              <el-icon class="el-icon--upload">
                <UploadFilled/>
              </el-icon>
              <div class="el-upload__text">
                <p>把文件拖动到此处，或者<em>点击此处上传</em></p>
                <p>jpg,jpeg,png,bmp格式的图片，且不超过2MB</p>
              </div>
            </el-upload>

          </div>
          <div class="flex items-center my-2 w-52">
            <el-input
                v-model="newHouseDTO.roomList[index].description"
                placeholder="房间描述（如：南卧）"
                class="w-full"
                required
            ></el-input>
          </div>
          <div class="flex items-center my-2 w-52">
            <el-input
                v-model="newHouseDTO.roomList[index].size"
                placeholder="面积"
                class="w-full"
                required
            ></el-input>
            <span class="text-gray-500 group-hover:text-white ml-1">㎡</span>
          </div>
          <div class="items-center my-2 w-52 grid grid-cols-3 gap-2">
            <el-input
                v-model="newHouseDTO.roomList[index].price"
                placeholder="价格"
                class="col-span-2"
                required
            ></el-input>
            <span class="text-gray-500 group-hover:text-white">元/月</span>
          </div>
        </div>
      </div>

      <el-button type="text" class="ml-2" style="height: 100%;">
        <div
            class="room-list__item flex flex-col justify-between items-center overflow-hidden relative group h-full
            w-64 bg-white border-slate-200 border hover:bg-indigo-600 rounded-xl p-5 md:p-3 hover:shadow-xl
            text-black hover:text-white hover:-translate-y-1 transition-all"
            @click="onAddRoomClick"
        >
          <span class="my-5 text-xl">点击新增一个房间</span>
          <span class="text-6xl">+</span>
        </div>
      </el-button>
    </div>

    <el-dialog
        title="房间图片预览"
        v-model="roomPicDialogVisible"
        width="80%"
        destroy-on-close>
      <img
          :src="roomPicDialogUrl"
          alt=""
          class="w-full h-full object-cover"/>
    </el-dialog>
  </div>
</template>

<script setup>
import {CloseBold, Plus, UploadFilled} from '@element-plus/icons-vue'
import RequestUtil from '@/utils/RequestUtil'
import User from "@/utils/User";
import {reactive, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import TopTitle from '@/components/TopTitle.vue'
// import houseImg from '@/assets/images/roomPic.jpg'
import Notification, {msgType} from '@/utils/basic/Notification'

const descPlaceholder = '请输入房源简介（例如：房源小区位置，周围是否有公共交通，房源楼层，最近的学校、' +
    '超市、医院等信息，或者是上一栏配置中未提及的额外配置。请不要填写您的手机号、微信等联系方式或敏感信息）'

let roomPicDialogVisible = ref(false)
let roomPicDialogUrl = ref('')
let roomPicUploadIndex = ref(0)
const route = useRoute()
const router = useRouter()
let checkbox = ref(null)
let provinceSelector = ref(null)
let isProvinceDisabled = ref(true)
let provinceList = ref('') // 这个数据是组件初始化created异步加载的数据
let cityList = ref('')
let districtList = ref('')

// 经纬度不填则默认天安门的经纬度
let newHouseDTO = reactive({
  address: {
    city: "",
    cityProper: "",
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
  id: null,
  description: "",
  roomList: [
    {
      description: "",
      pictureUrlList: [],
      price: 0,
      size: 0
    }
  ],
  title: ""
})

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

// setup时获取行政区信息
RequestUtil.getDistricts('')
    .then(res => {
      provinceList.value = res
      isProvinceDisabled.value = false
    })

watch(() => newHouseDTO.address.province, (val) => {
  RequestUtil.getDistricts(val)
      .then(res => {
        cityList.value = res
      })
})

watch(() => newHouseDTO.address.city, (val) => {
  RequestUtil.getDistricts(val)
      .then(res => {
        districtList.value = res
      })
})

// province = route.query.province;
// city = route.query.city;
// district = route.query.district;

/**
 * @function onAddRoomClick
 * @description 添加房间
 */
const onAddRoomClick = () => {
  newHouseDTO.roomList.push({
    description: "",
    pictureUrlList: [],
    price: 0,
    size: 0
  })
}

/**
 * @function onRemoveRoomClick
 * @description 删除房间
 * @param index 房间号
 * @param roomList 房间列表
 */
const onRemoveRoomClick = (index, roomList) => {
  if (index === 0 && roomList.length === 1) {
    Notification.Notify('第一个房间不能删除', {
      type: msgType.WARNING,
      title: '提示'
    })
  } else {
    // } else if (index >= 0 && roomList > 1) {
    newHouseDTO.roomList.splice(index, 1)
  }
}

/**
 * @function onCitySelectChange
 * @description 省份选择改变时触发
 * @param {string} value 选中的省份id
 */
const onCitySelectChange = (value) => {
  // console.log(value) // 获取已选项的label
}

/**
 * @function onCheckboxChange
 * @description 分配项改变时触发
 * @param {string} value 选中的项的label
 */
const onCheckboxChange = (value) => {
  // console.log(value) // 获取已选项的label
  // console.log(newHouseDTO.allocation)
}

/**
 * @function onSubmitHandler
 * @description 提交表单
 */
const onSubmitHandler = () => {
  // console.log(newHouseDTO)
  RequestUtil.postCreateHouse(newHouseDTO)
      .then(res => {
        Notification.Notify('发布成功', {
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
        Notification.Notify('发布失败' + err, {
          type: msgType.ERROR,
          title: '提示'
        })
        // console.log(err)
      })
}

/**
 * @function onRoomPicPreview
 * @description click to preview the room pictures that already uploaded or need to upload
 * @param {UploadFile} file
 * */
const onRoomPicPreview = (file) => {
  console.log(file)
  roomPicDialogUrl.value = file.url
  roomPicDialogVisible.value = true
}

/**
 * @function onRoomPicSuccess
 * @description upload room pictures successfully
 * @param {any} response response is an url
 * @param {UploadFile} uploadFile
 * */
const onRoomPicSuccess = (response, uploadFile) => {
  console.log(response)
  console.log(uploadFile)
  // console.log(newHouseDTO.roomList[uploadFile.index].pictureUrlList)
  newHouseDTO.roomList[roomPicUploadIndex.value].pictureUrlList.push(response)
}

/**
 * @function onRoomPicError
 * @description upload room pictures failed
 * @param {Error} error
 * @param {UploadFile} uploadFile
 * */
const onRoomPicError = (error, uploadFile) => {
  console.log(error)
  console.log(uploadFile)
  Notification.Notify('上传图片失败', {
    type: msgType.ERROR,
    title: '提示'
  })
}

/**
 * @function beforeRoomPicUpload
 * @description before upload room pictures, save the index of the room, for onRoomPicSuccess() to get the index
 * @param {number} index
 * */
const beforeRoomPicUpload = (index) => {
  // console.log(index)
  roomPicUploadIndex.value = index
}

// postCreateHouse(newHouseDTO)
// onMounted(() => {
// })
</script>

<style>
.new-house__container {
  width: 1280px;
}

.el-checkbox {
  margin-bottom: 10px;
}

.room-list__item-func-wrap {
  border-bottom-left-radius: 40%;
}

.room-list__item-func {
  transform: translate(5px, -1px);
  color: #fff;
}
</style>
