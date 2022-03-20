<template>
  <div class="container mx-auto px-4 py-4">
    <!-- <h1 class="top-title-text text-4xl my-5 pl-4 md:pl-2 relative">
      <span>{{ keyword[1] }}</span>
      <span>{{ keyword[2] }}</span>
      <span>的房源</span>
    </h1>-->
    <div class="w-full grid grid-cols-5">
      <TopTitleVue class="col-span-4" :text="keyword[1] + keyword[2] + '的房源'" />
      <div class="landlore__btn col-span-1 flex flex-col justify-center items-center">
        <el-link
          :underline="false"
          @click="onNewHouseClick"
          class="query-btn inline-flex w-full h-14 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
        >
          <span class="text-2xl flex flex-row justify-center items-center">
            <el-icon>
              <Plus />
            </el-icon>
            <span class="ml-3">发布房源</span>
          </span>
        </el-link>
      </div>
    </div>

    <div class="search-container my-5">
      <HouseSearchInputVue direction="horizontal" />
    </div>
    <div
      class="house-list-container grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-col-3 gap-3"
      v-if="!isEmptyList"
    >
      <HouseInfoCardVue
        class="sm:mx-auto"
        v-for="(item) in resultArr.value"
        :key="item.id"
        :house-info="item"
      />
      <!-- <HouseInfoCardVue :house-info="resultArr[0]" /> -->
    </div>
    <div class="house-list-container flex flex-col justify-center items-center py-16" v-else>
      <h1 class="error-text text-6xl font-bold leading-tight text-gray-900">
        <p class="text-9xl mb-5">空</p>
        <p>此地区暂无房源</p>
        <p>No House available</p>
      </h1>
    </div>
  </div>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue"
import RequestUtil from "@/utils/RequestUtil";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Crypto from "@/utils/basic/Crypto";
import HouseSearchInputVue from '@/components/HouseSearchInput.vue';
import HouseInfoCardVue from "@/components/HouseInfoCard.vue";
import TopTitleVue from "@/components/TopTitle.vue";

const route = useRoute()
const router = useRouter()

let keyword = reactive([])
let resultPageNum = ref(0)
let items = ref([])
let resultArr = reactive([])
let isEmptyList = ref(true)

const getSearchResult = async () => {
  await RequestUtil.getHouseList(keyword[1], keyword[2], resultPageNum.value, 10)
    .then(res => {
      resultArr.value = res
      resultArr.value.length === 0 ? isEmptyList.value = true : isEmptyList.value = false
    })
}

const params = JSON.parse(decodeURI(route.params.keyword))
for (let i = 0; i < params.length; i++) {
  keyword.push(params[i])
}

const onNewHouseClick = () => {
  const locationObj = {
    province: keyword[0].toString(),
    city: keyword[1].toString(),
    district: keyword[2].toString()
  }

  console.log(locationObj)
  const keywordStr = Crypto.getEncode64(JSON.stringify(locationObj))
  console.log(keywordStr)

  router.push({
    name: "NewHouse",
    query: {
      keyword: keywordStr
    }
  })
}

onMounted(() => {
  getSearchResult()
})

// watch(resultArr, (val) => {
//     console.log(val.value)
// })

</script>

<style>
.container {
  width: 1200px;
}
</style>