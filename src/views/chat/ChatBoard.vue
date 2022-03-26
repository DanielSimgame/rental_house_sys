<template>
  <div class="chat-board h-full overflow-hidden">
    <div class="chat-board__selected flex flex-col" v-if="props.chat !== null">
      <div class="chat-board__chat-user h-7 flex justify-center items-center text-xl">
        {{ props.chat.name === "系统通知" ? "系统通知" : `与 ${props.chat.name} 的对话` }}
      </div>
      <div
          class="chat-board__msg-wrap my-1 overflow-y-scroll break-words"
          :class="props.chat.name === '系统通知' ? 'chat-board__notice-height' :'h-96'"
          ref="msgBoxRef">
        <div class="chat-board__msg-item flex justify-start mx-2"
             :class="msg.creatorId === thisUser.id ? 'flex-row-reverse' : 'flex-row'"
             v-for="msg in componentData.messageList">
          <div class="chat-board__msg-inner max-w-96">
            <div class="contact-name mb-0.5" :class="isMyPostChat(msg.creatorId) ? 'text-right' : 'text-left'">
              {{ isMyPostChat(msg.creatorId) ? '我' : props.chat.name }}
            </div>
            <div
                class="msg-contain border rounded-xl border-gray-500 mb-2 p-2"
                :class="isMyPostChat(msg.creatorId) ? 'bg-green-500 text-white' : 'bg-white text-black'">
              {{ msg.contain }}
            </div>
          </div>
          <!--          <div class="chat-board__msg-portrait">-->

          <!--          </div>-->
        </div>
      </div>
      <div class="chat-board__input-wrap relative h-28" v-if="props.chat.name !== '系统通知'">
        <el-input type="textarea" v-model="componentData.msgDto.contain" :rows="5" resize="none"
                  maxlength="200" @keydown.enter="onMsgSendClick" placeholder="按Enter发送消息"></el-input>
        <el-button class="chat-board__send-btn absolute bottom-1 right-1" type="primary" @click="onMsgSendClick" circle>
          <el-icon>
            <ChatLineSquare/>
          </el-icon>
        </el-button>
      </div>
    </div>
    <div v-else class="chat-board__empty">请从左边栏选取聊天对象。</div>
  </div>
</template>

<script setup>
import {reactive, watch, computed, ref, nextTick} from "vue";
import {ChatLineSquare} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import RequestUtil from "@/utils/RequestUtil";

const store = useStore();

let msgBoxRef = ref(null);
let componentData = reactive({
  messageList: [],
  msgDto: {
    contain: "",
    receiverId: "",
    type: "message"
  },
})

let props = defineProps({
  chat: {
    type: Object,
    default: () => {
      return {
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
    }
  }
})

let thisUser = store.getters.getUserInfo

/**
 * @function isMyPostChat (computed function)
 * @description 是我发的聊天信息？
 * @param {String} creatorId 消息创建者id
 * */
let isMyPostChat = computed(function () {
  return (creatorId) => {
    return creatorId === thisUser.id
  }
})

/**
 * @function scrollToChatBottom
 * @description 滚动到聊天框底部
 * */
const scrollToChatBottom = () => {
  msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight;
}

/**
 * @function onMsgSendClick
 * @description 发送消息按下
 * */
const onMsgSendClick = () => {
  // 向后端传输DTO，但是本地显示需要用到msg
  let msg = {
    contain: componentData.msgDto.contain,
    createdDate: new Date().getTime(),
    creatorId: thisUser.id,
    id: "",
    messageType: "message",
    read: false,
    receiverId: props.chat.id,
    removedUserIds: [],
    type: "message"
  }
  if (componentData.msgDto.contain.trim() !== "") {
    msg.receiverId = props.chat.id
    msg.type = "message"
    RequestUtil.postSendMessage(componentData.msgDto)
        .then(r => r.text())
        .then(res => {
          // 向后端发送消息后继续填充信息，push到聊天框中
          // res 即消息id
          msg.id = res
          componentData.messageList.push(msg)
          componentData.msgDto.contain = ""
          nextTick(scrollToChatBottom)
        })
  }
}

watch(() => props.chat,
    () => {
      // chatList.chats = props.chat
      componentData.msgDto.receiverId = props.chat.id;
      // console.log('componentData.msgDto.receiverId', componentData.msgDto.receiverId)
      // console.log('watch', props.chat)
      componentData.messageList = props.chat.messageList
      nextTick(() => {
        scrollToChatBottom()
        // 向后端发送已读消息，不必等返回值
        if (props.chat.messageList[props.chat.messageList.length - 1].creatorId !== thisUser.id) {
          RequestUtil.getMessageRead([props.chat.messageList[props.chat.messageList.length - 1].id])
        }
      })
    }
)

defineExpose({
  props,
  data: () => componentData,
  methods: {
    onMsgSendClick,
    scrollToChatBottom
  },
})
// console.log('this user is ', thisUser)
</script>

<style scoped>
.chat-board {
  width: 550px;
}

.chat-board__msg-wrap {
  word-wrap: break-word;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  /*line-clamp: 3;*/
  /*-webkit-line-clamp: 3;*/
}

.chat-board__notice-height {
  height: calc(550px - 2.5rem)
}

.chat-board__chat-user {
  /*底部阴影*/
  /*box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.1);*/
}

</style>
