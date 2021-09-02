<template>
  <div class="content_box">
    <first-title title="资讯管理" />
    <div class="select_view">
      <el-button type="primary" @click="addItemFn"
        ><i class="el-icon-plus" />添加资讯信息</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="排序"
        fixed
        width="60"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="left" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" align="center" header-align="center">
        <template slot-scope="scope">
          <img
            style="width: 200px; height: 100px"
            :src="scope.row.coverPicture"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="200"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="editItemFn(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.id"
            type="danger"
            size="small"
            @click="deleteItemFn(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加/编辑" :visible.sync="dialogVisible" width="70%">
      <div>
        <el-form ref="form" :model="defDdata" label-width="100px">
          <el-form-item label="信息ID">
            <el-input v-model="defDdata.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="defDdata.title" />
          </el-form-item>
          <el-form-item label="封面图">
            <upload-img
              width="200px"
              height="100px"
              :img="defDdata.coverPicture"
              @uploadSuc="uploadSuccess"
            ></upload-img>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="defDdata.sort" />
          </el-form-item>
          <el-form-item label="内容">
            <tinymce
              v-if="dialogVisible"
              :id="'agreement_' + defDdata.id"
              v-model="defDdata.content"
              :height="300"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataFn">确 定</el-button>
      </span>
    </el-dialog>
    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import UploadImg from "@/components/uploadImg/upload-img.vue";
import {
  queryNoticeFn,
  editNoticeFn,
  handleRoleStatusFn,
  delNoticeFn,
  getNoticeDetailFn,
} from "@/api/content.js";
export default {
  name: "Notice",
  components: { Tinymce, UploadImg },
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      defDdata: {
        content: "",
        id: "",
        title: "",
        sort: "",
        coverPicture: "",
      },
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.queryNoticeFn();
  },
  methods: {
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryNoticeFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryNoticeFn();
    },
    uploadSuccess(e) {
      this.defDdata.coverPicture = e;
    },
    submitDataFn() {
      editNoticeFn({
        content: this.defDdata.content,
        id: this.defDdata.id ? this.defDdata.id : undefined,
        title: this.defDdata.title,
        sort: this.defDdata.sort,
        coverPicture: this.defDdata.coverPicture,
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.queryNoticeFn();
        }
      });
    },
    statusChangeFn(val, index) {
      console.log(val);
      handleRoleStatusFn({
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
            this.dataList[index].status = !val;
          }
        })
        .catch(() => {
          this.dataList[index].status = !val;
        });
    },
    editItemFn(id) {
      getNoticeDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData) {
          this.defDdata = resData;
          this.dialogVisible = true;
        }
      });
    },
    addItemFn() {
      this.defDdata = {
        content: "",
        id: "",
        title: "",
      };
      this.dialogVisible = true;
    },
    deleteItemFn(scope) {
      this.deleteAlert()
        .then(() => {
          const res = delNoticeFn({ id: scope.row.id });
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    queryNoticeFn() {
      queryNoticeFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        resData.records.forEach((item) => {
          item.status = item.status == 1;
        });
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.queryNoticeFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.queryNoticeFn();
    },
  },
};
</script>

<style>
</style>
