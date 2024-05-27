import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

// 获取热搜词
export const getHotwords = async () => {
  const data = await axios.get(`${URL_PREFIX}/search/hotword`);
  return data.data;
};

// 获取搜索建议
export const getSuggests = async (content: string) => {
  const data = await axios.get(`${URL_PREFIX}/search/suggest`, {
    params: {
      word: content,
    },
  });
  return data.data;
};

// 获取搜索结果
export const getSearchResult = async (params: {
  keyword: string;
  page: number;
  size: number;
  searchType: string;
  order: string;
}) => {
  const searchRequest = {
    keyword: params.keyword,
    page: params.page,
    size: params.size,
    searchType: params.searchType,
    order: params.order,
  };
  const data = await axios.post(`${URL_PREFIX}/search`, searchRequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.data;
};

// 获取搜索历史
export const getSearchRecord = async () => {
  let account = localStorage.getItem("loggedIn");
  const data = await axios.get(`${URL_PREFIX}/getSearchRecord?account=${account}`);
  return data.data;
};

// 删除搜索历史
export const deleteSearchRecord = async () => {
  let account = localStorage.getItem("loggedIn");
  const data = await axios.get(`${URL_PREFIX}/deleteSearchRecord?account=${account}`);
  return data.data;
};

// 添加搜索历史
export const addSearchRecord = async (content: string) => {
  let account = localStorage.getItem("loggedIn");
  let searchRecord = {
    account: account,
    content: content,
    createTime: new Date().toISOString(),
  };
  const data = await axios.post(`${URL_PREFIX}/addSearchRecord`, searchRecord, {
    headers: {
      "Content-Type": "application/json",
    },});
  return data.data;
}

