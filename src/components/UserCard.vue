<template>
    <div
        :class="props.size === 'large' ?
        'px-4 py-4 bg-white hover:bg-indigo-600 text-black hover:text-white' :
        'px-2 py-2 bg-indigo-600 group-hover:bg-white group-hover:text-black text-white'"
        class="user-info__card 
        rounded-xl cursor-pointer flex flex-row items-center transition-all ease-in-out hover:shadow-lg"
    >
        <div class="portrait rounded-full overflow-hidden">
            <img :src="userInfo.portrait" alt="头像" width="40" height="40" />
        </div>
        <p class="mx-2">{{ userInfo.name }}</p>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
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

// onMounted(() => {
//     console.log(props.size);
// })
</script>

<style>
</style>