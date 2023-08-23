<template>
  <div class="amendPricing">
    <el-card style="padding: 0 100px;">
      <h3 class="oneLineTitle">故障解决方案</h3>
      <!-- 故障类型: -->
      <div class="faultType">
        <h3>故障类型:</h3>
        <div>
          <el-checkbox-group v-model="faultTypeValue">
            <el-checkbox label="机械故障">机械故障</el-checkbox>
            <el-checkbox label="电气故障">电气故障</el-checkbox>
            <el-checkbox label="系统故障">系统故障</el-checkbox>
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

      <!-- 增值服务项 -->
      <h3 class="oneLineTitle">增值服务项</h3>
      <div class="faultType">
        <h3>预防性检测:</h3>
        <div>
          <el-radio-group v-model="orderDetails.preventType">
            <el-radio :label="2">不需要</el-radio>
            <el-radio :label="1">需要(5%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="faultType">
        <h3>协助清理机台:</h3>
        <div>
          <el-radio-group v-model="orderDetails.assistCleanType">
            <el-radio :label="2">不需要</el-radio>
            <el-radio :label="1">需要(1%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="faultType">
        <h3>配件:</h3>
        <div>
          <el-radio-group v-model="orderDetails.accessoryType">
            <el-radio :label="1">自备</el-radio>
            <el-radio :label="2">平台提供(1%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="faultType">
        <h3>到达时间:</h3>
        <div>
          <el-radio-group v-model="orderDetails.arrivalTimeType">
            <el-radio :label="3">当天</el-radio>
            <el-radio :label="1">1小时(10%)</el-radio>
            <el-radio :label="2">2小时(5%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="faultType">
        <h3>师傅技术能力:</h3>
        <div>
          <el-radio-group v-model="orderDetails.technicalCapabilitiesType">
            <el-radio :label="3">初级</el-radio>
            <el-radio :label="2">中级(5%)</el-radio>
            <el-radio :label="1">高级(10%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="faultType">
        <h3>配件质保时间:</h3>
        <div>
          <el-radio-group v-model="orderDetails.warrantyPeriodType">
            <el-radio :label="1">7天</el-radio>
            <el-radio :label="2">30天(1%)</el-radio>
            <el-radio :label="3">90天(2%)</el-radio>
            <el-radio :label="4">180天(3%)</el-radio>
          </el-radio-group>
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

      <!-- 配件明细 -->
      <div class="accessoriesDetail">
        <h3>
          配件明细<a href="#" @click.prevent="addAccessories">添加配件</a>
        </h3>
        <div class="content">
          <el-table
            :data="accessoriesList"
            style="width: 80%"
            :key="againTableRefresh"
          >
            <el-table-column label="采购方式" align="center" width="100">
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
            <el-table-column
              align="center"
              prop="num"
              label="配件数量"
              width="80"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="price"
              label="配件单价"
              width="80"
            >
            </el-table-column>
            <el-table-column align="center" label="配件品牌">
              <template slot-scope="{ row }">
                <div
                  :class="[
                    row.type === 1 && !row.brandId ? 'inquireBrandNone' : '',
                  ]"
                >
                  {{ row.brand }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="parameter" label="配件参数">
            </el-table-column>
            <el-table-column align="center" label="配件总金额" width="100">
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
        <h3 style="color: #0b2059;">维保报价</h3>
        <div class="content">
          <div class="item">
            <span class="title">人工费 <i>建议每公里2元,估算距离费用</i></span>
            <el-input
              @input="judgeInp('doorAmount')"
              class="inp"
              v-model="doorAmount"
              placeholder="0.00"
            ></el-input>
          </div>
          <!-- <div class="item">
            <span class="title">技术服务费<i>含检测和服务费</i></span>
            <el-input
              @input="judgeInp('technologyAmount')"
              v-model="technologyAmount"
              class="inp"
              placeholder="0.00"
            ></el-input>
          </div> -->
          <div class="item">
            <span>配件费</span>
            <el-input
              :disabled="true"
              v-model="partsAmount"
              class="inp"
              placeholder="0.00"
            ></el-input>
          </div>
          <!-- <div class="item">
            <span>其他费用</span>
            <el-input
              @input="judgeInp('otherAmount')"
              class="inp"
              v-model="otherAmount"
              placeholder="0.00"
            ></el-input>
          </div> -->
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
        class="toolBottom_cancel"
        @click="
          $router.push('/maintenance/maintenance_order_desc?orderSn=' + orderSn)
        "
        >取消</el-button
      >
      <el-button class="toolBottom_comfirm" @click="confirmEditBtn"
        >确定修改</el-button
      >
    </div>

    <!-- 新增/编辑解决方案 -->
    <el-dialog
      :title="addSolvePlanDialogTitle"
      :visible="addSolvePlanDialog"
      width="30%"
      :before-close="closeAddSolvePlanDialog"
      :close-on-click-modal="false"
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
      width="35%"
      :before-close="closeAddAccessoriesDialog"
      :close-on-click-modal="false"
    >
      <div slot="title" style="font-weight:700 ;color: #707070;font-size:20px">
        {{ accessoriesTitle }}
      </div>
      <el-form
        label-width="80px"
        label-position="right"
        :model="accessoriesForm"
        :rules="accessoriesRules"
        ref="accessoriesForm"
      >
        <el-form-item label="配件选择">
          <el-radio-group
            v-model="accessoriesForm.choose"
            @input="changeChoose"
          >
            <el-radio :label="2">仓库</el-radio>
            <el-radio :label="1">新增</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="配件采购"
          prop="type"
          v-if="accessoriesForm.choose != 2"
        >
          <el-radio-group v-model="accessoriesForm.type">
            <el-radio :label="1">师傅自费</el-radio>
            <el-radio :label="2">平台购买</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="勾选配件" v-if="accessoriesForm.choose == 2">
          <el-input
            placeholder="点击选择仓库已有的配件"
            @focus="openChooseStashParts"
            v-model="accessoriesForm.chooseStashPartsValue"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="accessoriesForm.choose != 2"
          label="配件品牌"
          prop="brand"
        >
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.brand"
              placeholder="请填写配件品牌"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item
          v-if="accessoriesForm.choose != 2"
          label="配件名称"
          prop="name"
        >
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.name"
              placeholder="请填写配件名称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item
          v-if="accessoriesForm.choose != 2"
          label="配件参数"
          prop="parameter"
        >
          <div class="accessoriesItem">
            <el-input
              v-model="accessoriesForm.parameter"
              placeholder="请填写配件参数"
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

    <!-- 选择仓库配件 -->
    <el-dialog
      title="选择仓库配件"
      :close-on-click-modal="false"
      :visible="chooseStashPartsVisible"
      :before-close="closeChooseStashParts"
      center
    >
      <div style="display: flex;align-items: center;margin-bottom: 10px;">
        <el-input
          placeholder="请输入商品名称查询"
          style="width: 20vw;margin-right: 10px;"
          v-model="jdProductListQuery"
        ></el-input>
        <el-button @click="queryJdProductList">搜索</el-button>
      </div>
      <el-table
        height="400px"
        highlight-current-row
        :data="stashPartsData"
        @current-change="changeStashParts"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" property="name"> </el-table-column>
        <el-table-column label="品牌名称" property="brandName">
        </el-table-column>
        <el-table-column label="规格型号" property="model"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeChooseStashParts">取 消</el-button>
        <el-button type="primary" @click="comfirmChooseStashParts"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  editRepairOrder,
  queryDevicePositionList,
  queryJdProductList,
} from "@/api/order"; //故障部位列表
import { getRepairOrderDetail } from "@/api/user";

export default {
  data() {
    return {
      chooseStashPartData: [],
      stashPartsData: [],
      jdProductListQuery: "",
      chooseStashPartsVisible: false,

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
        type: null,
        name: "",
        price: "",
        num: "",
        brand: null,
        parameter: null,
        choose: 2,
        chooseStashPartsValue: "",
      },

      accessoriesRules: {
        name: [
          { required: true, message: "配件名称不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "配件单价不能为空", trigger: "blur" },
          {
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
            message: "配件单价必须为数字",
            trigger: "blur",
          },
        ],
        num: [
          { required: true, message: "配件数量不能为空", trigger: "blur" },
          { type: "number", message: "配件数量必须为数字值", trigger: "blur" },
        ],
        type: [
          { required: true, message: "配件采购不能为空", trigger: "blur" },
        ],
        brand: [
          { required: true, message: "配件品牌不能为空", trigger: "blur" },
        ],
        parameter: [
          { required: true, message: "配件参数不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 确定选择仓库配件
    comfirmChooseStashParts() {
      const {
        brandId,
        brandName,
        model,
        name,
        id,
        unitId,
      } = this.chooseStashPartData;
      this.accessoriesForm.chooseStashPartsValue =
        name + "/" + brandName + "/" + model;
      this.closeChooseStashParts();
      this.accessoriesForm.id = id;
      this.accessoriesForm.brand = brandName;
      this.accessoriesForm.brandId = brandId;
      this.accessoriesForm.parameter = model;
      this.accessoriesForm.name = name;
      this.accessoriesForm.unitId = unitId;
    },
    // 选中仓库配件的数据
    changeStashParts(val) {
      this.chooseStashPartData = val;
    },
    // 查询金蝶仓库
    async queryJdProductList() {
      const res = await queryJdProductList({
        query: this.jdProductListQuery,
      });
      this.stashPartsData = res.data;
    },
    // 修改配件选择
    changeChoose() {
      this.accessoriesForm.type = null;
      this.accessoriesForm.price = "";
      this.accessoriesForm.num = "";
      this.$refs["accessoriesForm"].clearValidate();
    },
    // 关闭选择仓库配件框
    closeChooseStashParts() {
      this.jdProductListQuery = "";
      this.chooseStashPartData = [];
      this.chooseStashPartsVisible = false;
    },
    // 打开选择仓库配件框
    async openChooseStashParts() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
      });
      await this.queryJdProductList();
      this.chooseStashPartsVisible = true;
      loading.close();
    },
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
    // 确定修改的按钮
    async confirmEditBtn() {
      const {
        accessoryType,
        assistCleanType,
        warrantyPeriodType,
        technicalCapabilitiesType,
        preventType,
        arrivalTimeType,
      } = this.orderDetails;
      let data = {
        orderSn: this.orderSn,
        warrantyTime: this.qualityEnsureCycleValue,
        parts: JSON.stringify(this.accessoriesList),
        programme: JSON.stringify(this.solvePlanList),
        partsAmount: +this.partsAmount,
        doorAmount: +this.doorAmount,
        technologyAmount: +this.technologyAmount,
        otherAmount: +this.otherAmount,
        type: this.faultTypeValue.join(","),
        servicePositions: this.siteOfFailureValue.join(","),
        accessoryType,
        assistCleanType,
        warrantyPeriodType,
        technicalCapabilitiesType,
        preventType,
        arrivalTimeType,
      };
      const res = await editRepairOrder(data);
      if (res.message === "操作成功") {
        const route =
          "/maintenance/maintenance_order_desc?orderSn=" + this.orderSn;
        this.$router.push(route);
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
        price: "",
        num: "",
        type: null,
        brand: null,
        parameter: null,
        choose: 2,
        id: null,
      };
      this.accessoriesForm.chooseStashPartsValue = "";
      this.addAccessoriesDialog = false;
      // this.$refs["accessoriesForm"].resetFields();
    },
    // 新增配件确定
    async addAccessoriesComfirm(index) {
      if (this.accessoriesForm.choose === 2) {
        this.accessoriesForm.type = 2;
      }

      await this.$refs.accessoriesForm.validate();
      if (this.accessoriesTitle === "新增配件") {
        if (!this.accessoriesList) {
          this.accessoriesList = [];
        }
        this.accessoriesList.push({ ...this.accessoriesForm });
      } else {
        const {
          price,
          num,
          type,
          name,
          brand,
          parameter,
          brandId,
          choose,
          chooseStashPartsValue,
          id,
          unitId,
        } = this.accessoriesForm;
        this.accessoriesList[index] = {
          id,
          price,
          num,
          type,
          name,
          brand,
          parameter,
          choose,
          brandId,
          unitId,
          chooseStashPartsValue,
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
      if (!this.solvePlanList) {
        this.solvePlanList = [];
      }
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
    const { data } = await getRepairOrderDetail({
      enterpriseOrderSn: this.orderSn,
    });
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
    this.faultTypeValue = type ? type.split(",") : [];
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
    this.doorAmount = doorAmount || 0;
    this.technologyAmount = technologyAmount || 0;
    this.otherAmount = otherAmount || 0;
    this.partsAmount = partsAmount || 0;
    loading.close();
  },
  computed: {
    priceSum() {
      const coefficientMap = {
        accessoryType: { 2: 0.01 },
        assistCleanType: { 1: 0.01 },
        warrantyPeriodType: { 2: 0.01, 3: 0.02, 4: 0.03 },
        technicalCapabilitiesType: { 1: 0.1, 2: 0.05 },
        preventType: { 1: 0.05 },
        arrivalTimeType: { 1: 0.1, 2: 0.05 },
      };

      let addSum = 0;

      for (const condition in coefficientMap) {
        if (condition == "accessoryType") {
          if (coefficientMap[condition][this.orderDetails[condition]]) {
            addSum +=
              coefficientMap[condition][this.orderDetails[condition]] *
              this.partsAmount;
          }
        } else {
          if (coefficientMap[condition][this.orderDetails[condition]]) {
            addSum +=
              coefficientMap[condition][this.orderDetails[condition]] *
              this.doorAmount;
          }
        }
      }

      let sum = Number(this.doorAmount) + Number(this.partsAmount) + addSum;
      return sum.toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
.inquireBrandNone {
  background-color: red;
  color: #fff;
}

.accessoriesItem {
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
  .toolBottom_cancel {
    width: 170px;
    border: 1px solid #2e4c9e;
    color: #2e4c9e;
  }
  .toolBottom_comfirm {
    width: 170px;
    background-color: #2e4c9e;
    color: #fff;
  }
}
</style>
