<template>
  <div class="content_box">
    <first-title title="系统操作日志" />
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="ID"
        width="80"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="修改人"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.loginAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Ip地址"
        width="140"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.loginIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源路径" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actionUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作内容" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
    </el-table>
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
import { baseLogListFn } from "@/api/system.js";
export default {
  name: "BaseLogList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
    };
  },
  beforeMount() {
    this.baseLogListFn();
  },
  methods: {
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.baseLogListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.baseLogListFn();
    },
    baseLogListFn() {
      this.dataConfig.loading = true;
      baseLogListFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>

<style>
</style>
