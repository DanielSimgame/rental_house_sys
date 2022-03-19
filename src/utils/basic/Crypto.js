export default {
    /**
     * 字符串转base64
     * @param {String} string a string to be encoded
     * @returns {String} encoded string
     */
    getEncode64(str) {
        return window.btoa(
            encodeURIComponent(str)
                .replace(/%([0-9A-F]{2})/g,
                    function toSolidBytes(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }
                )
        );
    },
    /**
     * base64转字符串
     * @param {String} str a base64 string to be decoded
     * @returns {String} decoded string
     */
    getDecode64(str) {
        return decodeURIComponent(
            window.atob(str)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
    },
}