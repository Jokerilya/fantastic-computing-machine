import axios from 'axios'
// import md5 from 'md5'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// import { setUserInfo, getMenuId, getUserInfo } from '@/utils/auth'
import { getToken } from '@/utils/auth';
require("es6-promise").polyfill()

// create an axios instance
// 创建一个axios请求实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})



service.interceptors.request.use(
  request => {
		if (store.getters.token) {
			request.headers['admin-token'] = getToken();
		}
    return request;
  }
)
// response interceptor
// 服务响应拦截
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，如头信息或状态信息
   * 请返回响应=>响应
   */
  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 你也可以通过HTTP状态码来判断状态
   */
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
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service