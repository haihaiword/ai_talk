<template>
    <div class="dialogue-content">
        <!-- 頂部回話欄 -->
        <div v-if="state.valuePresent" class="dialog-box">
            <!-- 消息盒子 -->
            <!-- 改变滚动条 -->
            <el-scrollbar>
                <!-- 饿了么的加载更多方法 -->
                <div v-infinite-scroll="load">
                    <div class="message-box" :class="item.role === 'assistant' ? 'mess-left' : 'mess-right'"
                        v-for="(item, index) in state.list" :key="index">
                        <!-- 左边的头像 -->
                        <div class="mess-image" v-if="item.role === 'assistant'">
                            <el-image :src="url.user" fit="cover" />
                        </div>
                        <!-- 修改按钮 -->
                        <div class="edit-mess-box" v-if="item.role === 'user'">
                            <el-button :icon="Check" @click="submitModify" v-if="state.messCheckedVal === item.id" circle />
                            <el-button circle type="primary" v-if="state.messCheckedVal !== item.id"
                                @click="selectMessage(item)" plain>修</el-button>
                        </div>
                        <!-- 消息 -->
                        <div class="message-content">
                            <div class="message"
                                :class="[state.messCheckedVal === item.id ? 'mess-red' : '', item.fixContentArr ? 'mess-radius' : '']">
                                {{ item.content }}
                            </div>
                            <div v-if="state.messCheckedVal === item.id">
                                <div class="mess-modify" v-for="(item, index) in state.messModifyList" :key="index">
                                    <div class="mess-modify-id">
                                        {{ index + 1 }}.
                                    </div>
                                    <textarea @keydown="handleKeyCode($event)" v-model="item.content"
                                        placeholder="请输入需要修改的语句" />
                                </div>
                            </div>
                            <div v-if="item.fixContentArr && state.messCheckedVal !== item.id" class="bgc-b">
                                <div class="mess-modify" v-for="(i, id) in item.fixContentArr" :key="id">
                                    <div class="mess-modify-id">
                                        {{ id + 1 }}.&nbsp;
                                    </div>
                                    <div class="mess-w">{{ i }}</div>
                                </div>
                            </div>
                        </div>
                        <!-- 右边的头像 -->
                        <div class="mess-image" v-if="item.role === 'user'">
                            <el-image :src="url.robot" fit="cover" />
                        </div>
                    </div>
                    <!-- 分页到底提示 -->
                    <div class="mess-end" v-if="state.list.length === state.total && state.list.length > 10">到底了</div>
                </div>
            </el-scrollbar>
        </div>
        <el-empty style="margin-top: 200px;" v-if="!state.valuePresent" description="暂无聊天记录" />
        <!-- 底下確認button -->
        <el-button type="primary" @click="toSubmitAll" v-if="state.valuePresent" class="btn">提交</el-button>
    </div>
</template>

<script setup lang="ts">
// 引入方法
import { Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue';
// 引入接口
import { getQuerySessionApi, submitModifyApi, submitToApi, type sessionListType } from '@/apis/home'

// 自定义变量
const emit = defineEmits(['submitAll'])
const state = reactive({
    valuePresent: false, //判断是否左边选中了，或者是否end了
    list: [] as sessionListType[],
    messCheckedVal: undefined as unknown as number, //消息列表选中修改的消息
    params: {
        pageNo: 1,
        pageSize: 10,
        fansId: 0, //粉丝ID
    },
    total: 0, //总数
    messModifyList: [
        {
            content: ''
        }
    ]
})
// 头像路径
const url = {
    robot: new URL('@/assets/images/robot.png', import.meta.url).href,
    user: new URL('@/assets/images/user.png', import.meta.url).href,
}

// 提交修改后的语句上去保存
const submitModify = async () => {
    // 清除掉末尾空白模板
    if (!state.messModifyList[state.messModifyList.length - 1].content) {
        state.messModifyList.pop();
    }
    // 防止0内容提交
    if (!state.messModifyList.length) {
        ElMessage.error('请输入需要修改的内容')
        state.messModifyList = [{ content: '' }] //修改用的数组
        return false
    }

    // 转换下格式
    let result: string[] = state.messModifyList.map(item => item.content);

    let res = await submitModifyApi({
        id: state.messCheckedVal,
        fixContentArr: result
    })

    if (res.data) {
        ElMessage.success('保存成功')
        // 不刷新页面直接添加内容进去
        let findList = state.list.find(item => item.id === state.messCheckedVal)
        if (findList) {
            findList.fixContentArr = result
        }

        // 重置
        state.messCheckedVal = undefined as unknown as number //选中要修改的
        state.messModifyList = [{ content: '' }] //修改用的数组
    }
}

// 接收左边组件改变值时的传值
const openDialog = async (val: number) => {
    await resetView() //重置页面
    state.valuePresent = true
    state.params.fansId = val
    getList() //拉取数据
}

// 查询会话信息
const getList = async () => {
    let res = await getQuerySessionApi(state.params)
    // console.log(res, '查询到的会话信息')
    if (res.data.list && res.data.total) {
        state.list = [...state.list, ...res.data.list]
        state.total = res.data.total
    }
}

// 加载更多
const load = () => {
    if (state.list.length < state.total) {
        state.params.pageNo++
        getList()
    }
}

// 选中消息修改
const selectMessage = (val: any) => {
    // if别的写了未保存，则给ta保存
    if (state.messModifyList[0].content && state.messCheckedVal) {
        ElMessageBox.confirm(
            '当前内容暂未保存，是否保存?',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                // 保存
                await submitModify()
                fixContentArrList(val.fixContentArr, val.id)
            })
            .catch(() => {
                fixContentArrList(val.fixContentArr, val.id)
            })
        return
    }
    // 如果修改过了，就是直接编辑了
    if (val.fixContentArr) {
        // 转换格式
        let result = val.fixContentArr.map((item: string) => {
            return {
                content: item
            }
        })
        state.messModifyList = result
        state.messCheckedVal = val.id
    } else {
        resetting(val.id)
    }
}

const fixContentArrList = (fixContentArr: string[], id: number) => {
    // 如果修改过了，就是直接编辑了
    if (fixContentArr) {
        // 转换格式
        let result = fixContentArr.map((item: string) => {
            return {
                content: item
            }
        })
        state.messModifyList = result
        state.messCheckedVal = id
    } else {
        resetting(id)
    }
}

// 重置修改数组
const resetting = (val: number) => {
    state.messModifyList = [{
        content: ''
    }]
    state.messCheckedVal = val
}

// 回车新增函数
const handleKeyCode = (event: any) => {
    if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        if (state.messModifyList[state.messModifyList.length - 1].content) {
            state.messModifyList.push({
                content: ''
            })
        }
        return false;
    }
}

// 提交
const toSubmitAll = async () => {
    // if别的写了未保存，则给ta保存
    if (state.messModifyList[0].content && state.messCheckedVal) {
        ElMessageBox.confirm(
            '当前有内容暂未保存，是否保存并提交?',
            '提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                // 保存
                await submitModify()
                toSubmitAllMethosd()
            })
            .catch(() => {
                toSubmitAllMethosd()
            })
        return
    }
    toSubmitAllMethosd()
}
// 提交方法
const toSubmitAllMethosd = async () => {
    let res = await submitToApi(state.params.fansId)
    if (res.data) {
        ElMessage.success('提交成功')
        state.valuePresent = false
        emit('submitAll', state.params.fansId)
        resetView()
    }
}

// 重置页面函数
const resetView = () => {
    state.list = [] as sessionListType[] //存储列表
    state.params.pageNo = 1
    state.total = 0
    state.params.fansId = 0
    state.messCheckedVal = undefined as unknown as number //选中要修改的
    state.messModifyList = [{ content: '' }] //修改用的数组
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
.dialogue-content {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .bgc-b {
        background-color: rgb(190, 219, 255);
    }

    .mess-left {
        justify-content: flex-start;
    }

    .mess-right {
        justify-content: flex-end;
    }


    .dialog-box {
        height: 90vh;
        width: 100%;
        overflow: auto;

        .mess-end {
            text-align: center;
            color: rgb(136, 136, 136);
        }

        .message-box {
            display: flex;
            min-height: 50px;
            padding: 20px 0;

            .edit-mess-box {
                margin-top: 8px;
                margin-right: 10px;
            }

            .mess-image {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                margin: 0 20px;

                .el-image {
                    width: 50px;
                    height: 50px;
                }
            }

            .message-content {
                max-width: 50%;

                .message {
                    border: 1px solid rgb(184, 184, 184);
                    border-radius: 5px;
                    padding: 10px;
                    word-break: break-all;
                }

                //选中的消息变红
                .mess-red {
                    // border-color: red;
                    border: 2px solid red;
                    border-radius: 5px 5px 0 0;
                }

                .mess-radius {
                    border-radius: 5px 5px 0 0;
                }

                .mess-modify {
                    border: 1px solid rgb(184, 184, 184);
                    border-top: 0;
                    padding: 10px;
                    word-break: break-all;
                    display: flex;

                    .mess-modify-id {
                        padding-top: -1px;
                    }

                    .mess-w {
                        width: 95%;
                        word-wrap: break-word;
                    }

                    textarea {
                        border: none;
                        margin-left: 3px;
                        resize: none;
                        display: inline;
                        flex: 1;
                        min-height: 50px;
                        font-size: 14px;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
    }

    .btn {
        width: 100px;
        margin: 20px 0;
    }
}
</style>