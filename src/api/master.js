import request from "@/utils/request";

// 获取资讯列表
export function handleRetentionWithdrawal(uid) {
  return request({
    url: "/admin/master/handleRetentionWithdrawal?uid=" + uid,
    method: "get",
  });
}
