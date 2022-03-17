import Network from "./basic/Network";
import store from "../store";

export default {
    /**
     * @function postLogin
     * @description 发送登录请求
     * @param {Object} data 登录信息
     * */
    postLogin: (data: Object) => {
        const reqUrl = `${store.getters.getApiServer}/user/login`
        return Network.fetchPost(reqUrl,null, data)
            .then((res: any) => {
                if (res.status === 200) {
                    return res.json()
                } else {
                    return Promise.reject(res)
                }
            })
    },
}
