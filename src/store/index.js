import {createStore} from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
  state: {
    app: {
      title: import.meta.env.VITE_APP_TITLE || '合租房管理系统',
      apiUrl: import.meta.env.VITE_API_URL || 'https://hzf.api.keker.icu',
      // apiUrl: import.meta.env.VITE_API_URL || 'https://hzf.keker.ink',
      // wssUrl: import.meta.env.VITE_WSS_URL || 'wss://hzf.keker.ink',
      wssUrl: import.meta.env.VITE_WSS_URL || 'wss://hzf.api.keker.icu',
      chatView: false,
      chatNew: {},
    },
    socket: {
      // 连接状态
      isConnected: false,
      // 消息内容
      message: "",
      // 重新连接错误
      reconnectError: false,
      // 心跳消息发送时间
      heartBeatInterval: 50000,
      // 心跳定时器
      heartBeatTimer: 0
    },
    newMessage: [],
    count: 0,
    userRole: '',
    // defaultAvatar: null,
    // defaultAvatar: 'https://pics.keker.icu/face.jpg',
    userInfo: {
      id: "",
      name: "",
      email: "",
      detail: "",
      phone: "",
      username: "",
      gender: "",
      role: -1,
      portrait: "",
      ownedHouseIdList: [],
      rentedHouseIdList: []
    },
  },
  getters,
  mutations,
  actions,
  modules: {}
})

