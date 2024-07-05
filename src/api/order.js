import request from "@/utils/request";
import { publicData } from "@/webConfig.js";

//查询师傅成员列表
export function queryMasterMemberList(data) {
  return request({
    url: "/admin/maintenance/queryMasterMemberList",
    method: "POST",
    data,
  });
}

// 查询师傅姓名
export function queryMasterName(data) {
  return request({
    url: "/admin/maintenance/queryMasterName?query=" + data,
    method: "get",
  });
}

//查询企业成员列表
export function queryEnterpriseMemberList(data) {
  return request({
    url: "/admin/maintenance/queryEnterpriseMemberList",
    method: "POST",
    data,
  });
}
//企业列表导出
export function handleEnterpriseInfoExport(data) {
  return request({
    url: "/admin/maintenance/handleEnterpriseInfoExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//师傅列表导出
export function handleMasterInfoExport(data) {
  return request({
    url: "/admin/maintenance/handleMasterInfoExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//获取师傅详情
export function getMasterInfo(id) {
  return request({
    url: "/admin/maintenance/getMasterInfo?id=" + id,
    method: "GET",
  });
}

// 查询打卡记录
export function queryPunchList(data) {
  return request({
    url: "/admin/maintenance/queryPunchList",
    method: "post",
    data,
  });
}

// 编辑师傅信息
export function editMasterInfo(data) {
  return request({
    url: "/admin/maintenance/editMasterInfo",
    method: "POST",
    data,
  });
}

//平台取消订单
export function cancelRepairOrder(data) {
  return request({
    url: "/admin/maintenance/cancelRepairOrder",
    method: "post",
    data,
  });
}

//打款至师傅
export function handleMasterPayment(orderSn) {
  return request({
    url: "/admin/maintenance/handleMasterPayment?orderSn=" + orderSn,
    method: "get",
  });
}

//合同上传
export async function uploadButlerOrder(data, num) {
  return request({
    url: "/admin/maintenance/uploadButlerOrder?type=" + num,
    method: "POST",
    data,
  });
}

//合同上传 -- 斯耐克
export async function uploadButlerOrderByOwn(data) {
  return request({
    url: "/admin/maintenance/uploadButlerOrderByOwn",
    method: "POST",
    data,
  });
}

//维保订单列表
export function queryRepairOrderList(data) {
  return request({
    url: "/admin/maintenance/queryRepairOrderList",
    method: "POST",
    data,
  });
}

// 维保订单列表导出
export function editOrderServiceProgress(data) {
  return request({
    url: "/admin/maintenance/editOrderServiceProgress",
    method: "POST",
    data,
  });
}

// 编辑订单维修进度记录
export function handleRepairOrderExport(data) {
  return request({
    url: "/admin/maintenance/handleRepairOrderExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//平台审核报价
export function examineMasterQuotation(data) {
  return request({
    url: "/admin/maintenance/examineMasterQuotation",
    method: "POST",
    data,
  });
}
//查询管家订单详情
export function getButlerOrderDetail(data) {
  return request({
    url: "/admin/maintenance/getButlerOrderDetail",
    method: "get",
    params: data,
  });
}
//查询管家订单列表
export function queryButlerOrderList(data) {
  return request({
    url: "/admin/maintenance/queryButlerOrderList",
    method: "post",
    data,
  });
}

// 管家订单列表导出
export function handleButlerOrderExport(data) {
  return request({
    url: "/admin/maintenance/handleButlerOrderExport",
    method: "post",
    data,
    responseType: "blob",
  });
}

//查询系统类型
export function queryDeviceSystemList() {
  return request({
    url: "/admin/maintenance/queryDeviceSystemList",
    method: "post",
  });
}

// 查询故障分类及故障部位
export function queryFaultPosition(machineType) {
  return request({
    url: "/admin/maintenance/queryFaultPosition?machineType="+machineType,
    method: "get",
  });
}

// 查询设备部位
export function queryDevicePositionList() {
  return request({
    url: "/admin/maintenance/queryDevicePositionList",
    method: "get",
  });
}

//查询设备类型
export function queryDeviceTypeList() {
  return request({
    url: "/admin/maintenance/queryDeviceTypeList",
    method: "post",
  });
}

//新增/编辑设备类型
export function editDeviceType(data) {
  return request({
    url: "/admin/maintenance/editDeviceType",
    method: "post",
    data,
  });
}

// 删除设备类型
export function deleteDeviceType(id) {
  return request({
    url: "/admin/maintenance/deleteDeviceType?id=" + id,
    method: "get",
  });
}

// 新增/录入管家订单
export function editButlerOrder(data) {
  return request({
    url: "/admin/maintenance/editButlerOrder",
    method: "post",
    data,
  });
}
// 订单列表
export function queryOrderFn(data) {
  return request({
    url: "/admin/order/queryOrder",
    method: "post",
    data: data,
  });
}
// 订单详情
export function getOrderDetailFn(data) {
  return request({
    url: "/admin/order/getOrderDetail",
    method: "get",
    params: data,
  });
}
// 平台定价
export function handleMasterQuotation(data) {
  return request({
    url: "/admin/maintenance/handleMasterQuotation",
    method: "post",
    data: data,
  });
}

//修改订单
export function editRepairOrder(data) {
  return request({
    url: "/admin/maintenance/editRepairOrder",
    method: "post",
    data,
  });
}

// 订单发货
export function handleOrderSendFn(data) {
  return request({
    url: "/admin/order/handleOrderSend",
    method: "post",
    data: data,
  });
}
// 订单审核
export function handleOrderExamineFn(data) {
  return request({
    url: "/admin/order/handleOrderExamine",
    method: "post",
    data: data,
  });
}
// 获取物流公司列表
export function queryOrderBasicFn(data) {
  return request({
    url: "/admin/order/queryOrderBasic",
    method: "get",
    params: data,
  });
}
// 获取物流详情
export function getOrderExp(data) {
  return request({
    url: "/admin/order/getOrderExp",
    method: "get",
    params: data,
  });
}
// 订单导出
export function handleOrderExportFn(data) {
  return request({
    url: "/admin/order/handleOrderExport",
    method: "post",
    responseType: "blob",
    data: data,
  });
}

// 售后订单(退款订单)
export function queryOrderRefund(data) {
  return request({
    url: "/admin/order/queryOrderRefund",
    method: "post",
    data: data,
  });
}
// 修改收货人信息
export function updateOrderReceiptInfo(data) {
  return request({
    url: "/admin/order/updateOrderReceiptInfo",
    method: "post",
    data: data,
  });
}

// 批量下单模板下载
export function downloadBatchRepairOrderTemplate(data) {
  return request({
    url: "/admin/maintenance/downloadBatchRepairOrderTemplate",
    method: "post",
    data,
  });
}

// 管家合同模板下载
export function downloadButlerOrderTemplate(data) {
  return request({
    url: "/admin/maintenance/downloadButlerOrderTemplate",
    method: "post",
    data,
  });
}

//平台代下单
export function agentCreateOrder(data) {
  return request({
    url: "/admin/maintenance/agentCreateOrder",
    method: "post",
    data,
  });
}

// 设置师傅身份(区域经理、签约师傅)
export function handleMasterIdentity(data) {
  return request({
    url: "/admin/maintenance/handleMasterIdentity",
    method: "post",
    data,
  });
}

// 批量下单导入
export function uploadBatchRepairOrder(data) {
  return request({
    url: "/admin/maintenance/uploadBatchRepairOrder",
    method: "post",
    data,
  });
}

//管家订单绑定业务员账号
export function bindSalesmanAccount(data) {
  return request({
    url: "/admin/maintenance/bindSalesmanAccount",
    method: "post",
    data,
  });
}

// 管家订单绑定推荐人信息
export function bindRecommendInfo(data) {
  return request({
    url: "/admin/maintenance/bindRecommendInfo",
    method: "post",
    data,
  });
}

// 填写维保回访信息
export function handleRepairMessage(data) {
  return request({
    url: "/admin/maintenance/handleRepairMessage",
    method: "post",
    data,
  });
}

// 标记已读
export function handleUnReadMessage(id) {
  return request({
    url: "/admin/maintenance/handleUnReadMessage?id=" + id,
    method: "get",
  });
}

// 查询平台未读消息
export function queryUnReadMessgae() {
  return request({
    url: "/admin/maintenance/queryUnReadMessgae",
    method: "post",
  });
}

// 填写维保备注
export function handleRepairRemarks(data) {
  return request({
    url: "/admin/maintenance/handleRepairRemarks",
    method: "post",
    data,
  });
}

// 操作师傅积分
export function handleMasterIntegral(params) {
  return request({
    url: "/admin/maintenance/handleMasterIntegral",
    method: "get",
    params,
  });
}

// 师傅积分记录
export function queryMasterIntegralList(params) {
  return request({
    url: "/admin/maintenance/queryMasterIntegralList",
    method: "get",
    params,
  });
}

// 查询设备品牌
export function queryDeviceBrandList(params) {
  return request({
    url: "/admin/maintenance/queryDeviceBrandList",
    method: "get",
    params,
  });
}

// 查询金蝶商品
export function queryJdProductList(data) {
  return request({
    url: "/admin/maintenance/queryJdProductList",
    method: "post",
    data,
  });
}

// 散单转年保
export function convertToInsurance(data) {
  return request({
    url: "/admin/maintenance/convertToInsurance",
    method: "post",
    data,
  });
}

// 标记散单完成
export function markOrderCompletion(orderSn) {
  return request({
    url: "/admin/maintenance/markOrderCompletion?orderSn=" +orderSn,
    method: "get",
  });
}

// 查询物流
export function queryLogistics(params) {
  return request({
    url: "/admin/maintenance/queryLogistics",
    method: "get",
    params,
  });
}

// 上传物流信息
export function uploadLogisticsInfo(data) {
  return request({
    url: "/admin/maintenance/uploadLogisticsInfo",
    method: "post",
    data,
  });
}

// 审核配件商品
export function examinePartProduct(data) {
  return request({
    url: "/admin/maintenance/examinePartProduct",
    method: "post",
    data,
  });
}

// 审核故障项目
export function examineFaultItem(data) {
  return request({
    url: "/admin/maintenance/examineOrderFaultItem",
    method: "post",
    data,
  });
}

// 查询自动抢单列表
export function queryAutomaticAssignList() {
  return request({
    url: "/admin/maintenance/queryAutomaticAssignList",
    method: "post",
  });
}

// 查询师傅等级列表
export function queryMasterLevelList() {
  return request({
    url: "/admin/maintenance/queryMasterLevelList",
    method: "get",
  });
}

// 故障项目列表
export function queryFaultItems(data) {
  return request({
    url: "/admin/maintenance/queryFaultItems",
    method: "post",
    data
  });
}

// 保存故障列表
export function saveFaultItems(data) {
  return request({
    url: "/admin/maintenance/saveFaultItems",
    method: "post",
    data
  });
}

// 查询师傅故障项定价列表
export function queryMasterFaultPriceList(data) {
  return request({
    url: "/admin/maintenance/queryMasterFaultPriceList",
    method: "post",
    data
  });
}

// 师傅故障项定价审核
export function examineMasterFaultPrice(data) {
  return request({
    url: "/admin/maintenance/examineMasterFaultPrice",
    method: "post",
    data
  });
}

// 寄修
export function sendRepair(orderSn) {
	return request({
		url: '/admin/maintenance/sendRepair?orderSn=' + orderSn,
		method: 'get',
	})
}

// 新增/编辑配件商品
export function editPartProduct(data) {
	return request({
		url: '/admin/maintenance/editPartProduct',
		method: 'post',
    data
	})
}

// 删除配件商品
export function deletePartProduct(data) {
	return request({
		url: '/admin/maintenance/deletePartProduct',
		method: 'post',
    data
	})
}

// 查询维保供应商信息
export function queryMaintenanceSupplierInfo(data) {
	return request({
		url: '/admin/maintenance/queryMaintenanceSupplierInfo',
		method: 'post',
    data
	})
}

// 填写物流信息
export function fillLogisticsInformation(data) {
	return request({
		url: '/admin/maintenance/fillLogisticsInformation',
		method: 'post',
    data
	})
}

// 故障项定价申请列表
export function queryFaultItemApplyList() {
	return request({
		url: '/admin/maintenance/queryFaultItemApplyList',
		method: 'get'
	})
}

// 故障项定价申请明细
export function queryFaultItemApplyDetails(faultItemId) {
	return request({
		url: '/admin/maintenance/queryFaultItemApplyDetails?faultItemId='+faultItemId,
		method: 'get'
	})
}

// 申诉操作师傅金额
export function handleMasterAmount(data) {
	return request({
		url: '/admin/maintenance/handleMasterAmount',
		method: 'POST',
    data
	})
}

// 标记为活跃师傅
export function handleActiveMaster({uid,flag}) {
	return request({
		url: `/admin/maintenance/handleActiveMaster?uid=${uid}&flag=${flag}`,
		method: 'get',
	})
}

// 查询考核项目列表
export function queryMasterAssessmentItemList() {
	return request({
		url: `/admin/maintenance/queryMasterAssessmentItemList`,
		method: 'get',
	})
}

// 查询师傅考核记录列表
export function queryMasterAssessmentRecords(id) {
	return request({
		url: `/admin/maintenance/queryMasterAssessmentRecords?id=${id}`,
		method: 'get',
	})
}

// 编辑师傅考核项目
export function editMasterAssessmentItem(data,montageData) {
  console.log(656,`/admin/maintenance/editMasterAssessmentItem`+montageData);
	return request({
		url: `/admin/maintenance/editMasterAssessmentItem`+montageData,
		method: 'post',
    data
	})
}

// 删除配件商品
export function deleteOrderFaultItem(data) {
	return request({
		url: '/admin/maintenance/deleteOrderFaultItem',
		method: 'post',
    data
	})
}

// 新增订单故障项目
export function addOrderFaultItem(data) {
	return request({
		url: '/admin/maintenance/addOrderFaultItem',
		method: 'post',
    data
	})
}

// 协商费用
export function consultCost(data) {
	return request({
		url: '/admin/maintenance/consultCost',
		method: 'post',
    data
	})
}

// 机将大师傅接单
export function handleSystemCreateOrder(orderSn) {
	return request({
		url: '/admin/maintenance/handleSystemCreateOrder?orderSn='+orderSn,
		method: 'get'
	})
}


// 故障减免费用
export function handleFaultCost(data) {
	return request({
		url: '/admin/maintenance/handleFaultCost',
		method: 'post',
    data
	})
}

// 查询师傅保险列表
export function queryMasterInsuranceList(data) {
	return request({
		url: '/admin/maintenance/queryMasterInsuranceList',
		method: 'post',
    data
	})
}

// 新增编辑师傅保险信息
export function editMasterInsurance(data) {
	return request({
		url: '/admin/maintenance/editMasterInsurance',
		method: 'post',
    data
	})
}

// 查询开票列表 
export function queryRepairInvoiceOrderList(data) {
	return request({
		url: '/admin/maintenance/queryRepairInvoiceOrderList',
		method: 'post',
    data
	})
}

// 上传发票
export function uploadRepairInvoice(data) {
	return request({
		url: '/admin/maintenance/uploadRepairInvoice',
		method: 'post',
    data
	})
}

// 订单抵扣标识
export function handleOrderDiscountFlag(orderSn,flag) {
	return request({
		url: `/admin/maintenance/handleOrderDiscountFlag?orderSn=${orderSn}&flag=${flag}`,
		method: 'get'
	})
}

// 上传线下工单
export function handleOfflineImages(data) {
	return request({
		url: `/admin/maintenance/handleOfflineImages`,
		method: 'post',
    data
	})
}

// 同步金蝶单据
export function synchronizationJdOrder(data) {
	return request({
		url: `/admin/maintenance/synchronizationJdOrder`,
		method: 'post',
    data
	})
}

// 编辑维保供应商信息
export function editMaintenanceSupplierInfo(data) {
	return request({
		url: `/admin/maintenance/editMaintenanceSupplierInfo`,
		method: 'post',
    data
	})
}

// 师傅订单折扣记录列表
export function queryMasterOrderDiscountList(data) {
	return request({
		url: `/admin/maintenance/queryMasterOrderDiscountList`,
		method: 'post',
    data
	})
}

// 手动合并师傅折扣
export function handleMergeMasterOrder(data) {
	return request({
		url: `/admin/maintenance/handleMergeMasterOrder`,
		method: 'post',
    data
	})
}

// 删除师傅折扣记录
export function deleteMasterDiscountLog(data) {
	return request({
		url: `/admin/maintenance/deleteMasterDiscountLog`,
		method: 'post',
    data
	})
}

// 查询设备详情
export function getDeviceInfoByNo(no) {
	return request({
		url: `/admin/maintenance/getDeviceInfoByNo?no=${no}`,
		method: 'get'
	})
}

// 查询产品咨询列表
export function queryRegisterInfoList(data) {
	return request({
		url: `/admin/maintenance/queryRegisterInfoList`,
		method: 'post',
    data
	})
}

// 查询平台未读消息
export function queryRepairMessgae(data) {
	return request({
		url: `/admin/maintenance/queryRepairMessgae`,
		method: 'post',
    data
	})
}

