<template>
    <div class="container mx-auto p-5">
        HOUSE DETAIL {{ id }}
        <div class="house-detail__top grid grid-cols-3 p-5 border rounded-xl">
            <div class="house-detail__top-item row-span-3 mr-5">
                <img :src="roomPic" alt/>
            </div>
            <div class="house-detail__top-item col-span-2">
                <h1 class="text-2xl font-bold">
                    {{ houseInfo.title }}
                </h1>
            </div>
            <div class="house-detail__top-item col-span-2">
                阿姐怕解决皮肤视频
            </div>
        </div>
    </div>
</template>

<script setup>
import roomPic from "@/assets/images/roomPic.jpg"
import RequestUtil from '@/utils/RequestUtil';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

const route = useRoute()
const router = useRouter()

let id = ref(route.query.id)
let houseInfo = ref({})

RequestUtil.getSingleHouse(id.value)
.then(res => {
    return houseInfo.value = res
})

onMounted(() => {
    if(id.value === "" || null || undefined) {
        router.push('/')
    }
})
</script>

<style>
</style>