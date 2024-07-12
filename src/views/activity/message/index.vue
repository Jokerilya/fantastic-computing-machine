<template>
  <div class="content_box">
    <div style="display: flex; justify-content: space-between">
      <div class="topTool">
        <el-input
          v-model="queryRegisterInfoListParams.simpleContent"
          placeholder="输入详情描述"
          class="toolInput"
        >
        </el-input>
        <el-select
          v-model="queryRegisterInfoListParams.type"
          placeholder="请选择类型"
          class="toolInput"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="item"
            :label="item"
            :value="index + 1"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="queryTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="changeQueryTime"
        >
        </el-date-picker>
      </div>
      <div class="topTool">
        <el-button @click="searchBtn">搜索</el-button>
        <el-button @click="resetBtn">重置</el-button>
      </div>
    </div>

    <el-table border :data="dataList" class="list" style="min-height: auto">
      <el-table-column
        label="询问时间"
        prop="createTime"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column label="类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ typeList[scope.row.type - 1] }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="ID"
        width="100px"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="咨询人" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="详情描述"
        prop="simpleContent"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="备注"
        prop="feedback"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作人"
        prop="operationPeople"
        align="center"
        header-align="center"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="operationPeople"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div :style="{ color: row.completeFlag == 0 ? 'red' : '' }">
            {{ row.completeFlag == 0 ? "未完结" : "已完结" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.completeFlag == 1"
            type="text"
            @click="openFeedbackDialog(scope.row)"
            >备注</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 16px"></div>
    <div class="table-block" v-show="dataList.length > 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="currentChangeFn"
        :current-page.sync="queryRegisterInfoListParams.pageNo"
        :page-size="queryRegisterInfoListParams.pageSize"
        :page-sizes="[20, 30, 50, 100]"
        layout="total,sizes, prev, pager, next"
        :total="queryRegisterInfoListParamsTotal"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="处理产品咨询"
      :visible="feedbackdialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="closeFeedbackDialog"
    >
      <div>
        <el-form
          :model="handleRegisterInfoParams"
          :rules="handleRegisterInfoRules"
          ref="handleRegisterInfoRef"
        >
          <el-form-item label="备注:" prop="feedback">
            <el-input
              placeholder="请输入备注"
              v-model="handleRegisterInfoParams.feedback"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否完结该咨询:" prop="completeFlag">
            <el-radio-group v-model="handleRegisterInfoParams.completeFlag">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <div style="color: red">注:选择了是,后续将不能更改备注</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFeedbackDialog">取 消</el-button>
        <el-button type="primary" @click="confirmRegisterInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { queryBoxMessage } from "@/api/activity";
import { queryRegisterInfoList, handleRegisterInfo } from "@/api/order";
export default {
  data() {
    return {
      queryTime: null,
      dataList: [],
      queryRegisterInfoListParams: {
        pageNo: 1,
        pageSize: 20,
        type: null,
        simpleContent: null,
        queryTime: null,
      },
      queryRegisterInfoListParamsTotal: null,
      typeList: ["投保咨询", "单次维修咨询", "维修培训", "其他"],
      feedbackdialogVisible: false,
      handleRegisterInfoParams: {
        id: null,
        feedback: null,
        completeFlag: 0,
      },
      handleRegisterInfoRules: {
        feedback: [{ required: true, message: "请输入备注", trigger: "blur" }],
        completeFlag: [
          { required: true, message: "请选择是否完结", trigger: "change" },
        ],
      },
    };
  },
  beforeMount() {
    this.queryRegisterInfoList();
  },
  methods: {
    changeQueryTime(val) {
      // 为了满足能查一天的
      const one = val[0] + " 00:00:00";
      const two = val[1] + " 23:59:59";
      this.queryRegisterInfoListParams.queryTime = one + "~" + two;
    },
    // 重置
    resetBtn() {
      this.queryTime = null;
      this.queryRegisterInfoListParams = {
        pageNo: 1,
        pageSize: 20,
        type: null,
        simpleContent: null,
        queryTime: null,
      };
      this.queryRegisterInfoList();
    },
    // 搜索
    async searchBtn() {
      this.queryRegisterInfoListParams.pageNo = 1;
      this.queryRegisterInfoList();
    },
    // 确定修改备注
    async confirmRegisterInfo() {
      await this.$refs["handleRegisterInfoRef"].validate();
      const res = await handleRegisterInfo(this.handleRegisterInfoParams);
      if (res.message == "操作成功") {
        this.queryRegisterInfoList();
        this.closeFeedbackDialog();
      }
    },
    // 关闭备注框
    closeFeedbackDialog() {
      this.$refs["handleRegisterInfoRef"].resetFields();
      this.handleRegisterInfoParams = {
        id: null,
        feedback: null,
        completeFlag: 0,
      };
      this.feedbackdialogVisible = false;
    },
    // 打开备注框
    openFeedbackDialog(row) {
      const { id, completeFlag, feedback } = row;
      this.handleRegisterInfoParams.id = id;
      this.handleRegisterInfoParams.completeFlag = completeFlag;
      this.handleRegisterInfoParams.feedback = feedback;
      this.feedbackdialogVisible = true;
    },
    // 查询产品咨询列表
    async queryRegisterInfoList() {
      const res = await queryRegisterInfoList(this.queryRegisterInfoListParams);
      this.dataList = res.data.records;
      this.queryRegisterInfoListParamsTotal = res.data.total;
    },
    handleSizeChange(val) {
      this.queryRegisterInfoListParams.pageSize = val;
      this.queryRegisterInfoList();
    },
    currentChangeFn(pageNo) {
      this.queryRegisterInfoListParams.pageNo = pageNo;
      this.queryRegisterInfoList();
    },
  },
};
</script>

<style lang="scss">
.topTool {
  display: flex;
  margin-bottom: 20px;
  .toolInput {
    width: 170px;
    margin-right: 10px;
  }
  .toolSelect {
    width: 130px;
    margin-right: 10px;
  }
  .toolBtn {
    color: #2e4c9e;
  }
}
</style>
