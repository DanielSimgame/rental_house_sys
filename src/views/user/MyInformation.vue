<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <el-form class="col-span-1" v-model="userInfoForm" label-width="100px">
      <el-divider content-position="left">账号</el-divider>
      <el-form-item label="账号ID">
        <el-input
            v-model="pageData.userIdReadonly"
            readonly
            title="账号ID用于辨别用户身份">
        </el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
            v-model="pageData.usernameReadonly"
            title="用户名作为您的登录凭据，不可更改"
            readonly
            disabled>
        </el-input>
      </el-form-item>
      <el-form-item label="身份">
        <span>{{ userInfoForm.role === 1 ? "管理员" : "用户" }}</span>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userInfoForm.name" @change="pageData.changeFlag = true"></el-input>
      </el-form-item>
      <el-divider content-position="left">个人信息</el-divider>
      <el-form-item label="个人简介">
        <el-input v-model="userInfoForm.detail" @change="pageData.changeFlag = true"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfoForm.email" @change="pageData.changeFlag = true"></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="userInfoForm.phone" @change="pageData.changeFlag = true"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfoForm.gender" @change="pageData.changeFlag = true">
          <el-radio label="男"/>
          <el-radio label="女"/>
        </el-radio-group>
      </el-form-item>
      <div class="w-full flex justify-center">
        <el-button class="w-1/4" @click="onSubmitClick" type="primary">保存资料</el-button>
      </div>
    </el-form>

    <div class="flex-col">
      <el-divider content-position="left">头像</el-divider>
      <div class="p-5 flex flex-row justify-around">
        <div class="current-portrait justify-center w-fit">
          <div class="mb-2 w-full flex justify-center">
            <span class="text-center">当前头像</span>
          </div>
          <div class="flex">
            <el-image
                class="w-24 h-24"
                :src="userInfoForm.portrait"
                fit="cover">
            </el-image>
            <el-image
                class="w-24 h-24 ml-2 rounded-full"
                :src="userInfoForm.portrait"
                fit="cover">
            </el-image>
          </div>
        </div>
        <div class="new-portrait justify-center w-fit">
          <div class="mb-2 w-full flex justify-center">
            <span class="text-center">新头像</span>
          </div>
          <div class="flex">
            <form id="imgInput">
              <input
                  style="height: 96px;"
                  type="file"
                  accept="image/*"
                  @change="handlePortraitChange"/>
            </form>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <el-button class="w-1/4" @click="onUploadClick" type="primary">上传头像</el-button>
      </div>
    </div>

  </div>
</template>

<script setup>
import RequestUtil from "@/utils/RequestUtil"
import {onMounted, reactive, watch} from "vue"
import {useStore} from "vuex"
import Notification from "@/utils/basic/Notification"

const store = useStore()

let userInfoForm = reactive({
  detail: "",
  email: "",
  gender: "",
  id: "",
  name: "",
  phone: "",
  portrait: "",
  role: 0,
  username: ""
})

let pageData = reactive({
  changeFlag: false,
  usernameReadonly: "",
  userIdReadonly: ""
})

let fileData = null

const handlePortraitChange = (event) => {
  // console.log('handlePortraitChange', arg)
  pageData.changeFlag = true
  try {
    fileData.append('file', event.target.files[0])
  } catch (e) {
    Notification.Notify(e.message, {
      type: "error",
      title: "出错了"
    })
  }
}

const beforeAvatarUpload = (rawFile) => {
  const allowedType = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
  if (!allowedType.includes(rawFile.get('file').type)) {
    Notification.Notify('上传图片格式不正确，只能上传jpg、jpeg、png、bmp格式的图片', {
      type: "error",
      title: "出错了"
    })
    return false
  } else if (rawFile.get('file').size / 1024 / 1024 > 2) {
    Notification.Notify("图片大小不能超过2MB", {
      title: '错误',
      type: 'error'
    })
    return false
  }
  return true
}

const userInfoChange = () => {
  RequestUtil.postUserUpdate(userInfoForm)
      .then((res) => {
        if (res.ok) {
          Notification.Notify("个人信息修改成功", {
            title: '成功',
            type: 'success'
          })
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          Notification.Notify(res.message, {
            title: '个人信息修改出错',
            type: 'error'
          })
        }
      })
      .catch((err) => {
        Notification.Notify(err.message, {
          type: "error",
          title: "网络繁忙"
        })
      })
}

const onUploadClick = () => {
  if (beforeAvatarUpload(fileData)) {
    RequestUtil.postImage(fileData)
        .then((res) => {
          if (res.ok) {
            return res.text()
          } else {
            Notification.Notify(res.message, {
              title: '上传图片出错了',
              type: 'error'
            })
            return Promise.reject(res.message)
          }
        })
        .then((url) => {
          userInfoForm.portrait = url
          userInfoChange()
        })
        .catch((err) => {
          Notification.Notify(err.message, {
            type: "error",
            title: "出错了"
          })
        })
  }
}

const isFormValid = (form) => form.name && form.email && form.phone && form.gender && pageData.changeFlag

const onSubmitClick = () => {
  isFormValid(userInfoForm) ? userInfoChange() : Notification.Notify('请修改个人信息后再做提交，或者检查个人信息格式是否有误。', {
    type: "warning",
    title: "警告"
  })
}

/**
 * @function applyUserInfo
 * @description 初始化用户信息
 */
const applyUserInfo = (userInfo) => {
  userInfoForm.detail = userInfo.detail
  userInfoForm.email = userInfo.email
  userInfoForm.gender = userInfo.gender
  userInfoForm.id = userInfo.id
  userInfoForm.name = userInfo.name
  userInfoForm.phone = userInfo.phone
  userInfoForm.portrait = userInfo.portrait
  userInfoForm.role = userInfo.role
  userInfoForm.username = userInfo.username
  pageData.usernameReadonly = userInfo.username
  pageData.userIdReadonly = userInfo.id
}

onMounted(() => {
  fileData = new FormData()
  if (store.getters.getUserInfo.id !== "") {
    applyUserInfo(store.getters.getUserInfo)
  }
})

watch(() => store.getters.getUserInfo, (newVal) => {
  if (newVal.id !== "") {
    applyUserInfo(newVal)
  }
})
</script>

<style lang="scss" scoped>
</style>
