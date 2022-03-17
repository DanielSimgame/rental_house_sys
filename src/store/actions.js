// use store.dispatch("actionName", payload) to call the action

export default {
    increment(context) {
        context.commit('increment')
    }
}