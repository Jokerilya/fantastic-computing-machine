// 订单提醒模块
import request from "@/utils/request";

//订单提醒列表
export function queryOrderReminderList(data) {
  return request({
    url: "/admin/orderReminder/queryOrderReminderList",
    method: "post",
    data,
  });
}

//订单提醒详情
export function getOrderReminderDetail(id) {
  return request({
    url: "/admin/orderReminder/getOrderReminderDetail?id=" + id,
    method: "get",
  });
}

// 处理订单提醒
export function handleOrderReminder(data) {
  return request({
    url: "/admin/orderReminder/handleOrderReminder",
    method: "post",
    data,
  });
}

// 保存订单提醒
export function saveOrderReminder(data) {
  return request({
    url: "/admin/orderReminder/saveOrderReminder",
    method: "post",
    data,
  });
}
