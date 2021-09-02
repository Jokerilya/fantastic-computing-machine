import request from '@/utils/request'
import { publicData } from '@/webConfig.js'

//模式订单成交金额统计
export function modeOrderPayMoneyFn() {
  return request({
    url: '/admin/statistics/modeOrderPayMoney',
    method: 'get'
  })
}
//模式订单成交金额统计
export function modeOrderQuantityFn() {
  return request({
    url: '/admin/statistics/modeOrderQuantity',
    method: 'get'
  })
}
//会员级别数量统计
export function memberFn() {
  return request({
    url: '/admin/statistics/member',
    method: 'get'
  })
}
//平台积分池统计
export function pointsPoolFn() {
  return request({
    url: '/admin/statistics/pointsPool',
    method: 'get'
  })
}