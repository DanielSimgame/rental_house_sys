import Storage from "./basic/Storage";
import store from "@/store";

export default {
    setToken: (token: string) => {
        Storage.set("jwt", token);
    },
    getToken: () => {
        return Storage.get("jwt");
    },
    delToken: () => {
        Storage.remove("jwt");
    },
    setRole: (role: string) => {
        store.commit("setUserRole", role);
    },
}