import router from "../router";

export default {
    goHome: () => {
        router.push({name: "Home"})
    },
    goSignup: () => {
        router.push({name: "SignUp"})
    }
}
