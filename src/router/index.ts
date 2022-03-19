import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import nprogress from 'nprogress'
import store from "@/store"
// import { routes } from './routes.js'

// Components
import Home from "@/views/Home.vue"
// const Home = () => import("../views/Home.vue")
const About = () => import("@/views/About.vue")
const Admin = () => import('@/views/admin/index.vue')
const NotFound = () => import('@/views/error/NotFound.vue')
const NoPermission = () => import('@/views/error/NoPermission.vue')
const Login = () => import('@/views/user/Login.vue')
const SignUp = () => import('@/views/user/SignUp.vue')
const Query = () => import('@/views/query/index.vue')

// const whiteList = ['/login', '/auth-redirect']
const whiteList = ['/login', '/signup', '/404', '/403'] // 未登录不重定向白名单
const redirectList = ['/login', '/register'] // 已登录重定向名单

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
    path: "/search/:keyword",
    name: "Query",
    component: Query,
    meta: {
      title: "房源查询",
      roles: ["admin", "user"]
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      title: "管理后台",
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
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      title: "注册",
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

const titleHandler = (to: any) => {

  if (to.meta.title) {
    if (to.name === "Query") {
      const keyword = JSON.parse(decodeURI(to.params.keyword))
      document.title = `${keyword[1] + keyword[2]}房源信息 - ${store.state.app.title}`
    } else {
      document.title = `${to.meta.title} - ${store.state.app.title}`
    }
  } else {
    document.title = "合租房管理系统"//没有就默认
  }
}

// router guards
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  // 检查用户角色
  const requiredRoles: any = to.meta.roles
  const currentRole = store.getters.getUserRole
  if (currentRole === '' && whiteList.indexOf(to.path) === -1) {
    // 用户未登录，且页面不在不重定向白名单中，重定向到登录页
    titleHandler(to)
    next('/login')
  } else if (to.matched.length === 0) {
    // 用户已登录，路由不存在无法跳转，重定向到404页面
    titleHandler(to)
    next('/404')
  } else if (requiredRoles && requiredRoles.indexOf(currentRole) === -1) {
    // 用户已登录，路由存在但无权限无法跳转，重定向到403页面
    titleHandler(to)
    next('/403')
  } else if (currentRole !== '' && redirectList.indexOf(to.path) !== -1) {
    // 用户已登录，不允许访问登录页和注册页
    titleHandler(to)
    next('/')
  } else {
    // 用户已登录，正常访问网页
    titleHandler(to)
    next()
  }

})

router.afterEach(() => {
  nprogress.done()
})

export default router;
