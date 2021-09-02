<template>
	<div class="prod_imgs">
		<div v-for="(img, index) in imgs" :key="index" class="img" :class="{ border_radius: radius }"
			:style="{ width: width, height: height }">
			<div class="delete" @click="deleteImg(index)">
				<i class="el-icon-delete" />
			</div>
			<el-image v-if="img" :style="{ width: '100%', height: '100%' }" :src="img" fit="cover"
				:preview-src-list="imgs" />
		</div>
		<el-upload style="float: left" :class="{ border_radius: radius }" :style="{ width: width, height: height }"
			class="img" action="" :show-file-list="false" :http-request="httpRequestFn" :limit="max" :file-list="imgList"
			:on-exceed="exceedFn">
			<div slot="trigger" :style="{ width: width, height: height }" class="el_upload">
				<i class="el-icon-plus" />
			</div>
		</el-upload>
	</div>
</template>

<script>
	import {UploadImg} from "@/api/system.js";
	export default {
		props: {
			max: {
				type: Number,
				default: 9,
			},
			imgs: {
				type: Array,
				default: () => {
					return [];
				},
			},
			width: {
				type: String,
				default: "80px",
			},
			height: {
				type: String,
				default: "80px",
			},
			radius: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				choseLength: 0,
				imgList: []
			};
		},
		// computed: {
		//   maxLimit() {
		//     return this.max - this.imgs.length;
		//   },
		// },
		watch:{
			imgs(val){
				this.imgList = val.map(item=>{
					return {'name':'','url':item}
				})
			}
		},
		methods: {
			exceedFn() {
				this.$message({
					showClose: true,
					message: `最多只能上传${this.max}张图片哦！`,
					type: "warning",
				});
			},
			httpRequestFn(data) {
				console.log(this.imgs)
				if (this.imgs.length + 1 > this.max) {
					this.$message({
						showClose: true,
						message: `最多只能上传${this.max}张图片哦！`,
						type: "warning",
					});
					return;
				}
				const loading = this.$loading({
					text: '上传中..'
				})
				const formData = new FormData()
				formData.append('file', data.file)
				UploadImg(formData).then((res) => {
						this.$emit("uploadSuc", res.data);
						this.$message({
							showClose: true,
							message: "图片上传成功！",
							type: "success",
						});
						loading.close()
					})
					.catch(() => {
						this.$message({
							showClose: true,
							message: "文件上传失败！",
							type: "warning",
						});
						loading.close()
					});
			},
			deleteImg(index) {
				console.log(index);
				this.choseLength -= 1;
				this.$emit("deleteImg", index);
			},
		},
	};
</script>

<style lang="scss">
	.prod_imgs {
		overflow: hidden;

		.img {
			margin: 0 5px 5px 0;
			border: 1px #ccc solid;
			float: left;
			position: relative;

			.el_upload {
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				font-size: 30px;
				color: #ccc;
			}

			.delete {
				position: absolute;
				top: 0;
				right: 0;
				width: 30px;
				height: 30px;
				background: #000;
				display: none;
				justify-content: center;
				align-items: center;
				cursor: pointer;
				z-index: 99;

				i {
					font-size: 18px;
				}
			}

			.el-icon-delete {
				color: #ffffff;
				font-size: 24px;
			}

			&:hover {
				.delete {
					display: flex;
				}
			}
		}
	}

	.border_radius {
		border-radius: 50%;
	}
</style>
</style>
