<template>
    <div class="container mx-auto p-5">
        <TopTitleVue :text="topTitle" />
        <div class="house-detail__top grid grid-cols-3 p-5 mb-5 border rounded-xl">
            <div class="house-detail__top-item col-span-2 row-span-3 mr-5">
                <img class="w-full object-cover" :src="roomPic" alt />
            </div>
            <div class="house-detail__top-item">
                <h1 class="text-2xl font-bold">{{ houseInfo.value.title }}</h1>
                <h1 class="text-4xl text text-orange-500">¥{{ houseInfo.roomList[0].price }}元/月</h1>
            </div>
            <div class="house-detail__top-item"></div>
        </div>
        <div class>
            <span class="text-2xl">房源简介</span>
            <p class="text-gray-600 text-sm">编号：{{ id }}</p>
            <p class="my-5">{{ roomBrief }}</p>
        </div>
    </div>
</template>

<script setup>
import TopTitleVue from '@/components/TopTitle.vue';
import roomPic from "@/assets/images/roomPic.jpg"
import RequestUtil from '@/utils/RequestUtil';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

const route = useRoute()
const router = useRouter()

let id = ref(route.query.id)
let houseInfo = reactive({
    id: "",
    title: "",
    address: {
        province: "",
        city: "",
        cityProper: "",
        street: "",
        latitude: 39.9,
        longitude: 116.38
    },
    allocation: {
        television: false,
        microwaveOven: false,
        centralHeating: false,
        washingMachine: true,
        waterHeater: true,
        balcony: true,
        airConditioner: true,
        wardroe: true,
        fridge: false,
        gasStove: false,
        wifi: true,
        separateBathroom: true
    },
    roomList: [
        {
            description: "1号房",
            pictureUrlList: [],
            price: 1100,
            size: 13,
            roomId: 1,
            tenement: null
        },
        {
            description: "2号房",
            pictureUrlList: [],
            price: 1100,
            size: 15,
            roomId: 2,
            tenement: null
        },
        {
            description: "3号房",
            pictureUrlList: [],
            price: 1100,
            size: 14,
            roomId: 3,
            tenement: null
        }
    ],
    creator: {
        id: "",
        name: "",
        gender: "",
        portrait: "https://pics.keker.icu/face.jpg",
        detail: null
    }
})
let topTitle = ref('')
let roomBrief = ref('')

RequestUtil.getSingleHouse(id.value)
    .then(res => {
        houseInfo.value = res
        topTitle.value = houseInfo.value.address.province + houseInfo.value.address.city + houseInfo.value.address.cityProper + houseInfo.value.address.street
        roomBrief.value = `这套位于${houseInfo.value.address.street}的房源属于抢手房源。共有21栋楼。在小区内可以看到全天执勤的安保人员。
        有出租车位。该小区共有4个出入口。房源所在楼栋距离大沙田站比较近。小区配套成熟，有健身广场，
        篮球场，网球场，饮水站，快递柜，花园。楼栋概况 小区是2017年建的，楼栋外立面较新。单元无门禁。
        楼栋总高45层。3梯4户，楼道安静不嘈杂，上下班高峰期不用等电梯。楼道卫生由小区负责，有专人清扫。
        房源概况 这间4居室的05卧面积较大，无论是一个人住还是情侣合住都是不错的选择。房源位于9层，卧室朝南，冬暖夏凉。
        有独立阳台，可以摆放绿植，让房间绿意满满。厨房有窗户，光线好。公用卫生间有窗户，异味更容易排出。
        装修亮点 卧室的装修以灰、粉色为主，营造出简约低调的居室氛围。房间为环保装修，板材结实耐用。
        且配备了国内外一线品牌家电，品质安全有保障。`
        console.log(houseInfo.roomList)
    })


onMounted(() => {
    if (id.value === "" || null || undefined) {
        router.push('/')
    }
})
</script>

<style>
</style>
