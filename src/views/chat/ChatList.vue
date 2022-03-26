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
            <span class="chat-list__body-item-contain">{{
                chatList.notice.messageList[chatList.notice.messageList.length - 1].contain
              }}</span>
          </div>
        </div>
      </div>

      <div class="chat-list__body-item mb-1" v-for="(chatUser, index) in chatList.chats" :key="index"
           @click="onSelectChat(chatUser, index)">
        <div class="chat-list__body-item-content cursor-pointer h-full grid grid-cols-3 h-14 border rounded-full
          group hover:bg-indigo-600 hover:text-white p-1 transition-colors">
          <div class="portrait-wrap flex items-center">
            <el-badge :value="unreadNum[index]" :hidden="unreadNum[index] === 0" :max="10" class="item">
              <img :src="chatUser.portrait" class="h-12 w-12 rounded-full col-span-1" ondragstart="return false" alt>
            </el-badge>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <span>{{ chatUser.name }}</span>
            <span class="chat-list__body-item-contain">{{
                chatList.chats[index].messageList[chatList.chats[index].messageList.length - 1].contain
              }}</span>
<!--            <span class="chat-list__body-item-contain">{{-->
<!--                chat.messageList[chat.messageList.length - 1].contain-->
<!--              }}</span>-->
          </div>
        </div>
      </div>
      <div class="chat-list__empty text-center flex-col justify-center items-center" v-if="chatList.chats.length === 0">
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
import {onMounted, reactive, watch, watchEffect} from "vue";
import {MessageBox} from "@element-plus/icons-vue";
import NotificationImg from '@/assets/images/bell.png';
import {useStore} from "vuex";

const store = useStore();

let emit = defineEmits(['selectChat']);
let props = defineProps({
  chats: {
    type: Array,
    default: () => {
      return [
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
      ]
    }
  }
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
let unreadNum = reactive([0, 0])

let thisUser = store.getters.getUserInfo

/**
 * @function isMyPostChat (computed function)
 * @description 是我发的聊天信息？
 * @param {String} creatorId 消息创建者id
 * */
let isMyPostChat = (creatorId) => {
  return creatorId === thisUser.id
}

/**
 * @function getMsgListFirst
 * @description 获取消息列表的第一条消息
 * @param {Array} chatUser 聊天对方信息
 * */
let getMsgListFirst = (chatUser) => {
  console.log('chatUser', chatUser.messageList.length - 1)
  return chatUser.messageList[chatUser.messageList.length - 1].contain
}

/**
 * @function calcUnreadNum (computed function)
 * @description 返回未读消息数量（若想让computed可以传参，则必须是返回一个匿名方法，该方法中再定义相关计算方法）
 * @param {Object} chat 聊天对象
 * @param {Number} index 聊天对象在数组中的索引
 * */
let calcUnreadNum = (chat, index) => {
  let flag = 0;
  for (let msgKey in chat.messageList) {
    if (!isMyPostChat(chat.messageList[msgKey].creatorId) && !chat.messageList[msgKey].read) {
      flag += 1
    }
  }
  unreadNum[index] = flag;
}


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

/**
 * @function getUnread
 * @description 获取未读消息
 * @param {Array} unreadMsgIds 未读消息id数组
 * @param {Object} chat 聊天对象
 * */
const getUnread = async (unreadMsgIds, chat) => {
  await RequestUtil.getMessageRead(unreadMsgIds)
      .then(res => {
        if (res.status === 200) {
          chat.messageList.forEach(msg => {
            msg.read = true
          })
          if (chat.name !== "系统通知") {
            // 将消息标志el-badge变为已读
            calcUnreadNum(chat, chatList.chats.indexOf(chat))
          }
        }
      })
}

/**
 * @function onSelectChat
 * @description 点击聊天对象
 * @param {Object} chatUser 聊天对方信息
 * @param {String | Number} index 聊天对象在数组中的索引
 * */
function onSelectChat(chatUser, index) {
  emit('selectChat', chatUser)
  // 未读消息的id数组
  let unreadMsgIds = [];
  for (let msgKey in chatUser.messageList) {
    if (!chatUser.messageList[msgKey].read && !isMyPostChat(chatUser.messageList[msgKey].creatorId)) {
      unreadMsgIds.push(chatUser.messageList[msgKey].id)
    }
  }
  getUnread(unreadMsgIds, chatUser)
}

/**
 * @function addChatRecord
 * @description 添加聊天记录
 * */
function addChatRecord(newChat) {
  console.log('newChat', newChat)
  // push newChat to chatList.chats, which item includes id same as newChat creatorId.

}

// 监听聊天列表选择聊天对象
watch(
    props.chats,
    (newVal) => {
      // console.log(newVal)
      // for (let chatKey in chatList.chats) {
      //   calcUnreadNum(chatList.chats[chatKey], chatKey)
      // }
      // console.log(chatList.chats)
    }
)

watchEffect(() => {
  chatList.chats = props.chats;
})

onMounted(() => {
  getNotice()
})

defineExpose({
  props,
  data:() => chatList,
  methods: {
    addChatRecord,
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
