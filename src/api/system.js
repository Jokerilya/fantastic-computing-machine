// 系统管理模块
import request from '@/utils/request';
import { publicData } from '@/webConfig.js';
import * as qiniu from 'qiniu-js';
import { qiniuHost } from '@/webConfig.js';
import store from '@/store';

// 系统参数配置=======================================================
export function baseInfoFn(data) {
	return request({
		url: '/admin/base/getConfig',
		method: 'post',
		data: data,
	});
}
// 修改系统配置
export function baseEditFn(data) {
	return request({
		url: '/admin/base/editConfig',
		method: 'post',
		data: data,
	});
}
// 系统日志列表
export function baseLogListFn(data) {
	return request({
		url: '/admin/base/queryLog',
		method: 'post',
		data: data,
	});
}
// 添加/修改用户
export function addOrUpdateFn(data) {
	return request({
		url: `/admin/user/editUser`,
		method: 'post',
		data: data,
	});
}
// 用户信息详情
export function userDetailFn(data) {
	return request({
		url: '/admin/user/getUserDetail',
		method: 'get',
		params: data,
	});
}
// 用户信息列表
export function userListFn(data) {
	return request({
		url: `/admin/user/queryUser`,
		method: 'post',
		data: data,
	});
}
// 删除用户
export function removeUserFn(data) {
	return request({
		url: '/admin/user/delUser',
		method: 'get',
		params: data,
	});
}
// 修改系统用户状态
export function updateStatusFn(data) {
	return request({
		url: `/admin/user/handleUserStatus`,
		method: 'get',
		params: data,
	});
}
// 添加/修改角色
export function addOrUpdateRoleFn(data) {
	return request({
		url: `/admin/role/editRole`,
		method: 'post',
		data: data,
	});
}
// 角色信息详情
export function roleDetailFn(data) {
	return request({
		url: `/admin/role/getRoleDetail`,
		method: 'get',
		params: data,
	});
}
// 角色信息列表
export function roleListFn(data) {
	return request({
		url: `/admin/role/queryRole`,
		method: 'post',
		data: data,
	});
}
// 删除角色
export function roleRemoveFn(data) {
	return request({
		url: '/admin/role/delRole',
		method: 'get',
		params: data,
	});
}
// 角色禁用/启用
export function handleRoleStatusFn(data) {
	return request({
		url: '/admin/role/handleRoleStatus',
		method: 'get',
		params: data,
	});
}
// 添加/修改菜单
export function menuAddOrUpdateFn(data) {
	return request({
		url: `/admin/menu/editMenu`,
		method: 'post',
		data: data,
	});
}
// 菜单信息列表
export function menuListFn(data) {
	return request({
		url: '/admin/menu/queryMenu',
		method: 'post',
		data: data,
	});
}
// 删除菜单
export function menuRemoveFn(data) {
	return request({
		url: `/admin/menu/remove/${data.menuId}`,
		method: 'get',
	});
}
// 菜单信息树形列表
export function menuTreeListFn(data) {
	return request({
		url: data.id ? '/admin/menu/queryByRoleId' : '/admin/menu/queryUserMenu',
		method: 'get',
		params: data.id ? data : undefined,
	});
}
// 版本信息列表
export function getVersionFn(data) {
	return request({
		url: `/admin/param/getVersion`,
		method: 'get',
		data: data,
	});
}
// 添加版本
// export function versionAddFn(data) {
//   return request({
//     url: `/admin/version/add`,
//     method: 'post',
//     data: {
//       'sign': publicData.sign,
//       'sysType': publicData.sysType,
//       ...data
//     }
//   })
// }
// 修改版本
export function editVersionFn(data) {
	return request({
		url: `/admin/param/editVersion`,
		method: 'post',
		data: data,
	});
}
// 系统说明列表
export function queryAgreementFn(data) {
	return request({
		url: '/admin/agreement/queryAgreement',
		method: 'get',
		params: data,
	});
}
// 编辑系统说明
export function editAgreementFn(data) {
	return request({
		url: '/admin/agreement/editAgreement',
		method: 'post',
		data: data,
	});
}
// 查询地址信息
export function addressFn(data) {
  return request({
    url: '/admin/base/address',
    method: 'get',
    params: data
  })
}
// 运费模板列表
export function queryExpRuleFn(data) {
  return request({
    url: '/admin/exp/queryExpRule',
    method: 'post',
    data: data
  })
}
// 运费模板详情
export function getExpRuleDetailFn(data) {
  return request({
    url: '/admin/exp/getExpRuleDetail',
    method: 'get',
    params: data
  })
}
// 编辑运费模板
export function editExpRuleFn(data) {
  return request({
    url: '/admin/exp/editExpRule',
    method: 'post',
    data: data
  })
}
// 删除运费模板
export function delExpRuleDetailFn(data) {
  return request({
    url: '/admin/exp/delExpRuleDetail',
    method: 'get',
    params: data
  })
}
// 删除运费模板规则
export function delExpDetailFn(data) {
  return request({
    url: '/admin/exp/delExpDetail',
    method: 'get',
    params: data
  })
}
// 获取七牛Token
function getQiniuToken(data) {
	return request({
		url: '/admin/base/getToken',
		method: 'get',
		params: data,
	});
}

export function UploadImg(data) {
	return request({
		url: '/admin/base/uploadImg',
		method: 'post',
		data: data,
	});
}
// export function UploadImg(data) {
// 	return new Promise((resolve, reject) => {
// 		console.log("wenjian--"+ data.file)
// 		const formData = new FormData()
// 		formData.append('file', data.file)
// 		uploadFile(formData).then(res => {
// 			// 这是我封装的获取uptoken的方法，自行修改
// 			console.log("上传--"+res);
// 			// 上传成功后触发。包含文件地址。
// 			// resolve(config.domain + result.key);
// 		});
// 	});
// }
// export function UploadImg(data) {
// 	store.commit('user/SETFILEPROGRESS', { key: data.file.uid, val: 0 });
// 	return new Promise((resolve, reject) => {
// 		getQiniuToken().then(res => {
// 			// 这是我封装的获取uptoken的方法，自行修改
// 			const uptoken = res.data;
// 			const key = `changc_${new Date().getTime()}.${data.file.name.split('.')[1]}`; // 这是上船后返回的文件名，这里为了避免重复，加上了时间戳和随机数
// 			const config = {
// 				domain: qiniuHost, // 配置好的七牛云域名  如   https://cdn.qniyun.com/
// 			};
// 			const putExtra = {
// 				fname: data.file.name,
// 				params: {},
// 			};
// 			const observable = qiniu.upload(data.file, key, uptoken, putExtra, config);
// 			observable.subscribe({
// 				next: result => {
// 					store.commit('user/SETFILEPROGRESS', {
// 						key: data.file.uid,
// 						val: result.total.percent,
// 					});
// 					// 主要用来展示进度
// 				},
// 				error: err => {
// 					// 上传错误后触发
// 					console.log(err);
// 					reject(err);
// 				},
// 				complete: result => {
// 					// 上传成功后触发。包含文件地址。
// 					resolve(config.domain + result.key);
// 				},
// 			});
// 		});
// 	});
// }
