import request from "@/utils/request";


// ----------------------------企业
// 1.代企业确认验收
export function handleEnterpriseCheck(orderSn) {
	return request({
		url: '/admin/maintenance/proxy/handleEnterpriseCheck?orderSn='+orderSn,
		method: 'GET',
	})
}

// 2、代企业确认师傅报价
export function handleProxyConfirmQuotation(data) {
	return request({
		url: '/admin/maintenance/proxy/handleProxyConfirmQuotation',
		method: 'post',
        data
	})
}

// 3、代企业付款（手动标记企业已付款）
export function handleProxyPayment(orderSn) {
	return request({
		url: '/admin/maintenance/proxy/handleProxyPayment?orderSn='+orderSn,
		method: 'get'
	})
}

// 4、代企业发布评价  
export function handleReleaseComment(data) {
	return request({
		url: '/admin/maintenance/proxy/handleReleaseComment',
		method: 'post',
        data
	})
}

// --------------------------------师傅
// 1.代师傅接单
export function handleTakeOrder(data) {
	return request({
		url: '/admin/maintenance/proxy/handleTakeOrder',
		method: 'post',
        data
	})
}

// 2、代师傅开始出发
export function handleRemindStarted(data) {
	return request({
		url: '/admin/maintenance/proxy/handleRemindStarted',
		method: 'post',
		data
	})
}

// 3、代师傅拍照打卡  
export function handlePhotographPunch(data) {
	return request({
		url: '/admin/maintenance/proxy/handlePhotographPunch',
		method: 'post',
        data
	})
}

// 4、代师傅提交检测报价
export function handleMasterQuotation(data) {
	return request({
		url: '/admin/maintenance/proxy/handleMasterQuotation',
		method: 'post',
        data
	})
}

// 5、代师傅开始服务
export function handleStartService(orderSn) {
    return request({
      url: "/admin/maintenance/proxy/handleStartService?orderSn=" + orderSn,
      method: "get",
    });
}


// 6.师傅提交验收
export function handleSubmitAcceptance(data) {
    return request({
      url: "/admin/maintenance/proxy/handleSubmitAcceptance" ,
      method: "post",
	  data
    });
}