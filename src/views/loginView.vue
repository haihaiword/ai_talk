<template>
  <div id="login">
    <div class="login-box">
      <!-- 标题 -->
      <div class="title">
        <h1>AI 复盘</h1>
      </div>
      <!-- 表单 -->
      <el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules">
        <el-form-item prop="username">
          <el-input class="input" v-model="state.ruleForm.username" placeholder="账号" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" class="input" v-model="state.ruleForm.password" placeholder="密码"
            :prefix-icon="Lock"></el-input>
        </el-form-item>

        <div class="btns">
          <el-button type="primary" round @click="submitForm(ruleFormRef)" class="btn">登录</el-button>
          <div class="reset" @click="resetForm(ruleFormRef)">重置</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElLoading } from 'element-plus'

import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/userInfo';
// 引用接口
import { loginApi, type loginType } from '@/apis/login'

const userInfoStore = useUserInfoStore()
const router = useRouter();

// 自定义变量
const ruleFormRef = ref<FormInstance>()
const state = reactive({
  ruleForm: {
    username: 'test',
    password: '123456',
  }
})

// 校验账号规则
const rules = reactive<FormRules<loginType>>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'change',
    },
  ],
})
// 登录校验
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      toLogin()
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 登录(简易版)
const toLogin = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '登录中',
  })
  let res: any = await loginApi(state.ruleForm)
  if (res.code === 1000009000) {
    loading.close()
    ElMessage.error(res.msg)
    return
  }
  if (res.data) {
    userInfoStore.setAuth(res.data.accessToken) //存token
    userInfoStore.setUserInfo({
      userId: res.data.userId,
      refreshToken: res.data.refreshToken,
      expiresTime: res.data.expiresTime
    }) //存储userId和刷新令牌及过期time

    router.push('/home')
    loading.close()
    ElMessage.success('登录成功')
  }
}

</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background: linear-gradient(to right, rgb(33, 81, 138), rgb(76, 101, 151));
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 360px;
    height: 450px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;

    .title {
      height: 120px;
      line-height: 120px;
    }

    .el-form {
      width: 90%;
      margin-top: 30px;

      .input {
        height: 40px;

        :deep(.el-input__wrapper) {
          border-radius: 20px;
          // border: 1px solid #000;
        }
      }

      .btns {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 50px;

        .btn {
          width: 100%;
          height: 40px;
          border-radius: 20px;
          margin-bottom: 20px;
          cursor: pointer;
        }

        .reset {
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
../apis/login