import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

// 简历列表
export function queryResumeList(data) {
  return request({
    url: "/admin/job/queryResumeList",
    method: "post",
    data: data,
  });
}
// 岗位列表
export function queryPostList(data) {
  return request({
    url: "/admin/job/queryPostList",
    method: "post",
    data: data,
  });
}
// 企业列表
export function queryEnterpriseList(data) {
  return request({
    url: "/admin/job/queryEnterpriseList",
    method: "post",
    data: data,
  });
}

//
// 查询企业名称
export function queryEnterpriseName(data) {
  return request({
    url: "/admin/maintenance/queryEnterpriseName?query=" + data,
    method: "get",
  });
}

//编辑企业信息
export function editEnterpriseInfo(data) {
  return request({
    url: "/admin/maintenance/editEnterpriseInfo",
    method: "post",
    data: data,
  });
}

// 查询职位类型
export function queryPositionType(params) {
  return request({
    url: `/admin/job/queryPositionType?pid=${params}`,
    method: "get",
  });
}
// 编辑职位类型
export function editPositionType(data) {
  return request({
    url: "/admin/job/editPositionType",
    method: "post",
    data: data,
  });
}
// 下架/删除简历
export function handleResumeStatus(data) {
  return request({
    url: "/admin/job/handleResumeStatus",
    method: "post",
    data: data,
  });
}
// 下架/删除岗位
export function handlePostStatus(data) {
  return request({
    url: "/admin/job/handlePostStatus",
    method: "post",
    data: data,
  });
}
// 查询简历详情
export function getResumeDetail(params) {
  return request({
    url: `/admin/job/getResumeDetail?id=${params}`,
    method: "get",
  });
}
// 查询岗位详情
export function getPostDetail(params) {
  return request({
    url: `/admin/job/getPostDetail?id=${params}`,
    method: "get",
  });
}
// 查询企业类型
export function queryEnterpriseType(params) {
  return request({
    url: `/admin/job/queryEnterpriseType`,
    method: "get",
  });
}
// 编辑企业类型
export function editEnterpriseType(data) {
  return request({
    url: "/admin/job/editEnterpriseType",
    method: "post",
    data: data,
  });
}
// 查询福利
export function queryWelfare(params) {
  return request({
    url: `/admin/job/queryWelfare`,
    method: "get",
  });
}
// 编辑福利
export function editWelfare(data) {
  return request({
    url: "/admin/job/editWelfare",
    method: "post",
    data: data,
  });
}
// 删除福利
export function deleteWelfare(params) {
  return request({
    url: `/admin/job/deleteWelfare?id=${params.id}`,
    method: "get",
  });
}

//获取企业详情
export function getEnterpriseInfo(params) {
  return request({
    url: `/admin/maintenance/getEnterpriseInfo?uid=${params.uid}`,
    method: "get",
  });
}
