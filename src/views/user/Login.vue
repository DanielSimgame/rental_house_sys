<template>
  <div class="bg-gray-50">
    <div
        class="login-bg my-0 px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="lg:container h-80 relative">
        <div class="login-slogan absolute lg:left-60 md:left-10 top-0.5">
          <h1 class="login-slogan-text text-9xl text-white shadow-2xl">
            <p class="text-left">放心租</p>
            <p class="text-right mt-1.5 ml-10">安心住</p>
          </h1>
        </div>
        <div class="login-container absolute right-2 top-30 w-96 h-80 bg-white p-6">
          <el-tabs v-model="loginMethod">
            <el-tab-pane label="账号密码登录" name="account"></el-tab-pane>
            <el-tab-pane name="captcha" disabled>
              <template #label>
                <el-tooltip
                    class="tooltips-item"
                    effect="dark"
                    :content="disabledMsg"
                    placement="top"
                >手机验证码登录
                </el-tooltip>
              </template>
            </el-tab-pane>
          </el-tabs>
          <el-form v-model="loginForm.value" label-width="60px">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                  @keyup.enter="onLoginClick"
                  type="password"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="login-submit flex-row justify-between min-w-full">
                <el-tooltip
                    class="tooltips-item"
                    effect="dark"
                    content="请先同意《用户协议》与《个人隐私条例》"
                    placement="bottom"
                    :visible="loginBtnDisabled"
                >
                  <el-button
                      type="primary"
                      size="large"
                      class="w-44"
                      @click="onLoginClick"
                      :disabled="loginBtnDisabled"
                      :loading="loading"
                  >登录
                  </el-button>
                </el-tooltip>
                <el-button size="large" class="w-20" @click="onSignupClick">注册</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="mt-12">
            <el-checkbox v-model="eulaAgreed" @change="onEulaChange">
              我已阅读并同意
              <el-button
                  class="login__btn-eula"
                  size="small"
                  type="text"
                  @click="onEulaClick"
              >《用户协议》
              </el-button>
              与
              <el-button
                  class="login__btn-privacy"
                  size="small"
                  type="text"
                  style="margin-left: 0"
                  @click="onPrivacyClick"
              >《个人隐私协议》
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
// import store from "@/store";
import {useStore} from "vuex";
import RequestUtil from "@/utils/RequestUtil";
import {goHome, goSignup} from "@/utils/RouterUtil";
import Notification, {msgType} from "@/utils/basic/Notification";
import User from "@/utils/User";

const store = useStore()

const disabledMsg = ref('手机验证码登录未开放，请使用账号密码登录')
let loginMethod = ref('account')
let eulaAgreed = ref(false)
let loginBtnDisabled = ref(true)
let loading = ref(false)
let loginForm = reactive({
  username: '',
  password: '',
})

/**
 * @function loginValidator
 * @description 校验登录表单
 * @returns {boolean}
 * */
const loginValidator = () => {
  if (!eulaAgreed.value) {
    return false
  }
  if (loginForm.username.length === 0) {
    Notification.Notify('用户名不能为空', {
      title: '提示',
      type: msgType.ERROR,
    })
    return false
  }
  // if loginForm.username includes any special character like !@#$%^&*() or non-ASCII character, return false
  if (/[^\x00-\xff]/.test(loginForm.username) || /[^a-zA-Z0-9]/.test(loginForm.username)) {
    Notification.Notify('用户名不能包含特殊字符', {
      title: '提示',
      type: msgType.ERROR,
    })
    return false
  }
  if (loginForm.password.length === 0) {
    Notification.Notify('密码不能为空', {
      title: '提示',
      type: msgType.ERROR,
    })
    return false
  }
  if (loginForm.password.length < 6 || loginForm.password.length > 20) {
    Notification.Notify('密码长度不能小于6位或大于20位', {
      title: '提示',
      type: msgType.ERROR,
    })
    return false
  }
  return true
}

/**
 * @function onLoginClick
 * @description 登录按钮点击事件
 * */
const onLoginClick = async () => {
  if (!loginValidator()) {
    return
  }
  loading.value = true
  let userRole = ''
  await RequestUtil.postLogin(loginForm)
      .then(r => {
        if (r.isLogin) {
          userRole = r.isAdmin ? 'admin' : 'user'
          User.setRole(userRole)
          User.setToken(r.token)
          return r
        } else {
          Notification.Notify('请检查您的账号密码', {
            title: '登录失败',
            type: msgType.ERROR,
          })
        }
      })
      .then((res) => {
        if (res !== undefined) {
          console.log(res)
          return RequestUtil.getUserInfo(res.token)
        }
      })
      .then(r => {
        if (r !== undefined) {
          store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
          store.commit('setUserInfo', r)
          goHome()
        }
      })
      .catch(err => {
        console.log(err)
        Notification.Notify('登录失败！', {title: '错误', type: msgType.ERROR})
      })
      .finally(() => {
        loading.value = false
      })
}

/**
 * @function onSignupClick
 * @description 注册按钮点击事件
 */
const onSignupClick = () => {
  goSignup()
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
  background-size: auto;
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
