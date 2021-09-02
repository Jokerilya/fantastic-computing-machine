<template>
	<div class="content_box">
		<first-title title="合作伙伴" />
		<div class="select_view">
			<el-button type="primary" @click="addDataFn"><i class="el-icon-plus" />添加合作伙伴</el-button>
			<span class="mg_l15" style="color: #f56c6c">注意：“修改”和“添加”合作伙伴后需要点击右侧“提交编辑”按钮才会生效哦！</span>
		</div>
		<el-table v-loading="dataConfig.loading" border :data="dataList" class="list">
			<el-table-column label="ID" width="60px" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
					<span v-if="!scope.row.id" class="delete_icon" @click="deleteAddFn(scope.$index)"><i class="el-icon-delete" /></span>
				</template>
			</el-table-column>
			<el-table-column label="图片" align="center" width="220">
				<template slot-scope="scope">
					<upload-img width="200px" height="100px" :img="scope.row.image" @uploadSuc="uploadSucFn($event, scope.$index)" />
				</template>
			</el-table-column>
			<el-table-column label="名称" align="center" header-align="center">
				<template slot-scope="scope">
					<el-input v-model="scope.row.name" type="text" placeholder="请输入名称" />
				</template>
			</el-table-column>
			
			<el-table-column label="操作" fixed="right" width="200" align="center" header-align="center">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="editBankTypeFn(scope.row)">提交编辑</el-button>
					<el-button v-if="scope.row.id" type="danger" size="small" @click="delItemFn(scope.row.id)"><i class="el-icon-delete" />删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="height: 16px;"></div>
		<div class="table-block" v-show="dataList.length > 0">
			<el-pagination background @size-change="handleSizeChange" @current-change="currentChangeFn" :current-page.sync="dataConfig.pageNo" :page-size="dataConfig.pageSize" :page-sizes="[20, 30, 50, 100]" layout="total,sizes, prev, pager, next" :total="dataConfig.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import uploadImg from "@/components/uploadImg/upload-img.vue";
	import {queryPartner,editPartner,deletePartner} from "@/api/activity";
	export default {
		components: {
			uploadImg,
		},
		data() {
			return {
				dataList: [],
				editData: {
					name: "",
					id: "",
					image: "",
				},
				dataConfig: {
					loading: true,
					pageNo:1,
					pageSize:30
				},
			};
		},
		beforeMount() {
			this.getDataListFn();
		},
		methods: {
			editBankTypeFn(row) {
				editPartner({
					name:row.name,
					image:row.image,
					id:row.id || undefined
				}).then((res) => {
					const resData = this.resDataFn(res);
					if (resData == "000") {
						this.$message({
							showClose: true,
							message: "操作成功！",
							type: "success",
						});
						this.getDataListFn();
					}
				})
			},
			addDataFn() {
				this.dataList.unshift(Object.assign({}, this.editData));
			},
			deleteAddFn(index) {
				this.dataList.splice(index, 1);
			},
			delItemFn(id) {
				this.deleteAlert().then(() => {
					const res = deletePartner({
						id
					});
					return res;
				}).then((res) => {
					const resData = this.resDataFn(res);
					if (resData == "000") {
						this.$message({
							showClose: true,
							message: "操作成功！",
							type: "success",
						});
						this.getDataListFn();
					}
				});
			},
			uploadSucFn(img, index) {
				this.$set(this.dataList,index,
					Object.assign({}, this.dataList[index], {
						image: img
					})
				);
			},
			/* statusChangeFn(val, index) {
				let editData = this.dataList[index];
				editOperation(
					Object.assign({}, editData, {
						status: val ? 1 : 0,
						createTime: undefined,
					})
				).then((res) => {
					if (res.code == "000") {
						this.$message({
							showClose: true,
							message: "操作成功！",
							type: "success",
						});
					} else {
						this.dataList[index].status = !val;
					}
				})
				.catch(() => {
					this.dataList[index].status = !val;
				});
			}, */
			getDataListFn() {
				queryPartner({
					pageNo:this.dataConfig.pageNo,
					pageSize:this.dataConfig.pageSize
				}).then((res) => {
					const resData = this.resDataFn(res);
					this.dataConfig.total = resData.total;
					this.dataList.splice(0, this.dataList.length, ...resData.records);
				});
			},
			handleSizeChange(val) {
				this.dataConfig.pageSize = val
				this.getDataListFn()
			},
			currentChangeFn(pageNo) {
				this.dataConfig.pageNo = pageNo
				this.getDataListFn()
			},
		},
	};
</script>

<style lang="scss"></style>
