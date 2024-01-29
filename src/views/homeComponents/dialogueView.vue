<template>
    <div class="dialogue-content">
        <!-- 頂部回話欄 -->
        <div class="dialog-box">
            <!-- 消息盒子 -->
            <!-- 改变滚动条 -->
            <el-scrollbar>
                <!-- 饿了么的加载更多方法 -->
                <div v-infinite-scroll="load">
                    <div class="message-box" :class="index % 2 === 0 ? 'mess-left' : 'mess-right'"
                        v-for="(item, index) in 20" :key="index">
                        <!-- 左边的头像 -->
                        <div class="mess-image" v-if="index % 2 === 0">
                            <el-image :src="url" fit="cover" />
                        </div>
                        <!-- 修改按钮 -->
                        <div class="edit-mess-box" v-if="index % 2 !== 0">
                            <el-button :icon="Check" v-if="state.messCheckedVal === index" circle />
                            <el-button circle type="primary" v-if="state.messCheckedVal !== index"
                                @click="selectMessage(index)" plain>修</el-button>
                        </div>
                        <!-- 消息 -->
                        <div class="message-content">
                            <div class="message" :class="state.messCheckedVal === index ? 'mess-red' : ''">
                                详细的你加下细的你加下细的你加下我，我
                            </div>
                            <div v-if="state.messCheckedVal === index">
                                <div class="mess-modify" v-for="(item, index) in state.messModifyList" :key="index">
                                    <div class="mess-modify-id">
                                        {{ item.id }}.
                                    </div>
                                    <textarea @keydown="handleKeyCode($event)" :rows="2" v-model="item.content"
                                        placeholder="请输入需要修改的语句" />
                                </div>
                            </div>
                        </div>
                        <!-- 右边的头像 -->
                        <div class="mess-image" v-if="index % 2 !== 0">
                            <el-image :src="url" fit="cover" />
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <!-- 底下確認button -->
        <el-button type="primary" class="btn">提交</el-button>
    </div>
</template>

<script setup lang="ts">
// 引入方法
import { Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue';
// 引入接口
import { getQuerySession, type querySessionType } from '@/apis/home'

// 自定义变量
const state = reactive({
    messCheckedVal: undefined as unknown as number, //消息列表选中修改的消息
    params: {
        pageNo: 1,
        pageSize: 10,
        fansId: 0,
    },
    total: 0, //总数
    messModifyList: [
        {
            id: 1,
            content: ''
        }
    ]
})
const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

// 接收左边组件改变值时的传值
const openDialog = (val: number) => {
    state.params.fansId = val
    getList()
}

// 查询会话信息
const getList = async () => {
    let res = await getQuerySession(state.params)
    console.log(res, '查询到的会话信息')
}

// 加载更多
const load = () => {
    console.log(324);

}

// 选中消息修改
const selectMessage = (val: number) => {
    // if (state.messCheckedVal === val) return
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
            .then(() => {
                // ...保存
                ElMessage({
                    type: 'success',
                    message: '保存成功',
                })
                resetting(val)
            })
            .catch(() => {
                resetting(val)
            })
    } else {
        resetting(val)
    }
}

// 重置修改数组
const resetting = (val: number) => {
    state.messModifyList = [{
        id: 1,
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
                id: state.messModifyList.length + 1,
                content: ''
            })
        }
        return false;
    }
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

                .mess-modify {
                    border: 1px solid rgb(184, 184, 184);
                    border-top: 0;
                    padding: 10px;
                    word-break: break-all;
                    display: flex;

                    .mess-modify-id {
                        padding-top: -1px;
                    }

                    textarea {
                        border: none;
                        margin-left: 3px;
                        resize: none;
                        display: inline;
                        // max-height: 70px;
                        flex: 1;
                        font-size: 14px;
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