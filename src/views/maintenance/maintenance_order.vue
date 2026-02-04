<template>
  <div class="app-container">
    <el-card
      shadow="never"
      class="search-card"
      v-if="!orderSummaryTableListEdit"
    >
      <el-form
        v-model="queryRepairOrderListParams"
        ref="ruleForm"
        label-width="80px"
        class="search-form"
        label-position="left"
        size="small"
      >
        <el-row :gutter="20" type="flex" style="flex-wrap: wrap">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="师傅名称">
              <el-select
                v-model="queryRepairOrderListParams.masterUid"
                filterable
                placeholder="请选择师傅"
                :remote-method="getMasterList"
                remote
                @change="changeInquireMasterFn"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in masterSearchList"
                  :key="item.uid"
                  :label="item.realName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="订单编号">
              <el-input
                v-model="queryRepairOrderListParams.orderSn"
                placeholder="请输入订单编号"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="企业名称">
              <el-input
                v-model="queryRepairOrderListParams.enterpriseName"
                placeholder="请输入企业名称"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-form-item label="查询时间">
              <el-date-picker
                v-model="queryRepairOrderListParams.searchTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始"
                end-placeholder="结束"
                @change="changeSearchTime"
                style="width: 100%"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <template v-if="isSearchExpanded">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="设备编码">
                <el-input
                  v-model="queryRepairOrderListParams.no"
                  placeholder="请输入设备编码"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="设备型号">
                <el-input
                  v-model="queryRepairOrderListParams.deviceModel"
                  placeholder="请填写设备型号"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="紧急程度">
                <el-select
                  v-model="queryRepairOrderListParams.degree"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in degreeList"
                    :key="'degree_' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="订单类型">
                <el-select
                  v-model="queryRepairOrderListParams.orderType"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in orderTypeList"
                    :key="'orderType_' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="结算类型">
                <el-select
                  v-model="queryRepairOrderListParams.settlementType"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in settlementTypeList"
                    :key="'settlementType_' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="数据审核">
                <el-select
                  v-model="queryRepairOrderListParams.dataExamineStatus"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in dataExamineStatusList"
                    :key="'dataExamineStatus_' + index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <el-form-item label="设备类型">
                <el-cascader
                  v-model="queryRepairOrderListParams.deviceTypeId"
                  :options="deviceTypeList"
                  placeholder="请选择"
                  :props="serviceTypesProps"
                  style="width: 100%"
                  clearable
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
              <div class="switch-group">
                <el-checkbox v-model="queryRepairOrderListParams.timeoutFlag"
                  >仅超时</el-checkbox
                >
                <el-checkbox v-model="queryRepairOrderListParams.snkFlag"
                  >仅斯耐克</el-checkbox
                >
              </div>
            </el-col>
          </template>

          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
            class="search-btn-col"
            style="margin-left: auto; align-self: flex-end"
          >
            <div class="search-action-btns">
              <el-button type="primary" size="small" @click="searchTableList"
                >查询</el-button
              >
              <el-button type="info" plain size="small" @click="resetTableList"
                >重置</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="isSearchExpanded = !isSearchExpanded"
              >
                {{ isSearchExpanded ? "收起" : "展开" }}
                <i
                  :class="
                    isSearchExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  "
                ></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="toolbar-section">
        <div
          class="status-radio-group"
          v-if="!orderSummaryTableListEdit && tableType != 3 && tableType != 4"
        >
          <el-radio-group
            v-model="queryRepairOrderListParams.status"
            @input="changeOrderState"
            size="medium"
          >
            <el-radio-button
              :label="item.num"
              v-for="item in statusObjList"
              :key="item.num"
            >
              {{ item.desc }}
              <span class="badge" v-if="orderSubscript[item.str] > 0"
                >({{ orderSubscript[item.str] }})</span
              >
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="status-radio-group" v-else></div>

        <div class="function-btns">
          <template v-if="!orderSummaryTableListEdit">
            <!-- <el-button
              size="small"
              plain
              @click="handleBatchProxyPayment"
              :disabled="multipleSelection.length == 0"
              v-if="tableType == 1"
            >
              批量代付
            </el-button> -->

            <el-button
              size="small"
              @click="openPreviewGenerateBill"
              plain
              v-if="tableType == 4"
              :disabled="accountSelection.length == 0"
            >
              生成对账单
            </el-button>

            <el-button
              size="small"
              @click="changeOrderSummaryTableListEdit"
              type="warning"
              v-if="tableType != 1 && tableType != 4"
              >编辑</el-button
            >

            <el-dropdown
              v-if="tableType == 1"
              @command="exportListFn"
              trigger="click"
              class="margin-lr-10"
            >
              <el-button type="success" plain size="small">
                导出 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="导出">普通导出</el-dropdown-item>
                <el-dropdown-item command="导出V2">详细导出V2</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button
              class="margin-right-10"
              v-if="tableType != 1 && tableType != 4"
              type="success"
              plain
              size="small"
              @click="handleTableExport"
              >导出</el-button
            >

            <el-dropdown trigger="click" @command="tableTypeListFn">
              <el-button type="primary" plain size="small">
                {{ currentTableTypeName }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">默认列表</el-dropdown-item>
                <el-dropdown-item :command="2">订单总表</el-dropdown-item>
                <el-dropdown-item :command="3">交接单</el-dropdown-item>
                <el-dropdown-item :command="4">对账单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template v-else>
            <el-button size="small" @click="cancelOnlineRepairOrder"
              >取消</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="updateOnlineRepairOrder"
              >保存</el-button
            >
          </template>
        </div>
      </div>

      <RepairOrderListTable
        v-if="tableType == 1"
        ref="repairOrderListTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-tableSelection="changeTableSelection"
      ></RepairOrderListTable>

      <OrderSummaryTable
        v-if="tableType == 2"
        ref="orderSummaryTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-orderSummaryTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </OrderSummaryTable>

      <HandoverSheetTable
        v-if="tableType == 3"
        ref="handoverSheetTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-checklistTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </HandoverSheetTable>

      <AccountTable
        v-if="tableType == 4"
        ref="accountTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-tableSelection="changeTableSelection"
      >
      </AccountTable>

      <DailyNewspaper v-if="tableType == 5"> </DailyNewspaper>

      <div class="pagination-wrapper" v-if="!orderSummaryTableListEdit">
        <el-pagination
          background
          :current-page="queryRepairOrderListParams.pageNo"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryRepairOrderListParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationTotal"
          @current-change="changePageNo"
          @size-change="changePageSize"
        ></el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="预览对账单"
      :visible="previewGenerateBillInfoVisible"
      width="60%"
      :before-close="closePreviewGenerateBill"
      custom-class="responsive-dialog"
      append-to-body
    >
      <el-form
        :rules="generateBillParamsRules"
        :model="generateBillParams"
        ref="generateBillFormRef"
        label-position="top"
        size="small"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <el-form-item label="甲方(供方)" prop="mchName">
              <el-select
                placeholder="请选择"
                v-model="generateBillParams.mchName"
                style="width: 100%"
              >
                <el-option
                  v-for="item in mchNameList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="乙方(需方)" prop="enterpriseName">
              <el-input
                placeholder="请输入"
                v-model="generateBillParams.enterpriseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item label="开票税率" prop="taxRateValue">
              <el-select
                placeholder="请选择"
                v-model="generateBillParams.taxRateValue"
                style="width: 100%"
              >
                <el-option
                  v-for="item in taxRateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="已选订单预览">
          <el-table
            border
            size="mini"
            max-height="300"
            :key="accountSelectionCopy.length"
            :data="accountSelectionCopy"
          >
            <el-table-column
              label="公司名称"
              show-overflow-tooltip
              align="center"
              min-width="150"
            >
              <template slot-scope="{ row }">
                {{ row.enterpriseName || "/" }}
              </template>
            </el-table-column>
            <el-table-column
              label="设备码"
              show-overflow-tooltip
              align="center"
              min-width="100"
            >
              <template slot-scope="{ row }">{{ row.no || "/" }}</template>
            </el-table-column>
            <el-table-column
              prop="orderSn"
              label="订单号"
              show-overflow-tooltip
              align="center"
              min-width="140"
            ></el-table-column>
            <el-table-column
              prop="simpleDesc"
              label="故障描述"
              show-overflow-tooltip
              align="center"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="payAmount"
              label="总金额"
              align="center"
              width="100"
            >
              <template slot-scope="{ row }">
                <span style="color: #f56c6c; font-weight: bold">{{
                  row.payAmount || 0
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closePreviewGenerateBill"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="generateBill"
          >生成账单</el-button
        >
      </span>
    </el-dialog>

    <!-- ps -->
    <!-- <p>收到 React 的回复: {{ childMessage }}</p>
    <iframe
      ref="iframeRef"
      src="http://localhost:3000"
      width="100%"
      height="500px"
      frameborder="0"
    ></iframe> -->
  </div>
</template>

<script>
// 保持原有组件引用
import RepairOrderListTable from "../maintenance/components/maintenance_order/repairOrderListTable.vue";
import OrderSummaryTable from "../maintenance/components/maintenance_order/orderSummaryTable.vue";
import HandoverSheetTable from "../maintenance/components/maintenance_order/handoverSheetTable.vue";
import AccountTable from "../maintenance/components/maintenance_order/accountTable.vue";
import DailyNewspaper from "../maintenance/components/maintenance_order/dailyNewspaper.vue";

import { handleBatchProxyPayment } from "@/api/proxy";
import { getMasterList } from "@/api/user.js";
import {
  queryDeviceTypeList,
  getOrderSubscript,
  handleRepairOrderExport,
  handleRepairEnterpriseOrderExport,
  handleOnlineRepairEnterpriseOrderExport,
  handleOnlineRepairMasterOrderExport,
  generateBill,
} from "@/api/order.js";

import { mapGetters } from "vuex";

export default {
  name: "MaintenanceOrder",
  components: {
    RepairOrderListTable,
    OrderSummaryTable,
    HandoverSheetTable,
    AccountTable,
    DailyNewspaper,
  },
  data() {
    return {
      childMessage: "",

      // UI控制
      isSearchExpanded: false, // 搜索栏折叠状态

      // 业务数据
      mchNameList: ["广东机将信息科技有限公司", "东莞市机之工匠科技有限公司"],
      taxRateList: [
        { label: "1%", value: 0 },
        { label: "6%", value: 0.05 },
        { label: "13%", value: 0.12 },
      ],
      tableType: 1, //1默认  2订单总表 3交接单 4对账单
      multipleSelection: [], // 选中的待收款订单
      accountSelection: [], // 选中的对账单订单
      accountSelectionCopy: [], //预览选中的对账单订单

      // 订单搜索条件
      queryRepairOrderListParams: {
        pageNo: 1,
        pageSize: 10,
        masterUid: null,
        orderType: null,
        orderSn: null,
        enterpriseName: null,
        degree: null,
        no: null,
        settlementType: null,
        dataExamineStatus: null,
        deviceTypeId: null,
        deviceModel: null,
        queryTime: null,
        searchTime: null,
        timeoutFlag: false,
        snkFlag: false,
        status: null,
      },
      paginationTotal: 0,
      orderSummaryTableListEdit: false,

      // 搜索下拉数据
      masterSearchList: [],
      orderTypeList: [
        { label: "全部", value: null },
        { label: "散单", value: 1 },
        { label: "年保", value: 2 },
        { label: "年卡", value: 3 },
      ],
      degreeList: [
        { label: "全部", value: null },
        { label: "一般", value: 1 },
        { label: "常规", value: 0 },
        { label: "紧急", value: 2 },
      ],
      settlementTypeList: [
        { label: "全部", value: null },
        { label: "现结", value: 1 },
        { label: "月结", value: 2 },
      ],
      dataExamineStatusList: [
        { label: "全部", value: null },
        { label: "审核中", value: 1 },
        { label: "审核通过", value: 2 },
        { label: "审核驳回", value: 3 },
      ],
      serviceTypesProps: {
        checkStrictly: false,
        emitPath: false,
        multiple: false,
        value: "id",
        label: "name",
        children: "list",
      },
      deviceTypeList: [],

      // 状态栏数据
      orderSubscript: {},
      statusObjList: [
        { str: "totalNum", num: null, desc: "全部" },
        { str: "discardNum", num: -2, desc: "已废弃" },
        { str: "cancelNum", num: -1, desc: "已取消" },
        { str: "waitAssignNum", num: 0, desc: "待指派" },
        { str: "waitReceiveNum", num: 1, desc: "待接单" },
        { str: "waitServiceNum", num: 2, desc: "待服务" },
        { str: "serviceNum", num: 3, desc: "服务中" },
        { str: "waitCheckNum", num: 4, desc: "待验收" },
        { str: "waitCollectionNum", num: 5, desc: "待收/付" },
        { str: "completeNum", num: 6, desc: "已完成" },
      ],

      // 账单生成
      generateBillParams: {
        mchName: null,
        enterpriseName: null,
        relationOrderSnList: null,
        taxRateValue: 0,
      },
      generateBillParamsRules: {
        mchName: [{ required: true, message: "请选择甲方", trigger: "change" }],
        enterpriseName: [
          { required: true, message: "请输入乙方", trigger: "blur" },
        ],
        taxRateValue: [
          { required: true, message: "请选择税率", trigger: "blur" },
        ],
      },
      previewGenerateBillInfoVisible: false,
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    // 获取当前表格类型的中文名
    currentTableTypeName() {
      const map = {
        1: "默认列表",
        2: "订单总表",
        3: "交接单",
        4: "对账单",
        5: "日报",
      };
      return map[this.tableType] || "默认列表";
    },
  },
  mounted() {
    // 监听来自子页面的消息
    window.addEventListener("message", this.handleMessage);
  },
  beforeDestroy() {
    // 组件销毁前移除监听，防止内存泄漏
    window.removeEventListener("message", this.handleMessage);
  },
  methods: {
    // 【父传子】发送消息
    sendMessageToReact() {
      const iframeWin = this.$refs.iframeRef.contentWindow;
      // 参数1：发送的数据
      // 参数2：接收方的源（出于安全考虑，建议替换 '*' 为具体的 React 项目地址）
      iframeWin.postMessage(
        {
          type: "FROM_VUE",
          data: "Hello React, this is Vue!",
        },
        "*"
      );
    },
    // 【子传父】接收消息处理
    handleMessage(event) {
      // 建议校验来源，防止安全风险
      // if (event.origin !== "http://localhost:3000") return;

      if (event.data && event.data.type === "FROM_REACT") {
        console.log("收到 React 数据:", event.data);
        this.childMessage = event.data.data;
      }
    },

    // === 辅助方法：获取当前激活的Table组件引用 ===
    getCurrentTableRef() {
      const refs = {
        1: this.$refs.repairOrderListTableRef,
        2: this.$refs.orderSummaryTableRef,
        3: this.$refs.handoverSheetTableRef,
        4: this.$refs.accountTableRef,
      };
      return refs[this.tableType];
    },

    // === 辅助方法：刷新当前表格数据 ===
    async refreshCurrentTable() {
      const ref = this.getCurrentTableRef();
      if (!ref) return;

      if (this.tableType == 1) await ref.queryRepairOrderList();
      else if (this.tableType == 2) await ref.queryRepairOrderList();
      else if (this.tableType == 3) await ref.queryEnrollRepairOrderList();
      else if (this.tableType == 4) await ref.queryRepairOrderList();
    },

    // === 辅助方法：清空当前表格选中项 ===
    cleanCurrentTableSelection() {
      this.multipleSelection = [];
      this.accountSelection = [];
      const ref = this.getCurrentTableRef();
      if (ref && ref.cleanTableChoose) {
        ref.cleanTableChoose();
      }
    },

    // 预览弹窗关闭
    closePreviewGenerateBill() {
      this.accountSelectionCopy = [];
      this.generateBillParams = {
        mchName: null,
        enterpriseName: null,
        relationOrderSnList: null,
        taxRateValue: 0,
      };
      this.$refs["generateBillFormRef"].resetFields();
      this.previewGenerateBillInfoVisible = false;
    },

    // 打开预览
    openPreviewGenerateBill() {
      this.accountSelectionCopy = JSON.parse(
        JSON.stringify(this.accountSelection)
      );
      this.generateBillParams.enterpriseName =
        this.accountSelection[0].enterpriseName;
      this.previewGenerateBillInfoVisible = true;
    },

    // 【生成对账单】
    async generateBill() {
      await this.$refs.generateBillFormRef.validate();
      const orderSnList = this.accountSelection.map((item) =>
        String(item.orderSn)
      );
      this.generateBillParams.taxRateLabel =
        this.generateBillParams.taxRateValue === 0.12
          ? "13%"
          : this.generateBillParams.taxRateValue === 0.05
          ? "6%"
          : "1%";
      this.generateBillParams.relationOrderSnList = orderSnList;

      const res = await generateBill(this.generateBillParams);
      if (res.code == "000") {
        window.open(res.data, "_blank");
        this.$message.success("操作成功");
        await this.closePreviewGenerateBill();
        this.cleanCurrentTableSelection();
        this.refreshCurrentTable();
      }
    },

    // 【导出】
    async handleTableExport() {
      if (this.tableType == 2) {
        this.handleExport(
          1000,
          handleOnlineRepairEnterpriseOrderExport,
          "订单总表"
        );
      } else if (this.tableType == 3) {
        this.handleExport(1000, handleOnlineRepairMasterOrderExport, "交接单");
      }
    },

    // 【编辑模式控制】
    async changeOrderSummaryTableListEdit() {
      this.orderSummaryTableListEdit = true;
      if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.changeOrderSummaryTableListEdit(
          true
        );
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.changeChecklistTableListEdit(
          true
        );
      }
    },

    // 取消编辑
    async cancelOnlineRepairOrder() {
      if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.changeOrderSummaryTableListEdit(
          false
        );
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.changeChecklistTableListEdit(
          false
        );
      }
      this.orderSummaryTableListEdit = false;
    },

    // 保存编辑
    updateOnlineRepairOrder() {
      if (this.tableType == 2) {
        this.$refs.orderSummaryTableRef.updateOnlineRepairOrder();
      } else if (this.tableType == 3) {
        this.$refs.handoverSheetTableRef.updateOnlineEnrollRepairOrder();
      }
    },

    // 保存后回调
    changeOrderSummaryTableListEditBack(flag) {
      this.orderSummaryTableListEdit = flag;
    },

    // 【切换图表类型】
    async tableTypeListFn(e) {
      if (e == this.tableType) {
        this.$message.warning(`您已经在 【${this.currentTableTypeName}】 页面`);
      } else {
        this.tableType = e;
        if (e == 3 || e == 4) {
          this.resetTableList(false);
        } else {
          this.resetTableList(true);
        }
      }
    },

    // 【批量代付款】
    async handleBatchProxyPayment() {
      const orderSnList = this.multipleSelection.map((item) =>
        String(item.orderSn)
      );
      const res = await handleBatchProxyPayment({ orderSnList });
      if (res.code == "000") {
        this.$message.success("操作成功");
        this.cleanCurrentTableSelection();
        await this.getOrderSubscript();
        await this.refreshCurrentTable();
      }
    },

    // 切换表格选中
    changeTableSelection(val) {
      if (this.tableType == 1) {
        this.multipleSelection = val;
      } else if (this.tableType == 4) {
        this.accountSelection = val;
      }
    },

    // 分页：页码改变
    async changePageNo(page) {
      this.queryRepairOrderListParams.pageNo = page;
      this.cleanCurrentTableSelection();
      await this.refreshCurrentTable();
    },

    // 分页：每页条数改变
    async changePageSize(pagesize) {
      this.queryRepairOrderListParams.pageSize = pagesize;
      this.cleanCurrentTableSelection();
      await this.refreshCurrentTable();
    },

    // 搜索：重置
    resetTableList(flag) {
      let currentStatus;
      if (flag) {
        currentStatus = this.queryRepairOrderListParams.status;
      } else {
        currentStatus = null;
      }

      this.queryRepairOrderListParams = {
        pageNo: 1,
        pageSize: 10,
        masterUid: null,
        orderType: null,
        orderSn: null,
        enterpriseName: null,
        degree: null,
        no: null,
        settlementType: null,
        dataExamineStatus: null,
        deviceTypeId: null,
        deviceModel: null,
        queryTime: null,
        searchTime: null,
        timeoutFlag: false,
        snkFlag: false,
        status: currentStatus, // 保留当前选中的Tab状态
      };

      this.cleanCurrentTableSelection();

      setTimeout(async () => {
        await this.refreshCurrentTable();
        this.getOrderSubscript();
      }, 300);
    },

    // 搜索：查询
    async searchTableList() {
      this.queryRepairOrderListParams.pageNo = 1;
      this.cleanCurrentTableSelection();
      await this.refreshCurrentTable();
      this.getOrderSubscript();
    },

    // 状态切换
    async changeOrderState() {
      this.queryRepairOrderListParams.pageNo = 1;
      this.cleanCurrentTableSelection();
      await this.refreshCurrentTable();
    },

    changePaginationTotal(total) {
      this.paginationTotal = total;
    },

    async getOrderSubscript() {
      const res = await getOrderSubscript(this.queryRepairOrderListParams);
      if (res.code == "000") {
        this.orderSubscript = res.data;
      }
    },

    changeSearchTime(e) {
      this.queryRepairOrderListParams.queryTime = e ? e[0] + "~" + e[1] : null;
    },

    changeInquireMasterFn(uid) {
      // 业务逻辑保留
    },

    async queryDeviceTypeList() {
      const res = await queryDeviceTypeList();
      if (res.code == "000") {
        this.deviceTypeList = res.data;
      }
    },

    async getMasterList(val) {
      const res = await getMasterList({ realName: val });
      this.masterSearchList = res.data.records;
    },

    // 通用导出
    async handleExport(maxLimit, exportApi, fileName) {
      if (this.paginationTotal > maxLimit) {
        return this.$message.warning("查询条数过多,请缩小搜索范围再导出");
      }
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      try {
        const exportParams = {
          ...this.queryRepairOrderListParams,
          pageSize: 10000,
        };
        const res = await exportApi(exportParams);
        if (res?.data) this.downloadFile(res.data, fileName);
      } catch (error) {
        this.$message.error("导出失败");
      } finally {
        loading.close();
      }
    },

    downloadFile(data, fileName, fileType = "application/vnd.ms-excel") {
      const link = document.createElement("a");
      const blob = new Blob([data], { type: fileType });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async exportListFn(e) {
      if (e == "导出")
        await this.handleExport(500, handleRepairOrderExport, "维保列表");
      else
        await this.handleExport(
          1000,
          handleRepairEnterpriseOrderExport,
          "维保企业列表"
        );
    },
  },
  created() {
    this.queryDeviceTypeList();
    this.getOrderSubscript();
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 10px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 10px;
  border: none;

  .search-form {
    .el-form-item {
      margin-bottom: 10px; // 紧凑布局
    }
  }

  .switch-group {
    display: flex;
    gap: 15px;
    align-items: center;
    height: 32px;
  }

  .search-action-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    height: 32px; /* 匹配 el-form-item 的高度，防止偏移 */
    margin-bottom: 10px; /* 匹配表单项的间距 */
  }
}

/* 工具栏区域 */
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  background: #fff;
  padding: 10px;
  border-radius: 4px;

  /* 状态Tab栏 - 移动端优化 */
  .status-radio-group {
    flex: 1;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch; // iOS顺滑滚动

    /* 隐藏滚动条但保留功能 */
    &::-webkit-scrollbar {
      display: none;
    }

    .badge {
      color: #f56c6c;
      font-weight: bold;
      margin-left: 2px;
    }
  }

  /* 功能按钮组 */
  .function-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}

.table-card {
  border: none;
  .pagination-wrapper {
    margin-top: 20px;
    text-align: center;
    overflow-x: auto;
  }
}

.margin-lr-10 {
  margin: 0 10px;
}
.margin-right-10 {
  margin-right: 10px;
}

/* 移动端适配 (小于768px) */
@media only screen and (max-width: 768px) {
  .app-container {
    padding: 5px;
  }

  .toolbar-section {
    flex-direction: column;
    align-items: stretch;

    .status-radio-group {
      width: 100%;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }

    .function-btns {
      justify-content: flex-start;
      margin-top: 5px;

      .el-button {
        padding: 7px 10px; // 缩小按钮padding
        margin-left: 0 !important;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }

  // margin-top: 10px;
  //     border-top: 1px dashed #eee;
  //     padding-top: 10px;
  .search-btn-col {
    float: none !important;
  }
}

/* 弹窗响应式 */
::v-deep .responsive-dialog {
  width: 50%;
  @media only screen and (max-width: 768px) {
    width: 95% !important;
    margin-top: 5vh !important;
  }
}
</style>