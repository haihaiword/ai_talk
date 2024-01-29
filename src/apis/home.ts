import { requests } from "../utils/request";

//查询粉丝列表条件类型
export type fansType = {
    pageNo: number  //页码，从 1 开始,示例值(1)	
    pageSize: number  //每页条数，最大值为 100,示例值(10)	
    platformId?: number //平台id,示例值(6785)
    bloggerId?: number //博主id,示例值(30985)
}

// 查询的粉丝列表
export type fansListType = {
    id: number //id	
    platformId: number //平台id	
    bloggerId: number //博主id	
    fansAccount: string //粉丝账号	
    nickName: string //昵称	
    remark: string //备注	
    createTime: string //创建时间	
    lastMessageTime: string //最后一条聊天消息发送时间	
}

//查询会话分页列表条件类型
export type querySessionType = {
    pageNo: number  //页码，从 1 开始,示例值(1)	
    pageSize: number  //每页条数，最大值为 100,示例值(10)	
    fansId: number //粉丝id
}

/* 
    -------------------------------------------------------------------------------------------------------------
    分界线（↑ TS类型， ↓ 接口）
    -------------------------------------------------------------------------------------------------------------
*/

// 查询粉丝列表接口
export const getFansList = (data: fansType) => {
    return requests({
        method: 'GET',
        url: '/app-api/conduct/fans/page',
        params: data
    })
}

// 查询会话接口
export const getQuerySession = (data: querySessionType) => {
    return requests({
        method: 'GET',
        url: '/app-api/conduct/conversation/page',
        params: data
    })
}