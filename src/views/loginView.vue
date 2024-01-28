<template>
  <div id="login">
    <div class="login-box">
      <!-- 标题 -->
      <div class="title">
        <h1>AI 复盘登录</h1>
      </div>
      <!-- 表单 -->
      <el-form>
        <el-form-item>
          <el-input class="input" placeholder="账号" :prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input class="input" placeholder="密码" :prefix-icon="Lock"></el-input>
        </el-form-item>

        <div class="btns">
          <el-button type="primary" round @click="toLogin" class="btn">登录</el-button>
          <div class="reset">重置</div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter();

// 登录(简易版)
const toLogin = () => {
  router.push('/home')
}
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background: linear-gradient(to right, #2b2c43, #1e3158);
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

        :deep(.el-input__wrapper){
          border-radius: 20px;
          // border: 1px solid #000;
        }
      }

      .btns {
        display: flex;
        flex-direction: column;
        align-items: center;

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
