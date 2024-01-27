import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const httpInstance = axios.create()

export type bkResponce = {
    code: number;
    data: any;
    message: string;
    success: true
}

// 设置请求根路径
httpInstance.defaults.baseURL = import.meta.env.VITE_BASEURL

// 配置相应拦截器
export const http = async (config: AxiosRequestConfig) => {
    try {
        const axiosResponse = await httpInstance<bkResponce>(config)
        const bkResponce = axiosResponse.data

        if (!bkResponce?.success) {
            console.log(bkResponce.code, '接口报错')
        }

        return bkResponce
    } catch (err) {
        if (err instanceof AxiosError) {
            console.log('网络错误')
        }
        throw err;
    }
}