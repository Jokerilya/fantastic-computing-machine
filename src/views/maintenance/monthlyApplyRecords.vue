<template>
  <div class="faultItemsExamine">
    <first-title title="月结申请记录" />
    <div class="faultItemsExamine_table">
      <el-card>
        <el-table border style="width: 100%" :data="monthlyApplyRecords">
          <el-table-column
            label="企业名称"
            prop="enterpriseName"
            align="center"
          >
          </el-table-column>
          <el-table-column label="税号" prop="taxpayerNo" align="center">
          </el-table-column>
          <el-table-column label="联系人" prop="contactPeople" align="center">
          </el-table-column>
          <el-table-column label="联系电话" prop="contactPhone" align="center">
          </el-table-column>
          <el-table-column label="税率" align="center" width="80px">
            <template slot-scope="{ row }">
              {{ row.taxPoint * 100 }}%
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="110px">
            <template slot-scope="{ row }">
              <div
                :style="{
                  color:
                    row.status === 2
                      ? '#67C23A'
                      : row.status === 3
                      ? '#F56C6C'
                      : '#909399',
                }"
              >
                {{
                  row.status === 2
                    ? "已通过"
                    : row.status === 3
                    ? "已驳回"
                    : "待审核"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="周期" align="center" width="80px">
            <template slot-scope="{ row }">
              {{ row.settlementDay ? row.settlementDay + "天" : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="驳回原因" align="center">
            <template slot-scope="{ row }">
              {{ row.reason ? row.reason : "/" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                v-if="row.status == 1"
                @click="openExamineDialog(row)"
                >审核</el-button
              >
              <!-- <el-button
                type="text"
                v-else-if="row.status == 2 && !row.settlementDay"
                @click="editEnterpriseInfo(row)"
                >转月结</el-button
              > -->
              <div v-else>/</div>
            </template>
          </el-table-column>
        </el-table>

        <div class="faultItemsExamine_table_pagination">
          <el-pagination
            @current-change="changePage"
            background
            :page-size="queryEnterpriseSettlementApplyParams.pageSize"
            :total="monthlyApplyRecordsTotal"
            layout="prev, pager, next"
          >
          </el-pagination>
        </div>
      </el-card>

      <!-- 审核记录弹框 -->
      <el-dialog
        title="审核月结申请"
        :visible="reviewMonthlyApplyVisible"
        :before-close="closeReviewMonthlyApplyDialog"
        :close-on-click-modal="false"
        width="30%"
      >
        <el-form
          label-width="80px"
          :model="handleEnterpriseSettlementApplyParams"
          :rules="handleEnterpriseSettlementApplyRules"
          ref="handleEnterpriseSettlementApplyFef"
        >
          <el-form-item label="审核状态" prop="status">
            <el-radio-group
              v-model="handleEnterpriseSettlementApplyParams.status"
            >
              <el-radio :label="2">通过</el-radio>
              <el-radio :label="3">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="驳回原因"
            prop="reason"
            v-if="handleEnterpriseSettlementApplyParams.status === 3"
          >
            <el-input
              v-model="handleEnterpriseSettlementApplyParams.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入驳回原因"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeReviewMonthlyApplyDialog">取 消</el-button>
          <el-button type="primary" @click="handleEnterpriseSettlementApply"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import {
  handleEnterpriseSettlementApply,
  queryEnterpriseSettlementApply,
} from "@/api/enterprise";
import { editEnterpriseInfo } from "@/api/boss";
export default {
  data() {
    return {
      monthlyApplyRecords: [],
      monthlyApplyRecordsTotal: 0,
      queryEnterpriseSettlementApplyParams: {
        pageNo: 1,
        pageSize: 10,
      },
      handleEnterpriseSettlementApplyParams: {
        id: null,
        reason: null,
        status: null,
      },
      handleEnterpriseSettlementApplyRules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" },
        ],
      },
      reviewMonthlyApplyVisible: false,
    };
  },
  methods: {
    // 转月结
    async editEnterpriseInfo(row) {
      this.$confirm("您确定要将该企业转为月结吗?", "转月结", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await editEnterpriseInfo({
          id: row.enterpriseId,
          settlementType: 2,
        });
        if (res && res.code === "000") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.queryEnterpriseSettlementApply();
        }
      });
    },
    // 审核月结申请
    async handleEnterpriseSettlementApply() {
      await this.$refs.handleEnterpriseSettlementApplyFef.validate();
      const res = await handleEnterpriseSettlementApply(
        this.handleEnterpriseSettlementApplyParams
      );
      if (res && res.code === "000") {
        this.$message.success("操作成功");
        this.closeReviewMonthlyApplyDialog();
        this.queryEnterpriseSettlementApply();
      }
    },
    // 关闭审核弹框
    closeReviewMonthlyApplyDialog() {
      this.handleEnterpriseSettlementApplyParams = {
        id: null,
        reason: null,
        status: null,
      };
      this.$refs.handleEnterpriseSettlementApplyFef.resetFields();
      this.reviewMonthlyApplyVisible = false;
    },
    // 打开审核弹框
    openExamineDialog(row) {
      this.handleEnterpriseSettlementApplyParams.id = row.id;
      this.reviewMonthlyApplyVisible = true;
    },
    // 改变页码
    changePage(page) {
      this.queryEnterpriseSettlementApplyParams.pageNo = page;
      this.queryEnterpriseSettlementApply();
    },
    // 查询企业微群列表
    async queryEnterpriseSettlementApply() {
      const res = await queryEnterpriseSettlementApply(
        this.queryEnterpriseSettlementApplyParams
      );
      if (res && res.code === "000") {
        this.monthlyApplyRecords = res.data.records || [];
        this.monthlyApplyRecordsTotal = res.data.total || 0;
      }
    },
  },
  created() {
    this.queryEnterpriseSettlementApply();
  },
};
</script>
  
  <style scoped lang="less">
.faultItemsExamine {
  padding: 20px;
  .faultItemsExamine_top {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 20px;

    .faultItemsExamine_top_left {
      display: flex;
      align-items: center;
      .faultItemsExamine_top_item {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          color: #606266;
          font-size: 14px;
          font-weight: 700;
          margin-right: 20px;
        }
      }
    }
    .faultItemsExamine_top_right {
      display: flex;
      align-items: center;
    }
  }

  .faultItemsExamine_table {
    .faultItemsExamine_table_pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
  