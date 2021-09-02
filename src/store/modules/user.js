import { login } from '@/api/admin.js';
import { menuTreeListFn } from '@/api/system.js';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { localStorageData, removeLocalStorage } from '@/utils';
import { resetRouter } from '@/router';
import Vue from 'vue';

const getDefaultState = () => {
	return {
		token: getToken(),
		userInfo: {},
		menuTreeList: [],
		fileProgress: {},
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: state => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_USERINFO: (state, data) => {
		state.userInfo = Object.assign({}, state.userInfo, data);
		if (!state.userInfo.portrait) {
			state.userInfo.portrait =
				'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png';
		}
	},
	SET_MENULIST: (state, list) => {
		state.menuTreeList.splice(0, state.menuTreeList.length, ...list);
	},
	SETFILEPROGRESS: (state, data) => {
		Vue.set(state.fileProgress, data.key, data.val);
	},
	DELFILEPROGRESS: (state, data) => {
		delete state.fileProgress[data];
	},
};

const actions = {
	actionMenulist({ commit }, dataObj) {
		return new Promise((resolve, reject) => {
			menuTreeListFn({ id: dataObj ? dataObj.id : undefined })
				.then(response => {
					const { data } = response;
					console.log(data);
					commit('SET_MENULIST', data);
					resolve();
				})
				.catch(error => {
					reject(error);
				});
		});
	},

	// user login
	login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			login(userInfo)
				.then(response => {
					const { data } = response;
					commit('SET_USERINFO', {
						userAccount: data.realName,
						portrait: data.portrait,
						roleId: data.roleId,
					});
					localStorageData('userAccount', data.realName);
					localStorageData('roleId', data.roleId);
					localStorageData(
						'portrait',
						data.portrait ||
							'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
					);
					commit('SET_TOKEN', data.token);
					setToken(data.token);
					resolve();
				})
				.catch(error => {
					reject(error);
				});
		});
	},
	getInfo({ commit }) {
		return new Promise(resolve => {
			commit('SET_USERINFO', {
				userAccount: localStorageData('userAccount'),
				portrait: localStorageData('portrait'),
				roleId: localStorageData('roleId'),
			});
			resolve();
		});
	},
	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			removeToken(); // must remove  token  first
			resetRouter();
			commit('RESET_STATE');
			resolve();
		});
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			removeToken(); // must remove  token  first
			commit('RESET_STATE');
			removeLocalStorage('userAccount');
			removeLocalStorage('portrait');
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
