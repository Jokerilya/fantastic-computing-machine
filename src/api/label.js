import request from "@/utils/request";

// 编辑标签列表
export function editLabel(data) {
  return request({
    url: "/admin/label/editLabel",
    method: "post",
    data,
  });
}
// 查询标签列表
export function queryLabelList() {
  return request({
    url: "/admin/label/queryLabelList",
    method: "get",
  });
}
