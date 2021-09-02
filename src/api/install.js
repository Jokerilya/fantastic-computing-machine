import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 获取装机列表数据
export function queryInstallListFn(data) {
	return request({
		url: '/admin/product/queryProductInstall',
		method: 'post',
		data,
	});
}
// 获取配件商品分类
export function queryProductParts(data) {
	return request({
		url: '/admin/product/queryProductParts',
		method: 'post',
		data,
	});
}
// 查询关联商品
export function queryProductRelated(data) {
	return request({
		url: '/admin/product/queryProductRelated',
		method: 'post',
		data,
	});
}
// 获取装机信息
export function getProductInstall(params) {
	return request({
		url: '/admin/product/getProductInstall',
		method: 'get',
		params,
	});
}
// 添加/编辑装机
export function editProductInstall(data) {
	return request({
		url: '/admin/product/editProductInstall',
		method: 'post',
		data,
	});
}
// 删除装机
export function delProductInstall(params) {
	return request({
		url: '/admin/product/delProductInstall',
		method: 'get',
		params,
	});
}
// 添加/编辑配件商品分类
export function editProductParts(data) {
	return request({
		url: '/admin/product/editProductParts',
		method: 'post',
		data,
	});
}
// 删除配件商品分类
export function delProductParts(params) {
	return request({
		url: '/admin/product/delProductParts',
		method: 'get',
		params,
	});
}
// 获取装机配件分类列表信息
export function queryInstallProductParts(params) {
	return request({
		url: '/admin/product/queryInstallProductParts',
		method: 'get',
		params,
	});
}
// 运费模板
export function queryExpRule(data) {
	return request({
		url: '/admin/exp/queryExpRule',
		method: 'post',
		data,
	});
}

// 上架/下架商品
export function handleProductDropOff(params) {
	return request({
		url: '/admin/product/handleProductDropOff',
		method: 'get',
		params,
	});
}
// 装机型号列表
export function installedModelList(params) {
	return request({
		url: '/admin/product/installedModelList',
		method: 'get',
		params,
	});
}



// 查看装机型号数据
export function queryProductInstallModel(data) {
	return request({
		url: '/admin/product/queryProductInstallModel',
		method: 'post',
		data,
	});
}
// 添加/编辑装机型号
export function editProductInstallModel(data) {
	return request({
		url: '/admin/product/editProductInstallModel',
		method: 'post',
		data,
	});
}
// 删除装机型号
export function delProductInstallModel(params) {
	return request({
		url: '/admin/product/delProductInstallModel',
		method: 'get',
		params,
	});
}


