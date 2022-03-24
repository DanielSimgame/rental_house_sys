// use store.commit('mutationName') to call the mutation
import {app} from "@/main";
import wSocketUtil from "@/utils/wSocket";

// 插件需要向Vue全局挂载属性，即Vue.prototype.xx = xx，在vue3中这一写法已经废除，需要用app.config.globalProperties.xx = xx来替换

export default {
  // 连接打开
  SOCKET_ONOPEN(state, event) {
    // document.querySelector('#chatAudio').play();
    app.config.globalProperties.$socket = event.currentTarget;
    state.socket.isConnected = true;
    // 连接成功时启动定时发送心跳消息，避免被服务器断开连接
    state.socket.heartBeatTimer = setInterval(() => {
      const message = "心跳消息";
      state.socket.isConnected &&
      app.config.globalProperties.$socket.sendObj({
        code: 200,
        msg: message
      });
    }, state.socket.heartBeatInterval);
    console.log("Socket Established");
  },
  // 连接关闭
  SOCKET_ONCLOSE(state, event) {
    state.socket.isConnected = false;
    // 连接关闭时停掉心跳消息
    clearInterval(state.socket.heartBeatTimer);
    state.socket.heartBeatTimer = 0;
    console.log("连接已断开: " + new Date());
    console.log(event);
  },
  // 发生错误
  SOCKET_ONERROR(state, event) {
    console.error(state, event);
  },
  // 收到服务端发送的消息
  SOCKET_ONMESSAGE(state, message) {
    document.querySelector('#chatAudio').play();
    state.socket.message = message;
    switch (state.socket.message.messageType) {
      case "notice":
        wSocketUtil.noticeHandler(message);
        break;
      case "message":
        wSocketUtil.messageHandler(message);
        break;
    }
    console.log(state.socket.message);
  },
  // 自动重连
  SOCKET_RECONNECT(state, count) {
    console.info("消息系统重连中...", state, count);
  },
  // 重连错误
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  },
  /**
   * @function setChatViewVisibility
   * @description 更新聊天框chatView可见性
   * @param {Object} state vuex state
   * @param {Boolean} isVisible 是否可见
   * */
  setChatViewVisibility(state, isVisible) {
    state.chatView.visibility = isVisible;
  },
  /**
   * @function setUserRole
   * @description set user role
   * @param {Object} state vuex state
   * @param {String} role user role
   */
  setUserRole(state, role) {
    state.userRole = role
  },
  /**
   * @function setUserInfo
   * @description set user info
   * @param {Object} state vuex store state
   * @param {Object} payload user info object
   */
  setUserInfo(state, payload) {
    state.userInfo = payload
    if (payload.role === 1) {
      state.userRole = 'admin'
    } else if (payload.role === 0) {
      state.userRole = 'user'
    }
  },
  /**
   * @function clearUserInfo
   * @description clear user info
   * @param {Object} state vuex store state
   */
  clearUserInfo(state) {
    state.userInfo = {
      id: "",
      name: "",
      email: "",
      detail: "",
      phone: "",
      username: "",
      gender: "",
      role: 0,
      portrait: "",
      owndHouseIdList: [],
      rentedHouseIdList: []
    }
  },
  /**
   * @function setDefaultUserInfo
   * @description set user info to default values
   * @param {Object} state vuex store state
   */
  setDefaultUserInfo(state) {
    state.userInfo = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    }
  }
}
