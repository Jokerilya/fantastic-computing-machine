<template>
  <div class="content_box">
    <first-title title="账务明细" />
    <div class="select_view">
      筛选：
      <!-- <el-input
        v-model="queryData.nickName"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      /> -->
      <el-select
        v-model="queryData.moneyType"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择账户类型"
      >
        <el-option
          v-for="item in moneyType"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      操作时间：
      <el-date-picker
        v-model="queryData.queryTime"
        class="mg_r15 mg_t10"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select
        v-model="queryData.isOut"
        class="mg_r15 mg_t10"
        style="width: 160px"
        placeholder="请选择账务类型"
      >
        <el-option
          v-for="item in isOut"
          :key="item.val"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column label="ID" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作数量" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operatingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易单号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收支类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 1 ? "收入" : "支出" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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
import { queryMoneyFn } from "@/api/user.js";
export default {
  name: "DetailedList",
  data() {
    return {
      dataList: [],
      isOut: [
        { name: "出账", val: 0 },
        { name: "入账", val: 1 },
      ],
      moneyType: [
        { name: "用户余额", val: 1 },
        { name: "代理余额", val: 3 },
        { name: "股权", val: 4 },
      ],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        uid: "", // 1 2 3
        isOut: "", // 1 2
        nickName: "", // 1 2 3
        moneyType: "", // 3
        queryTime: [], // 1 2 3
      },
    };
  },
  beforeMount() {
    this.queryData.moneyType = Number(this.$route.query.type);
    this.queryData.uid = this.$route.query.id;
    this.getDataListFn();
  },
  methods: {
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData.isOut = "";
      this.queryData.nickName = "";
      this.queryData.queryTime = [];
      this.getDataListFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      if (!this.queryData.uid) return;
      this.dataConfig.loading = true;
      queryMoneyFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        uid: this.queryData.uid,
        isOut: this.queryData.isOut || undefined,
        nickName: this.queryData.nickName || undefined,
        moneyType: this.queryData.moneyType || undefined,
        queryTime:
          this.queryData.queryTime.length == 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
  },
};
</script>

<style lang="scss">
</style>
