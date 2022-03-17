// 本js文件为基础js文件，不要单独使用，需要封装js文件的引用

// 超时Promise
let abort = null;
const abortPromise = new Promise((resolve, reject) => {
    abort = () => {
        return reject({
            code: 504,
            message: "请求超时！服务器或网络繁忙，请稍后再重试。"
        })
    }
})
// RequestMode
let ReqMode = "cors" as RequestMode;

export default {
    /**
     * @function fetchGet
     * @description 使用fetch来向后端GET，需要提供请求头，可为null。
     * @param {string} url API的地址以及要携带的数据
     * @param {Object | null} headers 请求头
     * @param {Number} timeout 超时时间，默认为5000ms
     * @returns {Promise} resolve(r) 成功的回调
     * @returns {Promise} reject(err) 失败的回调
     * */
    fetchGet: async (
        url: string,
        headers: object | null = null,
        timeout: number = 5000
    ): Promise<any> => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            mode: ReqMode,
        }
        const request = await fetch(url, options);
        let resultPromise = Promise.race([request, abortPromise]);

        setTimeout(() => { abort(); }, timeout);
        return resultPromise.then(response => {
            clearTimeout(timeout);
            return response;
        });
    },
    /**
     * @function fetchPost
     * @description 使用fetch来向后端POST，需要提供API URL与要发送的JSON对象。
     * @param {string} url API的地址
     * @param {Object | null} headers 请求头
     * @param {Object} data 要发送的JSON对象
     * @param {Number} timeout 超时时间，默认为5000ms
     * */
    fetchPost: async (
        url: string = '',
        headers: object | null = null,
        data: object = {},
        timeout: number = 5000
    ) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            mode: ReqMode,
            body: JSON.stringify(data)
        }
        const request = await fetch(url, options);
        let resultPromise = Promise.race([request, abortPromise]);

        setTimeout(() => { abort(); }, timeout);
        return resultPromise.then(response => {
            clearTimeout(timeout);
            return response;
        });
    },
    /**
     * @function fetchDel
     * @description 使用fetch来向后端发送DELETE请求，与GET类似。
     * @param {string} url API的地址
     * @param {Object | null} headers 请求头
     * @param {Number} timeout 超时时间，默认为5000ms
     * */
    fetchDel: async (
        url: string = '',
        headers: object | null = null,
        timeout: number = 5000
    ) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            mode: ReqMode,
        }
        const request = await fetch(url, options);
        let resultPromise = Promise.race([request, abortPromise]);

        setTimeout(() => { abort(); }, timeout);
        return resultPromise.then(response => {
            clearTimeout(timeout);
            return response;
        });
    },
}
