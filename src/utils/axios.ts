import { Toast } from "antd-mobile";
import axios from "axios";

axios.defaults.timeout = 60000;
// 拦截网络异常
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 拦截网络响应
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.stack.indexOf("timeout") > -1) {
      Toast.show("Get timeout");
    } else if (error.response) {  
      Toast.show(error.response.data.message);
    }else {
      Toast.show("Network Error");
    }

    return Promise.reject(error);
  }
);

export default axios;
