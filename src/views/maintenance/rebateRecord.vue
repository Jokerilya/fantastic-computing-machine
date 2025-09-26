<template>
  <div class="rebateRecord">
    <!-- 顶部查询表单 -->
    <div class="manage-top">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="25">
          <el-col :span="16">
            <el-form-item label="订单号">
              <el-input
                placeholder="输入订单号"
                v-model="queryOrderCommissionListParams.orderCode"
                style="width: 250px"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button plain type="primary" @click="batchPay"
              >批量付款</el-button
            >
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="queryOrderCommissionList"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="info"
              @click="resetSearch"
              >重置</el-button
            >
          </el-col>
        </el-row>
        <el-row
          :gutter="25"
          style="text-align: right; color: red; padding-right: 20px"
        >
          单次批量打款操作，针对同一用户最多只能勾选6个订单!
        </el-row>
      </el-form>
    </div>

    <!-- 分隔线 -->
    <div style="height: 16px"></div>

    <!-- 数据表格 -->
    <el-card>
      <el-table
        highlight-current-row
        :data="rebateRecordList"
        height="70vh"
        @selection-change="handleSelectionChange"
        empty-text="暂无返佣记录"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="订单编号" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goToOrderdesc(row)">{{
              row.orderSn
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="企业名称"
          prop="enterpriseName"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="订单支付金额"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }"> ￥{{ row.payAmount }}</template>
        </el-table-column>
        <el-table-column label="返佣金额" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            ￥{{ row.commissionAmount }}
          </template>
        </el-table-column>
        <el-table-column
          label="返佣人"
          prop="nickName"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
        <el-table-column label="审核状态" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="getExamineStatusType(row.examineStatus)"
              size="small"
            >
              {{ getExamineStatusText(row.examineStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <el-tag
              :type="row.paymentStatus === 1 ? 'success' : 'info'"
              size="small"
            >
              {{ row.paymentStatus === 1 ? "已支付" : "未支付" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.examineStatus == 1"
              @click="openReviewDialog(row.id)"
            >
              审核
            </el-button>
            <el-button
              type="text"
              v-else-if="row.examineStatus == 2 && row.paymentStatus == 0"
              @click="handleOrderCommissionPayment(row)"
            >
              打款
            </el-button>
            <div v-else>/</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div style="margin-top: 20px; display: flex; justify-content: center">
        <el-pagination
          background
          @current-change="updatePageNo"
          layout="total,  prev, pager, next, jumper"
          :page-size="queryOrderCommissionListParams.pageSize"
          :total="rebateRecordListTotal"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="审核"
      :visible="reviewDialogVisible"
      width="25%"
      :before-close="closeReviewDialog"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" label-position="left">
        <el-form-item label="审核状态: ">
          <el-radio-group v-model="handleOrderCommissionStatusParams.status">
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReviewDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderCommissionStatus"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOrderCommissionList,
  handleOrderCommissionStatus,
  handleOrderCommissionPayment,
} from "@/api/order";

// 审核状态常量（便于维护和复用）
const EXAMINE_STATUS = {
  PENDING: 1, // 审核中
  PASS: 2, // 审核通过
  REJECT: 3, // 审核驳回
};

// 支付状态常量
const PAYMENT_STATUS = {
  UNPAID: 0,
  PAID: 1,
};
export default {
  name: "RebateRecord",
  data() {
    return {
      EXAMINE_STATUS,
      PAYMENT_STATUS,
      rebateRecordList: [],
      rebateRecordListTotal: 0,
      queryOrderCommissionListParams: {
        orderCode: null,
        pageNo: 1,
        pageSize: 10,
      },
      reviewDialogVisible: false,
      handleOrderCommissionStatusParams: {
        id: null,
        status: null,
      },
      multipleSelection: [],
    };
  },
  methods: {
    // 跳转订单相亲
    goToOrderdesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
      window.open(routeData.href, "_blank");
    },
    // 批量付款
    async batchPay() {
      let id = this.multipleSelection.map((item) => item.id).join(",");
      const res = await handleOrderCommissionPayment(id);
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryOrderCommissionList();
      }
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 打款
    handleOrderCommissionPayment(row) {
      this.$confirm(
        `您确定要给【${row.nickName}】打款￥${row.commissionAmount}`,
        "打款",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const res = await handleOrderCommissionPayment(row.id);
        if (res.code == "000") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.queryOrderCommissionList();
        }
      });
    },
    // 查询触发
    resetSearch() {
      this.queryOrderCommissionListParams = {
        orderCode: null,
        pageNo: 1,
        pageSize: 10,
      };
      this.queryOrderCommissionList();
    },
    // 获取审核状态文本
    getExamineStatusText(status) {
      const map = {
        [this.EXAMINE_STATUS.PENDING]: "审核中",
        [this.EXAMINE_STATUS.PASS]: "审核通过",
        [this.EXAMINE_STATUS.REJECT]: "审核驳回",
      };
      return map[status] || "-";
    },
    // 获取审核状态对应 tag 类型
    getExamineStatusType(status) {
      const map = {
        [this.EXAMINE_STATUS.PENDING]: "warning",
        [this.EXAMINE_STATUS.PASS]: "success",
        [this.EXAMINE_STATUS.REJECT]: "danger",
      };
      return map[status] || "info";
    },
    // 确定审核
    async handleOrderCommissionStatus() {
      if (!this.handleOrderCommissionStatusParams.status) {
        this.$message({
          message: "请勾选审核状态",
          type: "warning",
        });
        return;
      }
      const res = await handleOrderCommissionStatus(
        this.handleOrderCommissionStatusParams
      );
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryOrderCommissionList();
        this.closeReviewDialog();
      }
    },
    // 关闭审核弹框
    closeReviewDialog() {
      this.handleOrderCommissionStatusParams = {
        id: null,
        status: null,
      };
      this.reviewDialogVisible = false;
    },
    // 打开审核弹框
    openReviewDialog(id) {
      this.handleOrderCommissionStatusParams.id = id;
      this.reviewDialogVisible = true;
    },
    // 切换页码
    updatePageNo(page) {
      this.queryOrderCommissionListParams.pageNo = page;
      this.queryOrderCommissionList();
    },
    // 查询订单佣金记录
    async queryOrderCommissionList() {
      const res = await queryOrderCommissionList(
        this.queryOrderCommissionListParams
      );
      if (res.code == "000") {
        this.rebateRecordListTotal = res.data.total;
        this.rebateRecordList = res.data.records;
      }
    },
  },
  created() {
    this.queryOrderCommissionList();
  },
};
</script>

<style scoped lang="scss">
.rebateRecord {
  padding: 20px;
}
</style>
