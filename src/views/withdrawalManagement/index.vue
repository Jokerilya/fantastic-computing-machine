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
        <el-button class="toolBtn" @click="handleWithdrawalExport"
          >导出</el-button
        >
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
        <!-- <el-table-column label="用户昵称" prop="nickName"> </el-table-column>
        <el-table-column label="用户电话" prop="phone" width="110">
        </el-table-column> -->
        <el-table-column label="提现金额" prop="quota">
          <template slot-scope="{ row }">
            {{ row.quota ? "￥" + row.quota : "/" }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="实际到账" prop="actualArrival">
        </el-table-column> -->
        <el-table-column label="收款人姓名" prop="payeeName"> </el-table-column>
        <el-table-column label="银行名称">
          <template slot-scope="{ row }">
            {{ row.bankName ? row.bankName : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="支行名称">
          <template slot-scope="{ row }">
            {{ row.bankBranchName ? row.bankBranchName : "/" }}
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" width="180">
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
        <el-table-column label="关联单号">
          <template slot-scope="{ row }">
            <div
              v-for="item in row.relationOrderSns"
              :key="item"
              @click="goToOrderDetails(item)"
              style="color: #409eff; cursor: pointer"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
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
            <el-button
              type="text"
              :disabled="row.status != 0"
              @click="openExamineWithdrawDialog(row.id)"
              >审核</el-button
            >
            <el-button type="text" v-if="row.status == 1" @click="remitFn(row)"
              >打款</el-button
            >
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

    <!-- 审核提现 -->
    <el-dialog
      title="审核"
      center
      :visible="examineWithdrawDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="handleWithdrawalExamineParams"
        :rules="handleWithdrawalExamineRules"
        ref="handleWithdrawalExamineRef"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="handleWithdrawalExamineParams.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="-1">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="handleWithdrawalExamineParams.remark"
            placeholder="请填写备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExamineWithdrawDialog">取 消</el-button>
        <el-button type="primary" @click="handleWithdrawalExamine"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryWithdrawal,
  handleWithdrawalExamine,
  handleWithdrawalExport,
} from "@/api/user";
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

      examineWithdrawDialogVisible: false,
      handleWithdrawalExamineParams: {
        id: null,
        remark: null,
        status: null,
      },
      handleWithdrawalExamineRules: {
        remark: [
          {
            required: true,
            message: "请填写备注,如果不需要填无",
            trigger: "blur",
          },
        ],
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 打款
    remitFn(item) {
      this.$confirm(
        `您是否要给【${item.payeeName}】打款 【￥${item.quota}】`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        let params = {
          id: item.id,
          status: 2,
        };
        const res = await handleWithdrawalExamine(params);
        if (res.code == "000") {
          this.$message({
            message: "打款成功",
            type: "success",
          });
          this.queryWithdrawal();
        }
      });
    },
    // 跳转订单详情
    goToOrderDetails(orderSn) {
      const targetRoute = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
      window.open(targetRoute.href, "_blank");
    },
    // 导出
    handleWithdrawalExport() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      handleWithdrawalExport(this.queryWithdrawalParams).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "提现记录"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        }
      });
    },
    // 审核确定
    async handleWithdrawalExamine() {
      await this.$refs["handleWithdrawalExamineRef"].validate();
      const res = await handleWithdrawalExamine(
        this.handleWithdrawalExamineParams
      );
      if (res.code == "000") {
        this.queryWithdrawal();
        this.closeExamineWithdrawDialog();
      }
    },
    // 关闭提现审核框
    closeExamineWithdrawDialog() {
      this.handleWithdrawalExamineParams = {
        id: null,
        remark: null,
        status: null,
      };
      this.$refs["handleWithdrawalExamineRef"].resetFields();
      this.examineWithdrawDialogVisible = false;
    },
    // 打开提现审核框
    openExamineWithdrawDialog(id) {
      this.handleWithdrawalExamineParams.id = id;
      this.examineWithdrawDialogVisible = true;
    },
    // 切换页码
    changePage(page) {
      this.queryWithdrawalParams.pageNo = page;
      this.queryWithdrawal();
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
      this.queryWithdrawalParamsQueryTime = null;
      this.queryWithdrawal();
    },
    // 点击搜索
    searchwithdrawalList() {
      this.queryWithdrawalParams.pageNo = 1;
      this.queryWithdrawal();
    },
    // 修改日期
    changeQueryWithdrawalParamsQueryTime(val) {
      this.queryWithdrawalParams.queryTime = val[0] + "/" + val[1];
    },
    // 查询提现记录
    async queryWithdrawal() {
      const res = await queryWithdrawal(this.queryWithdrawalParams);
      this.withdrawalList = res.data.data.records;
      this.withdrawalListTotal = res.data.data.total;
      if (res.data.data.total > 0) {
        res.data.data.records.forEach((item) => {
          item.relationOrderSns = item.relationOrderSns.split(",");
        });
      }
    },
  },
  created() {
    this.queryWithdrawal();
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
