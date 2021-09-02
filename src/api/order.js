import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 订单列表
export function queryOrderFn(data) {
	return request({
		url: '/admin/order/queryOrder',
		method: 'post',
		data: data,
	});
}
// 订单详情
export function getOrderDetailFn(data) {
	return request({
		url: '/admin/order/getOrderDetail',
		method: 'get',
		params: data,
	});
}
// 订单发货
export function handleOrderSendFn(data) {
	return request({
		url: '/admin/order/handleOrderSend',
		method: 'post',
		data: data,
	});
}
// 订单审核
export function handleOrderExamineFn(data) {
	return request({
		url: '/admin/order/handleOrderExamine',
		method: 'post',
		data: data,
	});
}
// 获取物流公司列表
export function queryOrderBasicFn(data) {
	return request({
		url: '/admin/order/queryOrderBasic',
		method: 'get',
		params: data,
	});
}
// 获取物流详情
export function getOrderExp(data) {
	return request({
		url: '/admin/order/getOrderExp',
		method: 'get',
		params: data,
	});
}
// 订单导出
export function handleOrderExportFn(data) {
	return request({
		url: '/admin/order/handleOrderExport',
		method: 'post',
		responseType: 'blob',
		data: data,
	});
}


// 售后订单(退款订单)
export function queryOrderRefund(data) {
	return request({
		url: '/admin/order/queryOrderRefund',
		method: 'post',
		data: data,
	});
}
// 修改收货人信息
export function updateOrderReceiptInfo(data) {
	return request({
		url: '/admin/order/updateOrderReceiptInfo',
		method: 'post',
		data: data,
	});
}
