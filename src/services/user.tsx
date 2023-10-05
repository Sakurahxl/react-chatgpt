import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";
import { history } from "umi";
import { setLoginStatus } from "./auth";

// 登录
export const login = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/login`, params);
  if (data.status === 200 && data.data == 'Login successfully') {
    setLoginStatus(params.account);
    history.push("/home");
  }
  
};

// 注册
export const register = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/register`, params);
  if (data.status === 200 && data.data == 'Register successfully')
    return false;
  return true;
};


// 获取用户信息
export const getInfo = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/search`, params);
  return data.data;
};

