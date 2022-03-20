<template>
  <div class="container mx-auto py-10">
      NEW HOUSE PANEL
      {{ paramRegion }}
  </div>
</template>

<script setup>
import Crypto from '@/utils/basic/Crypto';
import RequestUtil from '@/utils/RequestUtil';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
let paramRegion = '';

// 经纬度不填则默认天安门的经纬度
let newHouseDTO = {
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
  roomList: [
    {
      description: "",
      pictureUrlList: [],
      price: 0,
      size: 0
    }
  ],
  title: ""
}

onMounted(() => {
  paramRegion = JSON.parse(Crypto.getDecode64(route.params.keyword))
})

// postCreateHouse(newHouseDTO)

</script>

<style>

</style>