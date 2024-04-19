//openai api
// # Your API Key for OpenAI
const OPENAI_API_KEY = "sk-f2XR85UmdnrPJq0dBBox6VDpFXAzC4aJL84MSg9KRexzNI9P";
// # Provide proxy for OpenAI API. e.g. http://127.0.0.1:7890
const HTTPS_PROXY = "";
// # Custom base url for OpenAI API. default: https://api.openai.com
const OPENAI_API_BASE_URL = "https://api.f2gpt.com";
// # Inject analytics or other scripts before </head> of the page
const HEAD_SCRIPTS = "";
// # Secret string for the project. Use for generating signatures for API calls
const PUBLIC_SECRET_KEY = "";
// # Set password for site, support multiple password separated by comma. If not set, site will be public
const SITE_PASSWORD = "";
// # ID of the model to use. https://platform.openai.com/docs/api-reference/models/list
const OPENAI_API_MODEL = "";
// 百度语音识别配置
const BAIDU_APP_KEY = "1S3rNYcZGyUqK1Uij17ZkpyD";
const BAIDU_APP_SECRET = "xNZ8MqIWgyvWIRNT9qD89Npnih2Bruuj";

// 本地
// const origin = "localhost:8866";
const origin = "82.157.238.203:8866";
// 线上
const URL_PREFIX = "http://" + origin;
const URL_PREFIX_WS = "ws://" + origin;


export {
  OPENAI_API_KEY,
  HTTPS_PROXY,
  OPENAI_API_BASE_URL,
  HEAD_SCRIPTS,
  PUBLIC_SECRET_KEY,
  SITE_PASSWORD,
  OPENAI_API_MODEL,
  BAIDU_APP_KEY,
  BAIDU_APP_SECRET,
  URL_PREFIX,
  URL_PREFIX_WS
};
