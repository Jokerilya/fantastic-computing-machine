import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

// 商学院类型列表
export function querySchoolCategoryFn(data) {
  return request({
    url: "/admin/school/querySchoolCategory",
    method: "post",
    data: data
  });
}
// 编辑商学院类型
export function editSchoolCategoryFn(data) {
  return request({
    url: "/admin/school/editSchoolCategory",
    method: "post",
    data: data
  });
}
// 删除商学院类型
export function delSchoolCategoryFn(data) {
  return request({
    url: "/admin/school/delSchoolCategory",
    method: "get",
    params: data
  });
}
// 商学院类型下拉数据
export function getSchoolCategorySelectFn(data) {
  return request({
    url: "/admin/school/getSchoolCategorySelect",
    method: "get",
    params: data
  });
}
// 商学院数据列表
export function querySchoolDataFn(data) {
  return request({
    url: "/admin/schoolData/querySchoolData",
    method: "post",
    data
  });
}
// 添加/编辑商学院数据
export function editSchoolDataFn(data) {
  return request({
    url: "/admin/schoolData/editSchoolData",
    method: "post",
    data
  });
}
// 删除商学院数据
export function delSchoolDataFn(data) {
  return request({
    url: "/admin/schoolData/delSchoolData",
    method: "get",
    params: data
  });
}
// 商学院数据详情
export function schoolDataDetailFn(data) {
  return request({
    url: "/admin/schoolData/schoolDataDetail",
    method: "get",
    params: data
  });
}
