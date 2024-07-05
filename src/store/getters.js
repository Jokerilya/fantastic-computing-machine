const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	token: state => state.user.token,
	avatar: state => state.user.userInfo.portrait,
	name: state => state.user.userInfo.userAccount,
	roleId: state => state.user.userInfo.roleId,
	 visitedViews: state => state.tagsView.visitedViews, //这个是新增的
	  cachedViews: state => state.tagsView.cachedViews,  //这个是新增的
	  intervalId:state=>state.intervalId,

	menuTreeList: state => state.user.menuTreeList,
	menuRouteKList: state => {
		const resArr = [];
		const forEachArrFn = function(arr) {
			arr.forEach(item => {
				item.url && resArr.push(item.url);
				if (Object.prototype.toString.call(item.children) == '[object Array]') {
					forEachArrFn(item.children);
				}
			});
		};
		forEachArrFn(state.user.menuTreeList);
		return resArr;
	},
};
export default getters;
