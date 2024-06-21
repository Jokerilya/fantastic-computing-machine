<template>
  <!-- 收入明细 -->
  <div class="incomeExpenditrue">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        v-model="PaymentListData.orderSn"
        placeholder="输入订单号"
        class="toolInput"
      >
      </el-input>

      <el-input
        v-model="PaymentListData.realName"
        placeholder="输入师傅名称"
        class="toolInput"
      >
      </el-input>

      <el-input
        v-model="PaymentListData.enterpriseName"
        placeholder="输入企业名称"
        class="toolInput"
      >
      </el-input>

      <el-date-picker
        v-model="dateValueArr"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-right: 10px"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>

      <el-select
        placeholder="业务类型"
        class="toolSelect"
        v-model="PaymentListData.serviceType"
      >
        <!-- <el-option label="管家合同支付" :value="1"></el-option> -->
        <el-option label="维保企业支付" :value="2"></el-option>
        <el-option label="支付至维保师傅" :value="3"></el-option>
      </el-select>

      <el-select
        placeholder="收支状态"
        class="toolSelect"
        v-model="PaymentListData.status"
      >
        <el-option label="未支付" :value="0"> </el-option>
        <el-option label="已支付" :value="1"> </el-option>
      </el-select>
      <el-select
        placeholder="订单类型"
        class="toolSelect"
        v-model="PaymentListData.orderType"
      >
        <el-option label="散单" :value="1"></el-option>
        <el-option label="年保" :value="2"></el-option>
        <el-option label="年卡" :value="3"></el-option>
      </el-select>
    </div>

    <div class="topTool">
      <el-button class="toolBtn" @click="batchRenewalOrder"
        >批量更新付款状态</el-button
      >
      <el-button class="toolBtn" @click="searchBtn">查询</el-button>
      <el-button class="toolBtn" @click="resetBtn">重置</el-button>
      <el-button class="toolBtn" @click="exportBtn" style="margin-right: 10px"
        >导出</el-button
      >
      <el-upload
        class="upload-demo"
        action
        multiple
        :http-request="importBtn"
        :show-file-list="false"
      >
        <el-button class="toolBtn">导入</el-button>
      </el-upload>
    </div>

    <!-- 表格内容部分 -->
    <div class="tableContent" v-if="ordersList">
      <el-card>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="ordersList"
            style="width: 100%"
            tooltip-effect="dark"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
            @selection-change="chooseOrderSn"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column width="150" label="企业订单号">
              <template slot-scope="{ row }">
                <a
                  @click.prevent="
                    $router.push(
                      '/maintenance/maintenance_order_desc?orderSn=' +
                        row.relationOrderSn
                    )
                  "
                  style="color: #61afef"
                  >{{ row.relationOrderSn }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="师傅订单号" prop="orderSn">
            </el-table-column>
            <el-table-column label="订单类型">
              <template slot-scope="{ row }">
                {{
                  row.orderType === 1
                    ? "散单"
                    : row.orderType === 2
                    ? "年保"
                    : "年卡"
                }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              width="150"
              prop="payCode"
              label="支付流水号"
            ></el-table-column> -->
            <!-- <el-table-column prop="payTime" label="支付时间"></el-table-column> -->
            <el-table-column label="支付金额">
              <template slot-scope="{ row }"> ￥{{ row.payAmount }} </template>
            </el-table-column>
            <el-table-column
              prop="targetName"
              label="收付款对象"
            ></el-table-column>
            <!-- <el-table-column
              prop="transCode"
              label="第三方交易账号"
            ></el-table-column> -->
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
                <div v-if="row.status === 0" style="color: red">未支付</div>
                <div v-if="row.status === 1" style="color: green">已支付</div>
              </template>
            </el-table-column>
            <!-- <a
                  href="#"
                  style="color: #0b2059;margin-right: 10px;"
                  v-if="
                    row.status === 0 && row.serviceTypeName !== '维保企业支付'
                  "
                  @click.prevent="detailsOpen(row, true)"
                  >支付</a
                > -->
            <!-- <el-table-column label="操作">
              <template slot-scope="{ row }">
                <a
                  href="#"
                  style="color: #0b2059"
                  @click.prevent="detailsOpen(row, false)"
                  >详情</a
                >
              </template>
            </el-table-column> -->
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
              :current-page="PaymentListData.pageNo"
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
import {
  queryPaymentList,
  handlePaymentListExport,
  handlePaymentListImport,
  handleBatchPayment,
} from "@/api/financialController";
import payOrderDetails from "./components/payOrderDetails.vue";
import { localStorageData } from "@/utils";

export default {
  data() {
    return {
      chooseOrderSnStr: null, //选择要批量的单
      dateValueArr: null, //时间段
      detailsShow: false, //详情
      payBtnShow: false, //支付按钮显示
      // 查询的数据
      ordersList: null,
      // 查询列表需要的参数
      PaymentListData: {
        pageNo: 1,
        pageSize: 10,
        orderSn: null,
        serviceType: null,
        status: null,
        realName: null,
        enterpriseName: null,
        orderType: null,
      },
      total: 0,
    };
  },
  components: {
    "PayOrder-Details": payOrderDetails,
  },
  methods: {
    // 批量更新付款状态
    async batchRenewalOrder() {
      if (!this.chooseOrderSnStr) {
        this.$message({
          showClose: true,
          message: "请选择你要更新状态的订单",
          type: "warning",
        });
        return;
      }
      let handleBatchPaymentPrams = {
        id: this.chooseOrderSnStr,
        status: 1,
      };
      const res = await handleBatchPayment(handleBatchPaymentPrams);
      if (res.message == "操作成功") {
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
        this.getIncomeExpenditrueList();
      }
    },
    // 选择要批量更新付款的单子
    chooseOrderSn(val) {
      let arr = [];
      val.forEach((item) => {
        arr.push(item.id);
      });
      this.chooseOrderSnStr = arr.join(",");
    },
    // 导入
    async importBtn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await handlePaymentListImport(formData);
      if (res.message === "操作成功") {
        this.$message({
          message: "已导入成功",
          type: "success",
        });
        this.getIncomeExpenditrueList();
      }
    },
    // 导出
    async exportBtn() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      const res = await handlePaymentListExport(this.PaymentListData);
      if (res) {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = "收支明细"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      }
    },
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
        orderSn: null,
        serviceType: null,
        status: null,
        realName: null,
        enterpriseName: null,
        orderType: null,
      };
      this.getIncomeExpenditrueList();
    },
    // 页码发生变化触发的事件
    currentChangeFn(page) {
      this.PaymentListData.pageNo = page;
      this.getIncomeExpenditrueList();
    },
    // 点击查询触发的事件
    searchBtn() {
      if (this.dateValueArr) {
        this.PaymentListData.startTime = this.dateValueArr[0];
        this.PaymentListData.endTime = this.dateValueArr[1];
      }
      this.PaymentListData.pageNo = 1;
      this.PaymentListData.pageSize = 10;
      this.getIncomeExpenditrueList();
    },
    // 获取收支明细列表
    async getIncomeExpenditrueList() {
      localStorageData("PaymentListData", JSON.stringify(this.PaymentListData));
      const res = await queryPaymentList(this.PaymentListData);
      this.total = res.data.total;
      this.ordersList = res.data.records;
    },
  },
  created() {
    if (localStorage.getItem("PaymentListData")) {
      this.PaymentListData = JSON.parse(
        localStorage.getItem("PaymentListData")
      );
    }
    this.getIncomeExpenditrueList();
  },
};
</script>
