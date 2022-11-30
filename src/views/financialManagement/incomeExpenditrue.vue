<template>
  <!-- 收入明细 -->
  <div class="incomeExpenditrue">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        v-model="toolInput"
        placeholder="支付流水号/客户名称/订单号/收付账号"
        class="toolInput"
      ></el-input>
      <el-select
        placeholder="订单类型"
        class="toolSelect"
        v-model="toolSelect1"
      >
        <!-- 订单类型下拉框内容 -->
      </el-select>
      <el-select
        placeholder="收支状态"
        class="toolSelect"
        v-model="toolSelect1"
      >
        <!-- 收支状态下拉框内容 -->
      </el-select>
      <el-button class="toolBtn">查询</el-button>
      <el-button class="toolBtn">重置</el-button>
    </div>

    <!-- 表格内容部分 -->
    <div class="tableContent" v-if="ordersList">
      <el-card>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="ordersList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
          >
            <el-table-column prop="orderSn" label="订单号"></el-table-column>
            <el-table-column
              prop="orderSn"
              label="支付流水号"
            ></el-table-column>
            <el-table-column prop="payTime" label="时间"></el-table-column>
            <el-table-column prop="payMoney" label="金额"></el-table-column>
            <el-table-column
              prop="targetName"
              label="客户名称"
            ></el-table-column>
            <el-table-column
              prop="transCode"
              label="收支账号"
            ></el-table-column>
            <el-table-column
              prop="serviceTypeName"
              label="订单类型"
            ></el-table-column>
            <el-table-column prop="status" label="收支状态"></el-table-column>
            <el-table-column prop="orderSn" label="操作">
              <template>
                <a href="#" style="color: #0b2059;margin-right: 10px;">支付</a>
                <a href="#" style="color: #0b2059;">详情</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_pagination">
            <!--  @current-change="currentChangeFn" -->
            <!-- :current-page="current" -->
            <el-pagination
              :page-size="pageSize"
              layout="jumper, prev, pager, next,total "
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.incomeExpenditrue {
  padding: 20px;
  .topTool {
    display: flex;
    margin-bottom: 20px;
    .toolInput {
      width: 450px;
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

  // 表格内容部分
  .tableContent {
    .tableContent_title {
      color: #0b2059;
      font-weight: 700;
      font-size: 20px;
      padding-left: 30px;
    }
    .tableContent_table {
      margin: 30px 0;
    }
    .tableContent_footer {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

<script>
import { queryPaymentList } from "@/api/financialController";

export default {
  data() {
    return {
      toolSelect1: "",
      toolSelect2: "",
      toolInput: "",
      ordersList: null,
      // 查询列表需要的参数
      PaymentListData: {
        direction: 0,
        endTime: "",
        orderSn: "",
        pageNo: 1,
        pageSize: 5,
        serviceType: 0,
        startTime: "",
        status: 0,
        uid: "",
      },
      total: 0,
      pageSize: 5,
    };
  },
  methods: {
    // 获取收支明细列表
    async getIncomeExpenditrueList() {
      const res = await queryPaymentList(this.PaymentListData);
      this.total = res.data.total;
      this.ordersList = res.data.orders;
      console.log(res);
    },
  },
  created() {
    this.getIncomeExpenditrueList();
  },
};
</script>
