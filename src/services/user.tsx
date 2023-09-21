import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";
import { history } from "umi";

// 登录
export const login = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/login`, params);
  if (data.status === 200 && data.data == 'Login successfully') history.push("/chatgpt");
};

// 注册
export const register = async (params: any) => {
  const data = await axios.post(`${URL_PREFIX}/register`, params);
  if (data.status === 200 && data.data == 'Register successfully')
    return false;
  return true;
};
