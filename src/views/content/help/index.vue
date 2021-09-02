<template>
  <div class="content_box">
    <first-title title="帮助中心" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryTitle"
        style="width: 260px"
        class="mg_r15 mg_t10"
        placeholder="请输入信息标题"
      />
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button type="primary" @click="addItemFn"
        ><i class="el-icon-plus" />添加帮助信息</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        fixed
        width="60"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="left" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 1 ? "账户相关" : "交易相关" }}</span>
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
          <el-form-item label="分类">
            <el-select v-model="defDdata.type" placeholder="请选择类别">
              <el-option
                v-for="(item, index) in types"
                :key="index"
                :label="item.name"
                :value="item.val"
              ></el-option>
            </el-select>
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
import {
  queryCommonFn,
  editCommonFn,
  delCommonFn,
  getCommonDetailFn,
} from "@/api/content.js";
export default {
  name: "Help",
  components: { Tinymce },
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      types: [
        { name: "账户相关", val: 1 },
        { name: "交易相关", val: 2 },
      ],
      queryTitle: "",
      defDdata: {
        content: "",
        id: "",
        title: "",
        type: "",
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
    this.queryCommonFn();
  },
  methods: {
    queryDataListFn() {
      if (!this.queryTitle) return;
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryCommonFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryTitle = "";
      this.queryCommonFn();
    },
    submitDataFn() {
      editCommonFn({
        content: this.defDdata.content,
        id: this.defDdata.id ? this.defDdata.id : undefined,
        title: this.defDdata.title,
        type: this.defDdata.type,
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.queryCommonFn();
        }
      });
    },
    editItemFn(id) {
      getCommonDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData) {
          this.defDdata.content = resData.content;
          this.defDdata.id = resData.id;
          this.defDdata.title = resData.title;
          this.defDdata.type = resData.type;
          this.dialogVisible = true;
        }
      });
    },
    addItemFn() {
      this.defDdata = {
        content: "",
        id: "",
        title: "",
        type: "",
      };
      this.dialogVisible = true;
    },
    deleteItemFn(scope) {
      this.deleteAlert()
        .then(() => {
          const res = delCommonFn({ id: scope.row.id });
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    queryCommonFn() {
      queryCommonFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        title: this.queryTitle,
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
      this.queryCommonFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.queryCommonFn();
    },
  },
};
</script>

<style>
</style>
