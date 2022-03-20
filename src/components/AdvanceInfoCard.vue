<template>
    <div
        class="advances__card cursor-default group h-40 my-auto bg-white border-slate-200 hover:border-indigo-600 border-2 hover:bg-indigo-600 rounded-xl p-5 shadow-xl hover:shadow-2xl text-black hover:text-white transition-all grid grid-cols-3 gap-4"
    >
        <img class="row-span-2 m-auto" :src="props.infoObj.imgUrl" width="60" alt />
        <div class="flex flex-row justify-start items-end col-span-2">
            <span
                class="text-black group-hover:text-white text-xl font-bold"
            >{{ props.infoObj.title }}</span>
        </div>
        <span class="text-black group-hover:text-white col-span-2 text-sm font-thin">
            <p>{{ props.infoObj.desc }}</p>
            <p>{{ props.infoObj.desc2 }}</p>
        </span>
    </div>
</template>

<script setup>
import imgFlash from '@/assets/images/flash.png';
const props = defineProps({
    infoObj: {
        type: Object,
        default: () => {
            return {
                imgUrl: imgFlash,
                title: '出租快',
                desc: '最快可当天签约',
                desc2: '提供装修并配置品牌家具家电',
            }
        }
    },
});

</script>

<style>
</style>