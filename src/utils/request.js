import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';

const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 50000,
});

service.interceptors.request.use(
	config => {
		if (store.getters.token) {
			config.headers['admin-token'] = getToken();
		}
		return config;
	},
	error => {
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	response => {
		if (response.config.responseType == 'blob') {
			return response;
		} else {
			const res = response.data;
			if (res.code == '000') {
				return res;
			} else if (res.code == '002' || res.code == '004' || res.code == '007') {
				store.dispatch('user/logout').then(() => {
					location.reload();
				});
			} else if (res.code == '009') {
				Message({
					message: '您暂无操作权限！',
					type: 'error',
					duration: 5 * 1000,
				});
			} else {
				Message({
					message: res.errorMessage || res.message || 'Error',
					type: 'error',
					duration: 5 * 1000,
				});
				return Promise.reject(new Error(res.errorMessage || res.message || 'Error'));
			}
		}
	},
	error => {
		console.log('err' + error); // for debug
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000,
		});
		return Promise.reject(error);
	}
);

export default service;
