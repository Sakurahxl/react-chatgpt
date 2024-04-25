import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";
import { history } from "umi";
import { getLogout, setLoginStatus } from "./auth";

// 登录
export const login = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/login`, params);
  if (data.status === 200 && data.data == "Login successfully") {
    setLoginStatus(params.account);
    history.push("/home");
  }
};

// 注销
export const logon = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/logon`, params);
  if (data.status === 200 && data.data == "Logon successfully") {
    getLogout();
  }
};

// 注册
export const register = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/register`, params);
  if (data.status === 200 && data.data == "Register successfully") return false;
  return true;
};

// 获取用户信息{account}
export const getInfo = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/search`, params);
  return data.data;
};

// 上传头像
export const uploadAvatar = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/uploadAvatar`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

// 更新用户信息
export const update = async (params: any) => {
  let user = {
    account: localStorage.getItem("loggedIn"),
    name: params.name,
    avatar: params.avatar[0].url,
    description: params.description,
    prompt: params.sPrompt,
  };
  const data = await axios.post(`${URL_PREFIX}/update`, user);
  return data.data;
};
