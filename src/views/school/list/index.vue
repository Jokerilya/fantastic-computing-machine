<template>
  <div class="content_box">
    <first-title title="数据列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.title"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入标题"
      />
      <el-select
        v-model="queryData.categoryId"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择商学院类型"
      >
        <el-option
          v-for="item in categorys"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
      <el-button type="primary" @click="addItemFn"
        ><i class="el-icon-plus" />添加商学院数据</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" width="50px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.id">{{ scope.row.id }}</span>
          <span
            v-if="!scope.row.id"
            class="delete_icon"
            @click="deleteAddFn(scope.$index)"
            ><i class="el-icon-delete"
          /></span>
        </template>
      </el-table-column>
      <el-table-column label="封面图" width="240px" align="center">
        <template slot-scope="scope">
          <img style="width: 200px; height: 100px" :src="scope.row.coverUrl" />
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商学院类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="height: 90px" v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
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
          <el-form-item label="ID">
            <el-input v-model="defDdata.id" disabled="disabled" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="defDdata.title" />
          </el-form-item>
          <el-form-item label="封面图">
            <upload-img
              width="200px"
              height="100px"
              :img="defDdata.coverUrl"
              @uploadSuc="uploadSuccess"
            ></upload-img>
          </el-form-item>
          <el-form-item label="商学院类型">
            <el-select
              v-model="defDdata.schoolCategoryId"
              placeholder="请选择商学院类型"
            >
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
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
import UploadImg from "@/components/uploadImg/upload-img.vue";
import {
  querySchoolDataFn,
  schoolDataDetailFn,
  editSchoolDataFn,
  delSchoolDataFn,
  getSchoolCategorySelectFn,
} from "@/api/school.js";
export default {
  name: "SchoolData",
  components: { Tinymce, UploadImg },
  data() {
    return {
      dataList: [],
      dialogVisible: false,
      defDdata: {
        id: "", //id
        content: "", //内容
        coverUrl: "", //封面图 类型为多数据时有数据
        schoolCategoryId: "", //类型id
        title: "", //标题 类型为多数据时有数据
      },
      queryData: {
        title: "",
        categoryId: "",
      },
      categorys: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.querySchoolDataFn();
    this.getSchoolCategorySelectFn();
  },
  methods: {
    getSchoolCategorySelectFn() {
      getSchoolCategorySelectFn({}).then((res) => {
        const resData = this.resDataFn(res);
        this.categorys.splice(0, this.categorys.length, ...resData);
      });
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.querySchoolDataFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.querySchoolDataFn();
    },
    uploadSuccess(e) {
      this.defDdata.coverUrl = e;
    },
    submitDataFn() {
      editSchoolDataFn({
        content: this.defDdata.content,
        id: this.defDdata.id ? this.defDdata.id : undefined,
        title: this.defDdata.title,
        schoolCategoryId: this.defDdata.schoolCategoryId,
        coverUrl: this.defDdata.coverUrl,
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.dialogVisible = false;
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.querySchoolDataFn();
        }
      });
    },
    editItemFn(id) {
      schoolDataDetailFn({ id: id }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData) {
          this.defDdata = resData;
          this.dialogVisible = true;
        }
      });
    },
    addItemFn() {
      this.defDdata = {
        id: "", //id
        content: "", //内容
        coverUrl: "", //封面图 类型为多数据时有数据
        schoolCategoryId: "", //类型id
        title: "", //标题 类型为多数据时有数据
      };
      this.dialogVisible = true;
    },
    deleteItemFn(scope) {
      this.deleteAlert()
        .then(() => {
          const res = delSchoolDataFn({ id: scope.row.id });
          return res;
        })
        .then((res) => {
          const resData = this.resDataFn(res);
          if (resData == "000") {
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    querySchoolDataFn() {
      this.dataConfig.loading = true;
      querySchoolDataFn({
        categoryId: this.queryData.categoryId, //类型id 类型名称数据接口获取
        title: this.queryData.title, //标题
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.querySchoolDataFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.querySchoolDataFn();
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        categoryId: "",
        title: "",
      };
      this.querySchoolDataFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.querySchoolDataFn();
    },
  },
};
</script>

<style lang="scss">
</style>
