<template>
	<div class="app-container coupon-modify-container">
		<el-card>
			<el-form
				v-if="couponFormStatus !== 3"
				ref="couponForm"
				:rules="rules"
				label-width="120px"
				:model="couponForm"
				class="coupon-form"
			>
				<el-form-item label="优惠券标题" prop="name">
					<el-input v-model="couponForm.name" clearable />
				</el-form-item>
				<el-form-item label="发行总量" prop="publishCount">
					<el-input v-model="couponForm.publishCount" clearable />
				</el-form-item>
				<el-form-item label="面额（元）" prop="offerAmount">
					<el-input v-model="couponForm.offerAmount" clearable />
				</el-form-item>
				<el-form-item label="每人限领（张）" prop="limitPerPerson">
					<el-input v-model="couponForm.limitPerPerson" clearable />
					<span>0或为空，则不限制</span>
				</el-form-item>
				<el-form-item label="使用门槛" prop="minPoint">
					<el-input v-model="couponForm.minPoint" clearable>
						<template slot="prepend">满</template>
						<template slot="append">元可用</template>
					</el-input>
				</el-form-item>
				<el-form-item label="优惠券有效期">
					<el-date-picker
						v-model="couponDate"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="有效时间说明" prop="expiryTime">
					<el-select v-model="couponForm.expiryTime" placeholder="请选择">
						<el-option
							v-for="item in expiryTime"
							:key="item"
							:label="item"
							:value="item"
						></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="使用时间段" prop="usePeriod">
					<template v-for="(item, index) in usePeriod">
						<div class="table-row" :key="index">
							<el-time-picker
								is-range
								v-model="item.useTime"
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								:picker-options="{
									format: 'HH:mm'
								}"
								value-format="HH:mm"
							></el-time-picker>
							<el-button
								v-if="usePeriod.length > 1"
								type="danger"
								icon="el-icon-delete"
								circle
								@click.native.prevent="deleteRow(index, usePeriod)"
							/>
						</div>
						<div
							:key="index + 1"
							class="table-footer"
							v-if="index + 1 === usePeriod.length"
						>
							<el-button type="primary" @click.native.prevent="addRow(usePeriod)">
								添加使用时间
							</el-button>
						</div>
					</template>
				</el-form-item>
				<el-form-item label="商品图片" prop="imgUrl">
					<el-upload
						action
						class="img-uploader"
						:auto-upload="false"
						:show-file-list="false"
						:on-change="changeProductImg"
					>
						<el-image v-if="couponForm.imgUrl" :src="couponForm.imgUrl" fit="cover" />
						<i v-else class="el-icon-plus"></i>
					</el-upload>
					<span>最多可上传1张图片，限3M以内</span>
				</el-form-item>
				<el-form-item label="使用须知" prop="note">
					<el-input
						type="textarea"
						placeholder="请填写使用须知"
						v-model="couponForm.note"
					></el-input>
				</el-form-item>
				<el-form-item label="启用状态" prop="status">
					<el-radio-group v-model="couponForm.status">
						<el-radio :label="1">启用</el-radio>
						<el-radio :label="2">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-button
					class="next-step-btn"
					type="primary"
					@click="submitAdForm"
					:loading="couponFormStatus === 2"
				>
					发布
				</el-button>
			</el-form>

			<!-- 提交发布 -->
			<div class="result-main" v-if="couponFormStatus === 3">
				<i class="el-icon-success result-icon" />
				<div class="result-title">提交成功，请耐心等待审核</div>
				<div class="result-subtitle">将在一个工作日内审核完毕，请耐心等待审核</div>
				<div class="result-extra">
					<el-button class="back-btn" type="primary" @click="goBack()">
						返回列表
					</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script>
// import { AddOrUpdateCoupon, UploadImg, CouponDetail } from "@/api/admin";
export default {
	name: 'CouponModify',
	data() {
		return {
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 86400000;
				}
			},
			couponFormStatus: 1, // 表单提交状态 待发布1 发布中2 已发布 3
			// 表单数据
			couponForm: {
				endDate: '', // 有效期--结束
				expiryTime: '', // 有效时间说明
				imgUrl: [], // 封面图
				limitPerPerson: '', // 每人限领张数（0或为空，则不限制）
				minPoint: '', // 使用门槛；0表示无门槛
				name: '', // 优惠券名称
				note: '', // 使用须知/备注
				offerAmount: '', // 优惠金额
				publishCount: '', // 总发行量
				startDate: '', // 有效期--开始
				status: '', // 优惠券状态：0->未启用；1->已启用
				// 使用时间段
				usePeriod: []
			},
			expiryTime: [
				'工作日不可用',
				'限工作日可用',
				'限周末可用',
				'周末、法定节日不可用',
				'周末、法定节日通用'
			],
			usePeriod: [
				{
					useTime: ''
				}
			], // 使用时间段
			couponDate: '',
			// 表单规则
			rules: {
				name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
				category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
				code: [{ required: true, message: '请输入商品货号', trigger: 'blur' }]
			},
			// 搜索表单
			searchForm: {
				name: ''
			},
			loading: true
		};
	},
	async created() {
		// await CouponDetail({
		//   couponId: this.$route.query.id
		// }).then(res => {
		//   let imgUrl = res.imgUrl.split(",");
		//   res.imgUrl = [];
		//   for (let i in imgUrl) {
		//     res.imgUrl.push({
		//       name: imgUrl[i],
		//       url: imgUrl[i]
		//     });
		//   }
		//   // 有效期
		//   this.couponDate = [res.startDate, res.endDate];
		//   this.usePeriod = [];
		//   for (let i in res.usePeriods) {
		//     // 使用时间段
		//     this.usePeriod.push({
		//       useTime: [
		//         res.usePeriods[i].useStartTime,
		//         res.usePeriods[i].useEndTime
		//       ]
		//     });
		//   }
		//   console.log(res);
		//   this.couponForm = {
		//     ...res
		//   };
		// });
	},
	methods: {
		changeProductImg(file, fileList) {
			let fileData = new FormData();
			fileData.append('file', file.raw);
			// UploadImg(fileData).then(res => {
			//   this.couponForm.imgUrl.push({
			//     url: res,
			//     name: res
			//   });
			// });
		},
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		// 发布
		submitAdForm() {
			this.couponForm.endDate = this.couponDate[1]; // 有效期--结束
			this.couponForm.startDate = this.couponDate[0]; // 有效期--开始
			// isExpired: '', // 是否已过期：0->未过期；1->已过期/结束
			delete this.couponForm.usePeriods;
			delete this.couponForm.useCount;
			this.couponForm.usePeriod = [];
			let imgUrl = [];
			for (let i in this.couponForm.imgUrl) {
				imgUrl.push(this.couponForm.imgUrl[i].url);
			}
			this.couponForm.imgUrl = imgUrl.join(',');
			for (let i in this.usePeriod) {
				this.couponForm.usePeriod.push({
					useStartTime: this.usePeriod[i].useTime[0], // 使用时间段--开始
					useEndTime: this.usePeriod[i].useTime[1] // 使用时间段--结束
				});
			}
			this.couponFormStatus = 2;
			// AddOrUpdateCoupon(this.couponForm)
			//   .then(res => {
			//     this.couponFormStatus = 3;
			//   })
			//   .catch(err => {
			//     this.couponFormStatus = 1;
			//   });
		},
		addRow(rows) {
			rows.push({
				time: ''
			});
		},
		deleteRow(index, rows) {
			rows.splice(index, 1);
		},
		goBack() {
			this.$router.go(-1);
		}
	}
};
</script>
<style lang="scss">
// 修改element 样式
.el-upload-list__item-thumbnail {
	object-fit: cover;
}
</style>
<style lang="scss" scoped>
.coupon-modify-container {
	.el-card {
		padding: 20px 50px;
	}
	.coupon-form {
		margin: 30px auto;
		width: 800px;
	}
	.el-input,
	.el-select,
	.el-textarea {
		width: 300px;
	}
	.next-step-btn {
		margin-top: 10px;
		margin-left: 100px;
	}
	.group-buy-input {
		.group-buy-input-tips {
			color: #909399;
		}
	}
	.group-buy-table {
		.el-input,
		.el-select {
			width: 100%;
		}
	}
	.table-row {
		margin-bottom: 10px;
		.el-button.is-circle {
			margin-left: 10px;
		}
	}
	.table-footer {
		margin: 20px 0;
	}
	.result-main {
		text-align: center;
		.result-icon {
			font-size: 100px;
			color: #67c23a;
		}
		.result-title {
			margin: 20px 0 10px;
			font-size: 18px;
		}
		.result-subtitle {
			font-size: 14px;
			margin-bottom: 30px;
			color: #666666;
		}
	}
}
</style>
