import axios from "axios";
import { URL_PREFIX, URL_PREFIX_WS } from "./config";
import { getLoginStatus } from "./auth";
import { formatDate } from "@/utils/datetime";
import { get } from "node_modules/axios/index.cjs";

//断开 重连倒计时
let timeout: null | NodeJS.Timeout = null;
let toUser: string;
let chatMsg: string;
let contactId: number;
let websocket: WebSocket;
let currentChatHistory = [];
let friendsList: any[] = [];
let hasUnread: boolean = true;

// export const fromateDate = (end_time: string) => {
//   let end_str = end_time.replace(/-/g, "/");
//   let end_date: any = new Date(end_str); //将字符串转化为时间

//   let now_str = new Date().toLocaleDateString() + " 23:59:59";
//   let now_date: any = new Date(now_str);
//   let num = (now_date - end_date) / (1000 * 3600 * 24);
//   if (num < 1) {
//     return end_date.getHours() + ":" + end_date.getMinutes();
//   } else if (num >= 1 && num < 2) {
//     return "昨天";
//   } else {
//     return end_date.toLocaleDateString();
//   }
// };

// 当点击用户想要打开对话框时 发送下面两个请求 拿历史记录、建立连接
export const getChatHistory = async (toUser: string) => {
  const fromUser = getLoginStatus();
  const data = await axios.get(`${URL_PREFIX}/chat/getChatRecords/`, {
    params: { toUser, fromUser, startIndex: 0, pageSize: 10 },
  });
  console.log(data);

  return data.data;
};

export const getChatSatus = async (toUser: string) => {
  const data = await axios.get(`${URL_PREFIX}/chat/getChatStatus/${toUser}`);
  // 建立连接的同时会把全部消息设置为已读 这个因为没有重新去请求后台，所以自己做一个就行
  let index = friendsList.findIndex((item) => {
    return item.contact == toUser;
  });
  friendsList[index].unread = 0;
  console.log(data);

  return data.data;
};

// 建立websocket连接
export const initWebSocket = () => {
  const target = `${URL_PREFIX_WS}/websocket`;
  //判断当前浏览器是否支持WebSocket
  if ("WebSocket" in window) {
    websocket = new WebSocket(target);
  } else {
    console.log("浏览器不支持websocket");
    return;
  }
  //连接发生错误的回调方法
  websocket.onerror = () => {
    initWebSocket();
    console.log("连接发生错误！尝试重新连接！");
  };
  //连接关闭的回调方法
  websocket.onclose = () => {
    console.log("关闭连接！");
  };

  //连接成功建立的回调方法
  websocket.onopen = (event) => {
    console.log("连接成功！");
  };

  websocket.onmessage = (event) => {
    let chatContent = JSON.parse(event.data);
    console.log(chatContent);
    if (chatContent.sendUser == toUser) {
      // 如果文档的高度-折叠起来的高度 == clientHeight
      // 就是没有滚动 直接拉到底部
      // 如果文档的高度-折叠起来的高度 > clientHeight+10px 在查看历史记录状态
      // else  就是在底部的状态 直接拖到底

      // 记住当前正在浏览的历史记录的bottom
      let scrollBottom = 0;
      let isScanHistory = false;

      //   this.$nextTick(() => {
      //     var container = this.$el.querySelector("#chatContainer");
      //     if (container.scrollHeight - container.scrollTop > container.clientHeight) {
      //         // 表示在查看历史记录  显示按钮  并保持不动
      //         isScanHistory = true;
      //         // 记住当前正在浏览的历史记录的bottom
      //         scBottom = container.scrollHeight - container.scrollTop - container.offsetHeight;
      //     }
      // });

      // 将消息放进去对应的数组中
      // 这里要格式化时间
      chatContent.sendTime = formatDate(
        chatContent.sendTime,
        "yyyy-mm-dd hh:mm:ss"
      );
      currentChatHistory.push(chatContent);

      //   // 放进去之后 根据是否是在浏览历史记录 来做不同的处理
      //   this.$nextTick(() => {
      //     var container = this.$el.querySelector("#chatContainer");
      //     if (isScanHistory) {
      //       // 表示在查看历史记录  显示按钮  并保持不动
      //       container.scrollTop =
      //         container.scrollHeight - container.offsetHeight - scBottom;
      //       this.hasUnread = true;
      //     } else {
      //       // 表示处于聊天整天 直接拉到底部
      //       container.scrollTop = container.scrollHeight;
      //       this.hasUnread = false;
      //     }
      //   });

      //   设置上一条消息
      var index = friendsList.findIndex((item) => {
        return item.friendName == toUser;
      });
      // if (index != -1) {
      //     // 说明找到了 将其的unread+1
      //     this.$set(this.friendsList[index], 'unread', parseInt(this.friendsList[index].unread) + 1);
      //     console.log(parseInt(this.friendsList[index].unread) + 1);
      //     // 设置当前好友的上一条消息为这个
      //     this.$set(this.friendsList[index], 'lastMessage', chatContent.content);

      // } else {
      //     console.log('发出去的消息经过这里了！' + chatContent);
      // }
    }
  };
  window.onunload = async () => {
    var url = `${URL_PREFIX}/chat/resetWindows`;
    await axios.get(url);
  };
};

// 重新连接
export const reconnect = () => {
  let lockReconnect = true; //避免重复连接
  //没连接上会一直重连，设置延迟避免请求过多
  timeout && clearTimeout(timeout);
  // 如果到了这里断开重连的倒计时还有值的话就清除掉
  timeout = setTimeout(() => {
    //然后新连接
    initWebSocket();
    lockReconnect = false;
  }, 5000);
};

// 发送消息
export const websocketSend = () => {
  let content = {
    message: chatMsg,
    toUser: toUser,
    contactId: contactId,
    sendUser: getLoginStatus(),
    sendTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
  };
  // 发送消息
  websocket.send(JSON.stringify(chatMsg));
  // 添加進去聊天历史列表
  currentChatHistory.push(content);

  // 设置上一条消息为这一条 暂时不确定 应该不需要这个
  var index = friendsList.findIndex((item) => {
    return item.friendName == toUser;
  });
  // if (index != -1) {
  //     // 说明找到了 将其的unread+1
  //     this.$set(friendsList[index], 'lastMessage', this.msgContent);
  // } else {
  //     console.log('没有将这个发出去的消息设置为未读消息那里！！' + content);
  // }

  // 清空输入内容框
  chatMsg = "";
  // 将历史记录滚动到底部
  scrollBottom();
};

// export const getChatList= async () => {
//     const fromUser = getLoginStatus();
//     const data = await axios.get(`${URL_PREFIX}/chat/getChatList/`, {
//         params: { fromUser }
//     });
//     console.log(data);
//     return data.data;
// }

// // 向上滚动获取历史记录
// scrollHistory: async function(event) {
//     var sHeight = 0;
//     this.$nextTick(() => {
//         var container = this.$el.querySelector("#chatContainer");
//         // 记住当前文档的高度
//         sHeight = container.scrollHeight;
//     });
//     if (event.target.scrollTop == 0) {
//         // 更新聊天记录
//         // 当前有多少条记录
//         var currentIndex = this.currentChatHistory.length;
//         var pageSize = 6;
//         var url = '/chat/getChatRecords/' + this.currentFriendName + '?startIndex=' + currentIndex + '&pageSize=' + pageSize;
//         var history = await axios.get(url);
//         var tempHistory = history.data.data;
//         this.currentChatHistory = tempHistory.concat(this.currentChatHistory);

//         this.$nextTick(() => {
//             var container = this.$el.querySelector("#chatContainer");
//             // 当前文档总高度-刚刚记录的文档的高度 就是需要被折叠起来的高度
//             container.scrollTop = container.scrollHeight - sHeight;
//         });
//     }
//     // 滚动到底部时 自动消失那个提示框
//     this.$nextTick(() => {
//         var container = this.$el.querySelector("#chatContainer");
//         if (container.scrollHeight - container.scrollTop <= container.clientHeight) {
//             this.hasUnread = false;
//         }
//     });

// },

// 聊天记录滚动到底部实现
const scrollBottom = () => {
  // let container = this.$el.querySelector("#chatContainer");
  // container.scrollTop = container.scrollHeight;
  hasUnread = false;
};

// 隐藏显示是否滚动到下面的按钮
const hideUnreadBtn = () => {
  hasUnread = false;
};
