<template>
    <div class="contacts-content">
        <el-scrollbar>
            <div v-infinite-scroll="load">
                <div class="list-box" :class="state.selectVal === index ? 'select-style' : ''"
                    @click="toSelected(index, item)" v-for="(item, index) in state.list" :key="index">
                    <div class="list-name">
                        <div class="seat"></div>
                        {{ item.nickName }}
                    </div>
                    <div class="list-time">
                        {{ Timestamp(item.lastMessageTime) }}
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
// 引入接口
import { getFansList, type fansListType } from '@/apis/home'
// 引入方法
import { Timestamp } from '@/utils/time'

const emit = defineEmits(['selectChange'])
// 定义变量
const state = reactive({
    list: [] as fansListType[], //存储列表
    params: {
        pageNo: 1,
        pageSize: 10
    },
    total: 0, //总数
    selectVal: null as unknown as number, // 选中的联系人
})

// 查询列表
const getList = async () => {
    let res = await getFansList(state.params)
    if (res.data.total && res.data.list) {
        state.total = res.data.total
        state.list = [...state.list, ...res.data.list]
    }
}

// 选中联系人
const toSelected = (val: number, item: fansListType) => {
    // 改变样式
    state.selectVal = val
    // 选中的粉丝账号发送出去
    emit('selectChange', item.id)
}

// 加载更多
const load = () => {
    if (state.list.length < state.total) {
        state.params.pageNo++
        getList()
    }
}


onMounted(() => {
    getList()
})
</script>

<style lang="scss" scoped>
.contacts-content {
    padding: 7px 0;
    height: 100%;
    overflow-y: auto;

    .select-style {
        background-color: rgb(190, 219, 255);
        border: 2px solid rgb(33, 81, 138) !important;
    }

    .list-box {
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid #e6e6e6;
        transition: .2s;

        &:last-child {
            border-bottom: none;
        }

        .list-name {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 18px;

            .seat {
                width: 3px;
                height: 20px;
                margin-right: 8px;
                background-color: rgb(240, 119, 91);
            }
        }

        .list-time {
            font-size: 16px;
            color: #8d8c8c;
        }
    }
}
</style>