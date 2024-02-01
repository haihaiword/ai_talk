import { ElMessageBox } from 'element-plus';
import { requests } from "@/utils/request";

// 判断刷新令牌time
export const isWithinThirtyDays = (timestamp: number) => {
    const currentTime = new Date().getTime(); // 获取当前时间的时间戳
    if (currentTime - timestamp <= 2592000000 && currentTime - timestamp >= 0) {
        return true; // 如果时间戳落在过去30天内或未来30天之外，则返回true
    } else {
        return false; // 其他情况返回false
    }
}
// 判断token是否过期
export const currentTime = (targetTimestamp: number) => {
    // 获取当前时间的时间戳
    const currentTimestamp = new Date().getTime();
    if (targetTimestamp >= currentTimestamp) {
        return true //该时间尚未过期
    } else {
        return false; // 该时间已过期
    }
}

// 跳转到登录
export const toLoginMet = (mess: string) => {
    ElMessageBox.alert(mess, '提示', {
        confirmButtonText: '确定',
        callback: () => {
            // 退出登录并跳转到登录页
            localStorage.clear()
            delete requests.defaults.headers.common.Authorization
            window.location.href = '/login';
        },
    });
}