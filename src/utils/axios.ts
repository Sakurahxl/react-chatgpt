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
    // let resData = response.data;
    // console.log(resData);

    // if (resData.code === 200) {
    //   return resData.data;
    // } else if (resData.code === -1) {
    //   Toast.show(resData.msg);
    //   //抛出异常
    //   return Promise.reject(new Error(resData.msg));
    // }
    return response;
  },
  (error) => {
    if (error && error.stack.indexOf("timeout") > -1) {
      Toast.show("请求超时");
    } else {
      Toast.show("网络错误");
    }
    return Promise.reject(error);
  }
);

export default axios;
