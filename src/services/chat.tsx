import axios from "axios";
import { URL_PREFIX } from "./config";
import { getLoginStatus } from "./auth";


let friendsList: any[] = [];


// 当点击用户想要打开对话框时 发送下面两个请求 拿历史记录、建立连接
export const getChatHistory = async (toUser: string) => {
  const fromUser = getLoginStatus();
  const data = await axios.get(`${URL_PREFIX}/chat/getChatRecords/`, {
    params: { toUser, fromUser, startIndex: 0, pageSize: 10 },
  }); 
  return data.data;
};

// 判断是否是第一次聊天
export const isFirstChat = async (toUser: string) => {
  const fromUser = getLoginStatus();
  const data = await axios.get(`${URL_PREFIX}/chat/isFirstChat/`, {
    params: { toUser, fromUser },
  });
  return data.data;
}



export const getChatList = async () => {
  const fromUser = getLoginStatus();
  const data = await axios.get(`${URL_PREFIX}/chat/getChatList/`, {
    params: { fromUser },
  });
  return data.data;
};

export const closeWindow = async () => {
  const account = getLoginStatus();
  await axios.get(`${URL_PREFIX}/chat/resetWindows/`, {
    params: { account },
  });
}


export const getContactId = async (toUser: string) => {
  const fromUser = getLoginStatus();
  const data = await axios.get(`${URL_PREFIX}/chat/getContactId/`, {
    params: { fromUser, toUser },
  });
  return data.data;
}

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

