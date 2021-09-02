<template>
	<div class="content_box">
		<el-table v-loading="dataConfig.loading" border :data="dataList" class="list" style="min-height: auto;">
			<el-table-column label="ID" width="100px" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="姓名" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{scope.row.realName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{scope.row.phone}}</span>
				</template>
			</el-table-column>
		</el-table>
		<!--  -->
		<div style="height: 16px;"></div>
		<div class="table-block" v-show="dataList.length > 0">
			<el-pagination background @size-change="handleSizeChange" @current-change="currentChangeFn" :current-page.sync="dataConfig.pageNo" :page-size="dataConfig.pageSize" :page-sizes="[20, 30, 50, 100]"
				layout="total,sizes, prev, pager, next" :total="dataConfig.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import {
		queryBoxMessage
	} from "@/api/activity";
	export default {
		data() {
			return {
				dataList: [],
				dataConfig: {
					loading: true,
					pageNo: 1,
					pageSize: 20,
					total:0,
				},
			};
		},
		beforeMount() {
			this.getDataListFn();
		},
		methods: {
			deleteAddFn(index) {
				this.dataList.splice(index, 1);
			},
			getDataListFn() {
				queryBoxMessage({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize
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
