<template>
  <div class="chat-view__container h-96 flex flex-row">
    <ChatList class="mr-3" :chats="pageData.chats"></ChatList>
    <ChatBoard class="chat-board p-2"></ChatBoard>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch} from "vue";
import ChatBoard from "@/views/chat/ChatBoard.vue";
import ChatList from "@/views/chat/ChatList.vue";
import RequestUtil from "@/utils/RequestUtil";

let pageData = reactive({
  chats: []
});

/**
 * @function initChatList
 * @description 初始化聊天列表
 * */
const initChatList = async () => {
  pageData.chats = await RequestUtil.getMessageList()
      .then(r => r.json())
      .then(res => {
        console.log(res);
        return res;
      });
}

onMounted(() => {
  initChatList();
});

// watch(() => pageData.chats, () => {
//   console.log(pageData.chats);
// });
</script>

<style scoped>
.chat-board {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
