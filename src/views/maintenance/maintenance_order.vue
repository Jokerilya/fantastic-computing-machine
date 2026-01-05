<template>
  <div class="app-container">
    <!-- 顶部工具栏部分 -->
    <div class="manage-top" v-if="!orderSummaryTableListEdit">
      <el-form
        v-model="queryRepairOrderListParams"
        ref="ruleForm"
        label-width="100px"
        class="rule-form"
        label-position="left"
        :inline="true"
      >
        <el-form-item label="师傅名称">
          <el-select
            v-model="queryRepairOrderListParams.masterUid"
            filterable
            placeholder="请选择师傅"
            :remote-method="getMasterList"
            remote
            @change="changeInquireMasterFn"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          >
            <el-option
              v-for="item in masterSearchList"
              :key="item.uid"
              :label="item.realName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码">
          <el-input
            v-model="queryRepairOrderListParams.no"
            placeholder="请输入设备编码"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input
            v-model="queryRepairOrderListParams.orderSn"
            placeholder="请输入订单编号"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input
            v-model="queryRepairOrderListParams.enterpriseName"
            placeholder="请输入企业名称"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-input
            v-model="queryRepairOrderListParams.deviceModel"
            placeholder="请填写设备型号"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          ></el-input>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select
            v-model="queryRepairOrderListParams.degree"
            placeholder="请选择紧急程度"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          >
            <el-option
              v-for="(item, index) in degreeList"
              :key="'degree_' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select
            v-model="queryRepairOrderListParams.orderType"
            placeholder="请选择订单类型"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          >
            <el-option
              v-for="(item, index) in orderTypeList"
              :key="'orderType_' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型">
          <el-select
            v-model="queryRepairOrderListParams.settlementType"
            placeholder="请选择结算类型"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          >
            <el-option
              v-for="(item, index) in settlementTypeList"
              :key="'settlementType_' + index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据审核">
          <el-select
            v-model="queryRepairOrderListParams.dataExamineStatus"
            placeholder="请选择数据审核"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          >
            <el-option
              v-for="(item, index) in dataExamineStatusList"
              :key="'dataExamineStatus_' + index"
              :label="item.label"
              :value="item.value"
              >全部</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-cascader
            v-model="queryRepairOrderListParams.deviceTypeId"
            :options="deviceTypeList"
            placeholder="请选择设备类型"
            :props="serviceTypesProps"
            :style="{ width: sidebar.opened ? '10vw' : '12vw' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="查询时间">
          <el-date-picker
            v-model="queryRepairOrderListParams.searchTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeSearchTime"
            :style="{ width: sidebar.opened ? '15vw' : '18vw' }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="仅选择超时">
          <el-switch
            v-model="queryRepairOrderListParams.timeoutFlag"
            active-color="#409eff"
            inactive-color="#909399"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="仅选择斯耐克">
          <el-switch
            v-model="queryRepairOrderListParams.snkFlag"
            active-color="#409eff"
            inactive-color="#909399"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col
        :span="17"
        v-if="!orderSummaryTableListEdit && tableType != 3 && tableType != 4"
      >
        <el-radio-group
          :size="sidebar.opened ? 'small' : 'medium'"
          v-model="queryRepairOrderListParams.status"
          @input="changeOrderState"
        >
          <el-radio-button
            :label="item.num"
            v-for="item in statusObjList"
            :key="item.num"
            >{{ item.desc }}({{ orderSubscript[item.str] }})</el-radio-button
          >
        </el-radio-group>
      </el-col>
      <el-col
        :span="
          !orderSummaryTableListEdit && tableType != 3 && tableType != 4
            ? 7
            : 24
        "
        style="text-align: right"
      >
        <el-button
          plain
          @click="handleBatchProxyPayment"
          :disabled="multipleSelection.length == 0"
          v-if="tableType == 1"
        >
          批量代付款
        </el-button>
        <el-button
          @click="openPreviewGenerateBill"
          plain
          v-if="tableType == 4"
          :disabled="accountSelection.length == 0"
        >
          生成对账单
        </el-button>
        <el-button
          @click="changeOrderSummaryTableListEdit"
          type="warning"
          v-if="!orderSummaryTableListEdit && tableType != 1 && tableType != 4"
          >编辑</el-button
        >
        <el-button
          @click="cancelOnlineRepairOrder"
          type="success"
          v-if="orderSummaryTableListEdit && tableType != 1"
          >取消</el-button
        >
        <el-button
          @click="updateOnlineRepairOrder"
          type="success"
          v-if="orderSummaryTableListEdit && tableType != 1"
          >保存</el-button
        >
        <el-button
          v-if="!orderSummaryTableListEdit"
          plain
          type="primary"
          @click="searchTableList"
          >查询</el-button
        >
        <el-button
          v-if="!orderSummaryTableListEdit"
          plain
          type="info"
          :style="{
            marginRight: tableType == 1 || tableType == 4 ? '10px' : '0px',
          }"
          @click="resetTableList"
          >重置</el-button
        >
        <el-dropdown
          v-if="tableType == 1"
          @command="exportListFn"
          trigger="click"
          style="margin-right: 10px"
        >
          <el-button type="success" plain> 导出 </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="导出">导出</el-dropdown-item>
            <el-dropdown-item command="导出V2">导出V2</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          style="margin-right: 10px"
          v-if="tableType != 1 && !orderSummaryTableListEdit && tableType != 4"
          type="success"
          plain
          @click="handleTableExport"
        >
          导出
        </el-button>
        <el-dropdown
          v-if="!orderSummaryTableListEdit"
          trigger="click"
          @command="tableTypeListFn"
        >
          <el-button type="success" plain>
            {{
              tableType == 1
                ? "默认"
                : tableType == 2
                ? "订单总表"
                : tableType == 3
                ? "交接单"
                : "对账单"
            }}
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">默认</el-dropdown-item>
            <el-dropdown-item :command="2">订单总表</el-dropdown-item>
            <el-dropdown-item :command="3">交接单</el-dropdown-item>
            <el-dropdown-item :command="4">对账单</el-dropdown-item>
            <!-- <el-dropdown-item :command="5">日报</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <el-card>
      <!-- 订单列表默认 -->
      <RepairOrderListTable
        v-if="tableType == 1"
        ref="repairOrderListTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-tableSelection="changeTableSelection"
      ></RepairOrderListTable>

      <!-- 订单总表 -->
      <OrderSummaryTable
        v-if="tableType == 2"
        ref="orderSummaryTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-orderSummaryTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </OrderSummaryTable>

      <!-- 交接单-->
      <HandoverSheetTable
        v-if="tableType == 3"
        ref="handoverSheetTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-checklistTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </HandoverSheetTable>

      <!-- 对账单 -->
      <AccountTable
        v-if="tableType == 4"
        ref="accountTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-tableSelection="changeTableSelection"
      >
      </AccountTable>

      <DailyNewspaper v-if="tableType == 5"> </DailyNewspaper>

      <!-- 对账单信息 -->
      <el-dialog
        title="预览对账单信息"
        :visible="previewGenerateBillInfoVisible"
        width="50%"
        :before-close="closePreviewGenerateBill"
      >
        <el-form
          :rules="generateBillParamsRules"
          :model="generateBillParams"
          ref="generateBillFormRef"
          label-position="top"
          inline
        >
          <el-form-item label="甲方(供方)" prop="mchName">
            <el-select
              placeholder="请选择"
              v-model="generateBillParams.mchName"
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
          <el-form-item label="乙方(需方)" prop="enterpriseName">
            <el-input
              placeholder="请输入"
              v-model="generateBillParams.enterpriseName"
            ></el-input>
          </el-form-item>
          <el-form-item label="开票税率" prop="taxRateValue">
            <!-- @change="changeTaxRate" -->
            <el-select
              placeholder="请选择"
              v-model="generateBillParams.taxRateValue"
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
          <el-form-item label="已选订单" style="width: 100%">
            <el-table
              style="width: 100%"
              :key="accountSelectionCopy.length"
              :data="accountSelectionCopy"
            >
              <el-table-column
                label="公司名称"
                show-overflow-tooltip
                align="center"
                width="240"
              >
                <template slot-scope="{ row }">
                  {{ row.enterpriseName ? row.enterpriseName : "/" }}
                </template>
              </el-table-column>
              <el-table-column
                label="设备码"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.no ? row.no : "/" }}
                </template>
              </el-table-column>
              <el-table-column
                prop="orderSn"
                label="订单号"
                show-overflow-tooltip
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.orderSn }}
                </template>
              </el-table-column>
              <el-table-column
                prop="simpleDesc"
                label="故障描述"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column label="人工费" align="center">
                <template slot-scope="{ row }">
                  {{ row.doorAmount ? row.doorAmount : "/" }}
                </template>
              </el-table-column>
              <el-table-column label="配件费" align="center">
                <template slot-scope="{ row }">
                  {{ row.partsAmount ? row.partsAmount : "/" }}
                </template>
              </el-table-column>
              <el-table-column prop="payAmount" label="总金额" align="center">
                <template slot-scope="{ row }">
                  {{ row.payAmount ? row.payAmount : "/" }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closePreviewGenerateBill">取 消</el-button>
          <el-button type="primary" @click="generateBill">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页 -->
      <div
        style="text-align: center; margin-top: 20px"
        v-if="!orderSummaryTableListEdit"
      >
        <el-pagination
          background
          :current-page="queryRepairOrderListParams.pageNo"
          :page-size="queryRepairOrderListParams.pageSize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="paginationTotal"
          @current-change="changePageNo"
          @size-change="changePageSize"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
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
  components: {
    RepairOrderListTable,
    OrderSummaryTable,
    HandoverSheetTable,
    AccountTable,
    DailyNewspaper,
  },
  data() {
    return {
      mchNameList: ["广东机将信息科技有限公司", "东莞市机之工匠科技有限公司"],
      taxRateList: [
        {
          label: "1%",
          value: 0,
        },
        {
          label: "6%",
          value: 0.05,
        },
        {
          label: "13%",
          value: 0.12,
        },
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
      paginationTotal: 0, // 页码总条数
      orderSummaryTableListEdit: false,
      // 搜索需要的数据
      masterSearchList: [],
      orderTypeList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "散单",
          value: 1,
        },
        {
          label: "年保",
          value: 2,
        },
        {
          label: "年卡",
          value: 3,
        },
      ],
      degreeList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "一般",
          value: 1,
        },
        {
          label: "常规",
          value: 0,
        },
        {
          label: "紧急",
          value: 2,
        },
      ],
      settlementTypeList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "现结",
          value: 1,
        },
        {
          label: "月结",
          value: 2,
        },
      ],
      dataExamineStatusList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "审核中",
          value: 1,
        },
        {
          label: "审核通过",
          value: 2,
        },
        {
          label: "审核驳回",
          value: 3,
        },
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
      // 状态栏需要的数据
      orderSubscript: {},
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
      statusObjList: [
        {
          str: "totalNum",
          num: null,
          desc: "全部",
        },
        {
          str: "discardNum",
          num: -2,
          desc: "已废弃",
        },
        {
          str: "cancelNum",
          num: -1,
          desc: "已取消",
        },
        {
          str: "waitAssignNum",
          num: 0,
          desc: "待指派",
        },
        {
          str: "waitReceiveNum",
          num: 1,
          desc: "待接单",
        },
        {
          str: "waitServiceNum",
          num: 2,
          desc: "待服务",
        },
        {
          str: "serviceNum",
          num: 3,
          desc: "服务中",
        },
        {
          str: "waitCheckNum",
          num: 4,
          desc: "待验收",
        },
        {
          str: "waitCollectionNum",
          num: 5,
          desc: "待收/付款",
        },
        {
          str: "completeNum",
          num: 6,
          desc: "已完成",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  methods: {
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
    // 选择税率后重新计算
    changeTaxRate(e) {
      if (e === 0) {
        this.accountSelectionCopy = JSON.parse(
          JSON.stringify(this.accountSelection)
        );
      } else {
        let accountSelectionCopy = JSON.parse(
          JSON.stringify(this.accountSelection)
        );
        accountSelectionCopy = accountSelectionCopy.map((item) => {
          const newItem = { ...item };
          const keys = ["doorAmount", "partsAmount", "payAmount"];
          for (const key of keys) {
            const val = item[key];
            if (typeof val === "number" && !isNaN(val)) {
              const result = Math.round(val * (1 + e) * 100) / 100;
              newItem[key] = Number.isInteger(result)
                ? Math.floor(result)
                : result;
            }
          }
          return newItem;
        });
        this.accountSelectionCopy = accountSelectionCopy;
      }
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
        this.$message({
          message: "操作成功",
          type: "success",
        });
        await this.closePreviewGenerateBill();
        this.accountSelection = [];
        this.$refs.accountTableRef.cleanTableChoose();
      }
    },
    // 【导出订单总表】
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

    // 【编辑图表】
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
    // 取消图表信息
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
    // 保存图表信息
    updateOnlineRepairOrder() {
      if (this.tableType == 2) {
        this.$refs.orderSummaryTableRef.updateOnlineRepairOrder();
      } else if (this.tableType == 3) {
        this.$refs.handoverSheetTableRef.updateOnlineEnrollRepairOrder();
      }
    },
    // 保存后回调修改
    changeOrderSummaryTableListEditBack(flag) {
      this.orderSummaryTableListEdit = flag;
    },
    // 【切换图表】
    tableTypeListFn(e) {
      let tableTypeName =
        e == 1 ? "默认" : e == 2 ? "订单总表" : e == 3 ? "交接单" : "对账单";
      if (e == this.tableType) {
        this.$message({
          message: `您已经在 【${tableTypeName}】 页面`,
          type: "warning",
        });
      } else {
        this.tableType = e;
      }
    },

    // 【批量代付款】
    async handleBatchProxyPayment() {
      const orderSnList = this.multipleSelection.map((item) =>
        String(item.orderSn)
      );
      const res = await handleBatchProxyPayment({
        orderSnList,
      });
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });

        this.multipleSelection = [];
        this.$refs.repairOrderListTableRef.cleanTableChoose();

        await this.getOrderSubscript();
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      }
    },
    // 切换代付款项
    changeTableSelection(val) {
      if (this.tableType == 1) {
        this.multipleSelection = val;
      } else if (this.tableType == 4) {
        this.accountSelection = val;
      }
    },
    // 点击选择分页数量
    async changePageSize(pagesize) {
      this.queryRepairOrderListParams.pageSize = pagesize;

      this.multipleSelection = [];
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.cleanTableChoose();
      }

      this.accountSelection = [];
      if (this.$refs.accountTableRef) {
        this.$refs.accountTableRef.cleanTableChoose();
      }

      if (this.tableType == 1) {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
      } else if (this.tableType == 4) {
        await this.$refs.accountTableRef.queryRepairOrderList();
      }
    },
    // 点击分页的页码
    async changePageNo(page) {
      this.queryRepairOrderListParams.pageNo = page;

      this.multipleSelection = [];
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.cleanTableChoose();
      }

      this.accountSelection = [];
      if (this.$refs.accountTableRef) {
        this.$refs.accountTableRef.cleanTableChoose();
      }

      if (this.tableType == 1) {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
      } else if (this.tableType == 4) {
        await this.$refs.accountTableRef.queryRepairOrderList();
      }
    },
    // 修改查询师傅
    changeInquireMasterFn(uid) {
      const index = this.masterSearchList.findIndex((item) => item.uid == uid);
      this.queryRepairOrderListParams.masterName =
        this.masterSearchList[index].realName;
    },
    // 通用导出方法
    async handleExport(maxLimit, exportApi, fileName, message = "维保列表") {
      // 校验导出数量
      if (this.paginationTotal > maxLimit) {
        this.$message({
          message: "查询条数过多,请缩小搜索范围再导出",
          type: "warning",
        });
        return;
      }

      // 创建加载状态
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });

      try {
        // 准备导出参数
        const exportParams = JSON.parse(
          JSON.stringify(this.queryRepairOrderListParams)
        );
        exportParams.pageSize = 10000;

        // 调用导出API
        const res = await exportApi(exportParams);

        if (res?.data) {
          // 下载文件
          this.downloadFile(res.data, fileName);
        }
      } catch (error) {
        console.error("导出失败:", error);
        this.$message({
          message: "导出失败，请稍后重试",
          type: "error",
        });
      } finally {
        // 关闭加载状态
        loading.close();
      }
    },
    // 通用文件下载方法
    downloadFile(data, fileName, fileType = "application/vnd.ms-excel") {
      const link = document.createElement("a");
      const blob = new Blob([data], { type: fileType });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // 释放内存
      URL.revokeObjectURL(link.href);
    },
    // 点击导出按钮
    async exportListFn(e) {
      if (e == "导出") {
        await this.handleExport(500, handleRepairOrderExport, "维保列表");
      } else {
        await this.handleExport(
          1000,
          handleRepairEnterpriseOrderExport,
          "维保企业列表"
        );
      }
    },
    // 修改订单状态 然后查询
    async changeOrderState() {
      this.queryRepairOrderListParams.pageNo = 1;

      this.multipleSelection = [];
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.cleanTableChoose();
      }

      this.accountSelection = [];
      if (this.$refs.accountTableRef) {
        this.$refs.accountTableRef.cleanTableChoose();
      }

      if (this.tableType == 1) {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
      } else if (this.tableType == 4) {
        await this.$refs.accountTableRef.queryRepairOrderList();
      }
    },
    // 重置订单表单数据
    resetTableList() {
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
        status: null,
      };

      this.multipleSelection = [];
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.cleanTableChoose();
      }

      this.accountSelection = [];
      if (this.$refs.accountTableRef) {
        this.$refs.accountTableRef.cleanTableChoose();
      }

      setTimeout(async () => {
        if (this.tableType == 1) {
          await this.$refs.repairOrderListTableRef.queryRepairOrderList();
        } else if (this.tableType == 2) {
          await this.$refs.orderSummaryTableRef.queryRepairOrderList();
        } else if (this.tableType == 3) {
          await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
        } else if (this.tableType == 4) {
          await this.$refs.accountTableRef.queryRepairOrderList();
        }
        this.getOrderSubscript();
      }, 500);
    },
    // 查询订单表单数据
    async searchTableList() {
      this.queryRepairOrderListParams.pageNo = 1;

      this.multipleSelection = [];
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.cleanTableChoose();
      }

      this.accountSelection = [];
      if (this.$refs.accountTableRef) {
        this.$refs.accountTableRef.cleanTableChoose();
      }

      if (this.tableType == 1) {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == 2) {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == 3) {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
      } else if (this.tableType == 4) {
        await this.$refs.accountTableRef.queryRepairOrderList();
      }
      this.getOrderSubscript();
    },
    // 修改分页总条数
    changePaginationTotal(total) {
      this.paginationTotal = total;
    },
    // 查询维保订单列表角标
    async getOrderSubscript() {
      const res = await getOrderSubscript(this.queryRepairOrderListParams);
      if (res.code == "000") {
        this.orderSubscript = res.data;
      }
    },
    // 切换查询时间
    changeSearchTime(e) {
      this.queryRepairOrderListParams.queryTime = e[0] + "~" + e[1];
    },
    // 查询设备类型
    async queryDeviceTypeList() {
      const res = await queryDeviceTypeList();
      if (res.code == "000") {
        this.deviceTypeList = res.data;
      }
    },
    // 查询师傅列表
    async getMasterList(val) {
      const res = await getMasterList({
        realName: val,
      });
      this.masterSearchList = res.data.records;
    },
  },
  created() {
    this.queryDeviceTypeList();
    this.getOrderSubscript();
  },
};
</script>

<style scoped>
</style>
