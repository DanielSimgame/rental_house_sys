import Network from "./basic/Network";
import store from "@/store";

export default {
    /**
     * @function postLogin
     * @description 发送登录请求
     * @param {Object} data 登录信息
     * */
    postLogin: async (data: Object) => {
        const reqUrl = `${store.getters.getApiServer}/user/login`
        const res: any= await Network.fetchPost(reqUrl, null, data);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getUserInfo
     * @description 获取用户信息
     * @param {String} token 用户token
     */
    getUserInfo: async (token: string) => {
        const reqUrl = `${store.getters.getApiServer}/user/currentUser?token=${token}`
        const res = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    }
}
