<template>
  <div class="repairOrderListTable">
    <el-table
      @selection-change="handleSelectionChange"
      highlight-current-row
      :data="repairOrderList"
      :key="params.status == 5"
    >
      <el-table-column v-if="params.status == 5" type="selection" width="55">
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
          <div v-for="item in lablelList" :key="item.value">
            <el-tag v-if="row.label == item.value" :type="item.type">{{
              item.value
            }}</el-tag>
          </div>
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
                其他<i class="el-icon-arrow-down el-icon--right"></i>
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

    <!-- 绑定业务员 -->
    <el-dialog
      title="绑定业务员"
      width="25%"
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

    <!-- 转年保框 -->
    <el-dialog
      title="散单转类型"
      width="30%"
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

    <!-- 备注 ＋ 标签 -->
    <el-dialog
      title="备注"
      width="30%"
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

    <!-- 设置标签 -->
    <el-dialog
      title="选择标签"
      width="35%"
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
    // 查询订单需要的参数
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      repairOrderList: [],
      // 【绑定业务员】
      bindSalesmanDialogVisible: false,
      bindSalesmanParams: {
        salesmanId: null,
        orderSn: null,
      },
      salesmanOptions: [],

      // 【转类型】
      openConvertToInsuranceShow: false,
      convertToInsuranceparams: {
        orderSn: null,
        no: null,
        type: null,
      },

      // 【备注】
      remarksDialogVisible: false,
      handleRepairRemarksParamsCopy: {
        labelList: [],
        remark: null,
      },
      chooseOrderSn: null,
      orderTag: [],

      // 【设置199 299】
      setOrderTagDialogVisible: false,
      handleOrderLabelParams: {
        label: null,
        orderSn: null,
      },
      lablelList: [
        {
          value: "普通",
          type: "",
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
    orderRemark() {
      const { labelList, remark } = this.handleRepairRemarksParamsCopy;
      const parts = [...labelList];
      if (remark) {
        parts.push(remark);
      }
      return parts.join(";");
    },
  },
  methods: {
    // 删除订单
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
          this._queryRepairOrderList();
        }
      }
    },

    // 表格多选切换选择
    handleSelectionChange(val) {
      this.$emit("change-tableSelection", val);
    },

    // 【设置199 299】
    // 确定设置标签
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
    // 关闭订单标签框
    closeSetOrderTagDialog() {
      this.handleOrderLabelParams = {
        label: null,
        orderSn: null,
      };
      this.setOrderTagDialogVisible = false;
    },
    // 设置订单标签 199套餐
    setOrderTag(row) {
      this.handleOrderLabelParams.orderSn = row.orderSn;
      if (row.label) {
        this.handleOrderLabelParams.label = row.label;
      } else {
        this.handleOrderLabelParams.label = "普通";
      }
      this.setOrderTagDialogVisible = true;
    },

    //  【复制订单】
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

    // 【备注】
    // 点击标签
    addTag(tag) {
      const list = this.handleRepairRemarksParamsCopy.labelList;
      const index = list.indexOf(tag);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(tag);
      }
    },
    // 获取企业标签
    async getSysLabel() {
      const res = await getSysLabel("orderRemarkTag");
      if (res.code == "000") {
        if (res.data) {
          this.orderTag = res.data.split(",");
        }
      }
    },
    // 判断是否被选中
    judgeTagSelected(tag) {
      return this.handleRepairRemarksParamsCopy.labelList.includes(tag);
    },
    // 确定企业备注
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
    // 关闭备注弹窗
    closeRemarksDialog() {
      this.handleRepairRemarksParamsCopy = {
        labelList: [],
        remark: null,
      };
      this.chooseOrderSn = null;
      this.remarksDialogVisible = false;
    },
    // 打开备注弹框
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

    // 【转类型】
    // 确认散单转类型
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
    // 关闭转类型框
    closeConvertToInsurance() {
      this.openConvertToInsuranceShow = false;
      this.convertToInsuranceparams = {
        orderSn: null,
        no: null,
      };
    },
    // 打开转类型框
    openConvertToInsurance(orderSn) {
      this.convertToInsuranceparams.orderSn = orderSn;
      this.openConvertToInsuranceShow = true;
    },

    // 【绑定业务员】
    // 绑定业务员
    async bindSalesman() {
      const res = await bindSalesman(this.bindSalesmanParams);
      if (res.code == "000") {
        await this.queryRepairOrderList();
        this.closeBindSalesmanDialog();
      }
    },
    // 搜索业务员
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
    // 关闭绑定业务员框
    closeBindSalesmanDialog() {
      this.bindSalesmanParams.salesmanId = null;
      this.bindSalesmanParams.orderSn = null;
      this.salesmanOptions = [];
      this.bindSalesmanDialogVisible = false;
    },
    // 打开绑定业务员框
    openBindSalesmanDialog(orderSn) {
      this.bindSalesmanParams.orderSn = orderSn;
      this.bindSalesmanDialogVisible = true;
    },

    // 跳转详情
    goToOrderDesc(row) {
      const routeData = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
      window.open(routeData.href, "_blank");
    },
    // 查询订单
    async queryRepairOrderList() {
      const res = await queryRepairOrderList(this.params);
      if (res.code == "000") {
        this.repairOrderList = res.data.records;
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

<style scoped>
</style>
