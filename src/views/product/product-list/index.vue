<template>
	<div class="content_box">
		<first-title title="商品管理" />
		<div class="select_view">
			筛选：
			<el-input v-model="queryData.title" style="width: 200px" class="mg_r15 mg_t10" placeholder="请输入商品名称" />
			<el-select v-model="queryData.isShelves" style="width: 200px" class="mg_r15 mg_t10" placeholder="请选择商品状态">
				<el-option v-for="item in isShelves" :key="item.val" :label="item.name" :value="item.val" />
			</el-select>
			<el-cascader style="width: 300px" v-model="queryData.categoryId" class="mg_r15 mg_t10"
				:class="{ el_cascader: queryData.categoryId != '' }" placeholder="请选择商品分类" expand-trigger="hover"
				:props="categoryList" :show-all-levels="false" clearable />
			<el-button class="mg_t10" type="primary" @click="queryDataListFn">查询</el-button>
			<el-button class="mg_t10 mg_r15" type="danger" @click="resSetQueryFn">重置查询</el-button>
			<el-link href="#/product/product-detail">
				<el-button type="primary"><i class="el-icon-plus" />添加商品</el-button>
			</el-link>
		</div>
		<el-table v-loading="dataConfig.loading" border :data="dataList" class="list"
			:header-cell-style="{color:'#666'}">
			<el-table-column label="ID" fixed width="60" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="商品标题" fixed width="160" align="left" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.title }}</span>
				</template>
			</el-table-column>
			<el-table-column label="供应商" fixed width="160" align="left" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.supplierName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="商品分类" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.categoryName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="简述" align="center" header-align="center" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					<span>{{ scope.row.simpleDesc }}</span>
				</template>
			</el-table-column>
			<el-table-column label="商品型号" align="center" header-align="center" width="110px">
				<template slot-scope="scope">
					<span>{{ scope.row.mode }}</span>
				</template>
			</el-table-column>
			<el-table-column label="封面图片" width="110" align="center" header-align="center">
				<template slot-scope="scope">
					<el-image style="width: 80px; height: 80px" :src="scope.row.coverImage" fit="cover"
						:preview-src-list="[scope.row.coverImage]" />
				</template>
			</el-table-column>
			<el-table-column label="参考价" align="center" header-align="center" width="100px">
				<template slot-scope="scope">
					<span>{{ scope.row.price }}</span>
				</template>
			</el-table-column>
			<el-table-column label="总库存" align="center" header-align="center" width="84px">
				<template slot-scope="scope">
					<span>{{ scope.row.inventory }}</span>
				</template>
			</el-table-column>
			<el-table-column label="剩余库存" align="center" header-align="center" width="84px">
				<template slot-scope="scope">
					<span>{{ scope.row.lastInventory }}</span>
				</template>
			</el-table-column>
			<el-table-column label="是否多规格" align="center" header-align="center" width="98px">
				<template slot-scope="scope">
					<span>{{ scope.row.isExistManySpec == 1 ? "是" : "否" }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" header-align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上/下架" fixed="right" align="center" header-align="center" width="100">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.isShelves" @change="statusChangeFn($event, scope.$index)" />
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="180" align="center" header-align="center">
				<template slot-scope="scope">
					<!-- <el-link style="margin-right: 10px" :href="`#/product/product-detail?id=${scope.row.id}&pageNo=${dataConfig.pageNo}&pageSize=${dataConfig.pageSize}`" >
				<el-button type="primary" size="small">编辑</el-button>
          </el-link> -->
					<router-link style="margin-right: 10px"
						:to="{name:'ProductDetail',query:{id:scope.row.id,pageNo:dataConfig.pageNo,pageSize:dataConfig.pageSize}}">
						<el-button type="primary" size="small">编辑</el-button>
					</router-link>
					<el-button size="small" type="danger" @click="delProductFn(scope)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="el_pagination">
			<el-pagination background layout="prev, pager, next,total,sizes" :current-page="dataConfig.pageNo"
				:total="dataConfig.total" :page-sizes="[20, 30, 40, 50]" :page-size="dataConfig.pageSize"
				@current-change="currentChangeFn" @size-change="handleSizeChange" />
		</div>
	</div>
</template>

<script>
	import {
		queryProductCategoryFn,
		queryProductFn,
		handleProductStatus,
		delProductFn,
	} from "@/api/product";
	export default {
		name: "ProductList",
		data() {
			return {
				dataList: [],
				dataConfig: {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				},
				isShelves: [{
						name: "上架",
						val: 1
					},
					{
						name: "下架",
						val: 0
					},
				],
				isExistManySpec: [{
						name: "是",
						val: 1
					},
					{
						name: "否",
						val: 0
					},
				],
				queryData: {
					categoryId: '',
					isShelves: "",
					title: "",
				},
				productBrandList: [],
				categoryList: {
					lazy: true,
					checkStrictly: true,
					lazyLoad(node, resolve) {
						queryProductCategoryFn({
							pid: node.value || 0
						}).then((res) => {
							const resData = res.data;
							const nodes = resData.map((item) => ({
								value: item.id,
								label: item.name,
							}));
							// 通过调用resolve将子节点数据返回，通知组件数据加载完成
							resolve(nodes);
						})
					}
				},
			};
		},
		beforeMount() {
			if (this.$route.query.pageNo) {
				this.dataConfig.pageNo = Number(this.$route.query.pageNo);
			}
			if (this.$route.query.pageSize) {
				this.dataConfig.pageSize = Number(this.$route.query.pageSize);
			}
			this.getDataListFn();
		},
		methods: {
			delProductFn(scope) {
				this.deleteAlert()
					.then(() => {
						const res = delProductFn({
							id: scope.row.id
						});
						return res;
					})
					.then((res) => {
						const resData = this.resDataFn(res);
						if (resData == "000") {
							this.dataList.splice(scope.$index, 1);
						}
					});
			},
			statusChangeFn(val, index) {
				handleProductStatus({
						id: this.dataList[index].id,
						status: val ? 1 : 0,
					})
					.then((res) => {
						if (res.code == "000") {
							this.$message({
								showClose: true,
								message: "操作成功！",
								type: "success",
							});
						} else {
							this.dataList[index].isShelves = !val;
						}
					})
					.catch(() => {
						this.dataList[index].isShelves = !val;
					});
			},
			getDataListFn() {
				queryProductFn({
					pageNo: this.dataConfig.pageNo,
					pageSize: this.dataConfig.pageSize,
					categoryId: this.queryData.categoryId ? this.queryData.categoryId.pop() : 0,
					isShelves: this.queryData.isShelves,
					title: this.queryData.title,
				}).then((res) => {
					const resData = this.resDataFn(res);
					this.dataConfig.total = resData.total;
					resData.records.forEach((item) => {
						item.isShelves = item.isShelves == 1;
					});
					this.dataList.splice(0, this.dataList.length, ...resData.records);
				});
			},
			resSetQueryFn() {
				this.dataConfig = {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				};
				this.queryData = {
					categoryId: 0,
					isShelves: "",
					title: "",
				};
				this.getDataListFn();
			},
			queryDataListFn() {
				this.dataConfig = {
					pageNo: 1,
					pageSize: 20,
					total: 0,
					loading: true,
				};
				this.getDataListFn();
			},
			handleSizeChange(val) {
				this.dataConfig.pageSize = val;
				this.getDataListFn();
			},
			currentChangeFn(pageNo) {
				this.dataConfig.pageNo = pageNo;
				this.getDataListFn();
			},
		},
	};
</script>

<style lang="scss">
</style>
