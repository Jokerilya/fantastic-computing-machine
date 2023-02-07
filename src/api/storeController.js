// 库存模块
import request from "@/utils/request";

// 查询实时库存
export function queryStoreStock(data) {
  return request({
    url: "/admin/store/queryStoreStock",
    method: "post",
    data,
  });
}

// 查询出/入库单列表
export function queryStoreOrderList(data) {
  return request({
    url: "/admin/store/queryStoreOrderList",
    method: "post",
    data,
  });
}

// 查看出/入库单详情
export function getStoreOrderDetail(orderSn) {
  return request({
    url: "/admin/store/getStoreOrderDetail?orderSn=" + orderSn,
    method: "get",
  });
}

// 编辑出/入库单信息
export function editStoreOrder(data) {
  return request({
    url: "/admin/store/editStoreOrder",
    method: "post",
    data,
  });
}
