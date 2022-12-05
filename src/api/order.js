import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

//查询师傅成员列表
export function queryMasterMemberList(data) {
  return request({
    url: "/admin/maintenance/queryMasterMemberList",
    method: "POST",
    data,
  });
}

// 查询师傅姓名
export function queryMasterName(data) {
  return request({
    url: "/admin/maintenance/queryMasterName?query=" + data,
    method: "get",
  });
}

//查询企业成员列表
export function queryEnterpriseMemberList(data) {
  return request({
    url: "/admin/maintenance/queryEnterpriseMemberList",
    method: "POST",
    data,
  });
}
//企业列表导出
export function handleEnterpriseInfoExport(data) {
  return request({
    url: "/admin/maintenance/handleEnterpriseInfoExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//师傅列表导出
export function handleMasterInfoExport(data) {
  return request({
    url: "/admin/maintenance/handleMasterInfoExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//获取师傅详情
export function getMasterInfo(id) {
  return request({
    url: "/admin/maintenance/getMasterInfo?id=" + id,
    method: "GET",
  });
}

// 编辑师傅信息
export function editMasterInfo(data) {
  return request({
    url: "/admin/maintenance/editMasterInfo",
    method: "POST",
    data,
  });
}

//平台取消订单
export function cancelRepairOrder(data) {
  return request({
    url: "/admin/maintenance/cancelRepairOrder",
    method: "post",
    data,
  });
}

//平台修改师傅报价
export function updateMasterPrice(data) {
  return request({
    url: "/admin/maintenance/updateMasterPrice",
    method: "POST",
    data,
  });
}
//打款至师傅
export function handleMasterPayment(data) {
  return request({
    url: "/admin/maintenance/handleMasterPayment",
    method: "get",
    params: data,
  });
}

//合同上传
export async function uploadButlerOrder(data) {
  return request({
    url: "/admin/maintenance/uploadButlerOrder",
    method: "POST",
    data,
  });
}

//维保订单列表
export function queryRepairOrderList(data) {
  return request({
    url: "/admin/maintenance/queryRepairOrderList",
    method: "POST",
    data,
  });
}

//平台审核报价
export function examineMasterQuotation(data) {
  return request({
    url: "/admin/maintenance/examineMasterQuotation",
    method: "POST",
    data,
  });
}
//查询管家订单详情
export function getButlerOrderDetail(data) {
  return request({
    url: "/admin/maintenance/getButlerOrderDetail",
    method: "get",
    params: data,
  });
}
//查询管家订单列表
export function queryButlerOrderList(data) {
  return request({
    url: "/admin/maintenance/queryButlerOrderList",
    method: "post",
    data,
  });
}
//查询系统类型
export function queryDeviceSystemList() {
  return request({
    url: "/admin/maintenance/queryDeviceSystemList",
    method: "post",
  });
}

// 查询设备部位
export function queryDevicePositionList() {
  return request({
    url: "/admin/maintenance/queryDevicePositionList",
    method: "get",
  });
}

//查询设备类型
export function queryDeviceTypeList() {
  return request({
    url: "/admin/maintenance/queryDeviceTypeList",
    method: "post",
  });
}

//新增/编辑设备类型
export function editDeviceType(data) {
  return request({
    url: "/admin/maintenance/editDeviceType",
    method: "post",
    data,
  });
}

// 删除设备类型
export function deleteDeviceType(id) {
  return request({
    url: "/admin/maintenance/deleteDeviceType?id=" + id,
    method: "get",
  });
}

// 新增/录入管家订单
export function editButlerOrder(data) {
  return request({
    url: "/admin/maintenance/editButlerOrder",
    method: "post",
    data,
  });
}
// 订单列表
export function queryOrderFn(data) {
  return request({
    url: "/admin/order/queryOrder",
    method: "post",
    data: data,
  });
}
// 订单详情
export function getOrderDetailFn(data) {
  return request({
    url: "/admin/order/getOrderDetail",
    method: "get",
    params: data,
  });
}
// 平台定价
export function handleMasterQuotation(data) {
  return request({
    url: "/admin/maintenance/handleMasterQuotation",
    method: "post",
    data: data,
  });
}
// 订单发货
export function handleOrderSendFn(data) {
  return request({
    url: "/admin/order/handleOrderSend",
    method: "post",
    data: data,
  });
}
// 订单审核
export function handleOrderExamineFn(data) {
  return request({
    url: "/admin/order/handleOrderExamine",
    method: "post",
    data: data,
  });
}
// 获取物流公司列表
export function queryOrderBasicFn(data) {
  return request({
    url: "/admin/order/queryOrderBasic",
    method: "get",
    params: data,
  });
}
// 获取物流详情
export function getOrderExp(data) {
  return request({
    url: "/admin/order/getOrderExp",
    method: "get",
    params: data,
  });
}
// 订单导出
export function handleOrderExportFn(data) {
  return request({
    url: "/admin/order/handleOrderExport",
    method: "post",
    responseType: "blob",
    data: data,
  });
}

// 售后订单(退款订单)
export function queryOrderRefund(data) {
  return request({
    url: "/admin/order/queryOrderRefund",
    method: "post",
    data: data,
  });
}
// 修改收货人信息
export function updateOrderReceiptInfo(data) {
  return request({
    url: "/admin/order/updateOrderReceiptInfo",
    method: "post",
    data: data,
  });
}

// 批量下单模板下载
export function downloadBatchRepairOrderTemplate(data) {
  return request({
    url: "/admin/maintenance/downloadBatchRepairOrderTemplate",
    method: "post",
    data,
  });
}

// 管家合同模板下载
export function downloadButlerOrderTemplate(data) {
  return request({
    url: "/admin/maintenance/downloadButlerOrderTemplate",
    method: "post",
    data,
  });
}

//平台代下单
export function agentCreateOrder(data) {
  return request({
    url: "/admin/maintenance/agentCreateOrder",
    method: "post",
    data,
  });
}

// 批量下单导入
export function uploadBatchRepairOrder(data) {
  return request({
    url: "/admin/maintenance/uploadBatchRepairOrder",
    method: "post",
    data,
  });
}

//管家订单绑定业务员账号
export function bindSalesmanAccount(data) {
  return request({
    url: "/admin/maintenance/bindSalesmanAccount",
    method: "post",
    data,
  });
}
