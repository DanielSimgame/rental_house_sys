<template>
    <div
        class="house-info-card group bg-white border-slate-200 hover:border-indigo-600 border-2 hover:bg-indigo-600 rounded-xl p-5 hover:shadow-xl text-black hover:text-white hover:-translate-y-1 transition-all"
    >
        <img class="mb-2 rounded-xl" :src="imgUrl" width="368" height="270" alt />
        <span class="house-info__name">
            <strong>合租·南李路·2居室·地铁口</strong>
        </span>
        <div class="house-info__info flex flex-row">
            <div
                class="flex-2 text-black text-opacity-40 group-hover:text-white text-sm flex flex-col"
            >
                <span>15.5㎡</span>
                <span>房源距湖工大站直线距离200米</span>
            </div>
            <span
                class="flex-1 text-xl text-orange-500 group-hover:text-orange-400 text-right"
            >¥1100/月</span>
        </div>
        <div class="house-info__tags grid grid-cols-3 gap-2 mt-2">
            <el-tag
                v-for="(tag, i) in labels"
                :key="i"
                v-show="tag !== ''"
                class="house-info__tag"
                size="default"
                :type="getTagColor(i)"
            >{{ tag }}</el-tag>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue-demi';
import houseImg from '@/assets/images/roomPic.jpg'

const imgUrl = ref(houseImg)
const tagColors = ['', 'success', 'info', 'warning', 'danger']
const labels = ['满一年', '满两年', '满五年', '满十年', '满二十年', '满二十五年', '满三十年']

/**
 * @function getTagColor
 * @description 获取标签颜色
 * @param {number} index 标签索引下标
 */
const getTagColor = (index) => {
    if (index >= 5 && index < 10) {
        getTagColor(index - 5);
    } else {
        return tagColors[index % 5]
    }
    return tagColors[index]
}

</script>

<style>
.house-info-card {
    width: 380px;
    min-height: 430px;
    display: inline-block;
    box-sizing: border-box;
}
</style>