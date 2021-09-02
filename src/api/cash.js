import request from '@/utils/request'
import { publicData } from '@/webConfig.js'

// 提现列表
export function queryCashFn(data) {
  return request({
    url: '/admin/cash/queryCash',
    method: 'post',
    data: data
  })
}
// 审核
export function handleCashExamineFn(data) {
  return request({
    url: '/admin/cash/handleCashExamine',
    method: 'post',
    data: data
  })
}
// 提现规则详情
export function getCashRuleFn(data) {
  return request({
    url: '/admin/cash/getCashRule',
    method: 'get',
    params: data
  })
}
// 编辑提现规则
export function editCashRuleFn(data) {
  return request({
    url: '/admin/cash/editCashRule',
    method: 'post',
    data: data
  })
}
// 银行卡类型
export function queryBankTypeFn(data) {
  return request({
    url: '/admin/cash/queryBankType',
    method: 'post',
    data: data
  })
}
// 编辑银行卡类型
export function editBankTypeFn(data) {
  return request({
    url: '/admin/cash/editBankType',
    method: 'post',
    data: data
  })
}
// 删除银行卡类型
export function delBankTypeFn(data) {
  return request({
    url: '/admin/cash/delBankType',
    method: 'get',
    params: data
  })
}
