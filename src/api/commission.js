import request from '@/utils/request';

// 查询佣金奖励列表
export function queryCommissionRewardList(data) {
	return request({
		url: '/admin/commission/queryCommissionRewardList',
		method: 'post',
		data,
	});
}

// 查询推广团队列表
export function queryPromotionTeamList(data) {
	return request({
		url: '/admin/commission/queryPromotionTeamList',
		method: 'post',
        data
	});
}

// 获取推广人信息
export function getPromotionInfo(inviteCode) {
	return request({
		url: `/admin/commission/getPromotionInfo?inviteCode=${inviteCode}`,
		method: 'get',
	});
}

