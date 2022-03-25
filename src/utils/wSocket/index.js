import Notification, {msgDuration, msgType} from "@/utils/basic/Notification";


export default {
  /**
   * @function messageHandler
   * @description WebSocket消息处理
   * @param {Object} message 消息
   * */
  messageHandler: (message = {
    contain: "",
    createdDate: "",
    creatorId: "",
    id: "",
    level: "",
    messageType: "message",
    objectId: "",
    read: false,
    receiverId: ""
  }) => {
    Notification.Notify(
      `<p>来自<strong>${message.creatorId}</strong>的消息</p>
            <p>${message.contain.substring(0, 50)}</p>`,
      {title: '新消息提醒', duration: msgDuration.SHORT, type: msgType.INFO, HTML: true})
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
    // console.log('messageHandler', message)
    Notification.Notify(
      `
        <p>${message.contain}</p>
        <p>时间：${message.createdDate}</p>
        <a href="#/house/detail?id=${message.objectId}">
            <p>点击此处查看详情</p>
        </a>`,
      {
        title: "新的租入消息：",
        type: message.level === "info" ? msgType.INFO : msgType.WARNING,
        duration: msgDuration.LONG,
        HTML: true
      })
  },
  /**
   * @function errorHandler
   * @description WebSocket错误处理
   * @param {Object} error 错误
   * */
  errorHandler: (error) => {
    console.log('errorHandler', error)
  }
}
