// 保养模块
import request from "@/utils/request";

// 查询保养列表
export function queryDeviceKeepOrder(data) {
  return request({
    url: "/admin/maintenance/queryDeviceKeepOrder",
    method: "post",
    data,
  });
}

// 删除保养信息
export function deleteDeviceKeepOrder(orderSn) {
  return request({
    url: "/admin/maintenance/deleteDeviceKeepOrder?orderSn=" + orderSn,
    method: "get",
  });
}

// 保养订单上传
export function uploadDeviceKeepOrder(data) {
  return request({
    url: "/admin/maintenance/uploadDeviceKeepOrder",
    method: "POST",
    data,
  });
}
