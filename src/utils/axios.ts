import { message } from 'antd';
import axios from 'axios';
// import { getMessage, handleRedirect } from './util';


export function checkError(data: any, config: any) {
	const { status: code, message: msg } = data;
  if(data?.size||data?.type){ // 文件流类型直接返回
    return
  }
  if (code === 401) {
    // 延时1s后跳转登录，立即跳转会导致接口返回被取消， 导致前端没提示用户未登录
    setTimeout(() => {
			// tool.cookie.delete('accessToken');
			// tool.cookie.delete('isLogin');
      handleRedirect(() => {
    		message.error(getMessage('m1'));
			});
    }, 1000);
  } else if (code === 403) {
    setTimeout(() => {
			// tool.cookie.delete('accessToken');
			// tool.cookie.delete('isLogin');
			handleRedirect(() => {
				message.error(getMessage('m1'));
			});
		}, 1000)
  } else if (code === 500 || code === 503 || code === 504) {
    message.error(getMessage('m2'));
  } else if (code !== 200) {
		if (!config.hideMsg) {
			message.error(msg);
		}
	}
}
// Add a request interceptor
axios.interceptors.request.use(function (config) {
	// Do something before request is sent
  // const accessToken = tool.cookie.get('accessToken');
	// if (accessToken) {
	// 	config.headers.Authorization = accessToken;
	// }
	config.headers.accessKey = '136c18a50aba4684ba87810dc8fd487f';
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	const { data, config } = response;
	checkError(data, config);
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	if (error.response) {
		const { stauts: code } = error.response;
  	if (code === 500 || code === 503 || code === 504) {
			message.error(getMessage('m2'));
		}
	}
	return Promise.reject(error);
});

export default axios;