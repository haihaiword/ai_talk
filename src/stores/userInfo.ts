import { requests } from "@/utils/request";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore('userinfo-store', () => {
    // 添加token
    const setAuth = (token: string) => {
        requests.defaults.headers.common.Authorization = 'Bearer ' + token
        localStorage.setItem('token', token)
    };
    // 路由守卫用，判断是否有token
    const authFormLocal = () => {
        const token = localStorage.getItem('token')
        if (token) {
            setAuth(token)
            return true
        }
        return false
    };
    // 删除token
    const removeAuth = () => {
        delete requests.defaults.headers.common.Authorization
        localStorage.removeItem('token')
    };
    return {
        setAuth,
        authFormLocal,
        removeAuth
    }
})