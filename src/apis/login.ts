import { requests } from "../utils/request";

export type loginType = {
    username: string
    password: string
}

// 登录相关接口
export const loginApi = (data: loginType) => {
    return requests({
        method: 'POST',
        url: '/app-api/conduct/user/login',
        data: data
    })
}

// 登出相关接口
export const logoutApi = () => {
    return requests({
        method: 'POST',
        url: '/app-api/conduct/user/logout'
    })
}