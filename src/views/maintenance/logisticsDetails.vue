<template>
  <!-- 物流详情 -->
  <div class="logisticsDetails">
    <div class="logisticsDetails_steps">
      <div class="logisticsDetails_steps_right" v-if="collectLogistics.expVo">
        <div class="logisticsDetails_steps_title">
          客户 <span style="font-weight: 400; margin: 10px">——</span> 供应商
        </div>
        <div
          class="logisticsDetails_steps_Title"
          v-if="collectLogistics && collectLogistics.length > 0"
        >
          <div>{{ collectLogistics.expVo.expName }}快递:</div>
          <div>{{ collectLogistics.expVo.expNo }}</div>
        </div>
        <el-steps
          direction="vertical"
          :active="0"
          :space="80"
          v-if="collectLogistics.expVo.expNo"
        >
          <el-step
            v-for="item in collectLogistics.expVo.list"
            :key="item.time"
            :title="item.time"
            :description="item.remark"
            icon="el-icon-truck"
          ></el-step>
        </el-steps>
        <div class="collectLogistics-none" v-else>
          <div style="margin-bottom: 15px">此配件暂未同步物流信息</div>
          <div>请稍后查看</div>
        </div>
      </div>
      <div class="logisticsDetails_steps_left" v-if="sendLogistics.expVo">
        <div class="logisticsDetails_steps_title">
          供应商 <span style="font-weight: 400; margin: 10px">——</span> 客户
          <el-button style="margin-left: 10px" @click="openSynchronousDialog"
            >同步</el-button
          >
        </div>
        <div
          class="logisticsDetails_steps_Title"
          v-if="sendLogistics && sendLogistics.length > 0"
        >
          <div>{{ sendLogistics.expVo.expName }}快递:</div>
          <div>{{ sendLogistics.expVo.expNo }}</div>
        </div>
        <el-steps
          direction="vertical"
          :active="0"
          :space="80"
          v-if="sendLogistics.expVo.expNo"
        >
          <el-step
            v-for="item in sendLogistics.expVo.list"
            :key="item.time"
            :title="item.time"
            :description="item.remark"
            icon="el-icon-truck"
          ></el-step>
        </el-steps>
        <div class="sendLogistics-none" v-else>
          <div>此配件暂未同步物流信息</div>
          <div style="margin: 15px 0">点按钮同步</div>
        </div>
      </div>
    </div>

    <!-- 同步弹框 -->
    <el-dialog
      title="物流同步"
      width="30%"
      center
      :close-on-click-modal="false"
      :visible="logisticsSynchronousDialogShow"
      :before-close="closeSynchronousDialog"
    >
      <el-form
        label-width="80px"
        :model="synchronousParmas"
        :rules="logisticsSynchronousRules"
        ref="logisticsSynchronousRef"
      >
        <el-form-item label="快递公司" prop="expCom">
          <el-select
            placeholder="请选择"
            v-model="synchronousParmas.expCom"
            @change="changeExp"
          >
            <el-option
              v-for="item in logisticsCompanyList"
              :key="item.id"
              :label="item.expName"
              :value="item.expCom"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="logisticsNumber">
          <el-input
            placeholder="请填写快递单号"
            v-model.trim="synchronousParmas.logisticsNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            placeholder="请填写手机号码"
            v-model.trim="synchronousParmas.phone"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSynchronousDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmSynchronous">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryLogistics,
  uploadLogisticsInfo,
  queryOrderBasicFn,
} from "@/api/order.js";
export default {
  data() {
    return {
      synchronousParmas: {
        expCom: null,
        phone: null,
        logisticsNumber: null,
        expName: null,
      },
      sendLogistics: [], //供应商到客户
      collectLogistics: [], //客户到供应商
      option: null,

      logisticsCompanyList: [], //物流公司列表

      logisticsSynchronousDialogShow: false, //物流同步框显示隐藏、

      logisticsSynchronousRules: {
        expCom: [
          { required: true, message: "请选择快递公司", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "输入的手机号必须是11位数字",
            trigger: "blur",
          },
        ],
        logisticsNumber: [
          { required: true, message: "请填写快递单号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 修改快递公司
    changeExp() {
      this.logisticsCompanyList.forEach((item) => {
        if (item.expCom == this.synchronousParmas.expCom) {
          this.synchronousParmas.expName = item.expName;
        }
      });
    },
    // 确定同步
    async comfirmSynchronous() {
      await this.$refs.logisticsSynchronousRef.validate();
      let parmas = {
        ...this.synchronousParmas,
        ...this.option,
      };
      const res = await uploadLogisticsInfo(parmas);
      res.message == "操作成功"
        ? this.$message({
            message: "同步成功",
            type: "success",
          })
        : "";
      this.closeSynchronousDialog();
      this.queryLogistics(this.option);
    },
    // 查询快递物流信息
    async queryOrderBasicFn() {
      const res = await queryOrderBasicFn();
      this.logisticsCompanyList = res.data;
    },
    // 关闭同步物流框
    closeSynchronousDialog() {
      this.$refs.logisticsSynchronousRef.resetFields();
      this.logisticsSynchronousDialogShow = false;
    },
    // 打开同步物流框
    openSynchronousDialog() {
      this.logisticsSynchronousDialogShow = true;
    },
    // 查询物流详情
    async queryLogistics(params) {
      const res = await queryLogistics(params);
      this.sendLogistics = res.data[1];
      this.collectLogistics = res.data[0];
      console.log(this.sendLogistics, this.collectLogistics);
    },
  },
  created() {
    this.option = this.$route.query;
    this.queryLogistics(this.option);
    this.queryOrderBasicFn();
  },
};
</script>

<style lang="less" scoped>
.logisticsDetails {
  padding: 30px;

  .logisticsDetails_steps {
    display: flex;
    justify-content: space-between;

    .logisticsDetails_steps_Title {
      display: flex;
      justify-content: start;
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 10px;
    }

    .logisticsDetails_steps_left {
      min-height: 80vh;
      padding-left: 30px;
      text-align: center;
      flex: 1;
      .sendLogistics-none {
        min-height: 50vh;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    }

    .logisticsDetails_steps_right {
      text-align: center;
      border-right: 1px solid #000;
      flex: 1;
      .collectLogistics-none {
        min-height: 50vh;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }
    }

    .logisticsDetails_steps_title {
      font-weight: 700;
      font-size: 28px;
      margin-bottom: 20px;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
