import axios from "@/utils/axios";
import {
  OPENAI_API_KEY,
  HTTPS_PROXY,
  OPENAI_API_BASE_URL,
  HEAD_SCRIPTS,
  PUBLIC_SECRET_KEY,
  SITE_PASSWORD,
  OPENAI_API_MODEL,
  BAIDU_APP_KEY,
  BAIDU_APP_SECRET,
} from "./config";
const apiKey = OPENAI_API_KEY;
const httpsProxy = HTTPS_PROXY;
const baseUrl = (OPENAI_API_BASE_URL || "https://api.openai.com")
  .trim()
  .replace(/\/$/, "");
const model = OPENAI_API_MODEL || "gpt-3.5-turbo";
const sitePassword = SITE_PASSWORD || "";
const passList = sitePassword.split(",") || [];
//百度配置
const baiduAppKey = BAIDU_APP_KEY;
const baidAppSecret = BAIDU_APP_SECRET;

export interface ErrorMessage {
  code: string;
  message: string;
}

// 发送信息
// export const login = async function(params: any) {
// 	const { data } = await axios.post(`${userPrefix}/account/login`, params);
// 	return data;
// };
export const send = async (messages: any) => {
  // 初始配置
  const initOption: any = generatePayload(apiKey);
  let params = {
    model,
    messages,
    temperature: 0.6,
  };
  const data = await axios
    .post(`${baseUrl}/v1/chat/completions`, params, initOption)
    .catch(() => {
      return { data: null };
    });
  return data;
};

const generatePayload = (
  apiKey: string
): RequestInit & { dispatcher?: any } => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});


export const getBaiduToken = async () => {
  let params = {
    grant_type: "client_credentials",
    client_id: baiduAppKey,
    client_secret: baidAppSecret,
  };
  const data = await axios.post(
    `https://openapi.baidu.com/oauth/2.0/token?grant_type=${params.grant_type}&client_id=${params.client_id}&client_secret=${params.client_secret}`
  );
  return data;
};

// 语音识别
export const speechRecognition = async (params: any) => {
  const initOption: any = {
    headers: {
      "content-type": "Content-Type: audio/amr;rate=8000",
    },
  };
  const data = await axios.post(
    `https://vop.baidu.com/server_api`,
    params,
    initOption
  );
  return data;
};
