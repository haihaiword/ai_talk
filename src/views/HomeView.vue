<template>
  <div class="home-content">
    <!-- 左边联系人 -->
    <div class="contacts">
      <ContactsView @selectChange="selectChange" ref="ContactsViewRef" />
    </div>
    <!-- 右边对话框 -->
    <div class="dialogue">
      <DialogueView @submitAll="submitAll" ref="DialogueViewRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactsView from '@/views/homeComponents/contactsView.vue';
import DialogueView from '@/views/homeComponents/dialogueView.vue';
import { nextTick, ref } from 'vue';

// 左边粉丝选中传值
const DialogueViewRef = ref<InstanceType<typeof DialogueView>>()
const selectChange = (val: number) => {
  nextTick(() => DialogueViewRef.value?.openDialog(val))
}

const ContactsViewRef = ref<InstanceType<typeof ContactsView>>()
// 右边提交传递id过来清除左边组件的列表对应数据
const submitAll = (id: number) => {
  nextTick(() => ContactsViewRef.value?.openDialog(id))
}
</script>

<style lang="scss" scoped>
.home-content {
  display: flex;
  height: 100vh;
  padding: 15px;
  background-color: #f1f1f1;
  display: flex;

  .contacts {
    width: 400px;
    height: 100%;
    margin-right: 15px;
    background-color: #fff;
    border-radius: 7px;
  }

  .dialogue {
    border-radius: 7px;
    background-color: #fff;
    height: 100%;
    flex: 1;
  }
}
</style>
