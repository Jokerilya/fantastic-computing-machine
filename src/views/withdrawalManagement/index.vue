<template>
  <div class="withdrawalManagementIndex">
    <div class="topTool">
      <div class="topToolFlex">
        <el-input
          placeholder="输入用户昵称"
          class="toolInput"
          v-model="queryWithdrawalParams.nickName"
        >
        </el-input>
        <el-input
          placeholder="输入手机号码"
          class="toolInput"
          v-model="queryWithdrawalParams.phone"
        >
        </el-input>
        <el-date-picker
          @change="changeQueryWithdrawalParamsQueryTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="queryWithdrawalParamsQueryTime"
        >
        </el-date-picker>
      </div>
      <div>
        <!-- <el-button class="toolBtn">导出</el-button> -->
        <el-button class="toolBtn" @click="searchwithdrawalList"
          >查询</el-button
        >
        <el-button class="toolBtn" @click="resetQueryWithdrawalParams"
          >重置</el-button
        >
      </div>
    </div>

    <el-card>
      <el-table
        :cell-style="{ 'text-align': 'center' }"
        :data="withdrawalList"
        style="width: 100%"
        :header-cell-style="{
          background: '#f6f8fc',
          color: '#707070',
          'text-align': 'center',
        }"
      >
        <el-table-column label="创建时间" prop="createTime" width="140">
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickName"> </el-table-column>
        <el-table-column label="用户电话" prop="phone" width="110">
        </el-table-column>
        <el-table-column label="提现金额" prop="quota"> </el-table-column>
        <el-table-column label="收款人姓名" prop="payeeName"> </el-table-column>
        <el-table-column label="银行名称">
          <template slot-scope="{ row }">
            {{ row.bankName ? row.bankName : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="银行卡号">
          <template slot-scope="{ row }">
            {{ row.bankCode ? row.bankCode : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template slot-scope="{ row }">
            {{ row.remark ? row.remark : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="流水号" prop="serialNumber"> </el-table-column>
        <el-table-column label="审核时间">
          <template slot-scope="{ row }">
            {{ row.reviewTime ? row.reviewTime : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            {{ statusList[row.status + 1] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" :disabled="row.status != 0">审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="bottomPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="withdrawalListTotal"
          :page-size="queryWithdrawalParams.pageSize"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryWithdrawalFn, handleWithdrawalExamineFn } from "@/api/user";
export default {
  data() {
    return {
      withdrawalList: [],
      withdrawalListTotal: null,
      queryWithdrawalParams: {
        nickName: null,
        pageNo: 1,
        pageSize: 10,
        phone: null,
        queryTime: null,
      },
      queryWithdrawalParamsQueryTime: null, //没格式化之前的值
      statusList: ["审核失败", "审核中", "审核通过/待打款", "已打款"],
    };
  },
  methods: {
    // 切换页码
    changePage(page) {
      this.queryWithdrawalParams.pageNo = page;
      this.queryWithdrawalFn();
    },
    // 重置搜索信息
    resetQueryWithdrawalParams() {
      this.queryWithdrawalParams = {
        nickName: null,
        pageNo: 1,
        pageSize: 10,
        phone: null,
        queryTime: null,
      };
      this.queryWithdrawalFn();
    },
    // 点击搜索
    searchwithdrawalList() {
      this.queryWithdrawalParams.pageNo = 1;
      this.queryWithdrawalFn();
    },
    // 修改日期
    changeQueryWithdrawalParamsQueryTime(val) {
      this.queryWithdrawalParams.queryTime = val[0] + "/" + val[1];
    },
    // 查询提现记录
    async queryWithdrawalFn() {
      const res = await queryWithdrawalFn(this.queryWithdrawalParams);
      this.withdrawalList = res.data.data.records;
      this.withdrawalListTotal = res.data.data.total;
    },
  },
  created() {
    this.queryWithdrawalFn();
  },
};
</script>

<style scoped lang="less">
.withdrawalManagementIndex {
  padding: 20px;
  .topTool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .topToolFlex {
      display: flex;
      align-items: center;
    }
    .toolInput {
      width: 170px;
      margin-right: 10px;
    }
    .toolSelect {
      width: 130px;
      margin-right: 10px;
    }
    .toolBtn {
      color: #2e4c9e;
    }
  }

  .bottomPagination {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
