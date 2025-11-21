<template>
  <div class="largeScreenData">
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <span> 咨询数据</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          plain
          @click="openSetChannelOrderData"
          >修改</el-button
        >
      </div>
      <el-descriptions title="">
        <el-descriptions-item label="本月总咨询客户">{{
          channelOrderData.totalCustomerNumByMonth
        }}</el-descriptions-item>
        <el-descriptions-item label="本月已报价">{{
          channelOrderData.quotationCustomerNumByMonth
        }}</el-descriptions-item>
        <el-descriptions-item label="本月已下单">{{
          channelOrderData.createOrderCustomerNumByMonth
        }}</el-descriptions-item>
        <el-descriptions-item label="今日咨询总订单">{{
          channelOrderData.totalCustomerNumByDay
        }}</el-descriptions-item>
        <el-descriptions-item label="今日沟通中">{{
          channelOrderData.communicateCustomerNumByDay
        }}</el-descriptions-item>
        <el-descriptions-item label="今日超时回复">{{
          channelOrderData.overdueReplyCustomerNumByDay
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>
          {{
            masterDepartmentOptions[queryMasterPerformanceListParams.type - 1]
              .label
          }}目标
          <span style="color: red"
            >({{ realityNumTotal }}/{{ targetNumTotal }})</span
          ></span
        >
        <div style="color: #999; font-size: 12px; float: right; padding: 3px 0">
          数据六小时更新一次,有误请联系强哥
        </div>
      </div>
      <!-- 顶部 -->
      <div class="topControls">
        <div class="topControlsSearchInfo">
          <div class="topControlsSearchInfoItem">
            <div style="margin-right: 20px">
              <el-select
                v-model="queryMasterPerformanceListParams.type"
                placeholder="请选择师傅部门"
                @change="queryMasterPerformanceList"
              >
                <el-option
                  v-for="item in masterDepartmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <el-select
                placeholder="请选择月份"
                v-model="queryMasterPerformanceListParams.targetMonth"
                @change="queryMasterPerformanceList"
              >
                <el-option
                  v-for="item in targetMonthList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="topControlsBtn">
          <el-button
            type="primary"
            plain
            @click="openAddMonthlyTarget"
            v-if="isOperationBtn"
            >新增月度目标</el-button
          >
          <el-button type="primary" plain @click="openSetMembers"
            >设置成员组别</el-button
          >
        </div>
      </div>
      <el-table
        border
        :data="masterInsuranceList"
        style="width: 100%"
        height="580"
      >
        <el-table-column prop="realName" label="工程师名称" align="center">
        </el-table-column>
        <el-table-column label="部门" align="center">
          <template slot-scope="{ row }">
            {{ masterDepartmentOptions[row.type - 1].label }}
          </template>
        </el-table-column>
        <el-table-column label="目标" align="center">
          <template slot-scope="{ row }">
            <div>{{ row.targetNum ? row.targetNum : 0 }}单</div>
          </template>
        </el-table-column>
        <el-table-column label="实际完成" align="center">
          <template slot-scope="{ row }">
            {{ row.realityNum ? row.realityNum : 0 }}单
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" v-if="isOperationBtn">
          <template slot-scope="{ row }">
            <el-button type="text" @click="editMasterTargetNum(row)"
              >修改</el-button
            >
            <el-button
              type="text"
              @click="deleteMasterPerformance(row.id, row.realName)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <!-- <div class="tabelPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="masterInsuranceListTotal"
          :page-size="10"
        >
        </el-pagination>
      </div> -->
    </el-card>

    <!-- 设置成员组别 -->
    <el-dialog
      title="设置成员组别"
      width="40%"
      :visible="setMembersGroupVisible"
      :before-close="closeSetMembers"
      :close-on-click-modal="false"
    >
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入师傅名称"
        v-model="chooseMasterList"
        :data="masterList"
        :titles="[
          '全部师傅',
          masterDepartmentOptions[queryMasterPerformanceListParams.type - 1]
            .label,
        ]"
      >
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSetMembers">取 消</el-button>
        <el-button type="primary" @click="handleMasterGroup">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增月度目标框 -->
    <el-dialog
      title="新增月度目标框"
      width="40%"
      :visible="addMonthlyTargetVisible"
      :close-on-click-modal="false"
      :before-close="closeAddMonthlyTarget"
    >
      <el-form
        label-width="120px"
        ref="editMasterPerformanceRef"
        :model="editMasterPerformanceParams"
        :rules="editMasterPerformanceRules"
      >
        <el-form-item label="部门成员:" prop="uidsArr">
          <el-checkbox v-model="masterSelectAll" @change="changeMasterSelectAll"
            >全选</el-checkbox
          >
          <el-checkbox-group
            @change="handleCheckedCitiesChange"
            v-model="editMasterPerformanceParams.uidsArr"
          >
            <el-checkbox
              v-for="item in departmentMasterList"
              :key="item.uid"
              :label="item.uid"
              >{{ item.realName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="目标单量:" prop="targetNum">
          <el-input
            v-model.number="editMasterPerformanceParams.targetNum"
            type="number"
            :min="0"
            placeholder="请输入对师傅的目标单量"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddMonthlyTarget">取 消</el-button>
        <el-button type="primary" @click="editMasterPerformance"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 设置渠道订单数据弹框 -->
    <el-dialog
      title="设置渠道订单数据"
      width="45%"
      :visible="setChannelOrderDataVisible"
      :close-on-click-modal="false"
      :before-close="closeSetChannelOrderData"
    >
      <el-form
        label-width="140px"
        :label-position="'left'"
        ref="handleChannelOrderDataRef"
        :model="handleChannelOrderDataParams"
        :rules="handleChannelOrderDataRules"
      >
        <el-form-item label="本月总咨询客户:" prop="totalCustomerNumByMonth">
          <el-input
            v-model.number="
              handleChannelOrderDataParams.totalCustomerNumByMonth
            "
            type="number"
            :min="0"
            placeholder="请输入本月总咨询客户"
          ></el-input>
        </el-form-item>
        <el-form-item label="本月已报价:" prop="quotationCustomerNumByMonth">
          <el-input
            v-model.number="
              handleChannelOrderDataParams.quotationCustomerNumByMonth
            "
            type="number"
            :min="0"
            placeholder="请输入本月已报价"
          ></el-input>
        </el-form-item>
        <el-form-item label="本月已下单:" prop="createOrderCustomerNumByMonth">
          <el-input
            v-model.number="
              handleChannelOrderDataParams.createOrderCustomerNumByMonth
            "
            type="number"
            :min="0"
            placeholder="请输入本月已下单"
          ></el-input>
        </el-form-item>
        <el-form-item label="今日咨询总订单:" prop="totalCustomerNumByDay">
          <el-input
            v-model.number="handleChannelOrderDataParams.totalCustomerNumByDay"
            type="number"
            :min="0"
            placeholder="请输入今日咨询总订单"
          ></el-input>
        </el-form-item>
        <el-form-item label="今日沟通中:" prop="communicateCustomerNumByDay">
          <el-input
            v-model.number="
              handleChannelOrderDataParams.communicateCustomerNumByDay
            "
            type="number"
            :min="0"
            placeholder="请输入今日沟通中"
          ></el-input>
        </el-form-item>
        <el-form-item label="今日超时回复:" prop="overdueReplyCustomerNumByDay">
          <el-input
            v-model.number="
              handleChannelOrderDataParams.overdueReplyCustomerNumByDay
            "
            type="number"
            :min="0"
            placeholder="请输入今日超时回复"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSetChannelOrderData">取 消</el-button>
        <el-button type="primary" @click="handleChannelOrderData"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryMasterName } from "@/api/order";
import {
  handleMasterGroup,
  queryMasterByGroupId,
  editMasterPerformance,
  queryMasterPerformanceList,
  deleteMasterPerformance,
  getChannelOrderData,
  handleChannelOrderData,
} from "@/api/other";
export default {
  name: "LargeScreenData",
  data() {
    return {
      targetMonthList: [],
      masterDepartmentOptions: [
        { value: 1, label: "加工中心组" },
        { value: 2, label: "数控车床组" },
        { value: 3, label: "外协组" },
      ],
      queryMasterPerformanceListParams: {
        type: 1,
        targetMonth: "202509",
      },
      masterInsuranceList: [],
      // masterInsuranceListTotal: 0,
      masterList: [],
      chooseMasterList: [],

      setMembersGroupVisible: false,
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },

      // 新增月度目标弹窗
      addMonthlyTargetVisible: false,
      departmentMasterList: [],
      editMasterPerformanceParams: {
        uidsArr: [],
        targetNum: null,
      },
      editMasterPerformanceRules: {
        uidsArr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个部门成员",
            trigger: "change",
          },
        ],
        targetNum: [
          { required: true, message: "请输入目标单量", trigger: "blur" },
        ],
      },
      masterSelectAll: false,
      isOperationBtn: false,

      // 渠道订单数据
      channelOrderData: {
        totalCustomerNumByDay: 0,
        totalCustomerNumByMonth: 0,
        quotationCustomerNumByMonth: 0,
        createOrderCustomerNumByMonth: 0,
        communicateCustomerNumByDay: 0,
        overdueReplyCustomerNumByDay: 0,
      },
      handleChannelOrderDataParams: {
        communicateCustomerNumByDay: null,
        createOrderCustomerNumByMonth: null,
        overdueReplyCustomerNumByDay: null,
        quotationCustomerNumByMonth: null,
        totalCustomerNumByDay: null,
        totalCustomerNumByMonth: null,
      },
      handleChannelOrderDataRules: {
        communicateCustomerNumByDay: [
          { required: true, message: "请输入今日沟通中", trigger: "blur" },
        ],
        createOrderCustomerNumByMonth: [
          { required: true, message: "请输入本月已下单", trigger: "blur" },
        ],
        overdueReplyCustomerNumByDay: [
          { required: true, message: "请输入超时回复", trigger: "blur" },
        ],
        quotationCustomerNumByMonth: [
          { required: true, message: "请输入本月已报价", trigger: "blur" },
        ],
        totalCustomerNumByDay: [
          { required: true, message: "请输入今日咨询总订单", trigger: "blur" },
        ],
        totalCustomerNumByMonth: [
          { required: true, message: "请输入本月咨询总订单", trigger: "blur" },
        ],
      },
      setChannelOrderDataVisible: false,
    };
  },
  created() {
    this.generateMonthArray();
    this.queryMasterName();
    this.queryMasterPerformanceList();
    this.getChannelOrderData();
  },
  computed: {
    targetNumTotal() {
      let total = 0;
      if (!this.masterInsuranceList) {
        this.masterInsuranceList = [];
      }
      this.masterInsuranceList.forEach((item) => {
        total += item.targetNum || 0;
      });
      return total;
    },
    realityNumTotal() {
      let total = 0;
      if (!this.masterInsuranceList) {
        this.masterInsuranceList = [];
      }
      this.masterInsuranceList.forEach((item) => {
        total += item.realityNum || 0;
      });
      return total;
    },
  },
  methods: {
    // 处理渠道订单数据
    async handleChannelOrderData() {
      await this.$refs["handleChannelOrderDataRef"].validate();
      const res = await handleChannelOrderData(
        this.handleChannelOrderDataParams
      );
      if (res.code === "000") {
        this.$message.success("设置成功");
        this.closeSetChannelOrderData();
        this.getChannelOrderData();
      } else {
        this.$message.error(res.msg || "设置失败");
      }
    },
    // 关闭设置渠道订单数据弹窗
    closeSetChannelOrderData() {
      this.$refs["handleChannelOrderDataRef"].resetFields();
      this.handleChannelOrderDataParams = {
        communicateCustomerNumByDay: null,
        createOrderCustomerNumByMonth: null,
        overdueReplyCustomerNumByDay: null,
        quotationCustomerNumByMonth: null,
        totalCustomerNumByDay: null,
        totalCustomerNumByMonth: null,
      };
      this.setChannelOrderDataVisible = false;
    },
    // 打开设置渠道订单数据弹窗
    openSetChannelOrderData() {
      this.handleChannelOrderDataParams = {
        communicateCustomerNumByDay:
          this.channelOrderData.communicateCustomerNumByDay,
        createOrderCustomerNumByMonth:
          this.channelOrderData.createOrderCustomerNumByMonth,
        overdueReplyCustomerNumByDay:
          this.channelOrderData.overdueReplyCustomerNumByDay,
        quotationCustomerNumByMonth:
          this.channelOrderData.quotationCustomerNumByMonth,
        totalCustomerNumByDay: this.channelOrderData.totalCustomerNumByDay,
        totalCustomerNumByMonth: this.channelOrderData.totalCustomerNumByMonth,
      };
      this.setChannelOrderDataVisible = true;
    },
    // 获取渠道订单数据
    async getChannelOrderData() {
      const res = await getChannelOrderData();
      if (res.code === "000") {
        this.channelOrderData = res.data;
      }
    },
    // 修改师傅目标单量
    editMasterTargetNum(item) {
      this.$prompt("请输入新的目标单量", `修改${item.realName}师傅目标单量`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d+$/,
        inputErrorMessage: "目标单量必须为数字",
      }).then(async ({ value }) => {
        let newParams = {
          targetNum: Number(value),
          id: item.id,
          targetMonth: item.targetMonth,
        };
        const res = await editMasterPerformance(newParams);
        if (res.code == "000") {
          this.$message.success("设置成功");
          await this.queryMasterPerformanceList();
        } else {
          this.$message.error(res.msg || "设置失败");
        }
      });
    },
    // 判断输入的月份是否大于等于当前月份
    isMonthGreaterOrEqual(input) {
      // 获取当前年月
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 月份从0开始，所以+1
      // 解析输入值
      const inputStr = String(input);
      const year = parseInt(inputStr.slice(0, 4), 10);
      const month = parseInt(inputStr.slice(4, 6), 10);
      // 比较逻辑
      if (year > currentYear) {
        this.isOperationBtn = true;
      } else if (year === currentYear && month >= currentMonth) {
        this.isOperationBtn = true;
      } else {
        this.isOperationBtn = false;
      }
    },
    // 处理全选状态
    handleCheckedCitiesChange() {
      this.masterSelectAll =
        this.editMasterPerformanceParams.uidsArr.length ===
        this.departmentMasterList.length;
    },
    // 删除师傅绩效
    deleteMasterPerformance(id, realName) {
      this.$confirm("您确定要删除" + realName + "的绩效目标吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteMasterPerformance(id);
        if (res.code == "000") {
          this.$message.success("删除成功");
          await this.queryMasterPerformanceList();
        }
      });
    },
    // 全选或取消全选师傅
    changeMasterSelectAll(val) {
      if (val) {
        this.editMasterPerformanceParams.uidsArr =
          this.departmentMasterList.map((item) => item.uid);
      } else {
        this.editMasterPerformanceParams.uidsArr = [];
      }
    },
    // 查询师傅绩效列表
    async queryMasterPerformanceList() {
      await this.isMonthGreaterOrEqual(
        this.queryMasterPerformanceListParams.targetMonth
      );
      const res = await queryMasterPerformanceList(
        this.queryMasterPerformanceListParams
      );
      if (res.code == "000") {
        this.masterInsuranceList = res.data;
      }
    },
    // 设置师傅绩效
    editMasterPerformance() {
      this.$refs["editMasterPerformanceRef"].validate(async (valid) => {
        if (valid) {
          this.editMasterPerformanceParams.uids =
            this.editMasterPerformanceParams.uidsArr.join(",");
          this.editMasterPerformanceParams.type =
            this.queryMasterPerformanceListParams.type;
          this.editMasterPerformanceParams.targetMonth =
            this.queryMasterPerformanceListParams.targetMonth;
          const res = await editMasterPerformance(
            this.editMasterPerformanceParams
          );

          if (res.code == "000") {
            this.$message.success("设置成功");
            await this.queryMasterPerformanceList();
            this.closeAddMonthlyTarget();
          } else {
            this.$message.error(res.msg || "设置失败");
          }
        } else {
          return false;
        }
      });
    },
    // 关闭新增月度目标弹窗
    async closeAddMonthlyTarget() {
      this.addMonthlyTargetVisible = false;
      this.masterSelectAll = false;
      this.$refs["editMasterPerformanceRef"].resetFields();
      this.editMasterPerformanceParams.uids = [];
      this.editMasterPerformanceParams.targetNum = null;
    },
    // 打开新增月度目标弹窗
    async openAddMonthlyTarget() {
      const res = await queryMasterByGroupId(
        this.queryMasterPerformanceListParams.type
      );
      if (res.code == "000") {
        this.departmentMasterList = res.data;
      }
      this.addMonthlyTargetVisible = true;
    },
    // 确定设置成员组别
    async handleMasterGroup() {
      let groupId = this.queryMasterPerformanceListParams.type;
      let uids = this.chooseMasterList.join(",");
      const res = await handleMasterGroup({ groupId, uids });
      if (res.code == "000") {
        this.$message.success("设置成功");
        this.closeSetMembers();
      } else {
        this.$message.error(res.msg || "设置失败");
      }
    },
    // 关闭设置成员组别弹窗
    closeSetMembers() {
      this.chooseMasterList = [];
      this.setMembersGroupVisible = false;
    },
    // 打开设置成员组别弹窗
    async openSetMembers() {
      const res = await queryMasterByGroupId(
        this.queryMasterPerformanceListParams.type
      );
      if (res.code == "000") {
        this.chooseMasterList = res.data.map((item) => item.uid);
      }
      this.setMembersGroupVisible = true;
    },
    // 获取所有师傅
    async queryMasterName() {
      const res = await queryMasterName("");
      if (res.code == "000") {
        const transformedArray = res.data.map((item) => ({
          label: item.realName,
          key: item.uid,
        }));
        this.masterList = transformedArray;
      }
    },
    // 获取月份数组
    generateMonthArray() {
      let startYear = 2025;
      let startMonth = 6;
      // 获取当前时间，并往前推2个月
      let now = new Date();
      if (now.getMonth() + 1 < 10) {
        this.queryMasterPerformanceListParams.targetMonth =
          now.getFullYear() + "0" + (now.getMonth() + 1);
      } else {
        this.queryMasterPerformanceListParams.targetMonth =
          now.getFullYear() + (now.getMonth() + 1).toString();
      }
      console.log(659, this.queryMasterPerformanceListParams.targetMonth);

      now.setMonth(now.getMonth() + 2); // 往前推2个月
      let endYear = now.getFullYear();
      let endMonth = now.getMonth() + 1; // getMonth() 返回 0~11，所以要 +1
      // 创建结果数组
      const months = [];
      let currentYear = startYear;
      let currentMonth = startMonth;
      while (true) {
        // 格式化 value 和 label
        const value = `${currentYear}${currentMonth
          .toString()
          .padStart(2, "0")}`;
        const label = `${currentYear}年${currentMonth}月`;
        months.push({ value, label });
        // 如果已经到达结束时间则退出循环
        if (currentYear === endYear && currentMonth === endMonth) break;
        // 下一个月
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }
      this.targetMonthList = months;
    },
  },
};
</script>

<style scoped lang="less">
.largeScreenData {
  padding: 20px;
  .topControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .topControlsSearchInfo {
      display: flex;
      align-items: center;
      .topControlsSearchInfoItem {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          font-weight: 700;
          font-size: 16px;
          color: #606266;
          margin-right: 20px;
        }
      }
    }
  }

  .tabelPagination {
    margin-top: 20px;
    text-align: center;
  }
}

.titleflex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85vw;
}
</style>