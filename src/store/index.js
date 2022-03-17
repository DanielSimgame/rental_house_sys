import { createStore } from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default createStore({
    state: {
        app: {
            title: import.meta.env.VITE_APP_TITLE || '合租房管理系统',
            apiUrl: import.meta.env.VITE_API_URL || 'https://hzf.keker.ink',
            wssUrl: import.meta.env.VITE_WSS_URL || 'wss://hzf.keker.ink',
        },
        count: 0,
        userRole: '',
        userInfo: {},
    },
    getters,
    mutations,
    actions,
    modules: {}
})