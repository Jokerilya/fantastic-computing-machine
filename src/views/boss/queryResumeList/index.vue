<template>
  <div class="content_box">
    <!-- <first-title title="简历列表" /> -->
    <div class="manage-top">
      <el-form
        :model="queryData"
        ref="ruleForm"
        label-width="140px"
        class="rule-form"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="公司名称/职务名称">
              <el-input
                v-model="queryData.query"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="getDataListFn"
                >查询</el-button
              >
              <el-button type="danger" @click="resSetQueryFn">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      :data="dataList"
      class="list"
      :header-cell-style="{ color: '#666' }"
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
      <el-table-column
        prop="nickName"
        label="微信昵称"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column label="微信头像" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.portrait"
            :preview-src-list="[scope.row.portrait]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="真实姓名"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="jobTitle"
        label="职位名称"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="education"
        label="学历"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="工作时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.workingYears + "年" || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="jobStatus"
        label="工作状态"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="skill"
        label="工作技能"
        width="300"
        align="center"
      ></el-table-column>
      <el-table-column label="期望薪资" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.salary + "k" || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="300"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="getDetail(scope.row.id)"
            >查看详情</el-button
          >
          <el-button size="small" type="danger" @click="upatefunc(scope, 1)"
            >下架</el-button
          >
          <el-button size="small" type="danger" @click="delfunc(scope, 0)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="dataConfig.pageSize"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
    <!--详情弹窗-->
    <el-dialog
      title="简历详情"
      :visible.sync="dialogVisible"
      width="50%"
      @open="dialogopen"
    >
      <el-row>
        <el-col :span="6">姓名：</el-col>
        <el-col :span="6">{{ detail.name }}</el-col>
        <el-col :span="6">年龄：</el-col>
        <el-col :span="6">{{ detail.age }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">学历：</el-col>
        <el-col :span="6">{{ detail.education }}</el-col>
        <el-col :span="6">应聘职位：</el-col>
        <el-col :span="6">{{ detail.jobTitle }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">工作状态：</el-col>
        <el-col :span="6">{{ detail.jobStatus }}</el-col>
        <el-col :span="6">联系电话：</el-col>
        <el-col :span="6">{{ detail.phone }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">求职薪资：</el-col>
        <el-col :span="6">{{ detail.salary }}</el-col>
        <el-col :span="6">工作年限：</el-col>
        <el-col :span="6">{{ detail.workingYears }}年</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">微信号：</el-col>
        <el-col :span="6">{{ detail.wxNumber }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">工作经历：</el-col>
        <el-col :span="12">{{ detail.experience }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">掌握技能：</el-col>
        <el-col :span="12">{{ detail.skill }}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryResumeList,
  handleResumeStatus,
  getResumeDetail,
} from "@/api/boss";
export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      dataConfig: {
        id: 0,
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        query: "",
      },
      detailid: -1,
      detail: {},
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    getDataListFn() {
      queryResumeList({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataConfig.total = resData.total;
        this.dataList.splice(0, this.dataList.length, ...resData.records);
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    resSetQueryFn() {
      this.dataConfig.pageNo = 1;
      this.dataConfig.pageSize = 20;
      this.queryData = {
        query: "",
      };
      this.getDataListFn();
    },
    //删除简历
    delfunc(scope, status) {
      this.deleteAlert()
        .then(() => {
          const res = handleResumeStatus({
            id: scope.row.id,
            status: status,
          });
          return res;
        })
        .then((res) => {
          if (res.code == "000") {
            this.$message.success("删除成功！");
            this.dataList.splice(scope.$index, 1);
          }
        });
    },
    //下架简历
    upatefunc(scope, status) {
      this.deleteAlert()
        .then(() => {
          const res = handleResumeStatus({
            id: scope.row.id,
            status: status,
          });
          return res;
        })
        .then((res) => {
          if (res.code == "000") {
            this.$message.success("下架成功！");
            this.getDataListFn();
          }
        });
    },
    //弹窗打开时调用数据
    dialogopen() {
      getResumeDetail(this.detailid).then((res) => {
        let obj = res.data;
        if (res.code === "000") {
          this.detail = obj;
        }
      });
    },
    //查看详情
    getDetail(id) {
      this.dialogVisible = true;
      this.detailid = id;
    },
  },
};
</script>

<style scoped>
/deep/ .el-dialog .el-dialog__body .el-row {
  margin-bottom: 20px;
}
</style>
