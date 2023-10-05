import { history } from 'umi';

// 从本地存储中获取登录状态
export function getLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    return loggedIn || '';
}

// 设置登录状态到本地存储
export function setLoginStatus(loggedIn:string) {
    localStorage.setItem('loggedIn', loggedIn);
}

// 登出
export function getLogout() {
    localStorage.removeItem('loggedIn');
    history.push("/");
}
