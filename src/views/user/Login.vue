<template>
  <div class="bg-gray-50">
    <div
        class="login-bg my-0 px-4 py-12 sm:px-6 lg:flex
      lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="lg:container h-80 relative">
        <div class="login-slogan absolute left-60 top-0.5">
          <h1 class="login-slogan-text text-9xl text-white shadow-2xl">
            <p class="text-left">放心租</p>
            <p class="text-right mt-1.5 ml-10">安心住</p>
          </h1>
        </div>
        <div class="login-container absolute right-2 top-30 w-96 h-80 bg-white p-6">
          <el-tabs v-model="loginMethod">
            <el-tab-pane label="账号密码登录" name="account">

            </el-tab-pane>
            <el-tab-pane name="captcha" disabled>
              <template #label>
                <el-tooltip
                    class="tooltips-item"
                    effect="dark"
                    :content="disabledMsg"
                    placement="top">
                  手机验证码登录
                </el-tooltip>
              </template>
            </el-tab-pane>
          </el-tabs>
          <el-form v-model="loginForm.value" label-width="60px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="onLoginClick" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="login-submit flex-row justify-between min-w-full">
                <el-tooltip
                    class="tooltips-item"
                    effect="dark"
                    content="请先同意《用户协议》与《个人隐私条例》"
                    placement="bottom"
                    :visible="loginBtnDisabled">
                  <el-button
                      type="primary"
                      size="large"
                      class="w-44"
                      @click="onLoginClick"
                      :disabled="loginBtnDisabled"
                      :loading="loading">
                    登录
                  </el-button>
                </el-tooltip>
                <el-button size="large" class="w-20" @click="onLoginClick">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="mt-12">
            <el-checkbox
                v-model="eulaAgreed"
                @change="onEulaChange">
              我已阅读并同意
              <el-button
                  class="login__btn-eula"
                  size="small"
                  type="text"
                  @click="onEulaClick">
                《用户协议》
              </el-button>
              与
              <el-button
                  class="login__btn-privacy"
                  size="small"
                  type="text"
                  style="margin-left: 0"
                  @click="onPrivacyClick">
                《个人隐私协议》
              </el-button>
              。
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import RequestUtil from "@/utils/RequestUtil";
import RouterUtil from "@/utils/RouterUtil";
import NotificationUtil, {msgType} from "@/utils/NotificationUtil";
import User from "@/utils/User";

const disabledMsg = ref('手机验证码登录暂停使用，请使用账号密码登录')
let loginMethod = ref('account')
let eulaAgreed = ref(false)
let loginBtnDisabled = ref(true)
let loading = ref(false)
let loginForm = reactive({
  username: '',
  password: '',
})

/**
 * @function onLoginClick
 * @description 登录按钮点击事件
 * */
const onLoginClick = async () => {
  if (eulaAgreed.value === false) {
    return
  }
  loading.value = true
  await RequestUtil.postLogin(loginForm)
      .then(r => {
        loading.value = false
        if (r.isLogin) {
          User.setToken(r.token)
          if (r.isAdmin) {
            User.setRole('admin')
          } else {
            User.setRole('user')
          }
          RouterUtil.goHome()
        } else {
          NotificationUtil.Notify('请检查您的账号密码', {
            title: '登录失败',
            type: msgType.ERROR,
          })
        }
      })
}

/**
 * @function onEulaChange
 * @description 同意用户协议按钮点击事件
 * */
const onEulaChange = () => {
  loginBtnDisabled.value = !eulaAgreed.value
}

/**
 * @function onEulaClick
 * @description 用户协议按钮点击事件
 * */
const onEulaClick = () => {
  this.$router.push('/user/eula')
}

/**
 * @function onPrivacyClick
 * @description 隐私政策按钮点击事件
 * */
const onPrivacyClick = () => {
  this.$router.push('/user/privacy')
}
</script>

<style>
.login-bg {
  height: 600px;
  background-image: url("@/assets/images/bg_login.jpeg");
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
}

.login-slogan-text {
  font-weight: bold;
  font-style: italic;
}

.login-submit {
  display: flex !important;
  flex-direction: row;
}
</style>
