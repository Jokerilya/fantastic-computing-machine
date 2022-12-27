<template>
  <div class="amendPricing">
    <el-card style="padding: 0 100px;">
      <h3 class="oneLineTitle">故障解决方案</h3>
      <!-- 故障类型: -->
      <div class="faultType">
        <h3>故障类型:</h3>
        <div>
          <el-checkbox-group v-model="faultTypeValue">
            <el-checkbox :label="1">机械故障</el-checkbox>
            <el-checkbox :label="2">电气故障</el-checkbox>
            <el-checkbox :label="3">系统故障</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 故障部位: -->
      <div class="siteOfFailure">
        <h3>故障部位:</h3>
        <div>
          <el-checkbox-group v-model="siteOfFailureValue">
            <el-checkbox
              style="margin-bottom: 15px;"
              v-for="item in equipmentPosition"
              :key="item.name"
              :label="item.name"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <!-- 解决方案 -->
      <div class="solvePlan">
        <h3>
          解决方案
          <i class="el-icon-circle-plus-outline" @click="addSolvePlan"></i>
        </h3>
        <div v-if="solvePlanList">
          <div class="item" v-for="(item, index) in solvePlanList" :key="index">
            <h3 class="title" style="position: relative;">
              方案{{ index + 1 }}:
              <i
                @click="editSolvePlanFn(index)"
                style="position: absolute;right: 25px;top: 0;"
                class="el-icon-s-tools"
              ></i>
              <i
                @click="delSolvePlanFn(index)"
                style="position: absolute;right: 0;top: 0;"
                class="el-icon-delete-solid"
              ></i>
            </h3>
            <div class="content">
              <div class="content_item">
                <div class="tile">故障描述:</div>
                <div class="conten">
                  {{ item.desc }}
                </div>
              </div>
              <div class="content_item">
                <div class="tile">故障分析:</div>
                <div class="conten">
                  {{ item.analysis }}
                </div>
              </div>
              <div class="content_item">
                <div class="tile">维保方案:</div>
                <div class="conten">
                  {{ item.programme }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 质保周期 -->
      <div class="qualityEnsureCycle">
        <h3>质保周期:</h3>
        <div>
          <el-radio-group v-model.number="qualityEnsureCycleValue">
            <el-radio :label="10">10天</el-radio>
            <el-radio :label="15">15天</el-radio>
            <el-radio :label="30">30天</el-radio>
            <el-radio :label="180">半年</el-radio>
            <el-radio>其他天数</el-radio>
          </el-radio-group>
          <input
            class="inp"
            v-model.number="qualityEnsureCycleValue"
            v-if="
              qualityEnsureCycleValue !== 10 &&
                qualityEnsureCycleValue !== 15 &&
                qualityEnsureCycleValue !== 30 &&
                qualityEnsureCycleValue !== 180
            "
          />
        </div>
      </div>

      <!-- 分割线 -->
      <hr color="#ebebeb" style="margin: 20px 0;" />

      <!-- 配件明细 -->
      <div class="accessoriesDetail">
        <h3>
          配件明细 <a href="#" @click.prevent="addAccessories">添加配件</a>
        </h3>
        <div class="content">
          <el-table
            :data="accessoriesList"
            style="width: 80%"
            :key="againTableRefresh"
          >
            <el-table-column label="采购方式" align="center">
              <template slot-scope="{ row }">
                <img
                  src="@/assets/logo/masterPurchase.png"
                  width="28px"
                  v-if="row.type !== 2"
                />
                <img
                  src="@/assets/logo/platformPurchase.png"
                  width="28px"
                  v-if="row.type === 2"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="配件名称">
            </el-table-column>
            <el-table-column align="center" prop="num" label="配件数量">
            </el-table-column>
            <el-table-column align="center" prop="price" label="配件单价">
            </el-table-column>
            <el-table-column align="center" label="配件总金额">
              <template slot-scope="{ row }">
                <div style="color: red;">￥{{ row.num * row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row, $index }">
                <a
                  style="color:#4889fb;margin-right: 10px;"
                  @click.prevent="delAccessoriesFn(row, $index)"
                  >删除</a
                >
                <a
                  style="color:#4889fb;"
                  @click.prevent="editAccessories(row, $index)"
                  >编辑</a
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 维保报价 -->
      <div class="maintenanceOffer">
        <h3>维保报价</h3>
        <div class="content">
          <div class="item">
            <span class="title"
              >上门费用 <i>建议每公里2元,估算距离费用</i></span
            >
            <el-input
              @input="judgeInp('doorAmount')"
              class="inp"
              v-model="doorAmount"
              placeholder="0.00"
            ></el-input>
          </div>
          <div class="item">
            <span class="title">技术服务费<i>含检测和服务费</i></span>
            <el-input
              @input="judgeInp('technologyAmount')"
              v-model="technologyAmount"
              class="inp"
              placeholder="0.00"
            ></el-input>
          </div>
          <div class="item">
            <span>配件费</span>
            <el-input
              :disabled="true"
              v-model="partsAmount"
              class="inp"
              placeholder="0.00"
            ></el-input>
          </div>
          <div class="item">
            <span>其他费用</span>
            <el-input
              @input="judgeInp('otherAmount')"
              class="inp"
              v-model="otherAmount"
              placeholder="0.00"
            ></el-input>
          </div>
          <div class="item">
            <span>合计</span>
            <span class="text" style="color: red;">{{ priceSum }}元</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 底部工具栏 -->
    <div class="toolBottom">
      <el-button
        style="width: 170px;border: 1px solid #2e4c9e;color: #2e4c9e;"
        @click="
          $router.push('/maintenance/maintenance_order_desc?orderSn=' + orderSn)
        "
        >取消</el-button
      >
      <el-button
        style="width: 170px;background-color: #2e4c9e;color: #fff;"
        @click="confirmEditBtn"
        >确定修改</el-button
      >
    </div>

    <!-- 新增/编辑解决方案 -->
    <el-dialog
      :title="addSolvePlanDialogTitle"
      :visible="addSolvePlanDialog"
      width="30%"
      :before-close="closeAddSolvePlanDialog"
    >
      <div>
        <div style="margin-bottom: 15px;">
          <a
            :class="active === 1 ? 'activeTextColor' : ''"
            style="margin-right: 15px;"
            @click.prevent="active = 1"
            >故障描述</a
          >
          <a
            :class="active === 2 ? 'activeTextColor' : ''"
            style="margin-right: 15px;"
            @click.prevent="active = 2"
            >故障分析</a
          >
          <a
            @click.prevent="active = 3"
            :class="active === 3 ? 'activeTextColor' : ''"
            >维保方案</a
          >
        </div>
        <div>
          <el-input
            v-model="addSolvePlanList.desc"
            type="textarea"
            :rows="7"
            v-if="active === 1"
            placeholder="请输入故障描述..."
            resize="none"
          ></el-input>
          <el-input
            resize="none"
            v-model="addSolvePlanList.analysis"
            type="textarea"
            :rows="7"
            v-if="active === 2"
            placeholder="请输入故障分析..."
          ></el-input>
          <el-input
            resize="none"
            v-model="addSolvePlanList.programme"
            type="textarea"
            :rows="7"
            v-if="active === 3"
            placeholder="请输入维保方案..."
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddSolvePlanDialog">取 消</el-button>
        <el-button type="primary" @click="addSolvePlanConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增配件 -->
    <el-dialog
      :visible="addAccessoriesDialog"
      width="30%"
      :before-close="closeAddAccessoriesDialog"
    >
      <div slot="title" style="font-weight:700 ;color: #707070;">
        {{ accessoriesTitle }}
      </div>
      <el-form
        :model="accessoriesForm"
        :rules="accessoriesRules"
        ref="accessoriesForm"
      >
        <el-form-item label="配件名称" prop="name">
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.name"
              placeholder="请填写配件名称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="配件单价" prop="price">
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.price"
              placeholder="请填写配件单价"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="配件数量" prop="num">
          <div class="accessoriesItem">
            <el-input
              v-model.number="accessoriesForm.num"
              placeholder="请填写配件数量"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="数量单位" prop="unit">
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.unit"
              placeholder="请填写配件数量单位"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="配件采购" prop="type">
          <el-radio-group v-model="accessoriesForm.type">
            <el-radio :label="1">师傅自费</el-radio>
            <el-radio :label="2">平台购买</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div style="display: flex;justify-content: center;">
          <el-button
            style="width: 120px;border: 1px #2d4da0 solid;color: #2d4da0;"
            @click="closeAddAccessoriesDialog"
            >取 消</el-button
          >
          <el-button
            style="width: 120px;background-color: #2d4da0;color: #ffffff;"
            @click="addAccessoriesComfirm(accessoriesForm.index)"
            >确 定</el-button
          >
        </div>
      </span></el-dialog
    >
  </div>
</template>

<script>
import { editRepairOrder, queryDevicePositionList } from "@/api/order"; //故障部位列表
import { getRepairOrderDetail } from "@/api/user";

export default {
  data() {
    return {
      orderSn: null,
      editIndex: null,
      accessoriesTitle: "添加配件",
      againTableRefresh: true,

      equipmentPosition: null, //故障部位列表
      faultTypeValue: [], //故障类型
      siteOfFailureValue: [], //故障部位
      qualityEnsureCycleValue: null, //质保周期

      orderDetails: null, //订单详情
      solvePlanList: [], //解决方案列表
      accessoriesList: [], //配件列表

      doorAmount: null, //上门费用
      technologyAmount: null, //技术服务费
      otherAmount: null, //其他费用
      partsAmount: null, //配件费用

      addSolvePlanDialog: false, //新增方案弹窗
      addSolvePlanDialogTitle: "新增解决方案",
      activeName: "故障描述", //新增方案标签页默认
      active: 1, //点击tabs的状态
      addSolvePlanList: {
        //方案的表格数据
        analysis: "",
        desc: "",
        programme: "",
      },

      addAccessoriesDialog: false, //新增配件弹窗
      accessoriesForm: {
        // 新增配件的数据
        name: "",
        unit: "",
        price: "",
        num: "",
        type: null,
      },

      accessoriesRules: {
        name: [
          { required: true, message: "配件名称不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "配件单价不能为空", trigger: "blur" },
          {
            pattern: /^[1-9][0-9]*(\.[0-9]{1,2})?$/,
            message: "配件单价必须为数字",
            trigger: "blur",
          },
        ],
        num: [
          { required: true, message: "配件数量不能为空", trigger: "blur" },
          { type: "number", message: "配件数量必须为数字值" },
        ],
        unit: [
          { required: true, message: "数量单位不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "配件采购不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 点击编辑配件
    editAccessories(item, index) {
      this.accessoriesTitle = "编辑配件";
      this.accessoriesForm = { ...item, index };
      this.addAccessoriesDialog = true;
    },
    // 算配件总价
    getAccessoriesSum() {
      this.partsAmount = 0;
      this.accessoriesList.forEach((item) => {
        this.partsAmount += item.num * item.price;
      });
    },
    // 判断输入框是否为数字
    judgeInp(attribute) {
      if (Number.isNaN(+this[attribute])) {
        this[attribute] = null;
        this.$message({
          message: "输入框只能输数字",
          type: "warning",
        });
      }
    },
    // 改造数据方案
    repairData(arr) {
      let str = null;
      if (Array.isArray(arr)) {
        arr.forEach((el, index) => {
          if (index === 0) {
            str = "" + el;
          } else {
            str = str + "," + el;
          }
        });
      }
      return str;
    },
    // 确定修改的按钮
    async confirmEditBtn() {
      let data = {
        orderSn: this.orderSn,
        warrantyTime: this.qualityEnsureCycleValue,
        parts: [],
        programme: [],
        partsAmount: +this.partsAmount,
        doorAmount: +this.doorAmount,
        technologyAmount: +this.technologyAmount,
        otherAmount: +this.otherAmount,
      };
      data.servicePositions = this.repairData(this.siteOfFailureValue);
      data.type = this.repairData(this.faultTypeValue);
      data.parts = JSON.stringify(this.accessoriesList);
      data.programme = JSON.stringify(this.solvePlanList);
      const res = await editRepairOrder(data);
      console.log(res);
      if (res.message === "操作成功") {
        this.$router.push(
          "/maintenance/maintenance_order_desc?orderSn=" + this.orderSn
        );
        this.$message({
          showClose: true,
          message: res.message,
          type: "success",
        });
      }
    },
    // 删除配件
    async delAccessoriesFn(item, index) {
      this.$confirm("您确定删除" + item.name + "吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.accessoriesList.splice(index, 1);
        this.getAccessoriesSum();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 关闭新增配件弹窗
    closeAddAccessoriesDialog() {
      this.accessoriesForm = {
        name: "",
        unit: "",
        price: "",
        num: "",
        type: null,
      };
      this.$refs.accessoriesForm.resetFields();
      this.addAccessoriesDialog = false;
    },
    // 新增配件确定
    async addAccessoriesComfirm(index) {
      await this.$refs.accessoriesForm.validate();
      if (this.accessoriesTitle === "新增配件") {
        console.log({ ...this.accessoriesForm });
        this.accessoriesList.push({ ...this.accessoriesForm });
      } else {
        const { price, num, type, name, unit } = this.accessoriesForm;
        this.accessoriesList[index] = {
          price,
          num,
          type,
          name,
          unit,
        };
        this.againTableRefresh = !this.againTableRefresh;
      }
      this.getAccessoriesSum();
      this.closeAddAccessoriesDialog();
    },
    // 新增配件
    addAccessories() {
      this.accessoriesTitle = "新增配件";
      this.addAccessoriesDialog = true;
    },
    // 编辑方案
    editSolvePlanFn(index) {
      this.addSolvePlanDialogTitle = "编辑方案" + (index + 1);
      this.editIndex = index;
      this.addSolvePlanList = { ...this.solvePlanList[index] };
      this.addSolvePlanDialog = true;
    },
    // 删除方案
    delSolvePlanFn(index) {
      this.$confirm("你确定删除该方案吗, 是否继续?", "删除方案" + (index + 1), {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.solvePlanList.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功",
        });
      });
    },
    // 确定添加方案
    async addSolvePlanConfirm() {
      if (this.addSolvePlanDialogTitle === "新增解决方案") {
        await this.solvePlanList.push(this.addSolvePlanList);
      } else {
        this.solvePlanList[this.editIndex] = this.addSolvePlanList;
      }
      this.closeAddSolvePlanDialog();
    },
    // 关闭弹窗
    closeAddSolvePlanDialog() {
      this.addSolvePlanList = {
        analysis: "",
        desc: "",
        programme: "",
      };
      this.activeName = "故障描述";
      this.active = 1;
      this.addSolvePlanDialog = false;
    },
    // 点击添加方案的按钮
    addSolvePlan() {
      this.addSolvePlanDialogTitle = "新增解决方案";
      this.addSolvePlanDialog = true;
    },
  },
  async created() {
    const loading = this.$loading({
      text: "数据正在回显中,请稍等...",
    });
    const res = await queryDevicePositionList();
    this.equipmentPosition = res.data;
    this.orderSn = this.$route.query.orderSn;
    const params = { enterpriseOrderSn: this.orderSn };
    const { data } = await getRepairOrderDetail(params);
    const {
      type,
      servicePositions,
      programmeList,
      warrantyTime,
      partsList,
      doorAmount,
      technologyAmount,
      otherAmount,
      partsAmount,
    } = data;
    this.orderDetails = data;
    // 故障类型回显
    if (type.indexOf("机械故障") !== -1) {
      this.faultTypeValue.push(1);
    }
    if (type.indexOf("电气故障") !== -1) {
      this.faultTypeValue.push(2);
    }
    if (type.indexOf("系统故障") !== -1) {
      this.faultTypeValue.push(3);
    }
    // 故障部位回显
    this.siteOfFailureValue = servicePositions
      ? servicePositions.split(",")
      : [];
    // 解决方案回显
    this.solvePlanList = programmeList;
    // 质保周期回显
    this.qualityEnsureCycleValue = warrantyTime;
    // 配件列表
    this.accessoriesList = partsList;
    // 费用回显
    this.doorAmount = doorAmount ? doorAmount : 0;
    this.technologyAmount = technologyAmount ? technologyAmount : 0;
    this.otherAmount = otherAmount ? otherAmount : 0;
    this.partsAmount = partsAmount ? partsAmount : 0;
    loading.close();
  },
  computed: {
    priceSum() {
      const num =
        +this.doorAmount +
        +this.technologyAmount +
        +this.otherAmount +
        +this.partsAmount;
      return num ? num.toFixed(2) : "0.00";
    },
  },
};
</script>

<style lang="less" scoped>
.accessoriesItem {
  display: flex;
  margin: 0 75px;
  .label {
    width: 100px;
    font-weight: 700;
    color: #707070;
  }
}
.activeTextColor {
  color: #409eff;
}

.amendPricing {
  padding: 20px;
  .oneLineTitle {
    color: #0b2059;
  }

  // 故障类型  故障部位
  .faultType,
  .siteOfFailure {
    display: flex;
    margin: 15px 0;
    h3 {
      color: #707070;
      flex: 1;
    }
    div {
      flex: 10;
    }
  }

  // 解决方案
  .solvePlan {
    margin-bottom: 20px;
    h3 {
      color: #0b2059;
    }
    .item {
      margin-top: 10px;
      .title {
        width: 90%;
        color: #0b2059;
        margin-bottom: 10px;
      }
      .content {
        width: 90%;
        padding: 10px 10px 0 10px;
        border: 1px #d5d5d5 solid;
        .content_item {
          display: flex;
          margin-bottom: 10px;
          .tile {
            width: 90px;
            color: #707070;
            font-weight: 700;
          }
          .conten {
            display: flex;
            flex-wrap: wrap;
            font-size: 15px;
            line-height: 20px;
            color: #999;
          }
        }
      }
    }
  }

  // 质保周期
  .qualityEnsureCycle {
    color: #707070;
    display: flex;
    align-items: center;
    height: 30px;
    h3 {
      flex: 1;
    }
    div {
      flex: 10;
    }
    .inp {
      border: none;
      border-bottom: 1px solid #999;
      height: 30px;
      width: 130px;
      margin-left: 10px;
      outline: none;
      color: #707070;
    }
  }

  // 配件明细
  .accessoriesDetail {
    h3 {
      color: #707070;
      margin-bottom: 10px;
      a {
        margin-left: 20px;
        font-size: 16px;
        color: #5291fb;
      }
    }
    .content {
      padding: 0px 100px;
      .item {
        height: 35px;
        display: flex;
        color: #0b2059;
        margin-bottom: 10px;
        align-items: center;
        position: relative;
        .name {
          color: #707070;
          margin-right: 50px;
        }
        .money,
        .num {
          margin-right: 20px;
        }
        .tool {
          color: #156afb;
        }
        .procurementLogo {
          position: absolute;
          left: -31px;
          top: 5px;
        }
      }
    }
  }

  // 维保报价
  .maintenanceOffer {
    display: flex;
    margin-top: 20px;
    h3 {
      color: #707070;
      flex: 1;
    }
    .content {
      flex: 10;
      .item {
        display: flex;
        width: 50%;
        height: 35px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .title {
          i {
            margin-left: 10px;
            font-style: normal;
            font-size: 13px;
            color: #aaaaaa;
          }
        }
        .inp {
          width: 130px;
          height: 35px;
        }
        .text {
          width: 130px;
          padding-left: 13px;
        }
      }
    }
  }
}

.toolBottom {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
