<template>
    <h1 class="top-title-text text-4xl my-5 pl-4 relative">
        <!-- <span>{{ keyword[0] }}</span> -->
        <span>用户管理</span>
    </h1>
    <div class="func-container flex flex-col w-full">
        <div class="admins__manage grid grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-10 px-10 py-5">
            <div class="admins__grant-wrap col-span-2">
                <span class="text-lg font-bold">用户提权</span>
                <div class="flex flex-row justify-center items-center">
                    <el-input
                        class="admins__user-input my-5"
                        size="large"
                        placeholder="用户ID"
                        v-model="inputAddAdmin"
                        clearable
                    ></el-input>
                    <el-popover :visible="popupAddAdmin" placement="bottom" width="200">
                        <span>
                            <p>
                                在进行管理员提权/降权操作时需要
                                <strong class="text-red-500">十分谨慎</strong>，
                            </p>
                            <p class="mt-1">请检查输入的用户id，并确认是否添加管理员！</p>
                        </span>
                        <div class="popover-btns text-right mx-0 mt-5">
                            <el-button size="small" type="primary" @click="popupAddAdmin = false">取消</el-button>
                            <el-button type="text" size="small" @click="onBtnAddAdminClick">确认添加</el-button>
                        </div>
                        <template #reference>
                            <el-button
                                class="admins__user-btn mx-8"
                                type="primary"
                                size="large"
                                @click="popupAddAdmin = true"
                            >提权</el-button>
                        </template>
                    </el-popover>
                </div>
            </div>
            <div class="admins__remove-wrap col-span-2">
                <span class="text-lg font-bold">管理降权</span>
                <div class="flex flex-row justify-center items-center">
                    <el-input
                        class="admins__user-input my-5"
                        size="large"
                        placeholder="用户ID"
                        v-model="inputDelAdmin"
                        clearable
                    ></el-input>
                    <el-popover :visible="popupDelAdmin" placement="bottom" width="200">
                        <span>
                            <p>
                                在进行管理员提权/降权操作时需要
                                <strong class="text-red-500">十分谨慎</strong>，
                            </p>
                            <p class="mt-1">请检查输入的用户id，并确认是否添加管理员！</p>
                        </span>
                        <div class="popover-btns text-right mx-0 mt-5">
                            <el-button size="small" type="primary" @click="popupDelAdmin = false">取消</el-button>
                            <el-button type="text" size="small" @click="onBtnDelAdminClick">确认添加</el-button>
                        </div>
                        <template #reference>
                            <el-button
                                class="admins__user-btn mx-8"
                                type="danger"
                                size="large"
                                @click="popupDelAdmin = true"
                            >降权</el-button>
                        </template>
                    </el-popover>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import NotificationUtil, { msgType } from "@/utils/NotificationUtil";
import RequestUtil from "@/utils/RequestUtil";
import { ref } from 'vue'

let inputAddAdmin = ref('');
let inputDelAdmin = ref('');
let btnAddLoading = ref(false);
let btnDelLoading = ref(false);
let popupAddAdmin = ref(false);
let popupDelAdmin = ref(false);

/**
 * @function onBtnAddAdminClick
 * @description 点击提权按钮
 * @TODO 处理后台返回response
 */
const onBtnAddAdminClick = async () => {
    btnAddLoading.value = true;

    await RequestUtil.getAddAdmin(inputAddAdmin.value)
        .then(res => {
            if (res.success) {
                NotificationUtil.Notify('添加管理员成功！', {type: msgType.SUCCESS});
                inputAddAdmin.value = '';
            }
        })
        .catch(err => {
            NotificationUtil.Notify(err.toString(), { type: msgType.ERROR, title: '错误' })
        })
        .finally(() => {
            btnAddLoading.value = false;
            popupAddAdmin.value = false;
        })

    // await RequestUtil.getAddAdmin()
}

/**
 * @function onBtnDelAdminClick
 * @description 点击降权按钮
 * @TODO 处理后台返回response
 */
const onBtnDelAdminClick = async () => {
    btnDelLoading.value = true;

    await RequestUtil.getDelAdmin(inputDelAdmin.value)
        .then(res => {
            if (res.success) {
                NotificationUtil.Notify('删除管理员成功！', {type: msgType.SUCCESS});
                inputDelAdmin.value = '';
            }
        })
        .catch(err => {
            NotificationUtil.Notify(err.toString(), { type: msgType.ERROR, title: '错误' })
        })
        .finally(() => {
            btnDelLoading.value = false;
            popupDelAdmin.value = false;
        })

}
</script>

<style>
.admins__user-btn {
    margin-left: 10px;
}
</style>