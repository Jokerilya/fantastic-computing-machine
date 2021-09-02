export default {
	filters: {
		reProdImg(val) {
			if (!val) return '';
			return val.split(',')[0];
		},
		resWan(val) {
			const reVal = parseInt(val);
			if (reVal > 9999) {
				return (reVal / 10000).toFixed(1) + '万';
			} else {
				return reVal;
			}
		},
	},
	methods: {
		exportData(response, filename) {
			var blob = new Blob([response.data]);
			var downloadElement = document.createElement('a');
			var href = window.URL.createObjectURL(blob); // 创建下载的链接
			downloadElement.href = href;
			downloadElement.download = `${
				response.headers.filename ? decodeURI(response.headers.filename) : decodeURI(filename)
			}.xls`; // 下载后文件名
			document.body.appendChild(downloadElement);
			downloadElement.click(); // 点击下载
			document.body.removeChild(downloadElement); // 下载完成移除元素
			window.URL.revokeObjectURL(href); // 释放掉blob对象
		},
		deleteAlert() {
			return this.$confirm('请再次确认是否继续执行此操作？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
		},
		promptFn() {
			return this.$prompt('请再次确认并输入备注信息！', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\S+/,
				inputErrorMessage: '备注信息不能为空!',
				type: 'warning',
			});
		},
		resDataFn(resData) {
			if (!resData || !resData.code) return;
			if (this.dataConfig) {
				this.dataConfig.loading = false;
			}
			if (resData.code === '000') {
				return resData.data || resData.code;
			} else {
				this.$message({
					showClose: true,
					message: resData.errorMessage,
					type: 'error',
				});
				return 'err';
			}
		},
	},
};
