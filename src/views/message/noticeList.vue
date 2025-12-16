<template>
  <div class="messageList">
    <!-- 顶部 -->
    <div class="topControls">
      <div class="topControlsSearchInfo">
        <div class="topControlsSearchInfoItem">
          <div class="label">订单号</div>
          <div>
            <el-input
              v-model="queryOrderReminderListParams.relationOrderSn"
              placeholder="请输入订单号"
            ></el-input>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">状态</div>
          <div>
            <el-select
              v-model="queryOrderReminderListParams.status"
              placeholder="请选择状态"
            >
              <el-option label="未处理" :value="0"> </el-option>
              <el-option label="已处理" :value="1"> </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="topControlsBtn">
        <el-button type="primary" plain @click="queryOrderReminderList"
          >搜索</el-button
        >
        <el-button type="primary" plain @click="resetSearch">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-card style="padding: 20px">
      <el-table :data="orderReminderList" style="width: 100%">
        <el-table-column
          prop="createTime"
          width="180"
          label="创建时间"
          align="center"
        >
        </el-table-column>
        <el-table-column width="180" label="订单号" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="goToOrderDetails(row.relationOrderSn)"
              >{{ row.relationOrderSn }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="reminderTime"
          label="通知时间"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="content" label="内容" align="center">
        </el-table-column>
        <el-table-column width="100" label="状态" align="center">
          <template slot-scope="{ row }">
            <div :style="{ color: row.status == 0 ? '#f56c6c' : '' }">
              {{ row.statusName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.status == 0">
              <el-button type="text" @click="openExtensionTimeDialog(row)"
                >延后</el-button
              >
              <el-button
                type="text"
                @click="handleOrderReminder('处理', row.id)"
                >我已处理</el-button
              >
            </div>
            <div v-else>/</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelPagination">
        <el-pagination
          @current-change="changeListPage"
          :total="orderReminderListTotal"
          background
          layout="prev, pager, next"
          :page-size="queryOrderReminderListParams.pageSize"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="延后提醒时间"
      center
      :visible="extensionTimeDialogVisible"
      width="30%"
    >
      <el-form>
        <el-form-item label="提醒时间">
          <el-date-picker
            type="date"
            v-model="datePickerVal"
            :picker-options="pickerOptionsDate"
            placeholder="选择提醒日期"
            value-format="yyyy-MM-dd"
            style="margin-right: 10px"
          >
          </el-date-picker>
          <el-time-select
            v-model="timePickerVal"
            :picker-options="{
              start: '09:00',
              end: '18:00',
              step: '00:15',
            }"
            placeholder="选择提醒时间"
          >
          </el-time-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExtensionTimeDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderReminder('延长')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryOrderReminderList,
  handleOrderReminder,
} from "@/api/orderReminder";
export default {
  data() {
    return {
      queryOrderReminderListParams: {
        status: null,
        relationOrderSn: null,
        pageNo: 1,
        pageSize: 10,
      },
      orderReminderList: [],
      orderReminderListTotal: 0,

      handleOrderReminderParams: {
        handleType: null,
        id: null,
        newReminderTime: null,
      },

      extensionTimeDialogVisible: false,

      // 初始化提醒框
      pickerOptionsDate: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0);
        },
      },
      datePickerVal: null,
      timePickerVal: null,
      reminderTime: null,
    };
  },
  methods: {
    // 跳转订单详情
    goToOrderDetails(orderSn) {
      const targetRoute = this.$router.resolve({
        name: "maintenance_order_desc",
        query: { orderSn },
      });
      window.open(targetRoute.href, "_blank");
    },
    // 点击页数
    changeListPage(page) {
      this.queryOrderReminderListParams.pageNo = page;
      this.queryOrderReminderList();
    },
    // 重置搜索
    resetSearch() {
      this.queryOrderReminderListParams = {
        status: null,
        relationOrderSn: null,
        pageNo: 1,
        pageSize: 10,
      };
      this.queryOrderReminderList();
    },
    /**
     *  判断第一个参数的日期和第二个参数的时间 大于第三个时间
     * */
    isDateTimeNotLess(dateStr, timeStr, datetimeStr) {
      const combined = `${dateStr} ${timeStr}`;
      const fullCombined =
        combined.includes(":") && combined.split(":").length === 2
          ? `${combined}:00`
          : combined;
      const dt1 = new Date(fullCombined);
      const dt2 = new Date(datetimeStr);
      if (isNaN(dt1) || isNaN(dt2)) {
        throw new Error("Invalid date/time string provided");
      }
      return dt1.getTime() >= dt2.getTime();
    },
    // 关闭延后框
    closeExtensionTimeDialog() {
      this.handleOrderReminderParams = {
        handleType: null,
        id: null,
        newReminderTime: null,
      };
      this.datePickerVal = null;
      this.timePickerVal = null;
      this.reminderTime = null;
      this.extensionTimeDialogVisible = false;
    },
    // 打开延后框
    openExtensionTimeDialog(row) {
      this.handleOrderReminderParams.id = row.id;
      this.handleOrderReminderParams.handleType = 2;
      this.reminderTime = row.reminderTime;
      if (row.reminderTime) {
        const [datePart, timePart] = row.reminderTime.split(" ");
        this.datePickerVal = datePart;
        this.timePickerVal = timePart.substring(0, 5);
      }
      this.extensionTimeDialogVisible = true;
    },
    // 处理订单提醒
    async handleOrderReminder(type, id) {
      if (type == "处理") {
        this.$confirm("您确定要将该提醒标记为已处理?", "处理提醒", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          this.handleOrderReminderParams.id = id;
          this.handleOrderReminderParams.handleType = 1;
          const res = await handleOrderReminder(this.handleOrderReminderParams);
          if (res.code == "000") {
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.queryOrderReminderList();
            this.closeExtensionTimeDialog();
          }
        });
      } else {
        let result = this.isDateTimeNotLess(
          this.datePickerVal,
          this.timePickerVal,
          this.reminderTime
        );
        if (!result) {
          this.$message({
            message: "延长的时间不能小于之前的选的时间",
            type: "warning",
          });
          return;
        }
        const [h, m] = this.timePickerVal.split(":").map(Number);
        let newReminderTime = `${this.datePickerVal} ${h
          .toString()
          .padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
        this.handleOrderReminderParams.newReminderTime = newReminderTime;
        const res = await handleOrderReminder(this.handleOrderReminderParams);
        if (res.code == "000") {
          if (this.handleOrderReminderParams.id) {
            const key = "notif_shown_" + this.handleOrderReminderParams.id;
            localStorage.removeItem(key);
          }
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.queryOrderReminderList();
          this.closeExtensionTimeDialog();
        }
      }
    },
    // 查询订单提醒列表
    async queryOrderReminderList() {
      const res = await queryOrderReminderList(
        this.queryOrderReminderListParams
      );
      if (res.code == "000") {
        this.orderReminderList = res.data.records;
        this.orderReminderListTotal = res.data.total;
      }
    },
  },
  created() {
    this.queryOrderReminderList();
  },
};
</script>

<style scoped lang="less">
.messageList {
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
</style>
