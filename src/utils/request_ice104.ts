import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import getOrigin from '/@/utils/origin'

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: getOrigin(import.meta.env.VITE_ICE104_API),
	// baseURL: 'http://jfg4xi.natappfree.cc',
	timeout: 120000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (localStorage.token) {
			(<any>config.headers).common['Authorization'] = `Bearer ${localStorage.token}`;
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
			ElMessageBox.alert('登录状态已过期，请重新登录', '提示',
				{ confirmButtonText: '确定', showCancelButton: false, closeOnHashChange: false, closeOnPressEscape: false, closeOnClickModal: false, showClose: false })
				.then(() => {
					localStorage.clear(); // 清除浏览器全部临时缓存
					window.location.href = '/'; // 去登录页
				})
				.catch(() => { });
		} else if (code === undefined && res.message === undefined) { // 可能是下载文件
			return response
		} else if (code !== 0) {
			ElMessage.closeAll()
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
			// if (res.data?.Data) {
			// 	return res.data.Data
			// }
			if (res.data?.Info && res.data?.Data) { // currentUser接口
				return res.data
			}
			if (res.data?.Data === undefined) {
				return res.data
			}
			return res.data.Data
		}
	},
	(error) => {
		ElMessage.closeAll()
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

export function get(url: string, params?: any, config?: any): any {
	return service({
		url,
		method: "get",
		...config,
		params
	})
}

export function post(url: string, data?: any, config?: any): any {
	return service({
		url,
		method: "post",
		...config,
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
export function del(url: string, data?: any): any {
	return service({
		url,
		method: "delete",
		data
	})
}


export function file(url: string, params?: any, method: 'get' | 'post' = 'get'): any {
	if (method === 'get') {
		return service({
			url,
			method,
			params,
			timeout: 120000,
			responseType: 'arraybuffer',
		});
	} else {
		return service({
			url,
			method,
			timeout: 120000,
			data: params,
			responseType: 'blob',
		});
	}
}
