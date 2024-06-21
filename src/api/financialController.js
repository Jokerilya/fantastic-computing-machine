// 财务管理模块的接口
import request from "@/utils/request";

// 查询收支明细列表
export function queryPaymentList(data) {
  return request({
    url: "/admin/financial/queryPaymentList",
    method: "post",
    data: data,
  });
}

// 管家业务-收款信息
export function getButlerOrderCollectionInfo(orderSn) {
  return request({
    url: "/admin/financial/getButlerOrderCollectionInfo?orderSn=" + orderSn,
    method: "get",
  });
}

// 维保订单-收款信息
export function getRepairOrderCollectionInfo(orderSn, serviceType) {
  return request({
    url:
      "/admin/financial/getRepairOrderCollectionInfo?orderSn=" +
      orderSn +
      "&serviceType=" +
      serviceType,
    method: "GET",
  });
}

//确认支付
export function handleMasterPayment(orderSn) {
  return request({
    url: "/admin/financial/handleMasterPayment?orderSn=" + orderSn,
    method: "GET",
  });
}

// 打款至银行卡
export function handleConfirmPaymentToMaster(orderSn) {
  return request({
    url: "/admin/financial/handleConfirmPaymentToMaster?orderSn=" + orderSn,
    method: "GET",
  });
}

// 收支明细列表导出
export function handlePaymentListExport(data) {
  return request({
    url: "/admin/financial/handlePaymentListExport",
    method: "post",
    data,
    responseType: "blob",
  });
}

// 收支明细列表导入
export function handlePaymentListImport(data) {
  return request({
    url: "/admin/financial/handlePaymentListImport",
    method: "post",
    data,
  });
}

// 批量更新付款状态
export function handleBatchPayment(data) {
  return request({
    url: "/admin/financial/handleBatchPayment",
    method: "post",
    data,
  });
}

