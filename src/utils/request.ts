
import axios from 'axios';
import { ref } from 'vue'
// 导入 element-plus 中的消息和弹框组件
import { ElMessageBox, ElMessage } from 'element-plus';
// 引入公用方法
import { toLoginMet, isWithinThirtyDays, currentTime } from '@/utils/login'
import { useUserInfoStore } from '@/stores/userInfo';

const userInfoStore = useUserInfoStore()
/***************************无感刷新换token相关****************/
const refreshTokenAjax: any = ref(false)

// 创建 Axios 实例
export const requests = axios.create({
    // 设置请求根路径
    baseURL: import.meta.env.VITE_BASEURL,
    // 设置超时时间
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }, // 设置请求头
})


// 存储请求的数组
const subscribesArr = [] as string[]

// 请求push到数组中
function subscribesArrRefresh(cb: any) {
    subscribesArr.push(cb)
}

// 用新token发起请求
function reloadSubscribesArr(newToken: any) {
    subscribesArr.map((cb: any) => cb(newToken))
}

// 刷新令牌
const toRefreshNew = async (token: string) => {
    //根据接口需求，处理刷新所需参数
    const params: any = { refreshToken: token }
    axios({
        method: 'post',
        url: import.meta.env.VITE_BASEURL + '/app-api/conduct/user/refresh-token',
        data: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then((res: any) => {
            userInfoStore.setAuth(res.data.data.accessToken) //存token
            localStorage.setItem('expiresTime', res.data.data.expiresTime) //登录令牌过期time(时间戳)
            reloadSubscribesArr(res.data.data.accessToken)
            refreshTokenAjax.value = false
        })
        .catch(() => {
            refreshTokenAjax.value = false
        })
}

// 请求拦截器
requests.interceptors.request.use(
    (config: any) => {
        const expiresTime = localStorage.getItem('expiresTime') //登录令牌时效
        const refreshTime = localStorage.getItem('refreshTime') //刷新令牌时效
        const refreshToken = localStorage.getItem('refreshToken') //获取刷新令牌
        const token = localStorage.getItem('token') // 在发送请求之前添加登录令牌

        if (token) {
            // 缺少一个时效就退出登录
            if (!refreshTime && !expiresTime) {
                toLoginMet('请先登录')
                return Promise.reject('fail');
            }
            // 判断刷新令牌是否过期
            const result = isWithinThirtyDays(parseInt(refreshTime!))
            if (!result) {
                toLoginMet('登录过期，请重新登录')
                return Promise.reject('fail');
            }

            // 判断登录令牌是否过期
            const resultToken = currentTime(parseInt(expiresTime!))
            // 如果过期了
            if (!resultToken) {
                //  去刷新token(节流防止多次请求)
                if (!refreshTokenAjax.value) {
                    toRefreshNew(refreshToken!)
                }
                refreshTokenAjax.value = true
                // 重新发起请求
                return new Promise(resolve => {
                    subscribesArrRefresh((newToken: any) => {
                        config.headers['Authorization'] = newToken
                        resolve(config)
                    })
                })
            }
            config.headers!['Authorization'] = 'Bearer ' + token; // 在请求头中添加 token
        }

        if (config.method.toUpperCase() === 'DELETE') {
            config.headers['content-type'] = 'application/x-www-form-urlencoded'
        }

        return config;
    },
    (error) => {
        // 对请求错误做处理
        return Promise.reject(error);
    }
)

// 响应拦截器
requests.interceptors.response.use((response) => {
    // 处理响应数据
    const res = response.data;

    // 根据状态码处理
    if (res.code === 401) {
        ElMessageBox.alert('登录超时,请重新登录', '提示', {
            confirmButtonText: 'OK',
            callback: () => {
                // 退出登录并跳转到登录页
                localStorage.clear()
                window.location.href = '/login';
            },
        });
        return Promise.reject(response);
    }
    // 直接返回收据
    return res;
}, (error) => {
    // 处理错误拦截
    if (error.message.indexOf('timeout') != -1) {
        ElMessage.error('网络超时');
    } else if (error.message == 'Network Error') {
        ElMessage.error('网络连接错误');
    } else {
        if (error.response?.data) ElMessage.error(error.response.statusText);
        else ElMessage.error('接口路径找不到');
    }
    return Promise.reject(error);
})

export default requests