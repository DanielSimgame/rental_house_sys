import router from "../router";

export default {
    goHome: () => {
        router.push({name: "Home"})
    },
    goSignup: () => {
        router.push({name: "SignUp"})
    },
    /**
     * @function goSearch
     * @description 路由推送搜索页面，带城市关键词参数，请把参数数组字符串化
     * @param keyword 字符串化后的数组
     */
    goSearch: (keyword: string) => {
        router.push({name: "Query", params: { keyword: encodeURI(keyword) }})
        .then(() => {
            window.location.reload()
        })
    },
}
