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
        v-if="!orderSummaryTableListEdit && tableType != '交接单'"
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
        :span="!orderSummaryTableListEdit && tableType != '交接单' ? 7 : 24"
        style="text-align: right"
      >
        <el-button
          plain
          @click="handleBatchProxyPayment"
          :disabled="multipleSelection.length == 0"
          v-if="tableType == '视图'"
        >
          批量代付款
        </el-button>
        <el-button
          @click="changeOrderSummaryTableListEdit"
          type="warning"
          v-if="!orderSummaryTableListEdit && tableType != '视图'"
          >编辑</el-button
        >
        <el-button
          @click="updateOnlineRepairOrder"
          type="success"
          v-if="orderSummaryTableListEdit && tableType != '视图'"
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
          :style="{ marginRight: tableType == '视图' ? '10px' : '0px' }"
          @click="resetTableList"
          >重置</el-button
        >
        <el-dropdown
          v-if="tableType == '视图'"
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
          v-if="tableType != '视图' && !orderSummaryTableListEdit"
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
          <el-button type="success" plain> 图表 </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="视图">视图</el-dropdown-item>
            <el-dropdown-item command="对账单">对账单</el-dropdown-item>
            <el-dropdown-item command="订单总表">订单总表</el-dropdown-item>
            <el-dropdown-item command="交接单">交接单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <el-card>
      <!-- 订单列表视图 -->
      <RepairOrderListTable
        v-if="tableType == '视图'"
        ref="repairOrderListTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-tableSelection="changeTableSelection"
      ></RepairOrderListTable>

      <!-- 订单总表 -->
      <OrderSummaryTable
        v-if="tableType == '订单总表'"
        ref="orderSummaryTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-orderSummaryTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </OrderSummaryTable>

      <!-- 交接单-->
      <HandoverSheetTable
        v-if="tableType == '交接单'"
        ref="handoverSheetTableRef"
        :params="queryRepairOrderListParams"
        @change-paginationTotal="changePaginationTotal"
        @change-checklistTableListEdit="changeOrderSummaryTableListEditBack"
      >
      </HandoverSheetTable>

      <!-- 分页 -->
      <div
        style="text-align: center; margin-top: 20px"
        v-if="!orderSummaryTableListEdit"
      >
        <el-pagination
          background
          :current-page="queryRepairOrderListParams.pageNo"
          :page-size="queryRepairOrderListParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paginationTotal"
          @current-change="changePageNo"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import RepairOrderListTable from "../maintenance/components/maintenance_order/repairOrderListTable.vue";
import OrderSummaryTable from "../maintenance/components/maintenance_order/orderSummaryTable.vue";
import HandoverSheetTable from "../maintenance/components/maintenance_order/handoverSheetTable.vue";

import { handleBatchProxyPayment } from "@/api/proxy";
import { getMasterList } from "@/api/user.js";
import {
  queryDeviceTypeList,
  getOrderSubscript,
  handleRepairOrderExport,
  handleRepairEnterpriseOrderExport,
  handleOnlineRepairEnterpriseOrderExport,
  handleOnlineRepairMasterOrderExport,
} from "@/api/order.js";
import { mapGetters } from "vuex";
export default {
  components: { RepairOrderListTable, OrderSummaryTable, HandoverSheetTable },
  data() {
    return {
      tableType: "视图", //视图  对账单  订单总表 交接单
      multipleSelection: [], // 待收款订单
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
    // 【导出订单总表】
    async handleTableExport() {
      if (this.tableType == "订单总表") {
        this.handleExport(
          1000,
          handleOnlineRepairEnterpriseOrderExport,
          "订单总表"
        );
      } else if (this.tableType == "交接单") {
        this.handleExport(1000, handleOnlineRepairMasterOrderExport, "交接单");
      }
    },

    // 【编辑图表】
    async changeOrderSummaryTableListEdit() {
      this.orderSummaryTableListEdit = true;
      if (this.tableType == "订单总表") {
        await this.$refs.orderSummaryTableRef.changeOrderSummaryTableListEdit(
          true
        );
      } else if (this.tableType == "交接单") {
        await this.$refs.handoverSheetTableRef.changeChecklistTableListEdit(
          true
        );
      }
    },
    // 保存图表信息
    updateOnlineRepairOrder() {
      if (this.tableType == "订单总表") {
        this.$refs.orderSummaryTableRef.updateOnlineRepairOrder();
      } else if (this.tableType == "交接单") {
        this.$refs.handoverSheetTableRef.updateOnlineEnrollRepairOrder();
      }
    },
    // 保存后回调修改
    changeOrderSummaryTableListEditBack(flag) {
      this.orderSummaryTableListEdit = flag;
    },
    // 【切换图表】
    tableTypeListFn(e) {
      if (e == "对账单") {
        this.$message({
          message: `正在开发中...`,
          type: "warning",
        });
        return;
      }
      if (e == this.tableType) {
        this.$message({
          message: `您已经在 【${e}】 页面`,
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
        await this.getOrderSubscript();
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      }
    },
    // 切换代付款项
    changeTableSelection(val) {
      this.multipleSelection = val;
    },

    // 点击分页的页码
    async changePageNo(page) {
      this.queryRepairOrderListParams.pageNo = page;
      this.multipleSelection = [];
      if (this.tableType == "视图") {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == "订单总表") {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == "交接单") {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
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
      if (this.tableType == "视图") {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == "订单总表") {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == "交接单") {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
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
      setTimeout(async () => {
        if (this.tableType == "视图") {
          await this.$refs.repairOrderListTableRef.queryRepairOrderList();
        } else if (this.tableType == "订单总表") {
          await this.$refs.orderSummaryTableRef.queryRepairOrderList();
        } else if (this.tableType == "交接单") {
          await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
        }
        this.getOrderSubscript();
      }, 500);
    },
    // 查询订单表单数据
    async searchTableList() {
      this.queryRepairOrderListParams.pageNo = 1;
      this.multipleSelection = [];
      if (this.tableType == "视图") {
        await this.$refs.repairOrderListTableRef.queryRepairOrderList();
      } else if (this.tableType == "订单总表") {
        await this.$refs.orderSummaryTableRef.queryRepairOrderList();
      } else if (this.tableType == "交接单") {
        await this.$refs.handoverSheetTableRef.queryEnrollRepairOrderList();
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
