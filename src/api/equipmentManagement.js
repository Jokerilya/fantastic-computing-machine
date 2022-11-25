import request from "@/utils/request";
// 查询设备列表
export function getEquipmentList(data) {
  return request({
    url: "/admin/maintenance/queryDeviceList",
    method: "post",
    data,
  });
}

// 查询设备详情
export function getEquipmentDetails(params) {
  return request({
    url: "/admin/maintenance/getDeviceInfoDetail",
    method: "post",
    params,
  });
}
