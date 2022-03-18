// use store.commit('mutationName') to call the mutation

export default {
    increment(state) {
        state.count++
    },
    /**
     * @function setUserRole
     * @description set user role
     * @param {Object} state vuex store state
     * @param {String} role user role
     */
    setUserRole(state, payload) {
        state.userRole = payload
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
        const emptyUserInfo= {
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
        state.userInfo = emptyUserInfo
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