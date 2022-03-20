export default {
    /**
     * 字符串转base64
     * @param {String} string a string to be encoded
     * @returns {String} encoded string
     */
    getEncode64(str) {
        return window.btoa(
            // 双层包裹
            encodeURI(encodeURI(str))
        );
    },
    /**
     * base64转字符串
     * @param {String} str a base64 string to be decoded
     * @returns {String} decoded string
     */
    getDecode64(str) {
        console.log(str)
        return decodeURI(
            decodeURI(window.atob(str))
        )
    },
}