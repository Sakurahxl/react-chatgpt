import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

export const addAIChatRecord = async (content: string) => {
  const AIChatRecord = {
    account: localStorage.getItem("loggedIn"),
    content: content,
    createTime: new Date().toISOString(),
  };
  const data = await axios.post(`${URL_PREFIX}/addAIChatRecord`, AIChatRecord, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.data;
};
