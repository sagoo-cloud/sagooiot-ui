import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			(<any>config.headers).common['Authorization'] = `Bearer ${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		const code = response.data.code
		if (code === 401) {
			ElMessageBox.alert('登录状态已过期，请重新登录', '提示', { confirmButtonText: '确定' })
				.then(() => {
					Session.clear(); // 清除浏览器全部临时缓存
					window.location.href = '/'; // 去登录页
				})
				.catch(() => { });
		} else if (code !== 0) {
			ElMessage.error(res.message)
			return Promise.reject(new Error(res.message))
		} else {
			// 分页的数据
			if (res.data?.Total !== undefined) {
				return {
					list: res.data.Data,
					total: res.data.Total,
					page: res.data.currentPage,
					...res.data,
				}
			}
			if (res.data?.Data) {
				return res.data.Data 
			}
			if (res.data?.Data === undefined) {
				return res.data
			}
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;

export function get(url: string, params?: any): any {
	return service({
		url,
		method: "get",
		params
	})
}

export function post(url: string, data?: any): any {
	return service({
		url,
		method: "post",
		data
	})
}
export function put(url: string, data?: any): any {
	return service({
		url,
		method: "put",
		data
	})
}
export function del(url: string, data?: any): any{
	return service({
		url,
		method: "delete",
		data
	})
}
