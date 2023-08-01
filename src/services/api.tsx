import axios from "axios";
import {
  OPENAI_API_KEY,
  HTTPS_PROXY,
  OPENAI_API_BASE_URL,
  HEAD_SCRIPTS,
  PUBLIC_SECRET_KEY,
  SITE_PASSWORD,
  OPENAI_API_MODEL,
} from "./config";
const apiKey = OPENAI_API_KEY;
const httpsProxy = HTTPS_PROXY;
const baseUrl = (OPENAI_API_BASE_URL || "https://api.openai.com")
  .trim()
  .replace(/\/$/, "");
const sitePassword = SITE_PASSWORD || "";
const passList = sitePassword.split(",") || [];

// 发送信息
// export const login = async function(params: any) {
// 	const { data } = await axios.post(`${userPrefix}/account/login`, params);
// 	return data;
// };