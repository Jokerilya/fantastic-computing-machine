<template>
  <div class="app-container">
    <div class="manage-top" style="display: flex">
      <el-form label-width="88px" label-position="right" style="width: 100%">
        <el-row :gutter="20">
          <el-col>
            <el-button
              style="margin-bottom: 22px"
              type="primary"
              icon="el-icon-plus"
              @click="addNews('new')"
              >添加资讯</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="height: 16px"></div>
    <div class="manage-table">
      <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="dataConfig.loading"
        style="width: 100%"
        border
        :header-cell-style="{ color: '#666' }"
      >
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="封面图片" width="300" align="center">
          <template slot-scope="scope">
            <el-image
              style="height: 80px"
              :preview-src-list="[scope.row.coverPicture]"
              :src="scope.row.coverPicture"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="资讯标题" header-align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || "--" }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="addNews('edit', scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              style="color: red"
              @click="classifyDel(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  -->
    <div style="height: 16px"></div>
    <div class="table-block" v-show="dataList.length > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="currentChangeFn"
        :current-page.sync="dataConfig.pageNo"
        :page-size="dataConfig.pageSize"
        :page-sizes="[20, 30, 50, 100]"
        layout="total,sizes, prev, pager, next"
        :total="dataConfig.total"
      >
      </el-pagination>
    </div>

    <!--  -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="1000px"
    >
      <el-form
        :model="newsForm"
        :rules="rules"
        ref="newsForm"
        label-width="110px"
        style="padding-right: 20px"
      >
        <el-form-item label="资讯标题" prop="title">
          <el-input
            v-model="newsForm.title"
            placeholder="请输入新闻资讯的标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="资讯封面图" prop="coverPicture">
          <upload-img
            width="80px"
            height="80px"
            :img="newsForm.coverPicture"
            @uploadSuc="uploadSucFn"
          />
        </el-form-item>
        <el-form-item label="资讯详情" prop="content">
          <tinymce
            v-if="dialogVisible"
            v-model="newsForm.content"
            :height="600"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" style="padding-right: 20px">
        <el-button type="primary" @click="addNewsSubmit('newsForm')"
          >确定{{ dialogTitle === "编辑新闻资讯" ? "编辑" : "添加" }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOperationNews,
  getOperationNewsDetail,
  editOperationNews,
  delOperationNews,
} from "@/api/news.js";
import uploadImg from "@/components/uploadImg/upload-img.vue";
import Tinymce from "@/components/Tinymce";
export default {
  components: {
    Tinymce,
    uploadImg,
  },
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      //
      dialogTitle: "添加新闻资讯",
      dialogVisible: false,
      newsForm: {
        title: "",
        coverPicture: "",
        content: "",
        sort: 0,
      },
      rules: {
        title: [
          { required: true, message: "请输入新闻资讯的标题", trigger: "blur" },
        ],
        coverPicture: [
          { required: true, message: "请上传封面图", trigger: "upload" },
        ],
        content: [
          { required: true, message: "请输入新闻详情", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getDataListFn();
  },
  methods: {
    async getDataListFn() {
      this.dataConfig.loading = true;
      const res = await queryOperationNews({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      });
      const resData = this.resDataFn(res);
      this.dataConfig.total = resData.total;
      this.dataList.splice(0, this.dataList.length, ...resData.records);
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    queryDataFn() {
      this.dataConfig.pageNo = 1;
      this.dataConfig.pageSize = 20;
      this.getDataListFn();
    },
    resSetQueryFn() {
      this.dataConfig.pageNo = 1;
      this.dataConfig.pageSize = 20;
      this.getDataListFn();
    },
    uploadSucFn(img) {
      this.newsForm.coverPicture = img;
    },
    // 添加/编辑新闻资讯弹窗
    async addNews(type, data) {
      const loading = this.$loading();
      this.dialogTitle = "添加新闻资讯";
      for (let i in this.newsForm) {
        if (typeof this.newsForm[i] === "number") {
          this.newsForm[i] = 0;
        } else {
          this.newsForm[i] = "";
        }
      }
      if (type === "edit") {
        this.dialogTitle = "编辑新闻资讯";
        const res = await getOperationNewsDetail({
          id: data.id,
        });
        if (res.code === "000") {
          this.newsForm = res.data;
        }
      }
      loading.close();
      this.dialogVisible = true;
    },
    // 添加/编辑
    async addNewsSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        } else {
          if (this.dialogTitle === "添加新闻资讯") {
            delete this.newsForm.id;
          }
          delete this.newsForm.createTime;
          const res = await editOperationNews(this.newsForm);
          if (res.code === "000") {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.dialogVisible = false;
            this.getDataListFn();
          }
        }
      });
    },
    // 删除
    classifyDel(index, data) {
      this.$confirm("此操作将永久删除该条资讯, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await delOperationNews({
            id: data.id,
          });
          if (res.code === "000") {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.dataList.splice(index, 1);
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.tab-title {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 15px;
  font-weight: bold;
  padding-bottom: 15px;
}
.relation-list {
  display: flex;
  flex-wrap: wrap;
}
.relation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  position: relative;
  margin: 0 10px 10px 0;
}
.relation-item:nth-child(6n) {
  margin-right: 0;
}
.relation-item > i {
  font-size: 20px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  padding: 4px;
  cursor: pointer;
}
.relation-item > i:hover {
  opacity: 0.8;
}
.relation-item > span {
  margin-top: 6px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
