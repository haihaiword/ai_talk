<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

// 登录(简易版)
const toLogin = () => {
  router.replace('/home')
}
</script>

<template>
  <div class="login-content">
    <div class="login">
      <div class="login-title">
        登录
      </div>

      <input type="text" placeholder="账号">
      <input type="text" placeholder="密码">

      <button @click="toLogin">登录</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .login {
    width: 400px;
    height: 500px;
    border: 1px solid rgb(253, 169, 169);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    box-sizing: content-box;
  }
}
</style>
