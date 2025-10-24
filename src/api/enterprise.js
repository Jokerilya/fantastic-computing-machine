import request from "@/utils/request";

// 审核企业月结申请
export function handleEnterpriseSettlementApply(data) {
  return request({
    url: "/admin/enterprise/handleEnterpriseSettlementApply",
    method: "post",
    data,
  });
}

// 查询企业月结申请列表
export function queryEnterpriseSettlementApply(data) {
  return request({
    url: "/admin/enterprise/queryEnterpriseSettlementApply",
    method: "post",
    data,
  });
}
