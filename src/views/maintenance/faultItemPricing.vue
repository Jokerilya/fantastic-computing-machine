<template>
  <div class="faultItemPricing">
    <!-- 表格内容部分 -->
    <div class="tableContent" v-if="faultItemList">
      <el-card>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="faultItemList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
          >
            <el-table-column width="150" label="师傅名称" prop="masterRealName">
            </el-table-column>
            <el-table-column label="机床类型">
              <template slot-scope="{ row }">
                {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
              </template>
            </el-table-column>
            <el-table-column prop="position" label="项目部位"></el-table-column>
            <el-table-column
              prop="simpleDesc"
              label="项目描述"
            ></el-table-column>
            <el-table-column
              prop="originalAmount"
              label="师傅标准价"
            ></el-table-column>
            <el-table-column
              prop="currentAmount"
              label="师傅申请价"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button
                  v-if="row.status == 1"
                  type="text"
                  @click="examinePricing(row)"
                  >审核</el-button
                >
                <div v-if="row.status == 2" style="color: green">已通过</div>
                <div v-if="row.status == 3" style="color: red">已失败</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_pagination">
            <el-pagination
              @current-change="currentChangeFn"
              :page-size="faultItemListParams.pageSize"
              layout="jumper, prev, pager, next,total "
              :total="total"
              :current-page="faultItemListParams.pageNo"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog
      title="审核定价"
      :visible="examinePricingDialog"
      width="30%"
      :before-close="closeExaminePricingDialog"
      center
    >
      <div class="examinePricingDialog">
        <el-form :model="examinePricingParams" label-width="10vw">
          <el-form-item label="审核状态:">
            <el-radio-group
              v-model="examinePricingParams.status"
              @change="changeStatus"
            >
              <el-radio :label="2">通过</el-radio>
              <el-radio :label="3">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="分数类型:"
            v-if="examinePricingParams.status == 2"
          >
            <el-radio-group v-model="examinePricingParams.type">
              <el-radio :label="1">加分</el-radio>
              <el-radio :label="2">减分</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="分数数值:"
            v-if="examinePricingParams.status == 2"
          >
            <el-input-number
              v-model.number="examinePricingParams.value"
              :min="1"
              :max="99999"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExaminePricingDialog">取 消</el-button>
        <el-button type="primary" @click="confirmExaminePricing"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryMasterFaultPriceList,
  examineMasterFaultPrice,
} from "@/api/order";
export default {
  data() {
    return {
      faultItemList: [],
      faultItemListParams: {
        pageNo: 1,
        pageSize: 10,
      },
      total: null,

      examinePricingDialog: false,
      examinePricingParams: {
        id: null,
        status: null,
        type: null,
        value: null,
      },
    };
  },
  methods: {
    warningMessage(message) {
      this.$message({
        showClose: true,
        message,
        type: "warning",
      });
    },
    async confirmExaminePricing() {
      // 校验开始
      if (!this.examinePricingParams.status) {
        this.warningMessage("审核状态不能为空");
        return;
      }
      if (this.examinePricingParams.status == 2) {
        if (!this.examinePricingParams.type) {
          this.warningMessage("分数类型不能为空");
          return;
        }
        if (
          this.examinePricingParams.value > 10 ||
          this.examinePricingParams.value < 1
        ) {
          this.warningMessage("请填写1到10以内的整数");
          return;
        }
      }

      // 校验结束

      const res = await examineMasterFaultPrice(this.examinePricingParams);
      if (res.message == "操作成功") {
        this.$message({
          showClose: true,
          message: res.message,
          type: "success",
        });
        this.queryMasterFaultPriceList();
        this.closeExaminePricingDialog();
      }
    },
    changeStatus() {
      this.examinePricingParams.type = null;
      this.examinePricingParams.value = null;
    },
    closeExaminePricingDialog() {
      this.examinePricingDialog = false;
      this.examinePricingParams = {
        id: null,
        status: null,
        type: null,
        value: null,
      };
    },
    currentChangeFn(page) {
      this.faultItemListParams.pageNo = page;
      this.queryMasterFaultPriceList();
    },
    examinePricing(item) {
      this.examinePricingDialog = true;
      this.examinePricingParams.id = item.id;
    },
    async queryMasterFaultPriceList() {
      const res = await queryMasterFaultPriceList(this.faultItemListParams);
      this.faultItemList = res.data.records;
      this.total = res.data.total;
    },
  },
  created() {
    this.queryMasterFaultPriceList();
  },
};
</script>

<style scoped lang="less">
.faultItemPricing {
  padding: 20px;

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
