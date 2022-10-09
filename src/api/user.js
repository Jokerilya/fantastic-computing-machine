import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 用户信息列表
export function queryUserInfoFn(data) {
	return request({
		url: '/admin/userInfo/queryUserInfo',
		method: 'post',
		data: data,
	});
}
//师傅列表
export function getMasterList(data) {
	return request({
		url: '/admin/maintenance/queryMasterList',
		method: 'get',
		params: data,
	});
}
// 指派师傅
export function handleAssignMaster(data) {
	return request({
		url: '/admin/maintenance/handleAssignMaster',
		method: 'post',
		data
	});
}
// 指派师傅
export function getRepairOrderDetail(data) {
	return request({
		url: '/admin/maintenance/getRepairOrderDetail',
		method: 'get',
		params:data,
	});
}
//企业信息列表
export function getEnterpriseList(data) {
	return request({
		url: '/admin/maintenance/queryEnterpriseList',
		method: 'get',
		params: data,
	});
}
// 启用/禁用
export function editUserInfoStatusFn(data) {
	return request({
		url: '/admin/userInfo/handleUserInfoStatus',
		method: 'get',
		params: data,
	});
}
// 用户等级信息
export function queryLevelInfoFn(data) {
	return request({
		url: '/admin/userInfo/queryLevelInfo',
		method: 'post',
		data: data,
	});
}
// 用户账户信息
export function handleAccountEditFn(data) {
	return request({
		url: '/admin/userInfo/handleAccountEdit',
		method: 'post',
		data: data,
	});
}
// 用户钱包流水列表
export function getqueryMoney(data) {
	return request({
		url: '/admin/userInfo/queryMoney',
		method: 'post',
		data: data,
	});
}
// 启用/禁用
export function editUservip(data) {
	return request({
		url: '/admin/userInfo/toVip',
		method: 'post',
		data: data,
	});
}
// 用户等级详情
export function getLevelInfoDetailFn(data) {
	return request({
		url: '/admin/userInfo/getLevelDetail',
		method: 'get',
		params: data,
	});
}
// 编辑等级
export function editLevelInfoFn(data) {
	return request({
		url: '/admin/userInfo/editLevelInfo',
		method: 'post',
		data: data,
	});
}
// 审核
export function handleBranchExamineFn(data) {
	return request({
		url: '/admin/userInfo/handleBranchExamine',
		method: 'get',
		params: data,
	});
}
// 用户金额明细
export function queryMoneyFn(data) {
	return request({
		url: '/admin/userInfo/queryMoney',
		method: 'post',
		data: data,
	});
}
// 用户团队
export function queryTeamFn(data) {
	return request({
		url: '/admin/userInfo/queryTeam',
		method: 'post',
		data: data,
	});
}
// 修改推荐人
export function handleEditParentFn(data) {
	return request({
		url: '/admin/userInfo/handleEditParent',
		method: 'post',
		data: data,
	});
}
// 用户积分明细
export function queryPointFn(data) {
	return request({
		url: '/admin/userInfo/queryPoint',
		method: 'post',
		data: data,
	});
}
// 用户收益明细
export function queryProfitFn(data) {
	return request({
		url: '/admin/userInfo/queryProfit',
		method: 'post',
		data: data,
	});
}
// 设置会员等级/手机号
export function editUserInfoFn(data) {
	return request({
		url: '/admin/userInfo/editUserInfo',
		method: 'post',
		data: data,
	});
}
// 用户提现记录
export function queryWithdrawalFn(data) {
	return request({
		url: '/admin/userInfo/queryWithdrawal',
		method: 'post',
		data: data,
	});
}
// 用户提现审核
export function handleWithdrawalExamineFn(data) {
	return request({
		url: '/admin/userInfo/handleWithdrawalExamine',
		method: 'post',
		data: data,
	});
}
// 用户提现导出
export function handleWithdrawalExportFn(data) {
	return request({
		url: '/admin/userInfo/handleWithdrawalExport',
		method: 'post',
		responseType: 'blob',
		data: data,
	});
}
// 用户设置为合伙人
export function handleUserInfoPartnerFn(data) {
	return request({
		url: '/admin/userInfo/handleUserInfoPartner',
		method: 'get',
		params: data,
	});
}
// 修改代理身份
export function handleUserInfoAgentFn(data) {
	return request({
		url: '/admin/userInfo/handleUserInfoAgent',
		method: 'post',
		data: data,
	});
}
// 获取代理列表
export function queryUserInfoAgentFn(data) {
	return request({
		url: '/admin/userInfo/queryUserInfoAgent',
		method: 'post',
		data: data,
	});
}
// 获取账目列表
export function queryPayFn(data) {
	return request({
		url: '/admin/userInfo/queryPay',
		method: 'post',
		data: data,
	});
}
// 获取账目列表导出
export function payExportFn(data) {
	return request({
		url: '/admin/userInfo/payExport',
		method: 'post',
		responseType: 'blob',
		data: data,
	});
}

// 查询代理补货库存
export function queryAgentStock(data) {
	return request({
		url: '/admin/userInfo/queryAgentStock',
		method: 'get',
		params: data,
	});
}

// 修改
export function handleStockClick(data) {
	return request({
		url: '/admin/userInfo/handleStockClick',
		method: 'post',
		data: data,
	});
}
