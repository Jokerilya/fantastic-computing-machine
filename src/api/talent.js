import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 编辑线下培训信息
export function editOfflineTraining(data) {
	return request({
		url: '/admin/talentPool/editOfflineTraining',
		method: 'post',
		data: data,
	});
}
// 获取线下培训信息
export function getOfflineTraining(params) {
	return request({
		url: `/admin/talentPool/getOfflineTraining?id=${params}`,
		method: 'get'
	});
}
// 学院/企业列表
export function getqueryPartnerlList(data) {
	return request({
		url: '/admin/talentPool/queryPartnerlList',
		method: 'post',
		data: data,
	});
}
//编辑学院/企业列表
export function editPartnerlInfo(data) {
	return request({
		url: '/admin/talentPool/editPartnerlInfo',
		method: 'post',
		data: data,
	});
}
// 获取学院/企业详情
export function getPartnerlInfo(params) {
	return request({
		url: `/admin/talentPool/getPartnerlInfo?id=${params}`,
		method: 'get'
	});
}
//获取人才精英列表
export function getqueryPersonnelList(data) {
	return request({
		url: '/admin/talentPool/queryPersonnelList',
		method: 'post',
		data: data,
	});
}
//编辑精英列表
export function editPersonnelInfo(data) {
	return request({
		url: '/admin/talentPool/editPersonnelInfo',
		method: 'post',
		data: data,
	});
}
// 获取人才精英详情
export function getPersonnelInfo(params) {
	return request({
		url: `/admin/talentPool/getPersonnelInfo?id=${params}`,
		method: 'get'
	});
}
//线下培训列表
export function getqueryOfflineTrainingList(data) {
	return request({
		url: '/admin/talentPool/queryOfflineTrainingList',
		method: 'post',
		data: data,
	});
}
//线下培训报名列表
export function getqueryOfflineApply(data) {
	return request({
		url: '/admin/talentPool/queryOfflineApply',
		method: 'post',
		data: data,
	});
}
// 删除线下培训报名信息
export function deleteOfflineApply(params) {
	return request({
		url: `/admin/talentPool/deleteOfflineApply?id=${params}`,
		method: 'get'
	});
}
// 删除合作伙伴(学院/企业)
export function deletePartnerlInfo(params) {
	return request({
		url: `/admin/talentPool/deletePartnerlInfo?id=${params}`,
		method: 'get'
	});
}
// 删除人才精英
export function deletePersonnelInfo(params) {
	return request({
		url: `/admin/talentPool/deletePersonnelInfo?id=${params}`,
		method: 'get'
	});
}