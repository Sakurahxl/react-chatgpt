import system_prompt from '@/pages/chatgpt/systemPrompt';
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

// 存入提示词
export function setPrompt(prompt:string) {
    localStorage.setItem('prompt', prompt);
    setUnload('true');
}

// 获取提示词
export function getPrompt() {
    const prompt = localStorage.getItem('prompt');
    if (!prompt) {
        setPrompt(system_prompt);
    }
    return prompt || system_prompt;
}

// 组件状态
export function setUnload(unload:string) {
    localStorage.setItem('unload', unload);
}

// 是否卸载组件
export function getUnload() {
    const unload = localStorage.getItem('unload');
    setUnload('false');
    return unload || 'false';
}