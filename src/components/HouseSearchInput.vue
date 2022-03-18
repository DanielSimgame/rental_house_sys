<template>
    <div class="flex justify-center items-center w-full" :class="direction === 'vertical' ? 'flex-col' : 'flex-row'">
        <el-cascader
            ref="cascader"
            class="w-full"
            :key="is_cascader"
            v-model="addressArr"
            placeholder="请选择地区"
            size="large"
            :props="addressProps"
            :options="provinces"
            @change="handleCityChange"
          />
          <el-link
            :underline="false"
            @click="onSearchClick"
            class="query-btn inline-flex items-center justify-center rounded-md border border-transparent
            bg-indigo-600 text-base font-medium leading-6 text-white transition
            duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
            :class="direction === 'vertical' ? 'mt-5 w-36 h-14 px-5 py-3' : 'ml-5 w-32 h-12 p-0'"
          ><span :class="direction === 'vertical' ? 'text-xl' : 'text-lg'">查询房源</span></el-link>
    </div>
</template>

<script setup>
import NotificationUtil from '@/utils/NotificationUtil';
import RequestUtil from '@/utils/RequestUtil';
import RouterUtil from '@/utils/RouterUtil';
import { onMounted, reactive, ref } from 'vue-demi';

defineProps({
    direction: {
        type: String,
        default: 'vertical',
    },
})

let cascader = ref(null)
let selectedCity = ref([])
let provinces = ref([{}]) // 这个数据是组件初始化created异步加载的数据，里面加空对象是为了el-cascader初始化没有数据报错 data=null这个原因
let addressArr = [] // 绑定的数据
let is_cascader = Math.random() // 重新渲染标识key
let addressProps = reactive({
  label: 'areaName',
  value: 'id',
  lazy: true,
  lazyLoad(node, resolve) {
    const { value, level } = node
    RequestUtil.getDistricts(value)
      .then(res => {
        if (level === 2) {
          resolve(
            res.map(item => {
              item.leaf = 'leaf'//这个必须加，就是让组件识别是不是最后一级
              return item
            })
          )
        } else {
          resolve(res)
        }
      })
  }
})

/**
 * @function initDistricts 初始化省市区数据
 */
const initDistricts = async () => {
  await RequestUtil.getDistricts('0')
    .then(res => {
      provinces.value = res
    });
};

/**
 * @function handleCityChange
 * @description 监听选择的城市
 * @param {Array} selectedOptions 当前选择的城市
 * @example handleCityChange({19, 20}) 即选择了天津市/天津城区
 */
const handleCityChange = (selectedOptions) => {
  addressArr = selectedOptions
  is_cascader = Math.random()

  // console.log(cascader.value.getCheckedNodes()[0].pathLabels) // 获取已选项的label
  selectedCity.value = cascader.value.getCheckedNodes()[0].pathLabels
}

/**
 * @function onSearchClick
 * @description 点击查询按钮
 */
const onSearchClick = () => {
  if(cascader.value.getCheckedNodes().length !== 0) {
    RouterUtil.goSearch(JSON.stringify(selectedCity.value))
  } else {
    NotificationUtil.TopMsg('请先选择一个城市', {type: 'warning', duration: 2000, offset: 100})
  }
}

onMounted(() => {
  initDistricts();
})
</script>