import Notification, {msgDuration, msgType} from "@/utils/basic/Notification";


export default {
  /**
   * @function messageHandler
   * @description WebSocket消息处理
   * @param {Object} message 消息
   * */
  messageHandler: (message) => {
    console.log('messageHandler', message)
  },
  /**
   * @function noticeHandler
   * @description WebSocket通知处理
   * @param {Object} message 消息
   * */
  noticeHandler: (message = {
    contain: "",
    createdDate: "",
    creatorId: "",
    id: "",
    level: "",
    messageType: "notice",
    objectId: "",
    read: false,
    receiverId: ""
  }) => {
    console.log('messageHandler', message)
    Notification.Notify(
      `<a href="/#/house/detail?id=${message.objectId}" target="_blank" style="text-decoration: none">
        <p>${message.contain}</p>
        <p>时间：${message.createdDate}</p>
        <p>点击此处查看详情</p>
        </a>`,
      {
        title: "新的租入消息：",
        type: message.level === "info" ? msgType.INFO : msgType.WARNING,
        duration: msgDuration.LONG,
        HTML: true
      })
  }

}
