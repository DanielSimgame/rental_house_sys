export default {
    count: state => state.count,
    getApiServer: state => state.app.apiUrl,
    getSocketServer: state => state.app.wssUrl,
    getUserRole: state => state.userRole,
    getUserInfo: state => state.userInfo,
    getRoleInUserInfo: state => state.userInfo.role,
    getDefaultAvatar: state => state.defaultAvatar,
}
