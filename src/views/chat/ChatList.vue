<template>
  <div class="chat-list">
    <div class="chat-list__body">
      <div class="chat-list__body-item mb-1" v-for="chat in chatList.chats">

        <div class="chat-list__body-item-content cursor-pointer h-full grid grid-cols-3 h-14 border rounded-full
          group hover:bg-indigo-600 hover:text-white p-1 transition-colors">
          <div class="portrait-wrap flex items-center">
            <img :src="chat.portrait" class="h-12 w-12 rounded-full col-span-1" ondragstart="return false" alt>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <span>{{ chat.name }}</span>
            <span class="chat-list__body-item-contain">{{
                chat.messageList[chat.messageList.length - 1].contain
              }}</span>
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
import {computed, onMounted, reactive, watch} from "vue";
import {MessageBox} from "@element-plus/icons-vue";

let props = defineProps(['chats'])
let chatList = reactive({
  chats: []
})


watch(() => props.chats, () => {
      chatList.chats = props.chats
      console.log(chatList.chats)
    }
)

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
