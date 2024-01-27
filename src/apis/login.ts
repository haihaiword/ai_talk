import { http } from ".";

// 登录相关接口
export const loginApi = (data: { xxx: number }) => {
    return http({
        method: 'POST',
        url: '/xxx/xxx',
        data: data
    })
}
