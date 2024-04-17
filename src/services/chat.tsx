import axios from "axios";
import { URL_PREFIX } from "./config";
import { getLoginStatus } from "./auth";

export const fromateDate = (end_time:string) => {
    let end_str = end_time.replace(/-/g, "/");
    let end_date:any = new Date(end_str); //将字符串转化为时间 

    let now_str = new Date().toLocaleDateString() + ' 23:59:59';
    let now_date:any = new Date(now_str);
    let num = (now_date - end_date) / (1000 * 3600 * 24);
    if (num < 1) {
        return end_date.getHours() + ':' + end_date.getMinutes();
    } else if (num >= 1 && num < 2) {
        return '昨天';
    } else {
        return end_date.toLocaleDateString();
    }
}

// 当点击用户想要打开对话框时 发送下面两个请求 拿历史记录、建立连接
export const getChatHistory = async (toUser: string) => {
    const fromUser = getLoginStatus();
    const data = await axios.get(`${URL_PREFIX}/chat/getChatRecords/`, {
        params: { toUser, fromUser,startIndex: 0, pageSize: 10 },
    });
    console.log(data);
    
    return data.data;
}