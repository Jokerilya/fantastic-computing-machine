<template>
  <!-- 收入明细 -->
  <div class="incomeExpenditrue">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        v-model="orderSnInp"
        placeholder="输入订单号"
        class="toolInput"
      ></el-input>
      <el-select
        placeholder="业务类型"
        class="toolSelect"
        v-model="serviceTypeSelect"
      >
        <el-option label="管家合同支付" :value="1"></el-option>
        <el-option label="维保企业支付" :value="2"></el-option>
        <el-option label="维保师傅支付" :value="3"></el-option>
      </el-select>
      <el-select
        placeholder="收支状态"
        class="toolSelect"
        v-model="statusSelect"
      >
        <el-option label="未支付" :value="0"> </el-option>
        <el-option label="已支付" :value="1"> </el-option>
      </el-select>
      <el-button class="toolBtn" @click="searchBtn">查询</el-button>
      <el-button class="toolBtn" @click="resetBtn">重置</el-button>
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
            <el-table-column
              width="150"
              prop="orderSn"
              label="订单号"
            ></el-table-column>
            <el-table-column
              width="150"
              prop="payCode"
              label="支付流水号"
            ></el-table-column>
            <el-table-column prop="payTime" label="支付时间"></el-table-column>
            <el-table-column label="支付金额">
              <template slot-scope="{ row }"> ￥{{ row.payMoney }} </template>
            </el-table-column>
            <el-table-column
              prop="targetName"
              label="客户名称"
            ></el-table-column>
            <el-table-column
              prop="transCode"
              label="第三方交易账号"
            ></el-table-column>
            <el-table-column label="业务类型名">
              <template slot-scope="{ row }">
                {{
                  row.serviceTypeName === "维保师傅支付"
                    ? "支付至维保师傅"
                    : row.serviceTypeName
                }}
              </template>
            </el-table-column>
            <el-table-column label="收支状态">
              <template slot-scope="{ row }">
                <div v-if="row.status === 0" style="color:red;">未支付</div>
                <div v-if="row.status === 1" style="color:green;">已支付</div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <a
                  href="#"
                  style="color: #0b2059;margin-right: 10px;"
                  v-if="
                    row.status === 0 && row.serviceTypeName !== '维保企业支付'
                  "
                  @click.prevent="detailsOpen(row, true)"
                  >支付</a
                >
                <a
                  href="#"
                  style="color: #0b2059;"
                  @click.prevent="detailsOpen(row, false)"
                  >详情</a
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_pagination">
            <!--  @current-change="currentChangeFn" -->
            <!-- :current-page="current" -->
            <el-pagination
              @current-change="currentChangeFn"
              :page-size="PaymentListData.pageSize"
              layout="jumper, prev, pager, next,total "
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详情 -->
    <PayOrder-Details
      @refreshpage="getIncomeExpenditrueList"
      ref="payOrderDetails"
      :payBtnShow="payBtnShow"
      @handleClose="detailsClose"
      :dialogVisible="detailsShow"
    ></PayOrder-Details>
  </div>
</template>

<style lang="less" scoped>
.incomeExpenditrue {
  padding: 20px;
  .topTool {
    display: flex;
    margin-bottom: 20px;
    .toolInput {
      width: 250px;
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
import payOrderDetails from "./components/payOrderDetails.vue";

export default {
  data() {
    return {
      detailsShow: false, //详情
      payBtnShow: false, //支付按钮显示
      // 查询的数据
      serviceTypeSelect: "",
      statusSelect: "",
      orderSnInp: "",
      ordersList: null,
      // 查询列表需要的参数
      PaymentListData: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
    };
  },
  components: {
    "PayOrder-Details": payOrderDetails,
  },
  methods: {
    // 关闭详情弹窗的事件
    detailsClose() {
      this.detailsShow = false;
    },
    // 显示弹窗
    async detailsOpen(row, Boolean) {
      this.payBtnShow = Boolean;
      this.$refs.payOrderDetails.rowList = row;
      this.detailsShow = true;
    },
    // 点击重置触发的事件
    resetBtn() {
      this.PaymentListData = {
        pageNo: 1,
        pageSize: 10,
      };
      this.orderSnInp = "";
      this.statusSelect = "";
      this.serviceTypeSelect = "";
      this.getIncomeExpenditrueList();
    },
    // 页码发生变化触发的事件
    currentChangeFn(page) {
      this.PaymentListData.pageNo = page;
      this.getIncomeExpenditrueList();
    },
    // 点击查询触发的事件
    searchBtn() {
      if (this.orderSnInp) {
        this.PaymentListData.orderSn = this.orderSnInp;
      }
      if (this.statusSelect !== "") {
        this.PaymentListData.status = this.statusSelect;
      }
      if (this.serviceTypeSelect !== "") {
        this.PaymentListData.serviceType = this.serviceTypeSelect;
      }
      this.PaymentListData.pageNo = 1;
      this.PaymentListData.pageSize = 10;
      this.getIncomeExpenditrueList();
    },
    // 获取收支明细列表
    async getIncomeExpenditrueList() {
      const res = await queryPaymentList(this.PaymentListData);
      this.total = res.data.total;
      this.ordersList = res.data.records;
    },
  },
  created() {
    this.getIncomeExpenditrueList();
  },
};
</script>
