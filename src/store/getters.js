export default {
    count: state => state.count,
    getApiServer: state => state.app.apiUrl,
    getUserRole: state => state.userRole,
    getUserInfo: state => state.userInfo,
    getRoleInUserInfo: state => state.userInfo.role,
}
