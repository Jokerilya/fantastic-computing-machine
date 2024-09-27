import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

// 获取banner列表
export function queryBannerFn(data) {
  return request({
    url: "/admin/operation/queryOperationAd",
    method: "post",
    data: data,
  });
}
// 编辑banner
export function editBannerFn(data) {
  return request({
    url: "/admin/operation/editOperationAd",
    method: "post",
    data: data,
  });
}
// 删除banner
export function delBannerFn(data) {
  return request({
    url: "/admin/operation/delOperationAd",
    method: "get",
    params: data,
  });
}

/*
 * ad图
 */
// 获取ad图
export function queryOperation(data) {
  return request({
    url: "/admin/operation/queryOperation",
    method: "post",
    data: data,
  });
}
// 编辑ad图
export function editOperation(data) {
  return request({
    url: "/admin/operation/editOperation",
    method: "post",
    data: data,
  });
}
// 盒子预约信息
export function queryBoxMessage(data) {
  return request({
    url: "/admin/base/queryBoxMessage",
    method: "post",
    data: data,
  });
}

/*
 * 优惠券部分  未启用
 */
// 优惠券列表
export function queryCoupon(data) {
  return request({
    url: "/admin/coupon/list",
    method: "post",
    data,
  });
}
// 添加/编辑优惠券
export function editCoupon(data) {
  return request({
    url: "/admin/coupon/addOrUpdate",
    method: "post",
    data,
  });
}
// 优惠券领取记录
export function couponRecords(data) {
  return request({
    url: "/admin/coupon/receiveRecords",
    method: "post",
    data,
  });
}
// 删除优惠券
export function delCoupon(data) {
  return request({
    url: "/admin/coupon/delete",
    method: "get",
    params: data,
  });
}
// 优惠券详情
export function couponDetail(data) {
  return request({
    url: "/admin/coupon/detail",
    method: "get",
    params: data,
  });
}

/* 合作伙伴 */
// 获取合作伙伴列表
export function queryPartner(data) {
  return request({
    url: "/admin/base/queryPartner",
    method: "post",
    data,
  });
}
// 编辑合作伙伴
export function editPartner(data) {
  return request({
    url: "/admin/base/editPartner",
    method: "post",
    data,
  });
}

// 删除合作伙伴
export function deletePartner(params) {
  return request({
    url: "/admin/base/deletePartner",
    method: "get",
    params,
  });
}

// 编辑活动产品
export function editActivityProduct(data) {
  return request({
    url: "/admin/activity/editActivityProduct",
    method: "post",
    data,
  });
}

// 查询活动产品列表
export function queryActivityProductList() {
  return request({
    url: "/admin/activity/queryActivityProductList",
    method: "get"
  });
}

// 上/下架活动产品
export function shelvesActivityProduct(data) {
  return request({
    url: "/admin/activity/shelvesActivityProduct",
    method: "post",
    data
  });
}

// 查询活动订单列表
export function queryActivityOrderList(data) {
  return request({
    url: "/admin/activity/queryActivityOrderList",
    method: "post",
    data
  });
}

// 查看活动订单详情
export function queryActivityOrderDetail(relationOrderSn) {
  return request({
    url: `/admin/activity/queryActivityOrderDetail?relationOrderSn=${relationOrderSn}`,
    method: "get"
  });
}

// 活动订单指派
export function handleActivityOrderAssign(data) {
  return request({
    url: "/admin/activity/handleActivityOrderAssign",
    method: "post",
    data
  });
}
