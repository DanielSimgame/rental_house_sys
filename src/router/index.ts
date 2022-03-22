import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import nprogress from 'nprogress'
import store from "@/store"
import User from "@/utils/User"
// import { routes } from './routes.js'
import RequestUtil from "@/utils/RequestUtil"

// Components
import Home from "@/views/Home.vue"
// const Home = () => import("../views/Home.vue")
const About = () => import("@/views/About.vue")
const Query = () => import('@/views/query/index.vue')

// 权限相关
const NotFound = () => import('@/views/error/NotFound.vue')
const NoPermission = () => import('@/views/error/NoPermission.vue')
const Login = () => import('@/views/user/Login.vue')
const SignUp = () => import('@/views/user/SignUp.vue')

// 房源信息页面
const NewHouse = () => import('@/views/house/NewHouse.vue')
const HouseDetail = () => import('@/views/house/HouseDetail.vue')
// 房源编辑属于特殊组件，同时位于Admin与User面板中
const HouseEdit = () => import('@/views/house/HouseEdit.vue')

// 管理面板与次级路由
const Admin = () => import('@/views/admin/Layout.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminSettings = () => import('@/views/admin/Settings.vue')
const AdminUsers = () => import('@/views/admin/Users.vue')

// 用户个人中心与次级路由
const UserPanel = () => import('@/views/user/index.vue')
const UserRentIn = () => import('@/views/user/MyRentIn.vue')
const UserRentOut = () => import('@/views/user/MyRentOut.vue')
const UserInformation = () => import('@/views/user/MyInformation.vue')

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
    path: "/search",
    // path: "/search/:keyword&page=:page",
    name: "Query",
    component: Query,
    meta: {
      title: "房源查询",
      roles: ["admin", "user"]
    }
  },
  {
    path: "/house/new",
    name: "NewHouse",
    component: NewHouse,
    meta: {
      title: "发布房源",
      roles: ["admin", "user"],
    }
  },
  {
    path: "/house/detail",
    name: "HouseDetail",
    component: HouseDetail,
    meta: {
      title: "房源详情",
      roles: ["admin", "user"],
    }
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    meta: {
      title: "管理面板",
      roles: ["admin"]
    },
    children: [
      {
        path: "/admin/dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
        meta: {
          title: "管理面板",
          roles: ["admin"]
        }
      },
      {
        path: "/admin/users",
        name: "AdminUsers",
        component: AdminUsers,
        meta: {
          title: "用户管理",
          roles: ["admin"]
        }
      },
      {
        path: "/admin/settings",
        name: "AdminSettings",
        component: AdminSettings,
        meta: {
          title: "后台设置",
          roles: ["admin"]
        }
      },
      {
        path: "/admin/houseedit",
        name: "AdminHouseEdit",
        component: HouseEdit,
        meta: {
          title: "管理员房源编辑",
          roles: ["admin"],
        }
      },
    ]
  },
  {
    path: "/user",
    name: "User",
    component: UserPanel,
    meta: {
      title: "个人中心",
      roles: ["admin", "user"]
    },
    children: [
      {
        path: "/user/information",
        name: "UserInformation",
        component: UserInformation,
        meta: {
          title: "个人中心",
          roles: ["admin", "user"]
        },
      },
      {
        path: "/user/rentin",
        name: "UserRentIn",
        component: UserRentIn,
        meta: {
          title: "个人中心",
          roles: ["admin", "user"]
        },
      },
      {
        path: "/user/rentout",
        name: "UserRentOut",
        component: UserRentOut,
        meta: {
          title: "个人中心",
          roles: ["admin", "user"]
        },
      },
      {
        path: "/user/houseedit",
        name: "UserHouseEdit",
        component: HouseEdit,
        meta: {
          title: "房源编辑",
          roles: ["admin", "user"],
        }
      },
    ]
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
      const keyword = JSON.parse(to.params.keyword || to.query.keyword)
      // const keyword = JSON.parse(decodeURI(to.params.keyword))
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
  const token = User.getToken()
  const requiredRoles: any = to.meta.roles
  const currentRole = store.getters.getUserRole
  if (currentRole === '' && whiteList.indexOf(to.path) === -1) {
    // 用户未登录，且页面不在 不重定向白名单 中，重定向到登录页
    titleHandler(to)
    next('/login')
  } else if (to.matched.length === 0) {
    // 用户已登录，路由不存在无法跳转，重定向到404页面
    titleHandler(to)
    next('/404')
  } else if ((currentRole === 'admin' || 'user') && requiredRoles && requiredRoles.indexOf(currentRole) === -1) {
    // 用户已登录，路由存在但无权限无法跳转，向后端请求查询用户身份再进行判断
    if (!token) {
      titleHandler(to)
      next('/login')
    } else {
      await RequestUtil.getUserInfo(token)
        .then(res => {
          if (res.role === 1) {
            console.log('用户身份合法')
            titleHandler(to)
            next()
          } else {
            console.log('用户身份不合法')
            titleHandler(to)
            next('/403')
          }
        }).catch(err => {
          console.log(err)
          titleHandler(to)
          next('/403')
        })
    }
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
