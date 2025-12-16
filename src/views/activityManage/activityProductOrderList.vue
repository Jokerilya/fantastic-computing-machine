<template>
  <div class="activityProductOrderList">
    <div class="activityProductOrderList_btnline">
      <div class="activityProductOrderList_btnline_left">
        <el-form inline>
          <el-form-item label="订单编号:">
            <el-input
              v-model="queryActivityOrderListParams.orderSn"
              placeholder="请输入订单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="支付状态:">
            <el-select
              v-model="queryActivityOrderListParams.status"
              placeholder="请选择支付状态"
            >
              <el-option label="全部" :value="null"> </el-option>
              <el-option label="未支付" :value="0"> </el-option>
              <el-option label="已支付" :value="1"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="searchQueryActivityOrderList">搜索</el-button>
        <el-button @click="resetQueryActivityOrderListParams">重置</el-button>
      </div>
    </div>
    <el-card>
      <el-table :data="activityProductOrderList" style="width: 100%">
        <el-table-column align="center" prop="payTime" label="支付时间">
          <template slot-scope="{ row }">
            {{ row.payTime ? row.payTime : "/" }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderSn" label="订单编号">
        </el-table-column>
        <el-table-column align="center" prop="realName" label="下单用户">
        </el-table-column>
        <el-table-column align="center" prop="enterpriseName" label="公司名称">
          <template slot-scope="{ row }">
            {{ row.enterpriseName ? row.enterpriseName : "/" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推荐人身份">
          <template slot-scope="{ row }">
            {{
              row.channel == "saleman"
                ? "业务员"
                : row.channel == "master"
                ? "师傅"
                : "/"
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推荐人">
          <template slot-scope="{ row }">
            {{ row.promotionName ? row.promotionName : "/" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付金额">
          <template slot-scope="{ row }"> ￥{{ row.payAmount }} </template>
        </el-table-column>
        <el-table-column align="center" label="支付状态">
          <template slot-scope="{ row }">
            <span :style="{ color: row.status == 0 ? 'red' : 'green' }">
              {{ row.status == 0 ? "未支付" : "已支付" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款状态">
          <template slot-scope="{ row }">
            <span :style="{ color: row.returnExamineStatus == 1 ? 'red' : '' }">
              {{
                row.returnExamineStatus == 0
                  ? "未退款"
                  : row.returnExamineStatus == 1
                  ? "退款中"
                  : row.returnExamineStatus == 2
                  ? "已退款"
                  : "已驳回"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="openActivityOrderDetailDialog(row.orderSn)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="activityProductOrderList_pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="activityProductOrderListTotal"
          :page-size="queryActivityOrderListParams.pageSize"
          @current-change="changeParamsPageSize"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="详情"
      width="65%"
      :visible="activityOrderDetailVisible"
      :before-close="closeActivityOrderDetailDialog"
      :close-on-click-modal="false"
      center
    >
      <el-tabs
        v-model="activeOrderDetail"
        @tab-click="changeActivityOrderDetailTab"
      >
        <el-tab-pane
          v-for="(item, index) in activityOrderDetailList"
          :key="index"
          :name="item.orderSn"
        >
          <div slot="label">产品:{{ item.title }}</div>
          <div
            v-if="item.orderType != 2 && item.applyRefundAmount > 0"
            style="margin-bottom: 15px; text-align: right"
          >
            <el-button type="primary" @click="openReviewRefundDialog">
              审核退款
            </el-button>
          </div>
          <el-table
            v-if="item.orderType != 2"
            :data="item.list"
            border
            style="width: 100%"
          >
            <el-table-column prop="code" label="券码" align="center">
              <template slot-scope="{ row }">
                <el-tag>{{ row.code }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="使用状态" align="center">
              <template slot-scope="{ row }">
                <div :style="{ color: row.useStatus == 1 ? 'green' : '' }">
                  {{ row.useStatus == 1 ? "已使用" : "未使用" }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="目标订单号" align="center">
              <template slot-scope="{ row }">
                {{ row.targetOrder ? row.targetOrder : "/" }}
              </template>
            </el-table-column>
            <el-table-column label="使用时间" align="center">
              <template slot-scope="{ row }">
                {{ row.useTime ? row.useTime : "/" }}
              </template>
            </el-table-column>
            <el-table-column label="退款申请" align="center">
              <template slot-scope="{ row }">
                {{
                  row.returnStatus == 0
                    ? "/"
                    : row.returnStatus == 1
                    ? "申请中"
                    : row.returnStatus == 2
                    ? "已通过"
                    : "已驳回"
                }}
              </template>
            </el-table-column>
            <el-table-column label="申请退款时间" align="center">
              <template slot-scope="{ row }">
                {{ row.applyReturnTime ? row.applyReturnTime : "/" }}
              </template>
            </el-table-column>
            <el-table-column label="退款时间" align="center">
              <template slot-scope="{ row }">
                {{ row.examineReturnTime ? row.examineReturnTime : "/" }}
              </template>
            </el-table-column>
          </el-table>

          <el-table v-else :data="item.list" border style="width: 100%">
            <el-table-column prop="code" label="机台码" align="center">
              <template slot-scope="{ row }">
                <el-tag>{{ row.code }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="validPeriodData"
              label="有限期限范围"
              align="center"
            >
            </el-table-column>
            <el-table-column label="使用状态" align="center">
              <template> 已使用 </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="审核退款" width="35%" :visible="reviewRefundVisible">
      <div class="reviewRefundBox">
        <el-form>
          <el-form-item label="退款张数:">
            {{ computeRefundNum(activityOrderDetailItem.list) }}张
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select
              v-model="handleOrderRefundParams.examineStatus"
              placeholder="请选择审核状态"
            >
              <el-option label="通过" :value="2"> </el-option>
              <!-- <el-option label="驳回" :value="3"> </el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReviewRefundDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderRefund">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryActivityOrderList,
  queryActivityOrderDetail,
  handleOrderRefund,
} from "@/api/activity";
export default {
  data() {
    return {
      activityProductOrderList: [],
      queryActivityOrderListParams: {
        pageNo: 1,
        pageSize: 10,
        orderSn: null,
        orderType: null,
        status: null,
      },
      activityProductOrderListPages: null,
      activityProductOrderListTotal: null,
      orderTypeOptions: [
        {
          value: 1,
          label: "保养卡",
        },
        {
          value: 2,
          label: "维修月卡",
        },
        {
          value: 3,
          label: "维修次卡",
        },
      ],

      // 详情
      activityOrderDetailVisible: false,
      activityOrderDetailList: [],
      activityOrderDetailItem: [],
      activeOrderDetail: null,
      relationOrderSn: null,
      // 审核退款
      reviewRefundVisible: false,
      handleOrderRefundParams: {
        orderSn: null,
        examineStatus: null,
      },
    };
  },
  methods: {
    // 审核退款
    async handleOrderRefund() {
      const res = await handleOrderRefund(this.handleOrderRefundParams);
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        await this.queryActivityOrderList();
        await this.closeReviewRefundDialog();
        this.closeActivityOrderDetailDialog();
      }
    },
    // 计算退款张数
    computeRefundNum(arr) {
      if (!arr || arr.length == 0) return 0;
      return arr.filter((item) => item.returnStatus === 1).length;
    },
    // 关闭审核退款弹框
    closeReviewRefundDialog() {
      this.handleOrderRefundParams = {
        orderSn: null,
        examineStatus: null,
      };
      this.reviewRefundVisible = false;
    },
    // 打开审核退款
    openReviewRefundDialog() {
      this.reviewRefundVisible = true;
    },
    // 修改详情框tab
    changeActivityOrderDetailTab(tab) {
      this.activeOrderDetail = this.activityOrderDetailList[tab.index].orderSn;
      this.activityOrderDetailItem = this.activityOrderDetailList[tab.index];
    },
    // 关闭详情页
    closeActivityOrderDetailDialog() {
      this.activityOrderDetailVisible = false;
      this.activityOrderDetailList = [];
      this.activeOrderDetail = null;
      this.activityOrderDetailItem = [];
    },
    // 查询详情信息
    async queryActivityOrderDetail() {
      const res = await queryActivityOrderDetail(this.relationOrderSn);
      if (res.code == "000") {
        this.activityOrderDetailList = res.data;
        this.activeOrderDetail = res.data[0].orderSn;
        this.activityOrderDetailItem = res.data[0];
      }
    },
    // 打开详情页
    openActivityOrderDetailDialog(relationOrderSn) {
      this.relationOrderSn = relationOrderSn;
      this.queryActivityOrderDetail();
      this.handleOrderRefundParams.orderSn = relationOrderSn;
      this.activityOrderDetailVisible = true;
    },
    // 切换页码
    changeParamsPageSize(page) {
      this.queryActivityOrderListParams.pageNo = page;
      this.queryActivityOrderList();
    },
    // 搜索
    searchQueryActivityOrderList() {
      this.queryActivityOrderListParams.pageNo = 1;
      this.queryActivityOrderList();
    },
    // 重置
    resetQueryActivityOrderListParams() {
      this.queryActivityOrderListParams = {
        pageNo: 1,
        pageSize: 10,
        orderSn: null,
        orderType: null,
        status: null,
      };
      this.queryActivityOrderList();
    },
    // 查询活动订单列表
    async queryActivityOrderList() {
      const res = await queryActivityOrderList(
        this.queryActivityOrderListParams
      );
      if (res.code == "000") {
        this.activityProductOrderList = res.data.records;
        this.activityProductOrderListPages = res.data.pages;
        this.activityProductOrderListTotal = res.data.total;
      }
    },
  },
  created() {
    this.queryActivityOrderList();
  },
};
</script>

<style scoped lang="scss">
.activityProductOrderList {
  padding: 20px;
  .activityProductOrderList_btnline {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .activityProductOrderList_btnline_left {
      display: flex;
    }
  }

  .activityProductOrderList_pagination {
    margin-top: 10px;
    text-align: center;
  }

  .designateMasterDialog {
    .designateMasterDialog_topBtn {
      display: flex;
      .designateMasterDialog_topBtn_search {
        margin-left: 20px;
      }
    }
  }
}
</style>
