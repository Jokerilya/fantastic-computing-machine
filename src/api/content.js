import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

// 公告列表
export function queryNoticeFn(data) {
  return request({
    url: "/admin/operation/queryOperationNews",
    method: "post",
    data: data
  });
}
// 添加编辑公告详情
export function editNoticeFn(data) {
  return request({
    url: "/admin/operation/editOperationNews",
    method: "post",
    data: data
  });
}
// 开启/关闭公告
export function handleRoleStatusFn(data) {
  return request({
    url: "/admin/notice/handleNoticeStatus",
    method: "get",
    params: data
  });
}
// 公告详情
export function getNoticeDetailFn(data) {
  return request({
    url: "/admin/operation/getOperationNewsDetail",
    method: "get",
    params: data
  });
}
// 删除公告详情
export function delNoticeFn(data) {
  return request({
    url: "/admin/operation/delOperationNews",
    method: "get",
    params: data
  });
}
// 获取意见反馈列表
export function queryOpinionLabelFn(data) {
  return request({
    url: "/admin/operation/queryOperationFeedback",
    method: "post",
    data: data
  });
}
// 编辑意见反馈
export function editOpinionLabelFn(data) {
  return request({
    url: "/admin/operation/handleOperationFeedback",
    method: "post",
    data: data
  });
}
