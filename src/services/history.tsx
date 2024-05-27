import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

export const getViewRecord = async () => {
  let account = localStorage.getItem("loggedIn");
  const data = await axios.get(
    `${URL_PREFIX}/getViewRecord?account=${account}`
  );
  return data.data;
};

export const addViewRecord = async (aid: string) => {
  let account = localStorage.getItem("loggedIn");
  let viewRecord = {
    account: account,
    aid: aid,
    createTime: new Date().toISOString(),
  };
  const data = await axios.post(`${URL_PREFIX}/addViewRecord`, viewRecord);
  return data.data;
};
