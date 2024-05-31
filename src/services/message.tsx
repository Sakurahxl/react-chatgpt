import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

// 获取联系人
export const getContacts = async () => {
  const account = localStorage.getItem("loggedIn");
  const data = await axios.get(`${URL_PREFIX}/getContacts`, {
    params: { account },
  });  
  return data.data;
};

// 搜索联系人
export const searchContacts = async (account: string) => {
  const data = await axios.get(`${URL_PREFIX}/searchContacts`, {
    params: { account },
  });
  return data.data;
};

// 添加联系人
export const addContact = async (account: string) => {
  let params = {
    myAccount: localStorage.getItem("loggedIn"),
    addAccount: account,
  };
  const data = await axios.post(`${URL_PREFIX}/addContact`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};


// 删除联系人
export const delContact = async (account: string) => {
  let params = {
    myAccount: localStorage.getItem("loggedIn"),
    delAccount: account,
  };
  const data = await axios.post(`${URL_PREFIX}/delContact`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// 更新联系人状态
export const updateStatus = async (account: string, status: string) => {
  let params = {
    sent: account,
    confirmed: localStorage.getItem("loggedIn"),
    status,
  };
  const data = await axios.post(`${URL_PREFIX}/updateStatus`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};
