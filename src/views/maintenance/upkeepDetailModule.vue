<template>
  <!-- 保养明细模块 -->
  <div class="upkeepDetailModuleBox">
    <!-- 顶部工具栏 -->
    <div class="topTool">
      <el-input
        v-model="queryUpkeepListParameter.orderSn"
        placeholder="输入订单编号"
        class="toolInput"
      >
      </el-input>
      <el-input
        v-model="queryUpkeepListParameter.no"
        placeholder="输入设备编号"
        class="toolInput"
      >
      </el-input>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-right: 10px"
        value-format="yyyy-MM-dd"
        @change="changeData"
      >
      </el-date-picker>
      <el-button class="toolBtn" @click="queryUpkeepListFn(1)">查询</el-button>
      <el-button class="toolBtn" @click="resetUpkeepListFn">重置</el-button>
      <el-button class="toolBtn" @click="exportBtn" style="margin-right: 10px"
        >导入模板</el-button
      >
      <el-upload
        class="upload-demo"
        action
        multiple
        :http-request="importUpkeepListFn"
        :show-file-list="false"
      >
        <el-button class="toolBtn">导入</el-button>
      </el-upload>
    </div>

    <!-- 表格内容部分 -->
    <div class="tableContent" v-if="upkeepList">
      <el-card>
        <div class="tableContent_table">
          <el-table
            :cell-style="{ 'text-align': 'center' }"
            :data="upkeepList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f6f8fc',
              color: '#707070',
              'text-align': 'center',
            }"
          >
            <el-table-column width="150" label="订单编号" prop="orderSn">
            </el-table-column>
            <el-table-column width="150" label="设备编号" prop="no">
            </el-table-column>
            <el-table-column label="保养日期">
              <template slot-scope="{ row }">
                {{ row.keepTime && row.keepTime.substr(0, 10) }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              prop="type"
              label="保养类型"
            ></el-table-column>
            <el-table-column prop="person" label="保养人"></el-table-column>
            <el-table-column label="保养内容" prop="content">
              <template slot-scope="{ row }">
                {{ row.content ? row.content : "/" }}
              </template>
            </el-table-column>
            <el-table-column prop="fault" label="排除故障"></el-table-column>
            <el-table-column
              prop="totalCostFee"
              label="总成本"
            ></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="{ row }">
                {{
                  row.status == 0
                    ? "未指派"
                    : row.status == 1
                    ? "进行中"
                    : "已完成"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  @click.prevent="openUpkeepDetailsDialogFn(row)"
                >
                  详情
                </el-button>
                <el-button
                  type="text"
                  @click.prevent="delUpkeepDetails(row.orderSn)"
                >
                  删除
                </el-button>
                <el-button
                  v-if="row.status == 1"
                  type="text"
                  @click.prevent="openEditUpkeepDialog(row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="row.status == 1"
                  type="text"
                  @click.prevent="markersCompleted(row)"
                >
                  标记已完成
                </el-button>
                <el-button
                  v-if="row.status == 0"
                  type="text"
                  @click.prevent="openDesignateMasterDialog(row.id)"
                >
                  指派师傅
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableContent_footer">
          <div class="footer_pagination">
            <el-pagination
              @current-change="currentChangeFn"
              :page-size="queryUpkeepListParameter.pageSize"
              layout="jumper, prev, pager, next,total "
              :total="total"
              :current-page="queryUpkeepListParameter.pageNo"
            >
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详情 -->
    <el-dialog
      :visible="upkeepDetailsDialog"
      width="50%"
      :before-close="closeUpkeepDetailsDialogFn"
      :showClose="false"
    >
      <div v-if="upkeepDetails">
        <div class="orderDetails">
          <h2 style="text-align: center">保养详情</h2>
          <div class="content">
            <div class="line">
              <div class="item">
                <span class="title">姓名</span>
                <span class="desc">{{ upkeepDetails.name }}</span>
              </div>
              <div class="item">
                <span class="title">电话</span>
                <span class="desc">{{ upkeepDetails.phone }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">公司名称</span>
                <span class="desc">{{ upkeepDetails.enterpriseName }}</span>
              </div>
              <div class="item">
                <span class="title">公司地址</span>
                <span class="desc">{{ upkeepDetails.enterpriseAddress }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">设备编号</span>
                <span class="desc">{{ upkeepDetails.no }}</span>
              </div>
              <div class="item">
                <span class="title">保养人</span>
                <span class="desc">{{ upkeepDetails.person }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">更换配件名</span>
                <span class="desc">{{ upkeepDetails.partsNames }}</span>
              </div>
              <div class="item">
                <span class="title">故障问题</span>
                <span class="desc">{{ upkeepDetails.problem }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">保养内容</span>
                <span class="desc">{{ upkeepDetails.simpleContent }}</span>
              </div>
              <div class="item">
                <span class="title">排除保障</span>
                <span class="desc">{{ upkeepDetails.fault }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">总数量</span>
                <span class="desc">{{ upkeepDetails.totalNum }}</span>
              </div>
              <div class="item">
                <span class="title">保养人工费用</span>
                <span class="desc">{{ upkeepDetails.totalArtificialFee }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">总成本</span>
                <span class="desc">{{ upkeepDetails.totalCostFee }}</span>
              </div>
              <div class="item">
                <span class="title">总配件费用</span>
                <span class="desc">{{ upkeepDetails.totalPartsFee }}</span>
              </div>
            </div>
            <div class="line">
              <div class="item">
                <span class="title">保养时间</span>
                <span class="desc">{{ upkeepDetails.keepTime }}</span>
              </div>
              <div class="item"></div>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <el-button @click="closeUpkeepDetailsDialogFn" class="closeBtn"
            >关闭</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 指派师傅 -->
    <el-dialog
      center
      title="指派师傅"
      :visible="designateMasterVisible"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        :model="designateMasterForms"
        :rules="designateMasterRules"
        ref="designateMasterFef"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="师傅姓名" prop="person">
          <el-input
            placeholder="请填写师傅姓名"
            v-model="designateMasterForms.person"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDesignateMasterDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDesignateMaster"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑保养记录 -->
    <el-dialog
      center
      title="编辑保养记录"
      :visible="editUpkeepVisible"
      :close-on-press-escape="false"
      :show-close="false"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        label-position="left"
        label-width="100px"
        :model="editUpkeepForms"
        :rules="editUpkeepRules"
        ref="editUpkeepRef"
      >
        <div style="display: flex">
          <el-form-item
            label="姓名"
            prop="name"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写姓名"
              v-model="editUpkeepForms.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone" style="flex: 1">
            <el-input
              placeholder="请填写电话"
              v-model="editUpkeepForms.phone"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="公司名称"
            prop="enterpriseName"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写公司名称"
              v-model="editUpkeepForms.enterpriseName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司地址"
            prop="enterpriseAddress"
            style="flex: 1"
          >
            <el-input
              placeholder="请填写公司地址"
              v-model="editUpkeepForms.enterpriseAddress"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="设备编号"
            prop="no"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写设备编号"
              v-model="editUpkeepForms.no"
            ></el-input>
          </el-form-item>
          <el-form-item label="保养人" prop="person" style="flex: 1">
            <el-input
              placeholder="请填写保养人"
              v-model="editUpkeepForms.person"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="更换配件名"
            prop="partsNames"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写更换配件名"
              v-model="editUpkeepForms.partsNames"
            ></el-input>
          </el-form-item>
          <el-form-item label="故障问题" prop="problem" style="flex: 1">
            <el-input
              placeholder="请填写故障问题"
              v-model="editUpkeepForms.problem"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="保养内容"
            prop="simpleContent"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写保养内容"
              v-model="editUpkeepForms.simpleContent"
            ></el-input>
          </el-form-item>
          <el-form-item label="排除故障" prop="fault" style="flex: 1">
            <el-input
              placeholder="请填写排除故障"
              v-model="editUpkeepForms.fault"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="总数量"
            prop="totalNum"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写总数量"
              type="number"
              v-model.number="editUpkeepForms.totalNum"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="保养人工费"
            prop="totalArtificialFee"
            style="flex: 1"
          >
            <el-input
              placeholder="请填写保养人工费用"
              type="number"
              v-model.number="editUpkeepForms.totalArtificialFee"
            ></el-input>
          </el-form-item>
        </div>
        <div style="display: flex">
          <el-form-item
            label="总成本"
            prop="totalCostFee"
            style="flex: 1; margin-right: 30px"
          >
            <el-input
              placeholder="请填写总成本"
              type="number"
              v-model.number="editUpkeepForms.totalCostFee"
            ></el-input>
          </el-form-item>
          <el-form-item label="总配件费" prop="totalPartsFee" style="flex: 1">
            <el-input
              placeholder="请填写总配件费用"
              type="number"
              v-model.number="editUpkeepForms.totalPartsFee"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="保养时间" prop="keepTime">
          <el-date-picker
            v-model="editUpkeepForms.keepTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择保养日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditUpkeepDialog">取 消</el-button>
        <el-button type="primary" @click="confirmEditUpkeep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryDeviceKeepOrder,
  deleteDeviceKeepOrder,
  uploadDeviceKeepOrder,
} from "../../api/upkeep.js";
import {
  deviceKeepOrderAssign,
  editDeviceKeepOrder,
  deviceKeepOrderMarkComplete,
} from "../../api/order.js";
export default {
  data() {
    // 校验手机号
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
      queryUpkeepListParameter: {
        no: null,
        pageSize: 10,
        pageNo: 1,
        startTime: null,
        endTime: null,
        orderSn: null,
      },
      date: null,
      upkeepList: [],
      total: null,
      upkeepDetails: [],

      upkeepDetailsDialog: false,

      designateMasterVisible: false,
      designateMasterForms: {
        id: null,
        person: null,
      },
      designateMasterRules: {
        person: { required: true, message: "请填写指派师傅", trigger: "blur" },
      },

      editUpkeepVisible: false,
      editUpkeepForms: {
        id: null,
        enterpriseName: null,
        enterpriseAddress: null,
        name: null,
        phone: null,
        fault: null,
        keepTime: null,
        no: null,
        partsNames: null,
        person: null,
        problem: null,
        simpleContent: null,
        totalArtificialFee: null,
        totalCostFee: null,
        totalNum: null,
        totalPartsFee: null,
        type: "保养类",
      },
      editUpkeepRules: {
        enterpriseName: [
          { required: true, message: "请填写公司名称", trigger: "blur" },
        ],
        enterpriseAddress: [
          { required: true, message: "请填写企业地址", trigger: "blur" },
        ],
        name: [{ required: true, message: "请填写姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请填写电话", trigger: "blur" },
          { validator: isMobileNumber, trigger: "blur" },
        ],
        fault: [{ required: true, message: "请填写排除故障", trigger: "blur" }],
        keepTime: [
          { required: true, message: "请选择保养时间", trigger: "change" },
        ],
        no: [{ required: true, message: "请填写设备编号", trigger: "blur" }],
        partsNames: [
          { required: true, message: "请填写更换配件名", trigger: "blur" },
        ],
        person: [{ required: true, message: "请填写保养人", trigger: "blur" }],
        problem: [
          { required: true, message: "请填写故障问题", trigger: "blur" },
        ],
        simpleContent: [
          { required: true, message: "请填写保养内容", trigger: "blur" },
        ],
        totalArtificialFee: [
          { required: true, message: "请填写保养人工费用", trigger: "blur" },
        ],
        totalCostFee: [
          { required: true, message: "请填写总成本 ", trigger: "blur" },
        ],
        totalNum: [
          { required: true, message: "请填写总数量", trigger: "blur" },
        ],
        totalPartsFee: [
          { required: true, message: "请填写总配件费用", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 保养订单标记已完成
    markersCompleted(row) {
      if (!row.no) {
        this.$message({
          message: "请编辑填写完善订单信息",
          type: "warning",
        });
        return;
      }
      this.$confirm("您是否要将该订单标记已完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deviceKeepOrderMarkComplete({
          id: row.id,
        });
        if (res.message == "操作成功") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.queryUpkeepListFn();
        }
      });
    },
    // 确定编辑保养
    async confirmEditUpkeep() {
      await this.$refs["editUpkeepRef"].validate();
      const res = await editDeviceKeepOrder(this.editUpkeepForms);
      if (res.message == "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryUpkeepListFn();
        this.closeEditUpkeepDialog();
      }
    },
    // 关闭编辑保养框
    closeEditUpkeepDialog() {
      this.editUpkeepForms = {
        id: null,
        enterpriseName: null,
        enterpriseAddress: null,
        name: null,
        phone: null,
        fault: null,
        keepTime: null,
        no: null,
        partsNames: null,
        person: null,
        problem: null,
        simpleContent: null,
        totalArtificialFee: null,
        totalCostFee: null,
        totalNum: null,
        totalPartsFee: null,
        type: "保养类",
      };
      this.$refs["editUpkeepRef"].resetFields();
      this.editUpkeepVisible = false;
    },
    // 打开编辑保养框
    openEditUpkeepDialog(row) {
      if (row) {
        const {
          enterpriseAddress,
          enterpriseName,
          fault,
          keepTime,
          name,
          no,
          partsNames,
          person,
          phone,
          totalArtificialFee,
          totalCostFee,
          totalNum,
          totalPartsFee,
          simpleContent,
          problem,
          id,
        } = row;
        Object.assign(this.editUpkeepForms, {
          enterpriseAddress,
          enterpriseName,
          fault,
          keepTime,
          name,
          no,
          partsNames,
          person,
          phone,
          totalArtificialFee,
          totalCostFee,
          totalNum,
          totalPartsFee,
          simpleContent,
          problem,
          id,
        });
      }
      this.editUpkeepVisible = true;
    },

    // 确定指派师傅
    async confirmDesignateMaster() {
      await this.$refs["designateMasterFef"].validate();
      const res = await deviceKeepOrderAssign(this.designateMasterForms);
      if (res.message == "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.queryUpkeepListFn();
        this.closeDesignateMasterDialog();
      }
    },

    // 关闭指派师傅框
    closeDesignateMasterDialog() {
      this.designateMasterForms = {
        id: null,
        person: null,
      };
      this.$refs["designateMasterFef"].resetFields();
      this.designateMasterVisible = false;
    },

    // 打开指派师傅框
    openDesignateMasterDialog(id) {
      this.designateMasterForms.id = id;
      this.designateMasterVisible = true;
    },

    // 改变时间格式
    changeData() {
      this.queryUpkeepListParameter.startTime = this.date[0] + " 00:00:00";
      this.queryUpkeepListParameter.endTime = this.date[1] + " 23:59:59";
    },

    // 查询
    async queryUpkeepListFn(id) {
      console.log(218, "查询了");
      if (id === 1) {
        this.queryUpkeepListParameter.pageNo = 1;
      }
      const res = await queryDeviceKeepOrder(this.queryUpkeepListParameter);
      const { records, total } = res.data;
      this.upkeepList = records;
      this.total = total;
    },

    // 重置
    resetUpkeepListFn() {
      this.queryUpkeepListParameter = {
        no: null,
        pageSize: 10,
        pageNo: 1,
        startTime: null,
        endTime: null,
        orderSn: null,
      };
      this.queryUpkeepListFn();
    },

    // 模板导出
    exportBtn() {
      window.location.replace(
        "https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/%E4%BF%9D%E5%85%BB%E8%AE%A2%E5%8D%95%E6%A8%A1%E7%89%88%EF%BC%88%E5%86%85%E5%90%AB%E7%A4%BA%E4%BE%8B%E5%8F%82%E8%80%83%EF%BC%89.xlsx"
      );
    },

    // 导入
    async importUpkeepListFn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await uploadDeviceKeepOrder(formData);
      if (res.message === "操作成功") {
        this.$message({
          message: "保养记录导入成功",
          type: "success",
        });
        this.resetUpkeepListFn();
      }
    },

    // 点击页码触发
    currentChangeFn(page) {
      this.queryUpkeepListParameter.pageNo = page;
      this.queryUpkeepListFn();
    },

    // 关闭保养详情
    closeUpkeepDetailsDialogFn() {
      this.upkeepDetailsDialog = false;
    },

    // 打开保养详情
    openUpkeepDetailsDialogFn(row) {
      this.upkeepDetails = row;
      this.upkeepDetailsDialog = true;
    },

    // 删除保养详情
    async delUpkeepDetails(orderSn) {
      const confirm = await this.$confirm("您确定删除该保养记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (confirm == "confirm") {
        const res = await deleteDeviceKeepOrder(orderSn);
        if (res.message === "操作成功") {
          this.queryUpkeepListFn();
        }
      }
    },
  },
  created() {
    this.queryUpkeepListFn();
  },
};
</script>

<style lang="less" scoped>
.upkeepDetailModuleBox {
  padding: 20px;
  // 顶部工具栏
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

  // 表格内容部分
  .tableContent {
    .tableContent_title {
      color: #0b2059;
      font-weight: 700;
      font-size: 20px;
      padding-left: 30px;
    }
    .tableContent_table {
      margin: 30px 0;
    }
    .tableContent_footer {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: center;
    }
  }

  // 详情
  .orderDetails {
    color: #707070;
    .content {
      padding: 20px 20px;
      .line {
        display: flex;
        margin-bottom: 20px;
        .item {
          flex: 1;
          display: flex;
          align-items: center;
          padding-right: 20px;
          .title {
            width: 150px;
            color: #707070;
            font-weight: 700;
            font-size: 22px;
          }
          .desc {
            font-size: 18px;
            flex: 1;
          }
        }
      }
    }
  }

  // 按钮样式
  .closeBtn {
    background-color: #fff;
    color: #0b2059;
    border: 1px solid #0b2059;
    width: 110px;
    height: 40px;
  }
}
</style>
