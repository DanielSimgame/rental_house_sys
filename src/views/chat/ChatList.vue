<template>
  <div class="chat-list">
    <div class="chat-list__body">

      <div class="chat-list__body-item-notice mb-1" @click="onSelectChat(chatList.notice, 'notice')">
        <div class="chat-list__body-item-content cursor-pointer h-full grid grid-cols-3 h-14 border rounded-full
          group hover:bg-indigo-600 hover:text-white p-1 transition-colors">
          <div class="portrait-wrap flex items-center">
            <img :src="chatList.notice.portrait" class="h-12 w-12 rounded-full col-span-1" ondragstart="return false"
                 alt>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <span>{{ chatList.notice.name }}</span>
            <span class="chat-list__body-item-contain">
              {{ chatList.notice.messageList[chatList.notice.messageList.length - 1].contain }}
            </span>
          </div>
        </div>
      </div>

      <div class="chat-list__body-item mb-1"
           v-if="chatList.chats.length !== 1 && chatList.chats[0].id !== ''"
           v-for="(conversation, index) in conversationList" :key="index"
           @click="onSelectChat(conversation, index)">
        <div class="chat-list__body-item-content cursor-pointer h-full grid grid-cols-3 h-14 border rounded-full
          group hover:bg-indigo-600 hover:text-white p-1 transition-colors">
          <div class="portrait-wrap flex items-center">
            <el-badge :value="unreadNum[index].num" :hidden="unreadNum[index].num === 0" :max="10" class="item">
              <!--            <el-badge :value="calcUnreadNumComputed(conversation)" :hidden="calcUnreadNumComputed(conversation) === 0" :max="10" class="item">-->
              <img :src="conversation.portrait" class="h-12 w-12 rounded-full col-span-1" ondragstart="return false"
                   alt>
            </el-badge>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <span>{{ conversation.name }}</span>
            <span class="chat-list__body-item-contain">
              {{ getLatestMsgInMessageList(conversation.id) }}
            </span>
            <!--            <span class="chat-list__body-item-contain">{{-->
            <!--                chat.messageList[chat.messageList.length - 1].contain-->
            <!--              }}</span>-->
          </div>
        </div>
      </div>
      <div
          class="chat-list__empty text-center flex-col justify-center items-center"
          v-if="chatList.chats.length === 1 && chatList.chats[0].id === ''">
        <div class="chat-list__empty-icon">
          <el-icon name="chat-empty" :size="64">
            <MessageBox/>
          </el-icon>
        </div>
        <div class="chat-list__empty-text">
          <span>目前没有聊天</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RequestUtil from "@/utils/RequestUtil";
import {computed, nextTick, reactive} from "vue";
import {MessageBox} from "@element-plus/icons-vue";
import NotificationImg from '@/assets/images/bell.png';
import {useStore} from "vuex";

const store = useStore();
let thisUser = store.getters.getUserInfo;

let emit = defineEmits(['selectChat']);

let conversationList = reactive([
  {
    detail: "",
    gender: "",
    id: "",
    messageList: [{
      contain: "",
      createdDate: "",
      creatorId: "",
      id: "",
      messageType: "message",
      read: false,
      receiverId: "",
      removedUserIds: [],
      type: "message"
    }],
    name: "",
    portrait: ""
  }
])

/**
 * @function getNotice
 * @description 获取通知
 * */
let getNotice = () => {
  RequestUtil.getNoticeList(0, 10)
      .then(r => r.json())
      .then(resArr => {
        if (resArr.length > 0) {
          if (chatList.notice.messageList[0].id === "") {
            chatList.notice.messageList.shift()
          }
          for (let resKey in resArr) {
            chatList.notice.messageList.push(resArr[resKey])
          }
          return resArr
        }
      })
}

// get notice
getNotice()
// get conversation list from server, it's an array.
RequestUtil.getConversationList()
    .then(r => r.json())
    .then(res => {
      // find the user's conversation by id, and rewrite the conversationList[index]
      // if the conversation is not found, push it to the list
      res.forEach(conversation => {
        let index = conversationList.findIndex(item => item.id === conversation.id);
        nextTick(() => {
          // if it's first init, shift empty conversation
          if (conversationList[0].id === "") {
            conversationList.shift()
          }
          if (unreadNum[0].id === "") {
            unreadNum.shift()
          }
        })
        if (index === -1) {
          conversationList.push(conversation);
          unreadNum.push({id: conversation.id, num: 0})
        } else {
          conversationList[index] = conversation;
          unreadNum[index].id = conversation.id;
        }
      })
    })

let chatList = reactive({
  notice: {
    detail: null,
    gender: "",
    id: "",
    messageList: [{
      contain: "暂时还没有系统通知",
      createdDate: "",
      creatorId: "",
      id: "",
      messageType: "message",
      read: false,
      receiverId: "",
      removedUserIds: [],
      type: "message"
    }],
    name: "系统通知",
    portrait: NotificationImg
  },
  chats: [{
    detail: "",
    gender: "",
    id: "",
    messageList: [{
      contain: "",
      createdDate: "",
      creatorId: "",
      id: "",
      messageType: "message",
      read: false,
      receiverId: "",
      removedUserIds: [],
      type: "message"
    }],
    name: "",
    portrait: ""
  }],
})
let unreadNum = reactive([
  {
    id: "",
    num: 0
  }
])

/**
 * @function isMyPostChat
 * @description 是我发的聊天信息？
 * @param {String} creatorId 消息创建者id
 * */
let isMyPostChat = (creatorId) => {
  return creatorId === thisUser.id
}

/**
 * @function getLatestMsgInMessageList
 * @description 获取消息列表的第一条消息
 * @param {String} id conversation user id
 * */
let getLatestMsgInMessageList = computed(() => (id) => {
  // get the latest message by id in conversationList, and return the message content
  let index = conversationList.findIndex(item => item.id === id);
  if (index === -1) {
    return "";
  }
  let messageList = conversationList[index].messageList;
  if (messageList.length === 0) {
    return "";
  }
  // if the message is start with '发起聊天:', and the msg is sent by this user, return the content without '发起聊天:'
  if (messageList[messageList.length - 1].contain.startsWith('发起聊天:') && isMyPostChat(messageList[messageList.length - 1].creatorId)) {
    return messageList[messageList.length - 1].contain.split(':')[1]
  } else {
    // return the last message
    return messageList[messageList.length - 1].contain;
  }
})

// /**
//  * @function calcUnreadNumComputed
//  * @description 返回未读消息数量
//  * @param {Object} conversation 聊天对话
//  * */
// let calcUnreadNumComputed = () => (conversation) => {
//   // calculate the unread message counts in conversationList array
//   // let unreadNum = 0;
//   let messageList = conversation.messageList;
//   for (let i = 0; i < messageList.length; i++) {
//     if (!messageList[i].read) {
//       unreadNum[i].num++;
//     }
//   }
// }

/**
 * @function calcUnreadNumComputed
 * @description 返回未读消息数量
 * @param {Object} conversation 聊天对话
 * */
const calcUnreadNum = (conversation) => {
  // calculate the unread message counts in conversationList array
  let count = 0;
  let messageList = conversation.messageList;
  for (let i = 0; i < messageList.length; i++) {
    if (!messageList[i].read) {
      count ++;
    }
  }
  // write count into unreadNum array, by conversation id
  let index = unreadNum.findIndex(item => item.id === conversation.id);
  if (index === -1) {
    unreadNum.push({id: conversation.id, num: count})
  } else {
    unreadNum[index].num = count
  }
}

/**
 * @function addUnreadMessageCount
 * @description 增加未读消息数量
 * @param {String} id creator id
 * */
let addUnreadMessageCount = (id) => {
  // add unread message count by id
  let index = unreadNum.findIndex(item => item.id === id);
  if (index === -1) {
    unreadNum.push({id: id, num: 1})
  } else {
    unreadNum[index].num++
  }
}

/**
 * @function getUnread
 * @description 获取未读消息
 * @param {Array} unreadMsgIds 要处理的未读消息id数组
 * @param {Object} conversation 聊天对象
 * */
const getUnread = async (unreadMsgIds, conversation) => {
  await RequestUtil.getMessageRead(unreadMsgIds)
      .then(res => {
        if (res.status === 200) {
          // 以聊天对象.消息列表中每一条消息，将消息的read属性设置为true
          for (let msgKey in conversation.messageList) {
            if (unreadMsgIds.includes(conversation.messageList[msgKey].id)) {
              conversation.messageList[msgKey].read = true
            }
          }
          calcUnreadNum(conversation)
        }
      })
}

/**
 * @function onSelectChat
 * @description 点击聊天对象事件
 * @param {Object} conversation 与某人的聊天对话(聊天对象)
 * @param {String | Number} index 聊天对象在conversationList中的索引
 * */
function onSelectChat(conversation, index) {
  // 向父组件传递聊天对象
  emit('selectChat', conversation)
  // 未读消息的id数组
  let unreadMsgIds = [];
  // 将聊天对象的消息列表中的未读消息id放入unreadMsgIds数组中
  for (let msgKey in conversation.messageList) {
    if (!conversation.messageList[msgKey].read && !isMyPostChat(conversation.messageList[msgKey].creatorId)) {
      unreadMsgIds.push(conversation.messageList[msgKey].id)
    }
  }
  getUnread(unreadMsgIds, conversation)
}

/**
 * @function pushNewMessage
 * @description 当收到后端发送新的单条消息时，调用此方法添加消息到ConversationList[index].messageList中
 * @param {Object} newMessage 新的单条消息
 * */
const pushNewMessage = (newMessage = {
  contain: "",
  createdDate: "",
  creatorId: "",
  id: "",
  messageType: "message",
  read: false,
  receiverId: "",
  removedUserIds: [],
  type: "message"
}) => {
  for (let chatsKey in conversationList) {
    if (newMessage.creatorId === conversationList[chatsKey].id && conversationList[chatsKey].messageList) {
      conversationList[chatsKey].messageList.push(newMessage)
    }
  }
}

defineExpose({
  data: () => chatList,
  methods: {
    pushNewMessage,
    addUnreadMessageCount
  }
})
</script>

<style scoped>
.chat-list {
  width: 200px
}

.chat-list__body-item-contain {
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
