import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

export function login(data) {
	return request({
		url: '/admin/login/getUserToken',
		method: 'post',
		data: data,
	});
}
// 统计
export function queryStatisticsFn(data) {
	return request({
		url: '/admin/base/queryStatistics',
		method: 'get',
		params: data,
	});
}
// 获取默认自提地址
export function getSysAddrFn(data) {
	return request({
		url: '/admin/base/getSysAddr',
		method: 'get',
		params: data,
	});
}
// 修改默认自提地址
export function editSysAddrFn(data) {
	return request({
		url: '/admin/base/editSysAddr',
		method: 'post',
		data: data,
	});
}


// 获取首页图表统计数据
export function queryChartStatistics(params) {
	return request({
		url: '/admin/base/queryChartStatistics',
		method: 'get',
		params,
	});
}
// 获取首页基础统计数据
export function queryStatistics(params) {
	return request({
		url: '/admin/base/queryStatistics',
		method: 'get',
		params,
	});
}
