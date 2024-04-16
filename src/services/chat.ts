import axios from "axios";
import { URL_PREFIX } from "./config";

// 当点击用户想要打开对话框时 发送下面两个请求 拿历史记录、建立连接
export const getChatHistory = async (toUser: string) => {
    const data = await axios.get(`${URL_PREFIX}/chat/getChatRecords/`, {
        params: { toUser, startIndex: 0, pageSize: 10 },
    });
    return data.data;
}