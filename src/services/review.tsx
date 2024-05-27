import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

export const sendReview = async (content: string, aid: string) => {
  const review = {
    aid: aid,
    content: content,
    account: localStorage.getItem("loggedIn"),
    name: sessionStorage.getItem("userName"),
    avatar: sessionStorage.getItem("userAvatar"),
    createTime: new Date().toISOString(),
  };
  const data = await axios.post(`${URL_PREFIX}/sendReview`, review, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getReviews = async (aid: string) => {
  const data = await axios.get(`${URL_PREFIX}/getReviews?aid=${aid}`);
  return data.data;
};
