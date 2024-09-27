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
        <el-button @click="openConsultDialog(null)">新增</el-button>
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
      <el-table-column label="来源渠道" align="center" header-align="center">
        <template slot-scope="{ row }">
          <span>{{ channelList[row.channel - 1].label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            typeList[scope.row.type - 1]
              ? typeList[scope.row.type - 1].label
              : "其他"
          }}</span>
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
      <el-table-column label="公司名称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.enterpriseName ? scope.row.enterpriseName : "/"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业地址" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.enterpriseAddress ? scope.row.enterpriseAddress : "/"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详情描述" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.simpleContent ? scope.row.simpleContent : "/"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.feedback ? scope.row.feedback : "/" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.operationPeople ? scope.row.operationPeople : "/"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="咨询状态"
        prop="operationPeople"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div :style="{ color: row.completeFlag == 0 ? 'red' : '' }">
            {{ row.completeFlag == 0 ? "未处理" : "已处理" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="操作"
        align="center"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.completeFlag == 1"
            type="text"
            @click="openFeedbackDialog(row)"
            >备注</el-button
          >
          <el-button
            :disabled="row.completeFlag == 1"
            type="text"
            @click="openConsultDialog(row)"
            >编辑</el-button
          >
          <el-button
            v-if="row.type == 4"
            type="text"
            @click="turnUpkeep(row.id)"
            >转保养</el-button
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

    <!-- 新增编辑新闻资讯框 -->
    <el-dialog
      center
      :title="consultDialogTitle"
      :visible="consultDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-form
        :model="consultInfoForm"
        :rules="consultInfoRules"
        ref="consultInfoRef"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="咨询来源" prop="channel">
          <el-select
            v-model="consultInfoForm.channel"
            placeholder="请选择咨询来源"
          >
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨询类型" prop="type">
          <el-select
            v-model="consultInfoForm.type"
            placeholder="请选择咨询类型"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="咨询人" prop="name">
          <el-input v-model="consultInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="consultInfoForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="enterpriseName">
          <el-input v-model="consultInfoForm.enterpriseName"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="enterpriseAddress">
          <el-input v-model="consultInfoForm.enterpriseAddress"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="simpleContent">
          <el-input v-model="consultInfoForm.simpleContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConsultDialog">取 消</el-button>
        <el-button type="primary" @click="confirmConsult">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { queryBoxMessage } from "@/api/activity";
import {
  queryRegisterInfoList,
  handleRegisterInfo,
  editRegisterInfo,
  handleConvertKeepOrder,
} from "@/api/order";
export default {
  data() {
    let isMobileNumber = (rule, value, callback) => {
      if (!value) {
        return new Error("请输入电话号码");
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error("手机号码格式如:138xxxx8754"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入电话号码"));
        }
      }
    };

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

      consultDialogTitle: "新增新闻资讯",
      consultDialogVisible: false,
      consultInfoForm: {
        id: "",
        enterpriseAddress: "",
        enterpriseName: "",
        name: "",
        phone: "",
        simpleContent: "",
        channel: 2,
        type: null,
      },
      consultInfoRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: isMobileNumber, trigger: "blur" },
        ],
        enterpriseName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        enterpriseAddress: [
          { required: true, message: "请输入公司地址", trigger: "blur" },
        ],
        simpleContent: [
          { required: true, message: "请输入内容", trigger: "blur" },
        ],
        channel: [
          { required: true, message: "请选择咨询来源", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择咨询类型", trigger: "change" },
        ],
      },
      channelList: [
        {
          value: 1,
          label: "小程序",
        },
        {
          value: 2,
          label: "抖音",
        },
        {
          value: 3,
          label: "小红书",
        },
        {
          value: 4,
          label: "视频号",
        },
        {
          value: 5,
          label: "快手",
        },
        {
          value: 6,
          label: "58同城",
        },
      ],
      typeList: [
        {
          value: 1,
          label: "投保咨询",
        },
        {
          value: 2,
          label: "单次维修咨询",
        },
        {
          value: 3,
          label: "维修培训",
        },
        {
          value: 4,
          label: "初次保养",
        },
      ],
    };
  },
  beforeMount() {
    this.queryRegisterInfoList();
  },
  methods: {
    // 咨询转保养
    turnUpkeep(id) {
      this.$confirm("您是否要将该记录转保养订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleConvertKeepOrder({
          id,
        });
        if (res.message == "操作成功") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.queryRegisterInfoList();
        }
      });
    },
    // 确定新增编辑新闻资讯
    async confirmConsult() {
      await this.$refs["consultInfoRef"].validate();
      const res = await editRegisterInfo(this.consultInfoForm);
      if (res.message == "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryRegisterInfoList();
        this.closeConsultDialog();
      }
    },
    // 关闭产品咨询框
    closeConsultDialog() {
      this.consultInfoForm = {
        id: "",
        enterpriseAddress: "",
        enterpriseName: "",
        name: "",
        phone: "",
        simpleContent: "",
        channel: 2,
        type: null, //暂时只有初次保养
      };
      this.$refs["consultInfoRef"].resetFields();
      this.consultDialogVisible = false;
    },
    // 打开产品咨询框
    openConsultDialog(row) {
      if (row) {
        // 编辑回显
        this.consultDialogTitle = "编辑新闻资讯";
        const {
          name,
          phone,
          channel,
          enterpriseName,
          enterpriseAddress,
          simpleContent,
          id,
          type,
        } = row;
        this.consultInfoForm.id = id;
        this.consultInfoForm.name = name;
        this.consultInfoForm.phone = phone;
        this.consultInfoForm.channel = channel;
        this.consultInfoForm.enterpriseName = enterpriseName;
        this.consultInfoForm.enterpriseAddress = enterpriseAddress;
        this.consultInfoForm.simpleContent = simpleContent;
        this.consultInfoForm.type = type;
      } else {
        this.consultDialogTitle = "新增新闻资讯";
      }
      this.consultDialogVisible = true;
    },

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
