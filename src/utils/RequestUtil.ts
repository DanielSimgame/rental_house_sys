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
    },
    /**
     * @function getPhoneAvailability
     * @description 检查手机号是否可用
     * @param {String} phone 手机号
     * @returns {Promise<Boolean> | Promise<Error>} 是否可用
     */
    getPhoneAvailability: async (phone: string): Promise<boolean | Error> => {
        const reqUrl = `${store.getters.getApiServer}/user/isPhoneAvailable?phone=${phone}`
        const res = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getEmaileAvailability
     * @description 检查email是否可用
     * @param {String} email email
     * @returns {Promise<Boolean> | Promise<Error>} 是否可用
     */
    getEmailAvailability: async (email: string): Promise<boolean | Error> => {
        const reqUrl = `${store.getters.getApiServer}/user/isEmailAvailable?email=${email}`
        const res = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function postSignUp
     * @description 发送注册请求
     * @param {Object} data 注册信息，空字符串填null或者不传
     */
    postSignUp: async (data: Object) => {
        const reqUrl = `${store.getters.getApiServer}/user/register`
        const res: any = await Network.fetchPost(reqUrl, null, data);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getDistricts
     * @description 获取所有的区域信息，返回值为对象数组
     */
    getDistricts: async (): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/areaInfo/list`
        const res: any = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    }
}
