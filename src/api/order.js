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

// 设备列表导出
export function handleDeviceInfoExport(data) {
  return request({
    url: "/admin/maintenance/handleDeviceInfoExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//企业列表导出
export function handleRepairEnterpriseOrderExport(data) {
  return request({
    url: "/admin/maintenance/handleRepairEnterpriseOrderExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

//用户金额导出
export function handleUserMoneyExport(data) {
  return request({
    url: "/admin/userInfo/handleUserMoneyExport",
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

//合同上传 三合一
export async function importButlerOrder(data, type, snkFlag) {
  return request({
    url:
      "/admin/maintenance/importButlerOrder?type=" +
      type +
      "&snkFlag=" +
      snkFlag,
    method: "POST",
    data,
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
    url: "/admin/order/queryRepairOrderList",
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

// 编辑订单维修进度记录
export function handleRepairOrderExportV2(data) {
  return request({
    url: "/admin/maintenance/handleRepairOrderExportV2",
    method: "POST",
    data,
    responseType: "blob",
  });
}

// 维保订单列表数据导出(故障项目)
export function handleRepairOrderExportByFaults(data) {
  return request({
    url: "/admin/maintenance/handleRepairOrderExportByFaults",
    method: "POST",
    data,
    responseType: "blob",
  });
}

// 在线表格(企业总表)导出
export function handleOnlineRepairEnterpriseOrderExport(data) {
  return request({
    url: "/admin/maintenance/handleOnlineRepairEnterpriseOrderExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

// 在线表格(师傅交单)导出
export function handleOnlineRepairMasterOrderExport(data) {
  return request({
    url: "/admin/maintenance/handleOnlineRepairMasterOrderExport",
    method: "POST",
    data,
    responseType: "blob",
  });
}

// 补充订单主表信息
export function updateOnlineRepairOrder(data) {
  return request({
    url: "/admin/order/updateOnlineRepairOrder",
    method: "POST",
    data,
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
    url: "/admin/maintenance/queryFaultPosition?machineType=" + machineType,
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

// 设置师傅身份 (1 兼职  2 签约  3 全职 )
export function handleMasterType(data) {
  return request({
    url: "/admin/maintenance/handleMasterType",
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
    url: "/admin/maintenance/markOrderCompletion?orderSn=" + orderSn,
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
    data,
  });
}

// 保存故障列表
export function saveFaultItems(data) {
  return request({
    url: "/admin/maintenance/saveFaultItems",
    method: "post",
    data,
  });
}

// 查询师傅故障项定价列表
export function queryMasterFaultPriceList(data) {
  return request({
    url: "/admin/maintenance/queryMasterFaultPriceList",
    method: "post",
    data,
  });
}

// 师傅故障项定价审核
export function examineMasterFaultPrice(data) {
  return request({
    url: "/admin/maintenance/examineMasterFaultPrice",
    method: "post",
    data,
  });
}

// 寄修
export function sendRepair(orderSn) {
  return request({
    url: "/admin/maintenance/sendRepair?orderSn=" + orderSn,
    method: "get",
  });
}

// 新增/编辑配件商品
export function editPartProduct(data) {
  return request({
    url: "/admin/maintenance/editPartProduct",
    method: "post",
    data,
  });
}

// 删除配件商品
export function deletePartProduct(data) {
  return request({
    url: "/admin/maintenance/deletePartProduct",
    method: "post",
    data,
  });
}

// 查询维保供应商信息
export function queryMaintenanceSupplierInfo(data) {
  return request({
    url: "/admin/maintenance/queryMaintenanceSupplierInfo",
    method: "post",
    data,
  });
}

// 填写物流信息
export function fillLogisticsInformation(data) {
  return request({
    url: "/admin/maintenance/fillLogisticsInformation",
    method: "post",
    data,
  });
}

// 故障项定价申请列表
export function queryFaultItemApplyList() {
  return request({
    url: "/admin/maintenance/queryFaultItemApplyList",
    method: "get",
  });
}

// 故障项定价申请明细
export function queryFaultItemApplyDetails(faultItemId) {
  return request({
    url:
      "/admin/maintenance/queryFaultItemApplyDetails?faultItemId=" +
      faultItemId,
    method: "get",
  });
}

// 申诉操作师傅金额
export function handleMasterAmount(data) {
  return request({
    url: "/admin/maintenance/handleMasterAmount",
    method: "POST",
    data,
  });
}

// 标记为活跃师傅
export function handleActiveMaster({ uid, flag }) {
  return request({
    url: `/admin/maintenance/handleActiveMaster?uid=${uid}&flag=${flag}`,
    method: "get",
  });
}

// 查询考核项目列表
export function queryMasterAssessmentItemList() {
  return request({
    url: `/admin/maintenance/queryMasterAssessmentItemList`,
    method: "get",
  });
}

// 查询师傅考核记录列表
export function queryMasterAssessmentRecords(id) {
  return request({
    url: `/admin/maintenance/queryMasterAssessmentRecords?id=${id}`,
    method: "get",
  });
}

// 编辑师傅考核项目
export function editMasterAssessmentItem(data, montageData) {
  return request({
    url: `/admin/maintenance/editMasterAssessmentItem` + montageData,
    method: "post",
    data,
  });
}

// 删除配件商品
export function deleteOrderFaultItem(data) {
  return request({
    url: "/admin/maintenance/deleteOrderFaultItem",
    method: "post",
    data,
  });
}

// 新增订单故障项目
export function addOrderFaultItem(data) {
  return request({
    url: "/admin/maintenance/addOrderFaultItem",
    method: "post",
    data,
  });
}

// 协商费用
export function consultCost(data) {
  return request({
    url: "/admin/maintenance/consultCost",
    method: "post",
    data,
  });
}

// 机将大师傅接单
export function handleSystemCreateOrder(orderSn) {
  return request({
    url: "/admin/maintenance/handleSystemCreateOrder?orderSn=" + orderSn,
    method: "get",
  });
}

// 故障减免费用
export function handleFaultCost(data) {
  return request({
    url: "/admin/maintenance/handleFaultCost",
    method: "post",
    data,
  });
}

// 查询师傅保险列表
export function queryMasterInsuranceList(data) {
  return request({
    url: "/admin/maintenance/queryMasterInsuranceList",
    method: "post",
    data,
  });
}

// 新增编辑师傅保险信息
export function editMasterInsurance(data) {
  return request({
    url: "/admin/maintenance/editMasterInsurance",
    method: "post",
    data,
  });
}

// 查询开票列表
export function queryRepairInvoiceOrderList(data) {
  return request({
    url: "/admin/maintenance/queryRepairInvoiceOrderList",
    method: "post",
    data,
  });
}

// 上传发票
export function uploadRepairInvoice(data) {
  return request({
    url: "/admin/maintenance/uploadRepairInvoice",
    method: "post",
    data,
  });
}

// 订单抵扣标识
export function handleOrderDiscountFlag(orderSn, flag) {
  return request({
    url: `/admin/maintenance/handleOrderDiscountFlag?orderSn=${orderSn}&flag=${flag}`,
    method: "get",
  });
}

// 上传线下工单
export function handleOfflineImages(data) {
  return request({
    url: `/admin/maintenance/handleOfflineImages`,
    method: "post",
    data,
  });
}

// 同步金蝶单据
export function synchronizationJdOrder(data) {
  return request({
    url: `/admin/maintenance/synchronizationJdOrder`,
    method: "post",
    data,
  });
}

// 编辑维保供应商信息
export function editMaintenanceSupplierInfo(data) {
  return request({
    url: `/admin/maintenance/editMaintenanceSupplierInfo`,
    method: "post",
    data,
  });
}

// 师傅订单折扣记录列表
export function queryMasterOrderDiscountList(data) {
  return request({
    url: `/admin/maintenance/queryMasterOrderDiscountList`,
    method: "post",
    data,
  });
}

// 手动合并师傅折扣
export function handleMergeMasterOrder(data) {
  return request({
    url: `/admin/maintenance/handleMergeMasterOrder`,
    method: "post",
    data,
  });
}

// 删除师傅折扣记录
export function deleteMasterDiscountLog(data) {
  return request({
    url: `/admin/maintenance/deleteMasterDiscountLog`,
    method: "post",
    data,
  });
}

// 查询设备详情
export function getDeviceInfoByNo(no) {
  return request({
    url: `/admin/maintenance/getDeviceInfoByNo?no=${no}`,
    method: "get",
  });
}

// 查询产品咨询列表
export function queryRegisterInfoList(data) {
  return request({
    url: `/admin/maintenance/queryRegisterInfoList`,
    method: "post",
    data,
  });
}

// 查询平台未读消息
export function queryRepairMessgae(data) {
  return request({
    url: `/admin/maintenance/queryRepairMessgae`,
    method: "post",
    data,
  });
}

// 处理产品咨询
export function handleRegisterInfo(data) {
  return request({
    url: `/admin/maintenance/handleRegisterInfo`,
    method: "post",
    data,
  });
}

// 师傅订单排行数据
export function queryMasterOrderRankData(data) {
  return request({
    url: `/admin/maintenance/queryMasterOrderRankData`,
    method: "post",
    data,
  });
}

// 编辑产品咨询记录
export function editRegisterInfo(data) {
  return request({
    url: `/admin/maintenance/editRegisterInfo`,
    method: "post",
    data,
  });
}

// 产品咨询转保养订单
export function handleConvertKeepOrder(data) {
  return request({
    url: `/admin/maintenance/handleConvertKeepOrder`,
    method: "post",
    data,
  });
}

// 保养订单指派师傅
export function deviceKeepOrderAssign(data) {
  return request({
    url: `/admin/maintenance/deviceKeepOrderAssign`,
    method: "post",
    data,
  });
}

// 编辑保养列表信息
export function editDeviceKeepOrder(data) {
  return request({
    url: `/admin/maintenance/editDeviceKeepOrder`,
    method: "post",
    data,
  });
}

// 保养订单标记已完成
export function deviceKeepOrderMarkComplete(data) {
  return request({
    url: `/admin/maintenance/deviceKeepOrderMarkComplete`,
    method: "post",
    data,
  });
}

// 转移订单配件商品
export function transferPartProduct(data) {
  return request({
    url: `/admin/maintenance/transferPartProduct`,
    method: "post",
    data,
  });
}

// 转移订单故障项目
export function transferOrderFaultItem(data) {
  return request({
    url: `/admin/maintenance/transferOrderFaultItem`,
    method: "post",
    data,
  });
}

// 修改师傅订单
export function editEnrollRepairOrder(data) {
  return request({
    url: `/admin/maintenance/editEnrollRepairOrder`,
    method: "post",
    data,
  });
}

// jdTest管理模块
export function testData(orderSns) {
  return request({
    url: `/admin/jdTest/testData?orderSns=${orderSns}`,
    method: "get",
  });
}

// 设置订单标签
export function handleOrderLabel(data) {
  return request({
    url: `/admin/maintenance/handleOrderLabel`,
    method: "post",
    data,
  });
}

// 查询维保订单列表角标
export function getOrderSubscript(data) {
  return request({
    url: `/admin/order/getOrderSubscript`,
    method: "post",
    data,
  });
}

// 生成对账单
export function generateBill(data) {
  return request({
    url: `/admin/order/generateBill`,
    method: "post",
    data,
  });
}

// 设置订单配件商品到达信息
export function handlePartProductArriveInfo(data) {
  return request({
    url: `/admin/maintenance/handlePartProductArriveInfo`,
    method: "post",
    data,
  });
}

//  驳回师傅提交验收
export function rejectOrderCheck(orderSn) {
  return request({
    url: `/admin/maintenance/rejectOrderCheck?orderSn=${orderSn}`,
    method: "get",
  });
}

// 订单退款审核
export function handleOrderRefund(data) {
  return request({
    url: `/admin/maintenance/handleOrderRefund`,
    method: "post",
    data,
  });
}

// 设置订单为返修单
export function handleOrderRework(data) {
  return request({
    url: `/admin/maintenance/handleOrderRework`,
    method: "post",
    data,
  });
}

// 设置师傅订单有效单数
export function handleMasterOrderValidOrderNum(data) {
  return request({
    url: `/admin/maintenance/handleMasterOrderValidOrderNum`,
    method: "post",
    data,
  });
}

// 设置师傅订单有效单数
export function handleMasterOrderServiceTimeout(orderSn) {
  return request({
    url: `/admin/maintenance/handleMasterOrderServiceTimeout?orderSn=${orderSn}`,
    method: "get",
  });
}

// 新增维保订单投诉
export function saveRepairOrderComplaint(data) {
  return request({
    url: `/admin/maintenance/saveRepairOrderComplaint`,
    method: "post",
    data,
  });
}

// 查询维保订单投诉
export function queryRepairOrderComplaint(data) {
  return request({
    url: `/admin/maintenance/queryRepairOrderComplaint`,
    method: "post",
    data,
  });
}

// 订单绑定业务员
export function bindSalesman(data) {
  return request({
    url: `/admin/maintenance/bindSalesman`,
    method: "post",
    data,
  });
}

// 设置企业备注
export function handleEnterpriseRemark(data) {
  return request({
    url: `/admin/maintenance/handleEnterpriseRemark`,
    method: "post",
    data,
  });
}

// 设置师傅备注
export function handleMasterRemark(data) {
  return request({
    url: `/admin/maintenance/handleMasterRemark`,
    method: "post",
    data,
  });
}

// 审核师傅订单数据
export function examineMasterOrderData(data) {
  return request({
    url: "/admin/maintenance/examineMasterOrderData",
    method: "post",
    data,
  });
}

// 删除维保订单.
export function deleteRepairOrder(id) {
  return request({
    url: "/admin/maintenance/deleteRepairOrder?id=" + id,
    method: "get",
  });
}

// 复制订单
export function copyOrder(orderSn) {
  return request({
    url: "/admin/maintenance/copyOrder?orderSn=" + orderSn,
    method: "get",
  });
}

// 设置订单质保时长
export function handleOrderWarranty(data) {
  return request({
    url: "/admin/maintenance/handleOrderWarranty",
    method: "post",
    data,
  });
}

// 设置返佣绑定人
export function handleBindCommission(data) {
  return request({
    url: "/admin/maintenance/handleBindCommission",
    method: "post",
    data,
  });
}

// 查询订单佣金记录表
export function queryOrderCommissionList(data) {
  return request({
    url: "/admin/maintenance/queryOrderCommissionList",
    method: "post",
    data,
  });
}

// 设置订单佣金状态
export function handleOrderCommissionStatus(data) {
  return request({
    url: "/admin/maintenance/handleOrderCommissionStatus",
    method: "post",
    data,
  });
}

// 处理订单佣金打款
export function handleOrderCommissionPayment(ids) {
  return request({
    url: `/admin/maintenance/handleOrderCommissionPayment?ids=${ids}`,
    method: "get",
  });
}

// 审核维保订单投诉
export function handleExamineRepairOrderComplaint(data) {
  return request({
    url: `/admin/maintenance/handleExamineRepairOrderComplaint`,
    method: "post",
    data,
  });
}

// 测试 师傅列表导出
export function testExport(data) {
  return request({
    url: "/admin/maintenance/io/test",
    method: "POST",
    data,
    responseType: "blob",
  });
}

// 订单优惠券减免
export function useOrderDiscount(data) {
  return request({
    url: `/admin/maintenance/useOrderDiscount`,
    method: "post",
    data,
  });
}
// 订单重置优惠减免
export function resetOrderDiscount(orderSn) {
  return request({
    url: `/admin/maintenance/resetOrderDiscount?orderSn=${orderSn}`,
    method: "get",
  });
}

// 查询师傅交接表信息
export function queryEnrollRepairOrderList(data) {
  return request({
    url: `/admin/order/queryEnrollRepairOrderList`,
    method: "post",
    data,
  });
}

// 查询师傅交接表信息
export function updateOnlineEnrollRepairOrder(data) {
  return request({
    url: `/admin/order/updateOnlineEnrollRepairOrder`,
    method: "post",
    data,
  });
}

// 订单挂起/继续
export function handleOrderPendingStatus(data) {
  return request({
    url: `/admin/order/handleOrderPendingStatus`,
    method: "post",
    data,
  });
}

// 订单流程备注
export function handleRepairProcessRemark(data) {
  return request({
    url: `/admin/order/handleRepairProcessRemark`,
    method: "post",
    data,
  });
}

// 订单流程快照
export function handleRepairProcessresultSnapshot(data) {
  return request({
    url: `/admin/order/handleRepairProcessresultSnapshot`,
    method: "post",
    data,
  });
}
