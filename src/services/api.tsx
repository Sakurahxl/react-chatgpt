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
const model = OPENAI_API_MODEL || "gpt-3.5-turbo";
const sitePassword = SITE_PASSWORD || "";
const passList = sitePassword.split(",") || [];

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
  const data = await axios.post(
    `${baseUrl}/v1/chat/completions`,
    params,
    initOption
  );
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

// const configuration = new Configuration({
//   organization: "org-yjJZOHlI2ufy99J6SuudW0pQ",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();


