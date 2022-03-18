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
                        @blur="checkPassword"
                    ></el-input>
                    <transition name="el-zoom-in-top">
                        <div
                            class="password-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                            v-if="isPasswordIllegal"
                        >
                            <span>密码长度不能小于6位或大于16位</span>
                        </div>
                    </transition>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input
                        v-model="confirmPassword"
                        placeholder="请再次确认密码"
                        type="password"
                        show-password
                        @blur="checkPassword"
                    ></el-input>
                    <transition name="el-zoom-in-top">
                        <div
                            class="password-illegal w-full mt-2 text-center rounded-lg border-5 bg-red-400 text-white"
                            v-if="!arePasswordsEqual"
                        >
                            <span>两次输入密码必须一致</span>
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
                            v-if="!isPhoneAvailable"
                        >
                            <p>这个手机号码已被使用，</p>
                            <p>请尝试直接登录或者更换手机号。</p>
                        </div>
                    </transition>
                </el-form-item>
                <el-form-item label="Email">
                    <el-input
                        v-model="signupForm.email"
                        @blur="onInputEmailBlur"
                        placeholder="请输入邮箱"
                    ></el-input>
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
                >《用户协议》</el-button>与
                <el-button
                    class="login__btn-privacy"
                    size="small"
                    type="text"
                    style="margin-left: 0"
                    @click="onPrivacyClick"
                >《个人隐私协议》</el-button>。
            </el-checkbox>
            <el-button type="primary" class="w-full" @click="onSignupSubmit" :loading="loading">注册</el-button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import store from '@/store';
import RequestUtil from '@/utils/RequestUtil';
import User from '@/utils/User';
import NotificationUtil from '@/utils/NotificationUtil';
import RouterUtil from '@/utils/RouterUtil';

// 登陆表单
let signupForm = reactive({
    email: "",
    name: "",
    password: "",
    phone: "",
    portrait: "",
    role: 0,
    username: ""
})
let loading = ref(false)
let confirmPassword = ref("")
let isPasswordIllegal = ref(false)
let arePasswordsEqual = ref(true)
let isPhoneAvailable = ref(true)
let isEmailAvailable = ref(true)
let eulaAgreed = ref(false)

onMounted(() => {
    signupForm.portrait = store.getters.getDefaultAvatar
})

/**
 * @function onInputPhoneBlur
 * @description 手机号输入框失去焦点时触发
 */
const onInputPhoneBlur = async () => {
    const phone = signupForm.phone
    RequestUtil.getPhoneAvailability(phone)
        .then(res => {
            if (res.status === 200) {
                isPhoneAvailable.value = true
            } else {
                isPhoneAvailable.value = false
            }
        })
}
/**
 * @function onInputEmailBlur
 * @description email输入框失去焦点时触发
 */
const onInputEmailBlur = () => {
    const email = signupForm.email
    RequestUtil.getEmailAvailability(email)
        .then(res => {
            if (res.status === 200) {
                isEmailAvailable.value = true
            } else {
                isEmailAvailable.value = false
            }
        })
}

/**
 * @function checkPassword
 * @description 检查密码是否合法
 */
const checkPassword = () => {
    if (signupForm.password.length < 6 || signupForm.password.length > 16) {
        isPasswordIllegal.value = true
    } else {
        isPasswordIllegal.value = false
    }
    if (confirmPassword.value !== signupForm.password) {
        arePasswordsEqual.value = false
    } else {
        arePasswordsEqual.value = true
    }
}

/**
 * @function onSignupSubmit
 * @description 注册按钮点击事件
 */
const onSignupSubmit = async () => {
    loading.value = true
    signupForm.name = signupForm.username
    await RequestUtil.postSignUp(signupForm)
        .then(r => {
            loading.value = false
            if (r.isLogin) {
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
                        RouterUtil.goHome()
                    })
            } else {
                NotificationUtil.Notify('注册出错，请重试。若反复出现请联系网站管理员。', {
                    title: '注册失败',
                    type: msgType.ERROR,
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
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