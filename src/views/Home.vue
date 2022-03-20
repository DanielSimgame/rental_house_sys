<template>
  <div class="bg-gray-50">
    <div class="bg-container relative">
      <div class="bg-overlay absolute l-0 t-0 w-full h-full"></div>
      <div class="bg-main-content flex flex-col justify-center items-center w-full h-full">
        <div
          class="bg-center flex flex-col justify-center items-center bg-slate-50 opacity-90 h-48 p-5"
        >
          <h1 class="text-gray-700 text-2xl mb-5">选择地区</h1>
          <!-- <el-cascader :props="districts" /> -->
          <HouseSearchInputVue />
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <section class="landlord__wrap py-5">
        <div class="top-title-text text-4xl my-10 pl-4 md:pl-2 relative">
          <h1>房屋出租 成为业主</h1>
        </div>
        <div class="advances__wrap grid grid-cols-3 gap-4 px-4">
          <AdvanceInfoCardVue v-for="(item, index) in advances" :key="index" :infoObj="item" />
        </div>
        <div class="landlore__btn px-5 py-10 flex flex-col justify-center items-center">
          <el-link
            :underline="false"
            @click="onNewHouseClick"
            class="query-btn inline-flex mt-5 w-80 h-24 px-5 py-3 items-center justify-center rounded-md border border-transparent bg-indigo-600 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
          >
            <span class="text-2xl">发布房源</span>
          </el-link>
        </div>
      </section>
    </div>

    <!-- <div
      class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <h2
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
      >
        Ready to dive in?
        <br />
        <span class="text-indigo-600">Vite + Vue 3 + Tailwind CSS</span>
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
            to="/about"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
          >Next Page</router-link>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script setup>
import HouseSearchInputVue from '@/components/HouseSearchInput.vue';
import AdvanceInfoCardVue from '@/components/AdvanceInfoCard.vue';
import imgFlash from '@/assets/images/flash.png';
import imgDiamond from '@/assets/images/diamond.png';
import imgMoney from '@/assets/images/money.png';

const advances = [
  {
    imgUrl: imgFlash,
    title: '出租快',
    desc: '最快可当天签约',
    desc2: '提供装修并配置品牌家具家电',
  },
  {
    imgUrl: imgDiamond,
    title: '租客好',
    desc: '租客对接公安系统',
    desc2: '多维度保障安全',
  },
  {
    imgUrl: imgMoney,
    title: '收益稳',
    desc: '按期打款，赠送财险',
    desc2: '保障不动产安全',
  },
]

/**
 * @function onNewHouseClick
 * @description 点击发布房源按钮
 */
const onNewHouseClick = () => {
  console.log('onNewHouseClick');
}

</script>

<style>
.bg-container {
  height: 500px;
  background-image: url("@/assets/images/bg-home.jpg");
  background-size: cover;
  background-position: center;
}
.bg-overlay {
  opacity: 0.3;
  z-index: 2;
  background-image: linear-gradient(90deg, #000 19%, rgba(0, 0, 0, 0.25));
}
.bg-center {
  width: 700px;
  z-index: 3;
}
.query-btn {
  text-decoration: none !important;
  color: #fff !important;
}
</style>