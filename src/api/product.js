import request from '@/utils/request';
import { publicData } from '@/webConfig.js';

// 分类列表
export function queryProductCategoryFn(data) {
	return request({
		url: '/admin/product/queryProductCategory',
		method: 'get',
		params: data,
	});
}
// *配件商品分类列表
export function queryProductFittingCategoryFn(data) {
	return request({
		url: '/admin/product/queryProductFittingCategory',
		method: 'get',
		params: data,
	});
}
// 编辑分类
export function editProductCategoryFn(data) {
	return request({
		url: '/admin/product/editProductCategory',
		method: 'post',
		data: data,
	});
}
// 删除分类
export function delProductCategoryFn(data) {
	return request({
		url: '/admin/product/delProductCategory',
		method: 'get',
		params: data,
	});
}
// 商品列表
export function queryProductFn(data) {
	return request({
		url: '/admin/product/queryProduct',
		method: 'post',
		data: data,
	});
}
// 商品上下架
export function handleProductStatus(data) {
	return request({
		url: '/admin/product/handleProductDropOff',
		method: 'get',
		params: data,
	});
}
// 删除商品
export function delProductFn(data) {
	return request({
		url: '/admin/product/delProduct',
		method: 'get',
		params: data,
	});
}
// 商品详情
export function getProductDetailFn(data) {
	return request({
		url: '/admin/product/getProductDetail',
		method: 'get',
		params: data,
	});
}
// 编辑商品
export function editProductFn(data) {
	return request({
		url: '/admin/product/editProduct',
		method: 'post',
		data: data,
	});
}
export function addProductFn(data) {
	return request({
		url: '/admin/product/addProduct',
		method: 'post',
		data: data,
	});
}
// 商品评论
export function queryProductEvaluateFn(data) {
	return request({
		url: '/admin/product/queryProductEvaluate',
		method: 'post',
		data: data,
	});
}
// 商品橱窗列表
export function queryProductCupboardFn(data) {
	return request({
		url: '/admin/product/queryProductCupboard',
		method: 'post',
		data: data,
	});
}
// 编辑商品橱窗
export function editProductCupboardFn(data) {
	return request({
		url: '/admin/product/editProductCupboard',
		method: 'post',
		data: data,
	});
}
// 商品橱窗显示/隐藏
export function productCupboardShowFn(data) {
	return request({
		url: '/admin/product/productCupboardShow',
		method: 'get',
		params: data,
	});
}
// 获取代理商品列表
export function queryProductAgentFn(data) {
	return request({
		url: '/admin/product/queryProductAgent',
		method: 'post',
		data: data,
	});
}
// 编辑代理商品
export function editProductAgentFn(data) {
	return request({
		url: '/admin/product/editProductAgent',
		method: 'post',
		data: data,
	});
}

/* 供应商管理 */

// 供应商列表
export function querySupplierList(data) {
	return request({
		url: '/admin/supplier/querySupplierList',
		method: 'post',
		data: data,
	});
}
// 新增/编辑供应商
export function editSupplier(data) {
	return request({
		url: '/admin/supplier/editSupplier',
		method: 'post',
		data: data,
	});
}
// 删除供应商
export function deleteSupplier(params) {
	return request({
		url: '/admin/supplier/deleteSupplier',
		method: 'get',
		params
	});
}
// 获取供应商详情
export function getSupplier(params) {
	return request({
		url: '/admin/supplier/getSupplier',
		method: 'get',
		params
	});
}

