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
            <el-form-item label="企业名称">
              <el-input
                v-model="queryData.name"
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
      max-height="550"
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
        prop="createTime"
        label="创建时间"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="name"
        label="企业名称"
        width="250"
        align="center"
      ></el-table-column>
      <el-table-column label="企业LOGO" width="200" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.logo"
            :preview-src-list="[scope.row.logo]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="企业规模" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scale }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="企业描述" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="企业地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="180"
        align="center"
        header-align="center"
      >
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
  </div>
</template>

<script>
import { queryEnterpriseList } from "@/api/boss";
export default {
  name: "",
  data() {
    return {
      dataList: [],
      dataConfig: {
        id: 0,
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        name: "",
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    getDataListFn() {
      queryEnterpriseList({
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
        name: "",
      };
      this.getDataListFn();
    },
  },
};
</script>

<style lang="scss">
</style>
