import request from "@/utils/request";

//设置师傅组别
export function handleMasterGroup(data) {
  return request({
    url: "/admin/other/handleMasterGroup",
    method: "post",
    data: data,
  });
}

//按组别查询师傅名称
export function queryMasterByGroupId(id) {
  return request({
    url: "/admin/other/queryMasterByGroupId?id=" + id,
    method: "get",
  });
}

// 设置师傅绩效
export function editMasterPerformance(data) {
  return request({
    url: "/admin/other/editMasterPerformance",
    method: "post",
    data,
  });
}

// 查询师傅绩效列表
export function queryMasterPerformanceList(data) {
  return request({
    url: "/admin/other/queryMasterPerformanceList",
    method: "post",
    data,
  });
}

// 删除师傅绩效
export function deleteMasterPerformance(id) {
  return request({
    url: "/admin/other/deleteMasterPerformance?id=" + id,
    method: "get",
  });
}

// 获取渠道订单数据
export function getChannelOrderData() {
  return request({
    url: "/admin/other/getChannelOrderData",
    method: "get",
  });
}

// 设置渠道订单数据
export function handleChannelOrderData(data) {
  return request({
    url: "/admin/other/handleChannelOrderData",
    method: "post",
    data,
  });
}
