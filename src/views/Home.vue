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