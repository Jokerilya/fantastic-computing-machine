<template>
  <div class="content_box">
    <first-title title="用户钱包流水列表" />
    <div class="select_view">
      筛选：
      <el-select
        v-model="queryData.isOut"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择收支类型"
      >
        <el-option
          v-for="item in isoutList"
          :key="item.type"
          :label="item.name"
          :value="item.type"
        />
      </el-select>
      <el-select
        v-model="queryData.moneyType"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择账户类型"
      >
        <el-option
          v-for="item in moneyTypeList"
          :key="item.type"
          :label="item.name"
          :value="item.type"
        />
      </el-select>
      <el-input
        v-model="queryData.nickName"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-date-picker
        v-model="queryData.queryTime"
        class="mg_r15 mg_t10"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10 mg_r15" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
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
      <el-table-column label="收支类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 0 ? "支出" : "收入" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作类型名称"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.accountDesc }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="操作类型"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.accountType }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作时间" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作金额" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operatingAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易单号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.serialNumber }}</span>
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
  </div>
</template>

<script>
import { getqueryMoney } from "@/api/user";
export default {
  name: "",
  data() {
    return {
      uid: "",
      isoutList: [
        { type: 1, name: "收入" },
        { type: 0, name: "支出" },
      ],
      moneyTypeList: [
        { type: 1, name: "用户余额" },
        { type: 3, name: "代理余额" },
        { type: 4, name: "股权" },
      ],
      dataList: [],
      dataConfig: {
        isOut: "",
        moneyType: "",
        nickName: "",
        queryTime: "",
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      queryData: {
        isOut: "",
        moneyType: "",
        nickName: "",
        queryTime: "",
      },
    };
  },
  beforeMount() {
    this.uid = this.$route.query.uid;
  },
  mounted() {
    this.getDataListFn();
  },
  methods: {
    //查询
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    //重置查询
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        isOut: "",
        moneyType: "",
        nickName: "",
        queryTime: "",
      };
      this.getDataListFn();
    },
    getDataListFn() {
      getqueryMoney({
        uid: this.uid,
        isOut: !this.queryData.isOut ? "" : Number(this.queryData.isOut),
        moneyType: !this.queryData.moneyType
          ? ""
          : Number(this.queryData.moneyType),
        nickName: this.queryData.nickName,
        queryTime:
          this.queryData.queryTime.length === 0
            ? ""
            : this.queryData.queryTime[0] + "/" + this.queryData.queryTime[1],
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
  },
};
</script>

<style lang="scss">
</style>
