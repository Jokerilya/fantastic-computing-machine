import request from '@/utils/request';

// 审核订单配件
export function examineOrderParts(data) {
	return request({
		url: '/admin/v2/maintenance/handleMatter/examineOrderParts',
		method: 'post',
		data,
	});
}

// 查询订单配件待审核列表
export function queryOrderPartsWaitExamineList() {
	return request({
		url: '/admin/v2/maintenance/handleMatter/queryOrderPartsWaitExamineList',
		method: 'get',
	});
}


