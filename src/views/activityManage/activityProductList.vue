<template>
  <div class="activityProductList">
    <div class="activityProductList_btnline">
      <el-button @click="openAddEditActivityProductDialog(null)"
        >新增</el-button
      >
    </div>
    <el-card>
      <el-table :data="activityProductList" style="width: 100%">
        <el-table-column align="center" prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="{ row }">
            {{
              row.type == 1
                ? "保养服务"
                : row.type == 2
                ? "检测服务"
                : "维保服务"
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>
        <el-table-column align="center" label="主图">
          <template slot-scope="{ row }">
            <el-image
              :src="row.coverImage"
              style="width: 120px; height: 90px"
              :preview-src-list="[row.coverImage]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="轮播图">
          <template slot-scope="{ row }">
            <el-image
              :src="row.images && row.images[0]"
              style="width: 120px; height: 90px"
              :preview-src-list="row.images"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="内容">
          <template slot-scope="{ row }">
            <el-image
              :src="row.content"
              fit="cover"
              :preview-src-list="[row.content]"
              style="width: 120px; height: 90px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="price" label="价格">
        </el-table-column>
        <el-table-column align="center" width="80" prop="sort" label="排序">
        </el-table-column>
        <el-table-column align="center" label="更多">
          <template slot-scope="{ row }">
            <el-button type="text" @click="unmountProductFn(row)">{{
              row.isShelves == 0 ? "上架" : "下架"
            }}</el-button>
            <el-button
              type="text"
              @click="openAddEditActivityProductDialog(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增编辑产品框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="activityProductDialogTitle"
      :visible="activityProductDialogVisible"
      :show-close="false"
      center
      width="50%"
    >
      <el-form
        label-width="100px"
        label-position="left"
        :model="queryActivityProductListParams"
        :rules="queryActivityProductListRules"
        ref="queryActivityProductListRef"
      >
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="queryActivityProductListParams.type">
            <el-radio :label="1">保养服务</el-radio>
            <el-radio :label="2">检测服务</el-radio>
            <el-radio :label="3">维保服务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请输入标题"
            v-model="queryActivityProductListParams.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            type="number"
            placeholder="请输入价格"
            v-model="queryActivityProductListParams.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <div style="color: #999; font-size: 26px">
            Tip:数字越低,排序越靠前
          </div>
          <el-input
            type="number"
            placeholder="请输入排序的顺序"
            v-model="queryActivityProductListParams.sort"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <div style="color: #999; font-size: 26px">
            Tip:封面图的尺寸最佳比例:宽 1486像素 : 高 1486像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :multiple="false"
            ref="uploadCoverImageRef"
            :file-list="coverImageFileList"
            :http-request="uploadCoverImageFileList"
            :on-remove="delCoverImage"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图" prop="images">
          <div style="color: #999; font-size: 26px">
            Tip:轮播图的尺寸最佳比例:宽 1486 像素 : 高 991 像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            :limit="5"
            multiple
            ref="uploadImageRef"
            :file-list="imagesFileList"
            :http-request="uploadImagesFileList"
            :on-remove="delImages"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容图" prop="content">
          <div style="color: #999; font-size: 26px">
            轮播图的尺寸最佳比例:宽750像素
          </div>
          <el-upload
            action="#"
            list-type="picture-card"
            ref="uploadContentRef"
            :multiple="false"
            :file-list="contentFileList"
            :http-request="uploadContentFileList"
            :on-remove="delContent"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeActivityProductDialog">取 消</el-button>
        <el-button type="primary" @click="confirmActivityProduct"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg } from "@/api/system.js";
import {
  queryActivityProductList,
  editActivityProduct,
  shelvesActivityProduct,
} from "@/api/activity";
export default {
  data() {
    return {
      activityProductList: [],
      activityProductDialogVisible: false,
      activityProductDialogTitle: "新增活动产品",
      queryActivityProductListParams: {
        type: null,
        title: null,
        price: null,
        images: null,
        coverImage: null,
        content: null,
        sort: null,
      },

      coverImageFileList: [],
      contentFileList: [],
      imagesFileList: [],

      queryActivityProductListRules: {
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        coverImage: [
          { required: true, message: "请上传封面图", trigger: "change" },
        ],
        content: [
          { required: true, message: "请上传内容图", trigger: "change" },
        ],
        images: [
          { required: true, message: "请上传轮播图", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 上/下架商品
    async unmountProductFn(item) {
      const res = await this.$confirm(
        `您是否${item.isShelves == 0 ? "上架" : "下架"}该活动产品`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (res == "confirm") {
        let isShelves;
        item.isShelves == 0 ? (isShelves = 1) : (isShelves = 0);
        const result = await shelvesActivityProduct({
          id: item.id,
          isShelves,
        });
        if (result.message == "操作成功") {
          this.$message({
            message: result.message,
            type: "success",
          });
          this.queryActivityProductList();
        }
      }
    },
    // 确定新增编辑活动框
    async confirmActivityProduct() {
      await this.$refs["queryActivityProductListRef"].validate();
      const res = await editActivityProduct(
        this.queryActivityProductListParams
      );
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.queryActivityProductList();
        this.closeActivityProductDialog();
      }
    },
    // 关闭新增编辑活动框
    closeActivityProductDialog() {
      this.activityProductDialogVisible = false;
      this.queryActivityProductListParams = {
        type: null,
        title: null,
        price: null,
        images: null,
        coverImage: null,
        content: null,
      };
      this.coverImageFileList = [];
      this.contentFileList = [];
      this.imagesFileList = [];
      this.$refs.uploadImageRef.$children[1].$el.style.display = "";
      this.$refs.uploadContentRef.$children[1].$el.style.display = "";
      this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "";
      this.$refs["queryActivityProductListRef"].resetFields();
    },
    // 删除轮播图
    delImages(e) {
      const findIndex = this.imagesFileList.findIndex(
        (item) => item.url == e.url
      );
      this.imagesFileList.splice(findIndex, 1);
      const urlArr = [];
      this.imagesFileList.forEach((item) => {
        urlArr.push(item.url);
      });
      this.queryActivityProductListParams.images = urlArr.join(",");
      this.$refs.queryActivityProductListRef.validateField("images");
      this.$refs.uploadImageRef.$children[1].$el.style.display = "";
    },
    // 上传轮播图 多张
    async uploadImagesFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.imagesFileList.push({ url: res.data });
      const urlArr = [];
      this.imagesFileList.forEach((item) => {
        urlArr.push(item.url);
      });
      this.queryActivityProductListParams.images = urlArr.join(",");
      this.$refs.queryActivityProductListRef.validateField("images");
      if (this.imagesFileList.length >= 5) {
        this.$refs.uploadImageRef.$children[1].$el.style.display = "none";
      }
    },
    // 删除内容图
    delContent() {
      this.contentFileList = [];
      this.queryActivityProductListParams.content = null;
      this.$refs.queryActivityProductListRef.validateField("content");
      this.$refs.uploadContentRef.$children[1].$el.style.display = "";
    },
    // 上传内容图 单张
    async uploadContentFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.contentFileList = [{ url: res.data }];
      this.queryActivityProductListParams.content = res.data;
      this.$refs.queryActivityProductListRef.validateField("content");
      if (this.contentFileList.length == 1) {
        this.$refs.uploadContentRef.$children[1].$el.style.display = "none";
      }
    },
    // 删除封面图
    delCoverImage(e) {
      this.coverImageFileList = [];
      this.queryActivityProductListParams.coverImage = null;
      this.$refs.queryActivityProductListRef.validateField("coverImage");
      this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "";
    },
    // 上传封面图 单张
    async uploadCoverImageFileList(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.coverImageFileList = [{ url: res.data }];
      this.queryActivityProductListParams.coverImage = res.data;
      this.$refs.queryActivityProductListRef.validateField("coverImage");
      if (this.coverImageFileList.length == 1) {
        this.$refs.uploadCoverImageRef.$children[1].$el.style.display = "none";
      }
    },
    // 打开新增编辑产品框
    openAddEditActivityProductDialog(item) {
      // 编辑回显
      if (item) {
        this.activityProductDialogTitle = "编辑活动产品";
        this.activityProductDialogVisible = true;
        this.queryActivityProductListParams = { ...item };
        // 回显封面图
        if (this.queryActivityProductListParams.coverImage) {
          this.coverImageFileList = [
            { url: this.queryActivityProductListParams.coverImage },
          ];
          setTimeout(() => {
            this.$refs.uploadCoverImageRef.$children[1].$el.style.display =
              "none";
          }, 300);
        }
        // 回显内容图
        if (this.queryActivityProductListParams.content) {
          this.contentFileList = [
            { url: this.queryActivityProductListParams.content },
          ];
          setTimeout(() => {
            this.$refs.uploadContentRef.$children[1].$el.style.display = "none";
          }, 300);
        }
        // 回显轮播图
        if (this.queryActivityProductListParams.images) {
          const imagesFileList = [];
          const urlArr = [];
          this.queryActivityProductListParams.images.forEach((item) => {
            imagesFileList.push({ url: item });
            urlArr.push(item);
          });
          this.queryActivityProductListParams.images = urlArr.join(",");
          this.imagesFileList = imagesFileList;
          if (this.imagesFileList.length >= 5) {
            setTimeout(() => {
              this.$refs.uploadContentRef.$children[1].$el.style.display =
                "none";
            }, 300);
          }
        }
      } else {
        this.activityProductDialogVisible = true;
        this.activityProductDialogTitle = "新增活动产品";
      }
    },
    // 查询产品列表
    async queryActivityProductList() {
      const res = await queryActivityProductList();
      res.data.forEach((item) => {
        if (item.images) {
          item.images = item.images.split(",");
        }
      });
      this.activityProductList = res.data;
    },
  },
  created() {
    this.queryActivityProductList();
  },
};
</script>

<style scoped lang="scss">
.activityProductList {
  padding: 20px;
  .activityProductList_btnline {
    text-align: right;
    margin-bottom: 20px;
  }
}
</style>
