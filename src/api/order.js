import request from '@/utils/request';
import { publicData } from '@/webConfig.js';




//平台审核报价
export function examineMasterQuotation(data) {
	return request({
		url: '/admin/maintenance/examineMasterQuotation',
		method: 'POST',
		data
	});
}
//查询管家订单详情
export function getButlerOrderDetail(data) {
	return request({
		url: '/admin/maintenance/getButlerOrderDetail',
		method: 'get',
		params:data
	});
}
//查询管家订单列表
export function queryButlerOrderList(data) {
	return request({
		url: '/admin/maintenance/queryButlerOrderList',
		method: 'post',
		data
	});
}
//查询系统类型
export function queryDeviceSystemList() {
	return request({
		url: '/admin/maintenance/queryDeviceSystemList',
		method: 'post',
		
	});
}
//查询设备类型
export function queryDeviceTypeList() {
	return request({
		url: '/admin/maintenance/queryDeviceTypeList',
		method: 'post',
		
	});
}
// 新增/录入管家订单
export function editButlerOrder(data) {
	return request({
		url: '/admin/maintenance/editButlerOrder',
		method: 'post',
		data
	});
}
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
// 平台定价
export function handleMasterQuotation(data) {
	return request({
		url: '/admin/maintenance/handleMasterQuotation',
		method: 'post',
		data:data
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
