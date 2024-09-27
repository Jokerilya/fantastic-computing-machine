<template>
  <div class="activityProductOrderList">
    <div class="activityProductOrderList_btnline">
      <div class="activityProductOrderList_btnline_left">
        <el-input
          style="margin-right: 10px"
          v-model="queryActivityOrderListParams.orderSn"
          placeholder="请输入订单编号"
        ></el-input>
        <el-select
          v-model="queryActivityOrderListParams.orderType"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div>
        <el-button @click="searchQueryActivityOrderList">搜索</el-button>
        <el-button @click="resetQueryActivityOrderListParams">重置</el-button>
      </div>
    </div>
    <el-card>
      <el-table :data="activityProductOrderList" style="width: 100%">
        <el-table-column
          align="center"
          prop="payTime"
          label="支付时间"
          width="150"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="orderSn"
          label="订单编号"
          width="150"
        >
        </el-table-column>
        <el-table-column align="center" prop="realName" label="下单用户">
        </el-table-column>
        <el-table-column align="center" label="订单类型">
          <template slot-scope="{ row }">
            {{
              row.orderType == 1
                ? "保养服务"
                : row.orderType == 2
                ? "检测服务"
                : "维保产品"
            }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="商品标题">
        </el-table-column>
        <el-table-column align="center" prop="notQty" label="未核销">
        </el-table-column>
        <el-table-column align="center" prop="waitUseQty" label="待核销">
        </el-table-column>
        <el-table-column align="center" prop="useQty" label="已核销">
        </el-table-column>
        <el-table-column align="center" prop="returnQty" label="已退款">
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
          <div slot="label">核销订单{{ index + 1 }}</div>
          <el-descriptions
            class="margin-top"
            title=""
            :column="5"
            direction="vertical"
            border
          >
            <template
              slot="extra"
              v-if="
                !activityOrderDetailItem.masterRealName &&
                !activityOrderDetailItem.applyRefundTime
              "
            >
              <el-button
                type="primary"
                size="small"
                @click="openDesignateMasterDialog(item.orderSn)"
                >指派师傅</el-button
              >
            </template>
            <el-descriptions-item label="联系人">{{
              activityOrderDetailItem.maintenancePeople
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              activityOrderDetailItem.maintenancePhone
            }}</el-descriptions-item>
            <el-descriptions-item label="订单号">{{
              activityOrderDetailItem.orderSn
            }}</el-descriptions-item>
            <el-descriptions-item label="企业名称">{{
              activityOrderDetailItem.enterpriseName
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              activityOrderDetailItem.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="预约时间">
              {{
                activityOrderDetailItem.reservationTime
                  ? activityOrderDetailItem.reservationTime
                  : "未预约"
              }}</el-descriptions-item
            >
            <el-descriptions-item label="核销时间">{{
              activityOrderDetailItem.verificationTime
                ? activityOrderDetailItem.verificationTime
                : "未核销"
            }}</el-descriptions-item>
            <el-descriptions-item label="申请退款时间">
              <span
                :style="{
                  color: activityOrderDetailItem.applyRefundTime ? 'red' : '',
                }"
                >{{
                  activityOrderDetailItem.applyRefundTime
                    ? activityOrderDetailItem.applyRefundTime
                    : "未退款"
                }}</span
              >
            </el-descriptions-item>
            <el-descriptions-item label="师傅名称">{{
              activityOrderDetailItem.masterRealName
                ? activityOrderDetailItem.masterRealName
                : "未指派"
            }}</el-descriptions-item>
            <el-descriptions-item label="预约数量">{{
              activityOrderDetailItem.qty
            }}</el-descriptions-item>
            <el-descriptions-item label="核销状态">{{
              activityOrderDetailItem.status == 0 ? "未核销" : "已核销"
            }}</el-descriptions-item>
            <el-descriptions-item label="企业地址">{{
              activityOrderDetailItem.enterpriseAddress
            }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      :visible="designateMasterVisible"
      title="指派师傅"
      width="45%"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <div class="designateMasterDialog">
        <div class="designateMasterDialog_topBtn">
          <el-input
            v-model="getMasterListParams.realName"
            placeholder="请输入师傅名称"
          ></el-input>
          <el-button
            class="designateMasterDialog_topBtn_search"
            @click="searchMasterList"
            >搜索</el-button
          >
        </div>
        <el-table
          :data="masterList"
          highlight-current-row
          @current-change="changeMaster"
        >
          <el-table-column label="师傅姓名" prop="realName" align="center">
          </el-table-column>
          <el-table-column label="师傅电话" prop="phone" align="center">
          </el-table-column>
          <el-table-column label="等级" prop="levelName" align="center">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDesignateMasterDialog">取 消</el-button>
        <el-button type="primary" @click="confirmHandleActivityOrderAssign"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryActivityOrderList,
  queryActivityOrderDetail,
  handleActivityOrderAssign,
} from "@/api/activity";
import { getMasterList } from "@/api/user";
export default {
  data() {
    return {
      activityProductOrderList: [],
      queryActivityOrderListParams: {
        pageNo: 1,
        pageSize: 10,
        orderSn: null,
        orderType: null,
      },
      activityProductOrderListPages: null,
      activityProductOrderListTotal: null,
      orderTypeOptions: [
        {
          value: 1,
          label: "保养服务",
        },
        {
          value: 2,
          label: "检测服务",
        },
        {
          value: 3,
          label: "维保产品",
        },
      ],

      // 详情
      activityOrderDetailVisible: false,
      activityOrderDetailList: [],
      activityOrderDetailItem: [],
      activeOrderDetail: null,
      relationOrderSn: null,

      //  指派师傅
      designateMasterVisible: false,
      getMasterListParams: {
        pageNo: 1,
        pageSize: 5,
        realName: null,
      },
      masterList: [],
      handleActivityOrderAssignParams: {
        orderSn: null,
        uid: null,
      },
    };
  },
  methods: {
    // 确定指派师傅
    async confirmHandleActivityOrderAssign() {
      const res = await handleActivityOrderAssign(
        this.handleActivityOrderAssignParams
      );
      if (res.message == "操作成功") {
        this.$message({
          message: "指派成功",
          type: "success",
        });
        this.queryActivityOrderDetail();
        this.closeDesignateMasterDialog();
      }
    },
    // 关闭指派师傅框
    closeDesignateMasterDialog() {
      this.handleActivityOrderAssignParams = {
        orderSn: null,
        uid: null,
      };
      this.getMasterListParams = {
        pageNo: 1,
        pageSize: 5,
        realName: null,
      };
      this.masterList = [];
      this.designateMasterVisible = false;
    },
    // 选中师傅
    changeMaster(val) {
      this.handleActivityOrderAssignParams.uid = val.uid;
    },
    // 点击搜索查询师傅
    searchMasterList() {
      this.getMasterListParams.pageNo = 1;
      this.getMasterList();
    },
    // 查询师傅列表
    async getMasterList() {
      const res = await getMasterList(this.getMasterListParams);
      this.masterList = res.data.records;
      this.masterListTotal = res.data.total;
    },
    // 打开指派师傅
    openDesignateMasterDialog(orderSn) {
      this.getMasterList();
      this.handleActivityOrderAssignParams.orderSn = orderSn;
      this.designateMasterVisible = true;
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
      if (res.data) {
        this.activityOrderDetailList = res.data;
        this.activeOrderDetail = res.data[0].orderSn;
        this.activityOrderDetailItem = res.data[0];
      }
    },
    // 打开详情页
    openActivityOrderDetailDialog(relationOrderSn) {
      this.relationOrderSn = relationOrderSn;
      this.queryActivityOrderDetail();
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
      };
      this.queryActivityOrderList();
    },
    // 查询活动订单列表
    async queryActivityOrderList() {
      const res = await queryActivityOrderList(
        this.queryActivityOrderListParams
      );
      this.activityProductOrderList = res.data.records;
      this.activityProductOrderListPages = res.data.pages;
      this.activityProductOrderListTotal = res.data.total;
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
