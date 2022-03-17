import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import nprogress from 'nprogress'
import store from "@/store"
// import { routes } from './routes.js'

// Components
import Home from "../views/Home.vue"
// const Home = () => import("../views/Home.vue")
const About = () => import("../views/About.vue")
const NotFound = () => import('../views/error/NotFound.vue')
const NoPermission = () => import('../views/error/NoPermission.vue')
const Login = () => import('../views/user/Login.vue')

// const whiteList = ['/login', '/auth-redirect']
const whiteList = ['/login', '/register', '/404', '/403'] // 不重定向白名单

nprogress.configure({ showSpinner: false })

/** @type {import('vue-router').RouterOptions['routes']} */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "首页",
      roles: ["admin", "user"]
    }
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: "关于",
      roles: ["admin"]
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "登录",
    }
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404 网页不存在",
    }
  },
  {
    path: "/403",
    name: "NoPermission",
    component: NoPermission,
    meta: {
      title: "403 无权访问",
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router guards
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  // 检查用户角色
  const requiredRoles: any = to.meta.roles
  const currentRole = store.getters.getUserRole
  if (currentRole === '' && whiteList.indexOf(to.path) === -1) {
      // 用户未登录，且页面不在不重定向白名单中，重定向到登录页
      next('/login')
  } else if (to.matched.length === 0) {
      // 用户已登录，路由不存在无法跳转，重定向到404页面
      next('/404')
  } else if (requiredRoles && requiredRoles.indexOf(currentRole) === -1) {
      // 用户已登录，路由存在但无权限无法跳转，重定向到403页面
      next('/403')
  } else {
      next()
  }
  if (to.meta.title) {
      document.title = `${to.meta.title} - ${process.env.VUE_APP_TITLE}`
  } else {
      document.title = "合租房管理系统"//没有就默认
  }

})

router.afterEach(() => {
  nprogress.done()
})

export default router;