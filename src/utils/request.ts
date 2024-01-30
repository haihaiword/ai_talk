
import axios from 'axios';
// 导入 element-plus 中的消息和弹框组件
import { ElMessageBox, ElMessage } from 'element-plus';


// 创建 Axios 实例
export const requests = axios.create({
    // 设置请求根路径
    baseURL: import.meta.env.VITE_BASEURL,
    // 设置超时时间
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }, // 设置请求头
})

// 请求拦截器
requests.interceptors.request.use(
    (config) => {
        // 在发送请求之前做些什么？
        const token = localStorage.getItem('token')
        if (token) config.headers!['Authorization'] = 'Bearer ' + token; // 在请求头中添加 token

        return config;
    },
    (error) => {
        // 对请求错误做些什么？
        return Promise.reject(error);
    }
)

// 响应拦截器
requests.interceptors.response.use((response) => {
    // 处理响应数据
    const res = response.data;

    // 根据状态码处理
    if (res.msg === 'Unauthorized') {
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