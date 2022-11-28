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
