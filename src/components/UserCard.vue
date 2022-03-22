<template>
  <div
      :class="props.size === 'large' ?
        'px-4 py-4 bg-white hover:bg-indigo-600 text-black hover:text-white flex-row items-center' :
        'px-2 py-2 bg-indigo-600 group-hover:bg-white group-hover:text-black text-white flex-col justify-center items-center'"
      class="user-info__card rounded-xl cursor-pointer flex transition-all ease-in-out hover:shadow-lg"
  >
    <div class="portrait rounded-full overflow-hidden">
      <img :src="props.userInfo.portrait" alt="头像" width="40" height="40"/>
    </div>
    <p class="mx-2">{{ props.userInfo.name }}</p>
  </div>
</template>

<script setup>
// import {onMounted, watch} from 'vue';

let props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {
        name: '',
        id: '',
        portrait: ''
      }
    }
  },
  size: {
    type: String,
    default: 'default'
  }
})

/**
 * @function updateUserInfo
 * @description 更新用户信息
 * */
// const updateUserInfo = (userInfo) => {
//   return {
//     userInfo: userInfo
//   }
// }

</script>

<style>
</style>
