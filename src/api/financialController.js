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
