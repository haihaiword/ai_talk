import { requests } from "@/utils/request";
import { defineStore } from "pinia";

export const useUserInfoStore = defineStore('userinfo-store', () => {
    // 添加token
    const setAuth = (token: string) => {
        requests.defaults.headers.common.Authorization = 'Bearer ' + token
        localStorage.setItem('token', token)
    };
    // 添加用户id和刷新令牌
    const setUserInfo = (data: { userId: number, refreshToken: string, expiresTime: string }) => {
        const newTime = new Date().getTime().toString() //获取当前时间戳

        localStorage.setItem('userId', data.userId.toString()) //用户id
        localStorage.setItem('refreshToken', data.refreshToken) //刷新令牌
        localStorage.setItem('expiresTime', data.expiresTime) //登录令牌过期time(时间戳)
        localStorage.setItem('refreshTime', newTime) //刷新令牌过期时间
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
        removeAuth,
        setUserInfo
    }
})