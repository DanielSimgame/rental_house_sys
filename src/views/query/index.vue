<template>
  <div class="container mx-auto px-4 py-4">
    <h1 class="top-title-text text-4xl my-5 pl-4 relative">
      <!-- <span>{{ keyword[0] }}</span> -->
      <span>{{ keyword[1] }}</span>
      <span>{{ keyword[2] }}</span>
      <span>的房源</span>
    </h1>
    <div class="search-container my-5">
      <HouseSearchInputVue direction="horizontal" />
    </div>
    <div class="house-list-container grid grid-cols-3 gap-4" v-if="!isEmptyList">
      <HouseInfoCardVue v-for="(item) in resultArr.value" :key="item.id" :house-info="item" />
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
import RequestUtil from "@/utils/RequestUtil";
import { onMounted, reactive, ref, watch } from "vue-demi";
import { useRoute } from "vue-router";
import HouseSearchInputVue from '@/components/HouseSearchInput.vue';
import HouseInfoCardVue from "@/components/HouseInfoCard.vue";

const route = useRoute()

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
.top-title-text {
  font-weight: bold;
  font-style: italic;
}
.top-title-text::before {
  content: "";
  position: absolute;
  width: 5px;
  height: 100%;
  background-color: var(--el-color-primary);
  top: 0;
  left: 0;
  transform: skewX(-18deg);
}
</style>