/**
 * @function S4
 * @description Generate four random hex digits.
 * 生成4个随机十六进制数。
 * @returns {string}
 * */
 const S4 = (): string => {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  
  /**
   * @description Generate a pseudo-UUID by concatenating random hexadecimal.
   * 通过连接随机十六进制数字符串，生成伪UUID。
   * @returns {string}
   * */
  export default (): string => {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };
  