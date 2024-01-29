import { requests } from "../utils/request";

// 登录相关接口
export const loginApi = (data: { xxx: number }) => {
    return requests({
        method: 'POST',
        url: '/xxx/xxx',
        data: data
    })
}
