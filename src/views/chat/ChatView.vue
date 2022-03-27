<template>
  <div class="chat-view__container h-96 flex flex-row">
    <ChatList class="mr-3" :chats="pageData.chats" @selectChat="chatListItemSelected" ref="chatListRef"></ChatList>
    <ChatBoard class="chat-board p-2" :chat="pageData.currentChat" ref="chatBoardRef"></ChatBoard>
  </div>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import ChatBoard from "@/views/chat/ChatBoard.vue";
import ChatList from "@/views/chat/ChatList.vue";
import RequestUtil from "@/utils/RequestUtil";

import {useStore} from "vuex";

const store = useStore();
const chatBoardRef = ref(null);
const chatListRef = ref(null);

let pageData = reactive({
  chats: [],
  currentChat: null
});

/**
 * @function initChatList
 * @description 初始化聊天列表
 * */
const initChatList = async () => {
  pageData.chats = await RequestUtil.getConversationList()
      .then(r => r.json())
      .then(res => {

        // console.log(res);
        return res;
      });
}

/**
 * @function chatListItemSelected
 * @description 聊天列表项被选中
 * @param {Object} chat 聊天对象
 * */
const chatListItemSelected = (chat) => {
  pageData.currentChat = chat;
  // console.log('current chat', pageData.currentChat)
}

onMounted(() => {
  initChatList();
});

// 从store监听新消息
watch(
    store.getters.getNewMsgArr,
    (newMessageList) => {
      if (newMessageList.length > 0) {
        // 将获取到的新消息插入到对应的聊天对象currenChat的messageList中
        for (let msgKey in newMessageList) {
          let newMsg = newMessageList[msgKey];
          if (pageData.currentChat !== null && pageData.currentChat.id === newMsg.creatorId) {
            pageData.currentChat.messageList.push(newMsg);
          }
          // 如果用户只打开了聊天窗口但没打开聊天对象的话，则将新消息插入到chats中
          else if (pageData.currentChat === null) {
            pageData.chats.push(newMsg);
            chatListRef.value.methods.pushNewMessage(newMsg)
            // add unread message count
            chatListRef.value.methods.addUnreadMessageCount(newMsg.creatorId);
          }
          if (chatBoardRef !== null) {
            nextTick(() => {
              chatBoardRef.value.methods.scrollToChatBottom()
              store.commit('clearNewMessage')
            });
          }
        }
      }
    }
);

// watch(() => pageData.chats, () => {
//   console.log(pageData.chats);
// });
</script>

<style scoped>
.chat-board {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.chat-view__container {
  height: 550px;
}
</style>
