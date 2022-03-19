<template>
    <div class="container mx-auto px-4 py-4">
        <h1 class="top-title-text text-4xl my-5">
            <!-- <span>{{ keyword[0] }}</span> -->
            <span>{{ keyword[1] }}</span>
            <span>{{ keyword[2] }}</span>
            <span>的房源</span>
        </h1>
        <div class="search-container my-5">
            <HouseSearchInputVue direction="horizontal" />
        </div>
        <div class="house-list-container grid grid-cols-3 gap-4">
            <HouseInfoCardVue v-for="(item, index) in items" :key="index"/>
        </div>
    </div>
</template>

<script setup>
import RequestUtil from "@/utils/RequestUtil";
import { nextTick, onMounted, reactive, ref } from "vue-demi";
import { useRoute } from "vue-router";
import HouseSearchInputVue from '@/components/HouseSearchInput.vue';
import HouseInfoCardVue from "@/components/HouseInfoCard.vue";

const route = useRoute()

let keyword = reactive([])
let resultPageNum = ref(0)
let resultArr = reactive([])
let items = [{},{},{},{}]

const getSearchResult = async () => {
    await RequestUtil.getHouseList(keyword[1], keyword[2], resultPageNum.value, 10)
        .then(res => {
            resultArr.value = res
            console.log(resultArr.value)
        })
}

onMounted(() => {
    const params = JSON.parse(decodeURI(route.params.keyword))
    for (let i = 0; i < params.length; i++) {
        keyword.push(params[i])
    }

    getSearchResult()
})
</script>

<style>
.container {
    width: 1200px;
}
.top-title-text {
    font-weight: bold;
    font-style: italic;
}
</style>