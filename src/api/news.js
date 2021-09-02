import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 获取资讯列表
export function queryOperationNews(data) {
	return request({
		url: '/admin/operation/queryOperationNews',
		method: 'post',
		data: data,
	});
}
// 获取资讯详情
export function getOperationNewsDetail(params) {
	return request({
		url: '/admin/operation/getOperationNewsDetail',
		method: 'get',
		params
	});
}

// 编辑资讯
export function editOperationNews(data) {
	return request({
		url: '/admin/operation/editOperationNews',
		method: 'post',
		data: data,
	});
}
// 删除资讯
export function delOperationNews(params) {
	return request({
		url: '/admin/operation/delOperationNews',
		method: 'get',
		params
	});
}