import axios from "axios";

export const requests = axios.create({
    // 设置请求根路径
    baseURL: import.meta.env.VITE_BASEURL,
    // 请求时间
    timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
    // config配置对象
    return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
    // 返回响应的数据
    return res.data
}, (error) => {
    // 返回错误的信息
    console.log(error)
    return Promise.reject(new Error('filed'))
})

export default requests