<template>
  <div class="repairOrderListTable">
    <el-table
      v-if="!isMobile"
      ref="repairOrderListTableRef"
      @selection-change="handleSelectionChange"
      highlight-current-row
      :data="repairOrderList"
      :key="params.status == 5"
      style="width: 100%"
    >
      <el-table-column v-if="params.status >= 5" type="selection" width="55">
      </el-table-column>
      <el-table-column
        prop="orderSn"
        label="订单编号"
        show-overflow-tooltip
        width="170"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="text" @click="goToOrderDesc(row)">{{
            row.orderSn
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="紧急程度"
        show-overflow-tooltip
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.degreeName ? row.degreeName : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        label="超时状态"
        show-overflow-tooltip
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <div :style="{ color: row.timeoutFlag ? 'red' : '' }">
            {{
              row.timeoutFlag == "2001"
                ? "指派超时"
                : row.timeoutFlag == "2101"
                ? "接单超时"
                : row.timeoutFlag == "2201"
                ? "打卡超时"
                : row.timeoutFlag == "2301"
                ? "服务中超时"
                : row.timeoutFlag == "3001"
                ? "派发->接单超时 "
                : "/"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="simpleDesc"
        label="故障描述"
        show-overflow-tooltip
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        label="工单类型"
        show-overflow-tooltip
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          {{
            row.orderType === 1 ? "散单" : row.orderType === 2 ? "年保" : "年卡"
          }}
        </template>
      </el-table-column>
      <el-table-column label="标签" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          <div v-if="row.label != null">
            <div v-for="item in lablelList" :key="item.value">
              <el-tag v-if="row.label == item.value" :type="item.type">{{
                item.value
              }}</el-tag>
            </div>
          </div>
          <el-tag v-else> 普通 </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="enterpriseName"
        label="企业名称"
        show-overflow-tooltip
        width="230"
        align="center"
      ></el-table-column>
      <el-table-column
        label="备注"
        show-overflow-tooltip
        width="180px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.remarks ? row.remarks : "/" }}
        </template>
      </el-table-column>
      <el-table-column label="结算类型" show-overflow-tooltip align="center">
        <template slot-scope="{ row }">
          {{ row.settlementType == 2 ? "月结" : "现结" }}
        </template>
      </el-table-column>
      <el-table-column
        label="机台码"
        show-overflow-tooltip
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.no ? row.no : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        label="设备编号"
        show-overflow-tooltip
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.enterpriseDeviceNo ? row.enterpriseDeviceNo : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        label="设备位置"
        show-overflow-tooltip
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          {{
            row.enterpriseDevicePosition ? row.enterpriseDevicePosition : "/"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="devicePlace"
        label="设备产地"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="deviceTypeName"
        label="设备类型"
        show-overflow-tooltip
        width="130"
        align="center"
      ></el-table-column>
      <el-table-column
        label="设备型号"
        show-overflow-tooltip
        width="130"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.deviceModel ? row.deviceModel : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deviceBrand"
        label="设备品牌"
        show-overflow-tooltip
        width="90"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="deviceSystemName"
        label="设备系统"
        show-overflow-tooltip
        width="140"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="serviceTime"
        label="服务时间"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactsPeople"
        label="联系人"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="contactsPhone"
        label="联系电话"
        show-overflow-tooltip
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="masterRealName"
        label="师傅名称"
        show-overflow-tooltip
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.masterRealName ? row.masterRealName : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        label="师傅联系电话"
        show-overflow-tooltip
        width="160"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.masterPhone ? row.masterPhone : "/" }}
        </template>
      </el-table-column>
      <el-table-column
        label="业务员"
        show-overflow-tooltip
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.salesmanName && row.salesmanName != '/'">
            {{ row.salesmanName }}
          </div>
          <el-button
            v-if="!row.salesmanName || row.salesmanName == '/'"
            type="text"
            @click="openBindSalesmanDialog(row.orderSn)"
            >未绑定</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatusName"
        label="状态"
        show-overflow-tooltip
        width="90"
        fixed="right"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="120"
        show-overflow-tooltip
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template slot-scope="{ row }">
          <div class="settings" v-if="row.orderSn">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="color: #409eff">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><el-button
                    type="text"
                    v-if="row.orderType == 1"
                    @click="openConvertToInsurance(row.orderSn)"
                    >转类型</el-button
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><el-button type="text" @click="openRemarksDialog(row)"
                    >备注</el-button
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><el-button type="text" @click="copyOrder(row)"
                    >复制</el-button
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><el-button
                    v-if="row.orderType == 1"
                    type="text"
                    @click="setOrderTag(row)"
                    >设置</el-button
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="settings" v-else>
            <el-button
              type="text"
              style="font-size: 14px; margin-right: 10px; font-weight: 400"
              plain
              @click="deleteRepairOrder(row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-else class="mobile-list-container">
      <div v-if="repairOrderList.length === 0" class="no-data">暂无数据</div>

      <el-checkbox-group
        v-model="mobileSelectedRows"
        @change="handleMobileSelectionChange"
      >
        <div
          class="mobile-card"
          v-for="(row, index) in repairOrderList"
          :key="row.orderSn || index"
        >
          <div class="card-header">
            <div class="header-left">
              <el-checkbox
                v-if="params.status >= 5"
                :label="row"
                class="mobile-checkbox"
              >
                <span></span>
              </el-checkbox>
              <el-button
                type="text"
                class="order-sn-btn"
                @click="goToOrderDesc(row)"
              >
                {{ row.orderSn || "无编号" }}
              </el-button>
            </div>
            <div class="header-right">
              <el-tag size="small" effect="plain">{{
                row.orderStatusName
              }}</el-tag>
            </div>
          </div>

          <div class="card-body">
            <div class="info-row full-width">
              <span class="label">企业:</span>
              <span class="value">{{ row.enterpriseName }}</span>
            </div>
            <div class="info-row full-width">
              <span class="label">地址:</span>
              <span class="value">{{ row.address || "/" }}</span>
            </div>
            <div class="info-row full-width">
              <span class="label">故障:</span>
              <span class="value fault-desc">{{ row.simpleDesc }}</span>
            </div>
            <div class="info-row">
              <span class="label">师傅:</span>
              <span class="value">{{ row.masterRealName || "/" }}</span>
            </div>
            <div class="info-row">
              <span class="label">类型:</span>
              <span class="value">{{
                row.orderType === 1
                  ? "散单"
                  : row.orderType === 2
                  ? "年保"
                  : "年卡"
              }}</span>
            </div>

            <div class="info-row">
              <span class="label">设类:</span>
              <span class="value">{{ row.deviceTypeName || "/" }}</span>
            </div>
            <div class="info-row">
              <span class="label">系统:</span>
              <span class="value">{{ row.deviceSystemName || "/" }}</span>
            </div>

            <div class="expand-toggle" @click="toggleExpand(row)">
              <span style="color: #409eff; font-size: 13px">
                {{ row.isExpanded ? "收起详情" : "展开更多" }}
                <i
                  :class="
                    row.isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                  "
                ></i>
              </span>
            </div>

            <div class="expand-content" v-show="row.isExpanded">
              <div class="info-row">
                <span class="label">联系人:</span>
                <span class="value">{{ row.contactsPeople }}</span>
              </div>
              <div class="info-row">
                <span class="label">电话:</span>
                <span class="value">{{ row.contactsPhone }}</span>
              </div>
              <div class="info-row">
                <span class="label">结算:</span>
                <span class="value">{{
                  row.settlementType == 2 ? "月结" : "现结"
                }}</span>
              </div>
              <div class="info-row">
                <span class="label">超时:</span>
                <span
                  class="value"
                  :style="{ color: row.timeoutFlag ? 'red' : '' }"
                >
                  {{
                    row.timeoutFlag == "2001"
                      ? "指派超时"
                      : row.timeoutFlag == "2101"
                      ? "接单超时"
                      : row.timeoutFlag == "2201"
                      ? "打卡超时"
                      : row.timeoutFlag == "2301"
                      ? "服务中超时"
                      : row.timeoutFlag == "3001"
                      ? "派发超时"
                      : "/"
                  }}
                </span>
              </div>
              <div class="info-row full-width">
                <span class="label">备注:</span>
                <span class="value">{{ row.remarks || "/" }}</span>
              </div>
            </div>
          </div>
          <!-- <div class="card-footer"></div> -->
        </div>
      </el-checkbox-group>
    </div>

    <el-dialog
      title="绑定业务员"
      :width="dialogWidth"
      :visible="bindSalesmanDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeBindSalesmanDialog"
      center
    >
      <el-select
        v-model="bindSalesmanParams.salesmanId"
        filterable
        remote
        placeholder="请输入业务员名字"
        :remote-method="searchSalesman"
        style="width: 100%"
      >
        <el-option
          v-for="item in salesmanOptions"
          :key="item.id"
          :label="item.realName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBindSalesmanDialog">取 消</el-button>
        <el-button type="primary" @click="bindSalesman">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="散单转类型"
      :width="dialogWidth"
      :visible="openConvertToInsuranceShow"
      :before-close="closeConvertToInsurance"
      center
    >
      <el-form label-width="70px">
        <el-form-item label="类型选择">
          <el-radio-group v-model="convertToInsuranceparams.type">
            <el-radio :label="2">转年保</el-radio>
            <el-radio :label="3">转年卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input
            :rows="4"
            placeholder="请输入设备编号"
            v-model="convertToInsuranceparams.no"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConvertToInsurance">取 消</el-button>
        <el-button type="primary" @click="convertToInsurance">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="备注"
      :width="dialogWidth"
      :before-close="closeRemarksDialog"
      :visible="remarksDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="auditDialog">
        <el-form label-width="80px">
          <el-form-item label="标签:" v-if="orderTag && orderTag.length > 0">
            <el-button
              :type="judgeTagSelected(item) ? 'primary' : ''"
              @click="addTag(item)"
              size="small"
              v-for="item in orderTag"
              :key="item"
              style="margin-right: 5px; margin-bottom: 5px"
              >{{ item }}</el-button
            >
          </el-form-item>
          <el-form-item label="自定义:">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="handleRepairRemarksParamsCopy.remark"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:" v-if="orderRemark">
            {{ orderRemark }}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRemarksDialog">取 消</el-button>
        <el-button type="primary" @click="handleRepairRemarks">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择标签"
      :width="dialogWidth"
      :visible="setOrderTagDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeSetOrderTagDialog"
      center
    >
      <el-radio-group v-model="handleOrderLabelParams.label">
        <el-radio
          v-for="item in lablelList"
          :key="item.value"
          :label="item.value"
          style="display: block; margin-bottom: 10px"
          ><el-tag :type="item.type">{{ item.value }}</el-tag></el-radio
        >
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSetOrderTagDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderLabel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { querySalesmanList } from "@/api/user";
import {
  queryRepairOrderList,
  bindSalesman,
  convertToInsurance,
  handleRepairRemarks,
  copyOrder,
  handleOrderLabel,
  deleteRepairOrder,
} from "@/api/order";
import { getSysLabel } from "@/api/system.js";
export default {
  name: "RepairOrderListTable",
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // === 移动端适配新增数据 ===
      isMobile: false,
      mobileSelectedRows: [], // 移动端选中的行
      // =======================

      repairOrderList: [],
      bindSalesmanDialogVisible: false,
      bindSalesmanParams: {
        salesmanId: null,
        orderSn: null,
      },
      salesmanOptions: [],
      openConvertToInsuranceShow: false,
      convertToInsuranceparams: {
        orderSn: null,
        no: null,
        type: null,
      },
      remarksDialogVisible: false,
      handleRepairRemarksParamsCopy: {
        labelList: [],
        remark: null,
      },
      chooseOrderSn: null,
      orderTag: [],
      setOrderTagDialogVisible: false,
      handleOrderLabelParams: {
        label: null,
        orderSn: null,
      },
      lablelList: [
        {
          value: "普通",
          type: null,
        },
        {
          value: "199",
          type: "success",
        },
        {
          value: "299",
          type: "warning",
        },
      ],
    };
  },
  computed: {
    // 动态计算弹窗宽度
    dialogWidth() {
      return this.isMobile ? "90%" : "30%";
    },
    orderRemark() {
      const { labelList, remark } = this.handleRepairRemarksParamsCopy;
      const parts = [...labelList];
      if (remark) {
        parts.push(remark);
      }
      return parts.join(";");
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    // 新增切换展开方法
    toggleExpand(row) {
      row.isExpanded = !row.isExpanded;
      // 如果是用 Vue 2 且发现视图没更新，请使用：this.$set(row, 'isExpanded', !row.isExpanded)
    },
    // === 移动端适配新增方法 ===
    checkMobile() {
      const width = window.innerWidth;
      // 768px 是常规平板竖屏和手机的分界线
      this.isMobile = width < 768;
    },
    // 移动端多选触发
    handleMobileSelectionChange(val) {
      // 模拟 el-table 的 selection-change 事件
      this.$emit("change-tableSelection", val);
    },
    // =======================

    async deleteRepairOrder(row) {
      const confirmRes = await this.$confirm(`您确定要该订单吗？`, "删除订单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (confirmRes == "confirm") {
        const res = await deleteRepairOrder(row.id);
        if (res.code == "000") {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          // 修正：调用的是 queryRepairOrderList
          this.queryRepairOrderList();
        }
      }
    },

    cleanTableChoose() {
      if (this.$refs.repairOrderListTableRef) {
        this.$refs.repairOrderListTableRef.clearSelection();
      }
      // 清空移动端选择
      this.mobileSelectedRows = [];
    },

    handleSelectionChange(val) {
      this.$emit("change-tableSelection", val);
    },

    async handleOrderLabel() {
      if (!this.handleOrderLabelParams.label) {
        this.$message({
          message: "请填写标签内容",
          type: "warning",
        });
        return;
      }
      if (this.handleOrderLabelParams.label == "普通") {
        this.handleOrderLabelParams.label = "";
      }
      const res = await handleOrderLabel(this.handleOrderLabelParams);
      if (res.code == "000") {
        this.$message({
          message: res.message,
          type: "success",
        });
        await this.queryRepairOrderList();
        this.closeSetOrderTagDialog();
      }
    },
    closeSetOrderTagDialog() {
      this.handleOrderLabelParams = {
        label: null,
        orderSn: null,
      };
      this.setOrderTagDialogVisible = false;
    },
    setOrderTag(row) {
      this.handleOrderLabelParams.orderSn = row.orderSn;
      if (row.label) {
        this.handleOrderLabelParams.label = row.label;
      } else {
        this.handleOrderLabelParams.label = "普通";
      }
      this.setOrderTagDialogVisible = true;
    },

    async copyOrder(row) {
      const confirm = await this.$confirm(
        `您是否根据【${row.orderSn}】复制一个新的订单号?`,
        "复制订单",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (confirm == "confirm") {
        const res = await copyOrder(row.orderSn);
        if (res.code == "000") {
          this.$message({
            message: "复制成功！",
            type: "success",
          });
          this.queryRepairOrderList();
        }
      }
    },

    addTag(tag) {
      const list = this.handleRepairRemarksParamsCopy.labelList;
      const index = list.indexOf(tag);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(tag);
      }
    },
    async getSysLabel() {
      const res = await getSysLabel("orderRemarkTag");
      if (res.code == "000") {
        if (res.data) {
          this.orderTag = res.data.split(",");
        }
      }
    },
    judgeTagSelected(tag) {
      return this.handleRepairRemarksParamsCopy.labelList.includes(tag);
    },
    async handleRepairRemarks() {
      let params = {
        orderSn: this.chooseOrderSn,
        remarks: this.orderRemark,
      };
      const res = await handleRepairRemarks(params);
      if (res.code == "000") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closeRemarksDialog();
        this.queryRepairOrderList();
      }
    },
    closeRemarksDialog() {
      this.handleRepairRemarksParamsCopy = {
        labelList: [],
        remark: null,
      };
      this.chooseOrderSn = null;
      this.remarksDialogVisible = false;
    },
    openRemarksDialog(row) {
      if (row.remarks) {
        let arr = row.remarks.split(";");
        arr.forEach((item) => {
          if (this.orderTag.includes(item)) {
            this.handleRepairRemarksParamsCopy.labelList.push(item);
          } else {
            this.handleRepairRemarksParamsCopy.remark = item;
          }
        });
      }
      this.chooseOrderSn = row.orderSn;
      this.remarksDialogVisible = true;
    },

    async convertToInsurance() {
      const res = await convertToInsurance(this.convertToInsuranceparams);
      if (res.message === "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.closeConvertToInsurance();
        this.queryRepairOrderList();
      }
    },
    closeConvertToInsurance() {
      this.openConvertToInsuranceShow = false;
      this.convertToInsuranceparams = {
        orderSn: null,
        no: null,
      };
    },
    openConvertToInsurance(orderSn) {
      this.convertToInsuranceparams.orderSn = orderSn;
      this.openConvertToInsuranceShow = true;
    },

    async bindSalesman() {
      const res = await bindSalesman(this.bindSalesmanParams);
      if (res.code == "000") {
        await this.queryRepairOrderList();
        this.closeBindSalesmanDialog();
      }
    },
    async searchSalesman(e) {
      const res = await querySalesmanList({
        pageNo: 1,
        pageSize: 100,
        realName: e,
        recommendName: null,
      });
      if (res.code == "000") {
        this.salesmanOptions = res.data.records;
      }
    },
    closeBindSalesmanDialog() {
      this.bindSalesmanParams.salesmanId = null;
      this.bindSalesmanParams.orderSn = null;
      this.salesmanOptions = [];
      this.bindSalesmanDialogVisible = false;
    },
    openBindSalesmanDialog(orderSn) {
      this.bindSalesmanParams.orderSn = orderSn;
      this.bindSalesmanDialogVisible = true;
    },

    goToOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
      window.open(routeData.href, "_blank");
    },
    async queryRepairOrderList() {
      const res = await queryRepairOrderList(this.params);
      if (res.code == "000") {
        // 遍历数据，添加 isExpanded 标识
        this.repairOrderList = res.data.records.map((item) => ({
          ...item,
          isExpanded: false,
        }));
        this.$emit("change-paginationTotal", res.data.total);
      }
    },
  },
  created() {
    this.queryRepairOrderList();
    this.getSysLabel();
  },
};
</script>

<style scoped lang="scss">
/* 移动端卡片样式 */
.mobile-list-container {
  padding: 10px;
  background: #f5f7fa;
}

.mobile-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

/* 头部: 编号 + 状态 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-checkbox {
  margin-right: 10px;
}

.order-sn-btn {
  font-weight: bold;
  font-size: 16px;
  padding: 0;
}

/* 内容区 Grid */
.card-body {
  display: flex;
  flex-wrap: wrap;
}

.info-row {
  width: 50%; /* 默认一行两个 */
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  display: flex;
}

.info-row.full-width {
  width: 100%; /* 独占一行 */
}

.label {
  color: #909399;
  margin-right: 6px;
  min-width: 40px;
}

.value {
  color: #303133;
  word-break: break-all;
}

.fault-desc {
  font-weight: 500;
}

/* 底部操作 */
.card-footer {
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.salesman-text {
  font-size: 13px;
  color: #909399;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #909399;
}

/* 移动端适配 CSS */
@media screen and (max-width: 768px) {
  /* 强制覆盖弹窗的可能的全局样式 */
  ::v-deep .el-dialog {
    margin-top: 15vh !important;
    width: 90% !important;
  }
}
.expand-toggle {
  width: 100%;
  text-align: center;
  padding: 8px 0;
  border-top: 1px dashed #ebeef5;
  margin-top: 5px;
  cursor: pointer;
}

.expand-content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background-color: #fafafa;
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  transition: all 0.3s;
}

/* 调整原有 info-row 在移动端的字体 */
.info-row {
  font-size: 13px;
  line-height: 1.6;
}
</style>