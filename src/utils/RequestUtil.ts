import Network from "./basic/Network";
import store from "@/store";
import User from "./User";

export default {
    /**
     * @function postLogin
     * @description 发送登录请求
     * @param {Object} data 登录信息
     * */
    postLogin: async (data: Object) => {
        const reqUrl = `${store.getters.getApiServer}/user/login`
        const res: any = await Network.fetchPost(reqUrl, null, data);
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
     * @param {String} parentName 父节点名称
     */
    getDistricts: async (parentName: string): Promise<Object> => {
        let reqUrl: string;
        if (parentName === "" || undefined || null) {
            reqUrl = `${store.getters.getApiServer}/areaInfo/list`
        } else {
            reqUrl = `${store.getters.getApiServer}/areaInfo/list?parentName=${parentName}`
        }
        const res: any = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getHouseList
     * @description 获取房源列表
     * @param {Number} pageNum 页码
     * @param {Number} pageSize 每页数量
     * @param {String} city
     * @param {String} district
     */
    getHouseList: async (city: string, district: string, pageNum: number, pageSize: number): Promise<Object> => {
        let reqUrl = ''
        if (city !== '' && district !== '') {
            reqUrl = `${store.getters.getApiServer}/house/list?cityName=${city}&cityProper=${district}&pageNum=${pageNum}&pageSize=${pageSize}`
        } else {
            reqUrl = `${store.getters.getApiServer}/house/list?pageNum=${pageNum}&pageSize=${pageSize}`
        }
        const res: any = await Network.fetchGet(reqUrl);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getSingleHouse
     * @description 获取单个房源信息
     * @param houseId 房源id
     */
    getSingleHouse: async (houseId: number): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/house/single?houseId=${houseId}`
        const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getAddAdmin
     * @description 添加管理员
     * @param {String} userId 用户id
     */
    getAddAdmin: async (userId: string = ''): Promise<Object> => {
        if (userId === '') {
            return Promise.reject('userId不能为空')
        } else {
            const reqUrl = `${store.getters.getApiServer}/user/grant?userId=${userId}`
            const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
            if (res.status === 200) {
                return {
                    success: true,
                    message: '添加管理员成功'
                };
            } else {
                return Promise.reject(res);
            }
        }
    },
    /**
     * @function getDelAdmin
     * @description 删除管理员
     * @param {String} userId 用户id
     */
    getDelAdmin: async (userId: string = ''): Promise<Object> => {
        if (userId === '') {
            return Promise.reject('userId不能为空')
        } else {
            const reqUrl = `${store.getters.getApiServer}/user/deleteAdmin?userId=${userId}`
            const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
            if (res.status === 200) {
                return {
                    success: true,
                    message: '删除管理员成功'
                };
            } else {
                return Promise.reject(res);
            }
        }
    },
    /**
     * @function postCreateHouse
     * @description 创建房源
     * @param {Object} data 房源信息
     */
    postCreateHouse: async (data: Object): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/house/create`
        const res: any = await Network.fetchPost(reqUrl, { token: User.getToken() }, data);
        if (res.status === 200) {
            return res.json();
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function getDeleteHouse
     * @description 删除房源
     * @param {String} houseId 房源信息
     */
    getDeleteHouse: async (houseId: String): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/house/delete?houseId=${houseId}`
        const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
        if (res.status === 200) {
            console.log('House delete Api', res)
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    /**
     * @function postEditHouse
     * @description 修改房源
     * @param {Object} data 新的房源信息
     */
    postEditHouse: async (data: Object): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/house/edit`
        const res: any = await Network.fetchPost(reqUrl, null, data);
        if (res.status === 200) {
            console.log('House update Api', res)
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    /**
    * @function getJoinRentHouse
    * @description 加入合租
    * @param {String} houseId 房产id
    * @param {Number} roomId 房间id
    */
    getJoinRentHouse: async (houseId: String, roomId: Number): Promise<Object> => {
        const reqUrl = `${store.getters.getApiServer}/house/rent?houseId=${houseId}&roomId=${roomId}`
        const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
        if (res.status === 200) {
            console.log('House rent Api', res)
            return res;
        } else {
            return Promise.reject(res);
        }
    },
    /**
    * @function getQuitRentHouse
    * @description 加入合租
    * @param {String} houseId 房产id
    * @param {Number} roomId 房间id
    */
    getQuitRentHouse: async (houseId: String, roomId: Number): Promise<Object> => {
        if ((houseId === '' || null || undefined) || (roomId === null || undefined )){
            return Promise.reject('houseId或roomId不能为空')
        }
        const reqUrl = `${store.getters.getApiServer}/house/rent?houseId=${houseId}&roomId=${roomId}`
        const res: any = await Network.fetchGet(reqUrl, { token: User.getToken() });
        if (res.status === 200) {
            return res;
        } else {
            return Promise.reject(res);
        }
    },
}
