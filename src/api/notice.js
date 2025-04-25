import request from '@/utils/request';

// 系统消息列表
export function querySysNoticeList(data) {
    return request({
      url: "/admin/notice/querySysNoticeList",
      method: "post",
      data
    });
  }
  
// 保存系统消息详情
export function saveSysNoticeDetail(data) {
    return request({
      url: "/admin/notice/saveSysNoticeDetail",
      method: "post",
      data
    });
  }
  
  // 删除系统消息详情
export function deleteSysNotice(id) {
    return request({
      url: "/admin/notice/deleteSysNotice?id="+id,
      method: "get",
    });
  }