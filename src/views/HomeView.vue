<template>
  <div class="content">
    <!-- 左边联系人 -->
    <div class="contacts">
      联系人
    </div>
    <!-- 右边对话框 -->
    <div class="dialogue">
      对话框
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  height: 100vh;

  .contacts {
    width: 400px;
    height: 100%;
    border-right: 1px solid #000;
  }
}
</style>
