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

// 删除配件
export function deleteDeviceParts(id) {
  return request({
    url: "/admin/maintenance/deleteDeviceParts",
    method: "get",
    params: { id },
  });
}

// 删除设备
export function deleteDeviceInfo(id) {
  return request({
    url: "/admin/maintenance/deleteDeviceInfo",
    method: "get",
    params: { id },
  });
}

// 新增 编辑 配件
export function editDeviceParts(data) {
  return request({
    url: "/admin/maintenance/editDeviceParts",
    method: "post",
    data,
  });
}

//新增/编辑设备
export function editDeviceInfo(data) {
  return request({
    url: "/admin/maintenance/editDeviceInfo",
    method: "post",
    data,
  });
}
