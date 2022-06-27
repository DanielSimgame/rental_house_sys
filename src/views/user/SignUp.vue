<template>
  <div
      class="signup-bg my-0 px-4 sm:px-6 flex flex-col md:justify-center lg:items-center lg:justify-center lg:py-16 lg:px-8"
  >
    <div class="signup-container w-96 h-fit bg-white p-6 mx-auto my-0">
      <el-form v-model="signupForm.value" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="signupForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
              v-model="signupForm.password"
              placeholder="请输入密码"
              type="password"
              show-password
              @blur="onInputPasswordBlur"
          ></el-input>
          <transition name="el-zoom-in-top">
            <div
                class="password-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                v-if="!isPasswordLegal && errorTips.passwordMsg !== ''"
            >
              <span>{{ errorTips.passwordMsg }}</span>
            </div>
          </transition>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
              v-model="confirmPassword"
              placeholder="请再次确认密码"
              type="password"
              show-password
              @blur="onInputConfirmPasswordBlur"
          ></el-input>
          <transition name="el-zoom-in-top">
            <div
                class="password-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                v-if="!arePasswordsEqual"
            >
              <span>{{ errorTips.repeatPwMsg }}</span>
            </div>
          </transition>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
              v-model="signupForm.phone"
              @blur="onInputPhoneBlur"
              placeholder="请输入手机号"
          ></el-input>
          <transition name="el-zoom-in-top">
            <div
                class="phone-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                v-if="!isPhoneAvailable && errorTips.phoneMsg !== ''"
            >
              <p>{{ errorTips.phoneMsg }}</p>
            </div>
          </transition>
        </el-form-item>
        <el-form-item label="Email">
          <el-input
              v-model="signupForm.email"
              @blur="onInputEmailBlur"
              placeholder="请输入邮箱"
          ></el-input>
          <transition name="el-zoom-in-top">
            <div
                class="phone-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                v-if="!isEmailAvailable && errorTips.emailMsg !== ''"
            >
              <p>{{ errorTips.emailMsg }}</p>
            </div>
          </transition>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="signupForm.gender" label="女">女</el-radio>
          <el-radio v-model="signupForm.gender" label="男">男</el-radio>
        </el-form-item>
      </el-form>
    </div>
    <div
        class="signup-container w-96 flex flex-col justify-center bg-white items-center p-6 mt-4 mx-auto"
    >
      <el-checkbox v-model="eulaAgreed">
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
      <el-button type="primary" class="w-full" @click="onSubmitClick" :loading="loading">注册</el-button>
      <transition name="el-zoom-in-top">
        <div
            class="phone-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
            v-if="errorTips.eulaMsg !== ''"
        >
          <p>{{ errorTips.eulaMsg }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import store from '@/store';
import RequestUtil from '@/utils/RequestUtil';
import User from '@/utils/User';
import Notification, {msgType} from '@/utils/basic/Notification';
import {goHome} from '@/utils/RouterUtil';

const SIGNUP_ERRORS = {
  USERNAME_EXISTS: '用户名已存在',
  PHONE_EXISTS: '这个手机号码已被使用，\n请尝试直接登录或者更换手机号。',
  PHONE_INVALID: '手机号码格式不正确',
  EMAIL_EXISTS: '这个电子邮箱已被使用，\n请尝试直接登录或者更换电子邮箱。',
  EMAIL_INVALID: '电子邮箱格式不正确',
  PASSWORD_LENGTH_ERROR: '密码长度不能小于6位或大于20位',
  PASSWORD_NOT_EQUAL: '两次输入密码必须一致',
  EULA_NOT_AGREED: '您还没有同意用户协议与隐私协议',
}

let errorTips = reactive({
  phoneMsg: '',
  emailMsg: '',
  passwordMsg: '',
  repeatPwMsg: '',
  eulaMsg: ''
})

// 注册表单
let signupForm = reactive({
  email: "",
  name: "",
  gender: "",
  password: "",
  phone: "",
  portrait: null,
  role: 0,
  username: ""
})
let loading = ref(false)
let confirmPassword = ref("")
let isPasswordLegal = ref(true)
let arePasswordsEqual = ref(true)
let isPhoneAvailable = ref(true)
let isEmailAvailable = ref(true)
let eulaAgreed = ref(false)

/**
 * @function phoneValidate
 * @description 检查手机号码是否合法
 * @returns {boolean}
 * */
const phoneValidate = () => {
  return /^1[3456789]\d{9}$/.test(signupForm.phone)
}

/**
 * @function onInputPhoneBlur
 * @description 手机号输入框失去焦点时触发
 */
const onInputPhoneBlur = async () => {
  const phone = signupForm.phone
  let val = phoneValidate()
  // if (phone.length === 11 && phone.startsWith('1')) {
  if (val) {
    RequestUtil.getPhoneAvailability(phone)
        .then(res => {
          if (res === "true") {
            val = true
          } else {
            val = false
            errorTips.phoneMsg = SIGNUP_ERRORS.PHONE_EXISTS
          }
          isPhoneAvailable.value = val
        })
  } else {
    errorTips.phoneMsg = SIGNUP_ERRORS.PHONE_INVALID
    isPhoneAvailable.value = val
  }
}

/**
 * @function emailValidate
 * @description 邮箱格式验证
 * @returns {boolean}
 */
const emailValidate = () => {
  return (signupForm.email.includes("@") && signupForm.email.includes("."))
}

/**
 * @function onInputEmailBlur
 * @description email输入框失去焦点时触发
 */
const onInputEmailBlur = () => {
  const email = signupForm.email
  let val = emailValidate()
  // 邮箱输入框包含@与.的情况下，视为正确
  if (val) {
    RequestUtil.getEmailAvailability(email)
        .then(res => {
          if (res === "true") {
            val = true
          } else {
            val = false
            errorTips.emailMsg = SIGNUP_ERRORS.EMAIL_EXISTS
          }
          isEmailAvailable.value = val
        })
  } else {
    errorTips.emailMsg = SIGNUP_ERRORS.EMAIL_INVALID
    isEmailAvailable.value = val
  }
}

/**
 * @function inputPasswordValidate
 * @description 密码输入框密码合法性校验
 * @returns {boolean}
 * */
const inputPasswordValidate = () => {
  return (signupForm.password.length >= 6 && signupForm.password.length <= 20)
}

/**
 * @function onInputPasswordBlur
 * @description password输入框失去焦点时触发,检查密码是否合法
 */
const onInputPasswordBlur = () => {
  let val = inputPasswordValidate()
  if (!val) {
    errorTips.passwordMsg = SIGNUP_ERRORS.PASSWORD_LENGTH_ERROR
  }
  isPasswordLegal.value = val
  if (confirmPassword.value !== '') {
    onInputConfirmPasswordBlur()
  }
}

/**
 * @function confirmPasswordValidate
 * @description 检查两次输入的密码是否一致
 * @returns {boolean}
 * */
const confirmPasswordValidate = () => {
  if (confirmPassword.value !== '') {
    return  confirmPassword.value === signupForm.password
  }
  return false
}

/**
 * @function onInputConfirmPasswordBlur
 * @description confirm password输入框失去焦点时触发,检查密码是否合法
 */
const onInputConfirmPasswordBlur = () => {
  let val = confirmPasswordValidate()
  if (!val) {
    errorTips.repeatPwMsg = SIGNUP_ERRORS.PASSWORD_NOT_EQUAL
  }
  arePasswordsEqual.value = val
}

/**
 * @function onSubmitClick
 * @description 注册按钮点击事件
 */
const onSubmitClick = async () => {

  // check if all fields are filled
  if (signupForm.email === '' || signupForm.username === '' || signupForm.password === '' || signupForm.phone === '' || signupForm.gender === '') {
    Notification.Notify("请完善注册信息", {
      type: msgType.ERROR,
      title: '错误'
    })
    return
  }

  if (eulaAgreed.value) {
    loading.value = true
    signupForm.name = signupForm.username
    await RequestUtil.postSignUp(signupForm)
        .then(r => {
          loading.value = false
          if (r.isLogin) {
            Notification.Notify('注册成功，正在跳转到主页面', {title: '注册成功', type: msgType.SUCCESS})
            User.setToken(r.token)
            if (r.isAdmin) {
              User.setRole('admin')
            } else {
              User.setRole('user')
            }
            RequestUtil.getUserInfo(r.token)
                .then(r => {
                  store.commit('setUserRole', r.role === 1 ? 'admin' : 'user')
                  store.commit('setUserInfo', r)
                  goHome()
                })
          } else {
            Notification.Notify('注册出错，请重试。若反复出现请联系网站管理员。', {
              title: '注册失败',
              type: msgType.ERROR,
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
  } else {
    errorTips.eulaMsg = SIGNUP_ERRORS.EULA_NOT_AGREED
  }
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
.signup-bg {
  height: 600px;
  background-image: url("@/assets/images/bg_login.jpeg");
  background-size: auto;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
