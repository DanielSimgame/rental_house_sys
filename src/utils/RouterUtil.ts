import router from "../router";

export const goHome = () => {
    router.push({ name: "Home" })
}

export const goSignup = () => {
    router.push({ name: "SignUp" })
}

/**
 * @function goSearch
 * @description 路由推送搜索页面，带城市关键词参数，请把参数数组字符串化
 * @param {Number} pageNum 当前页码，默认为0
 * @param {String} keyword 字符串化后的数组
 */
export const goSearch = (pageNum: number, keyword: string) => {
    router.push({
        path: "/search",
        query: {
            page: pageNum,
            keyword: keyword
            // keyword: encodeURI(keyword)
        }
        // name: "Query",
        // params: {
        //     page: pageNum,
        //     keyword: encodeURI(keyword)
        // }
    })
        .then(() => {
            window.location.reload()
        })
}

export const goAdmin = () => {
    router.push({ name: "Admin" })
}
