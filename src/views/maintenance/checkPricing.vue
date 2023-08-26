<!-- 检测定价 -->
<template>
  <div class="checkPart">
    <!-- 故障解决方案 -->
    <h2 style="color: #0b2059;margin-bottom: 20px;font-size:24px">
      故障解决方案
    </h2>
    <div class="faultSolveProgramme">
      <div class="lineItem">
        <div class="title">
          故障类型:
        </div>
        <div class="content">
          <el-checkbox-group v-model="faultTypeCheckbox">
            <el-checkbox :label="1">机械故障</el-checkbox>
            <el-checkbox :label="2">电气故障</el-checkbox>
            <el-checkbox :label="3">系统故障</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          故障部位:
        </div>
        <div class="content">
          <el-checkbox-group v-model="faultPartsCheckbox">
            <el-checkbox
              style="margin-bottom: 10px;"
              v-for="item in equipmentPosition"
              :key="item.name"
              :label="item.name"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <!-- 故障原因部分 -->
    <div class="solutionPart">
      <div class="describe">
        故障描述：
        <textarea
          style="resize:none "
          v-model="programmes[0].desc"
          name
          id
          cols="25"
          rows="10"
          placeholder="描述具体故障信息"
        ></textarea>
      </div>
      <div class="describe">
        故障分析：
        <textarea
          style="resize:none "
          v-model="programmes[0].analysis"
          name
          id
          cols="30"
          rows="10"
          placeholder="对故障进行具体分析"
        ></textarea>
      </div>
      <div class="describe">
        维保方案：
        <textarea
          style="resize:none "
          v-model="programmes[0].programme"
          name
          id
          cols="30"
          rows="10"
          placeholder="描述具体方案"
        ></textarea>
      </div>
    </div>

    <!-- 配件明细部分 -->
    <div class="peijian" style="margin-top: 30px;">
      <div class="peijianTitle">配件明细:</div>
      <div class="addpeijian" @click="openAdd">添加配件</div>
    </div>
    <div class="addPartcs">
      <el-table :data="param.parts" style="width: 70%" :key="againTableRefresh">
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
        <el-table-column align="center" prop="num" label="配件数量" width="80">
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
              @click.prevent="deleted(row, $index)"
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

    <!-- 增值服务项 -->
    <h2 style="color: #0b2059;margin: 20px 0;font-size:24px">
      增值服务项
    </h2>
    <div class="faultSolveProgramme">
      <div class="lineItem">
        <div class="title">
          预防性检测:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.preventType">
            <el-radio :label="2">不需要</el-radio>
            <el-radio :label="1">需要(5%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          协助清理机台:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.assistCleanType">
            <el-radio :label="2">不需要</el-radio>
            <el-radio :label="1">需要(1%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          配件:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.accessoryType">
            <el-radio :label="1">自备</el-radio>
            <el-radio :label="2">平台提供(1%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          到达时间:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.arrivalTimeType">
            <el-radio :label="3">当天</el-radio>
            <el-radio :label="1">1小时(10%)</el-radio>
            <el-radio :label="2">2小时(5%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          师傅技术能力:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.technicalCapabilitiesType">
            <el-radio :label="3">初级</el-radio>
            <el-radio :label="2">中级(5%)</el-radio>
            <el-radio :label="1">高级(10%)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="lineItem">
        <div class="title">
          配件质保时间:
        </div>
        <div class="content">
          <el-radio-group v-model="orderDetail.warrantyPeriodType">
            <el-radio :label="1">7天</el-radio>
            <el-radio :label="2">30天(1%)</el-radio>
            <el-radio :label="3">90天(2%)</el-radio>
            <el-radio :label="4">180天(3%)</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>

    <!-- 维保报价部分 -->
    <div class="pricing">
      <div class="pricingTitle" style="color: #0b2059;">维保报价</div>
      <div class="pricingPart">
        <div class="pricingLine" style="margin: 1px 0 ;">
          <div class="lineLeft">
            <div class="left1">人工费</div>
            <div class="left2">建议每公里2元，估算距离费用</div>
          </div>
          <div class="lineRight">
            <el-input
              @input="judgeInp('doorAmount', 'param')"
              v-model="param.doorAmount"
              placeholder="￥0.00"
            ></el-input>
          </div>
        </div>
        <!-- <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">技术服务费</div>
            <div class="left2">含检测费用</div>
          </div>
          <div class="lineRight">
            <el-input
              @input="judgeInp('technologyAmount', 'param')"
              v-model="param.technologyAmount"
              placeholder="￥0.00"
            ></el-input>
          </div>
        </div> -->
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">配件费</div>
            <div class="left2"></div>
          </div>
          <div class="lineRight">
            <el-input
              :disabled="true"
              v-model="param.partsAmount"
              placeholder="￥0.00"
            ></el-input>
          </div>
        </div>
        <!-- <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">其他费用</div>
            <div class="left2"></div>
          </div>
          <div class="lineRight">
            <el-input
              @input="judgeInp('otherAmount', 'param')"
              v-model="param.otherAmount"
              placeholder="￥0.00"
            ></el-input>
          </div>
        </div> -->
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1" style="font-weight:bold">合计</div>
            <div class="left2"></div>
          </div>
          <div
            class="lineRight"
            style="color:red;font-weight:bold;margin-right: 125px;"
          >
            ￥{{ sum }}
          </div>
        </div>
      </div>
      <!-- <div class="submitByn" style="margin-left:50px">
        <el-button
          type="primary"
          size="mini"
          plain
          
          >检测定价</el-button
        >
      </div> -->
    </div>

    <!-- 底部按钮部分 -->
    <div class="footerBtn">
      <el-button
        class="cancelBtn"
        @click="$router.push('/maintenance/maintenance_order')"
        >取消</el-button
      >
      <el-button class="submitBtn" @click="_handleMasterQuotation()"
        >提交检测</el-button
      >
    </div>

    <!-- 添加配件的弹窗 -->
    <el-dialog
      width="35%"
      :visible.sync="dialogpop"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
      @close="closeAddAccessories"
    >
      <template slot="title">
        <div style="color: #707070;font-size: 18px;font-weight: 700;">
          {{ accessoriesTitle }}
        </div>
      </template>
      <el-from label-width="1000px">
        <div class="addBorder">
          <div class="addPart">
            <div class="addcontent">
              <div class="name">配件选择:</div>
              <div style="width: 230px;">
                <el-radio v-model="part.choose" :label="2">仓库</el-radio>
                <el-radio v-model="part.choose" :label="1">新增</el-radio>
              </div>
            </div>
            <div class="addcontent" v-if="part.choose != 2">
              <div class="name">配件采购:</div>
              <div style="width: 230px;">
                <el-radio v-model="part.type" :label="2">平台采购</el-radio>
                <el-radio v-model="part.type" :label="1">师傅采购</el-radio>
              </div>
            </div>
            <div
              class="addcontent"
              style="position:relative"
              v-if="part.choose == 2"
            >
              <div class="name">勾选配件:</div>
              <el-input
                style="width: 230px;"
                v-model="part.chooseStashPartsValue"
                @focus="openChooseStashParts"
                placeholder="点击选择仓库已有的配件"
              ></el-input>
            </div>
            <div
              class="addcontent"
              style="position:relative"
              v-if="part.choose != 2"
            >
              <div class="name">配件品牌:</div>
              <el-input
                style="width: 230px;"
                v-model.trim="part.brand"
                placeholder="请填写配件品牌"
              ></el-input>
            </div>
            <div
              class="addcontent"
              style="position:relative"
              v-if="part.choose != 2"
            >
              <div class="name">配件名称:</div>
              <el-input
                style="width: 230px;"
                v-model.trim="part.name"
                placeholder="请填写配件名称"
              ></el-input>
            </div>
            <div
              class="addcontent"
              style="position:relative"
              v-if="part.choose != 2"
            >
              <div class="name">配件参数:</div>
              <el-input
                style="width: 230px;"
                v-model.trim="part.parameter"
                placeholder="请填写配件参数"
              ></el-input>
            </div>
            <div class="addcontent">
              <div class="name">配件单价:</div>
              <el-input
                style="width: 230px;"
                @input="judgeInp('price', 'part')"
                v-model="part.price"
                placeholder="请填写配件单价"
              ></el-input>
            </div>
            <div class="addcontent">
              <div class="name">配件数量:</div>
              <el-input
                style="width: 230px;"
                @input="judgeInp('num', 'part')"
                v-model.number="part.num"
                placeholder="请填写配件数量,例如：2"
              ></el-input>
            </div>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button style="color: #2e4c9e;width: 200px" @click="addFalse"
          >返回</el-button
        >
        <el-button
          style="background-color:#2e4c9e;color: #fff;width: 200px"
          @click="addTrue(part.index)"
          >提交</el-button
        >
      </div>
    </el-dialog>

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
  handleMasterQuotation,
  queryDevicePositionList,
  queryDeviceBrandList,
  queryJdProductList,
} from "@/api/order.js";
import { getRepairOrderDetail } from "@/api/user.js";
export default {
  title: "checkPricing",

  data() {
    return {
      chooseStashPartData: [],
      stashPartsData: [],
      jdProductListQuery: "",
      chooseStashPartsVisible: false,

      faultTypeCheckbox: [], //故障类型多选
      faultPartsCheckbox: [], //故障部位 多选
      equipmentPosition: null, //故障部位列表
      qualityWeekDataInp: false,
      edit: null,
      accessoriesTitle: "添加配件",
      againTableRefresh: true,

      dialogChosee: false,
      dialogpop: false,

      orderDetail: [],
      orderSn: "",
      radio: "10天",
      otherRadio: "",

      part: {
        name: null,
        price: null,
        num: null,
        type: null,
        brand: null,
        parameter: null,
        choose: 2,
        chooseStashPartsValue: "",
      },

      param: {
        orderSn: "",
        warrantyTime: "",
        parts: [],
        programme: [],
        partsAmount: null, //配件费
        doorAmount: null, //上门费用
        technologyAmount: null, //技术服务费
        otherAmount: null, //其他费用
      },
      programmes: [
        {
          desc: "",
          analysis: "",
          programme: "",
        },
      ],
    };
  },

  async created() {
    const res = await queryDevicePositionList();
    this.equipmentPosition = res.data;
    this.param.orderSn = this.$route.query.orderSn;
    const info = await getRepairOrderDetail({
      enterpriseOrderSn: this.param.orderSn,
    });
    this.faultTypeCheckbox = [];
    if (info.data.type.indexOf("机械故障") !== -1) {
      this.faultTypeCheckbox.push(1);
    }
    if (info.data.type.indexOf("电气故障") !== -1) {
      this.faultTypeCheckbox.push(2);
    }
    if (info.data.type.indexOf("系统故障") !== -1) {
      this.faultTypeCheckbox.push(3);
    }
    this.programmes[0].desc = info.data.simpleDesc;
    this.edit = this.$route.query.edit;
    this._getRepairOrderDetail();
  },
  mounted() {},
  computed: {
    // 计算维保报价总价
    sum() {
      const { doorAmount, partsAmount } = this.param;

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
          if (coefficientMap[condition][this.orderDetail[condition]]) {
            addSum +=
              coefficientMap[condition][this.orderDetail[condition]] *
              partsAmount;
          }
        } else {
          if (coefficientMap[condition][this.orderDetail[condition]]) {
            addSum +=
              coefficientMap[condition][this.orderDetail[condition]] *
              doorAmount;
          }
        }
      }

      let sum = Number(doorAmount) + Number(partsAmount) + addSum;
      // 需要判断一个非工作时间
      sum = this.judgNoWorkTime(sum, doorAmount);
      return sum.toFixed(2);
    },
  },
  methods: {
    // 判断非工作时间
    judgNoWorkTime(sum, doorAmount) {
      const currentDateTime = new Date();
      const dayOfWeek = currentDateTime.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = currentDateTime.getHours();

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        // 星期六日
        return sum + doorAmount * 0.2;
      } else if (currentHour < 8 || currentHour >= 18) {
        // 判断8点前和6点后
        return sum + doorAmount * 0.2;
      } else {
        return sum;
      }
    },
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
      this.part.chooseStashPartsValue = name + "/" + brandName + "/" + model;
      this.closeChooseStashParts();
      this.part.brand = brandName;
      this.part.brandId = brandId;
      this.part.parameter = model;
      this.part.name = name;
      this.part.id = id;
      this.part.unitId = unitId;
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
    // 查询设备品牌
    async searchBrand(name) {
      console.log(430, name);
      const res = await queryDeviceBrandList({
        name,
      });
      this.searchBrandList = res.data;
    },

    // 算配件总价
    getAccessoriesSum() {
      this.param.partsAmount = 0;
      this.param.parts.forEach((item) => {
        this.param.partsAmount += item.num * item.price;
      });
    },
    // 编辑配件弹窗
    editAccessories(item, index) {
      this.accessoriesTitle = "编辑配件";
      this.dialogpop = true;
      this.part = { ...item, index };
    },
    // 关闭添加配件弹窗
    closeAddAccessories() {
      this.dialogpop = false;
      this.part = {
        name: null,
        price: null,
        num: null,
        type: null,
        brand: null,
        parameter: null,
        choose: 2,
      };
    },
    // 改变其他天数
    checkqualityWeekDataInp() {
      if (this.param.warrantyTime === 0) {
        this.qualityWeekDataInp = true;
      } else {
        this.qualityWeekDataInp = false;
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
    // 判断输入框是否为数字
    judgeInp(attribute, form) {
      if (form === "part") {
        if (attribute === "price") {
          if (Number.isNaN(+this[form][attribute])) {
            this[form][attribute] = null;
            this.$message({
              message: "输入框只能输数字",
              type: "warning",
            });
          }
        } else {
          if (this[form][attribute] === "" || this[form][attribute] === null) {
            return;
          } else if (!(typeof this[form][attribute] === "number")) {
            this[form][attribute] = null;
            this.$message({
              message: "输入框只能输数字",
              type: "warning",
            });
          }
        }
      } else {
        if (Number.isNaN(+this[form][attribute])) {
          this[form][attribute] = null;
          this.$message({
            message: "输入框只能输数字",
            type: "warning",
          });
        }
      }
    },

    // 点击已选配件的删除事件
    deleted(item, index) {
      this.$confirm("您确定删除" + item.name + "吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.param.parts.splice(index, 1);
        this.getAccessoriesSum();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 点击添加配件弹窗里的提交按钮的事件
    addTrue(index) {
      if (this.part.choose === 2) {
        this.part.type = 2;
      }
      if (
        !this.part.name ||
        !this.part.price ||
        !this.part.num ||
        !this.part.type
      ) {
        this.$message({
          message: "表单未填写完整",
          type: "warning",
        });
      } else {
        if (this.accessoriesTitle === "添加配件") {
          this.param.parts.push({ ...this.part });
        } else {
          this.param.parts[index] = { ...this.part };
          this.againTableRefresh = !this.againTableRefresh;
        }
        this.getAccessoriesSum();
        this.part = {
          name: null,
          price: null,
          num: null,
          type: null,
          brand: null,
          parameter: null,
          id: null,
          unitId: null,
        };
        this.dialogpop = false;
      }
    },
    // 点击添加配件的事件
    openAdd() {
      this.accessoriesTitle = "添加配件";
      this.dialogpop = true;
    },
    // 点击添加配件弹窗里的返回按钮的事件
    addFalse() {
      this.dialogpop = false;
    },
    //订单信息
    _getRepairOrderDetail() {
      let params = {
        enterpriseOrderSn: this.param.orderSn,
      };
      getRepairOrderDetail(params).then((res) => {
        if (res.success) {
          this.orderDetail = res.data;
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
      });
    },
    //定价
    _handleMasterQuotation() {
      const {
        accessoryType,
        assistCleanType,
        warrantyPeriodType,
        technicalCapabilitiesType,
        preventType,
        arrivalTimeType,
      } = this.orderDetail;
      this.param.programme = this.programmes;
      let param = {
        ...this.param,
        accessoryType,
        assistCleanType,
        warrantyPeriodType,
        technicalCapabilitiesType,
        preventType,
        arrivalTimeType,
      };
      param.servicePositions = this.repairData(this.faultPartsCheckbox);
      param.type = this.repairData(this.faultTypeCheckbox);
      param.parts = JSON.stringify(param.parts);
      param.programme = JSON.stringify(param.programme);
      handleMasterQuotation(param).then((res) => {
        if (res.success) {
          this.$router.push(
            "/maintenance/maintenance_order_desc?orderSn=" + this.param.orderSn
          );
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        } else {
          alert(res.message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.inquireBrandNone {
  background-color: red;
  color: #fff;
}

.faultSolveProgramme {
  .lineItem {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .title {
      flex: 1.4;
      font-size: 20px;
      color: #707070;
      font-weight: 700;
    }

    .content {
      flex: 10;
    }
  }
}

// 测试开始
.footerBtn {
  height: 100px;
  display: flex;
  align-items: center;
  background-color: #f6f8fc;
  padding-right: 50px;
  .cancelBtn {
    background-color: #fff;
    border: 1px solid #2e4c9e;
    color: #2e4c9e;
    width: 155px;
  }
  .submitBtn {
    background-color: #2e4c9e;
    color: #fff;
    width: 155px;
  }
}
.addBorder {
  .addPart {
    .addcontent {
      height: 40px;
      line-height: 40px;
      .name {
        font-weight: 700;
        color: #707070;
      }
    }
  }
}
.addPartcs {
  margin-left: 7vw;
  .item {
    height: 50px;
    line-height: 50px;
    display: flex;
    width: 250px;
    justify-content: space-between;
    font-size: 18px;
    position: relative;

    .procurementLogo {
      position: absolute;
      left: -48px;
      top: 8px;
    }
  }
}
// 测试结束

.addBorder {
  width: 100%;
  display: flex;
  justify-content: center;
}
.checkPart {
  background: #fff;
  padding: 50px 20px 0 20px;
  .solutionTitle {
    font-size: 24px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #0b2059;
  }
  .solutionPart {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    .describe {
      display: flex;
      font-size: 24px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #707070;
      textarea {
        background: #f6f8fc;
        color: #000;
        font-size: 18px;
        padding: 12px 5px;
        border: 1rpx solid #ccc;
        outline-color: #707070;
      }
    }
  }
  .onload {
    margin-top: 54px;
    display: flex;
    align-items: center;
    .onloadTitle {
      font-size: 24px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #707070;
    }
    .onloadPart {
      margin: 7px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .onloadPart_inp {
        margin-left: 15px;
      }
    }
  }
  .fishedTime {
    margin-top: 53px;
    display: flex;
    .onloadTitle {
      display: flex;
      font-size: 24px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #707070;
    }
  }
  .cut {
    margin: 50px 0;
    height: 2px;
    background: #ebebeb;
    width: 1500px;
  }
  .peijian {
    width: 225px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .peijianTitle {
      font-size: 24px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #707070;
    }
    .addpeijian {
      font-size: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #156afb;
    }
  }
  .pricing {
    margin-top: 20px;
    width: 900px;
    display: flex;
    //   justify-content: space-between;
    .pricingTitle {
      font-size: 24px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #707070;
    }
    .pricingPart {
      .pricingLine {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .lineLeft {
          margin-left: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          .left1 {
            font-size: 18px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #707070;
          }
          .left2 {
            margin-left: 10px;
            font-size: 14px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #aaaaaa;
          }
        }
        .lineRight {
          margin-left: 108px;
        }
      }
    }
  }
}
.addPart {
  .addcontent {
    margin: 10px;
    display: flex;
    width: 480px;
    justify-content: center;
    align-items: center;
    .name {
      width: 100px;
    }
    el-input {
      padding: 0 10px;
    }
  }

  .addcontents {
    display: flex;
    .paramName {
      width: 200px;
      margin: 0 20px;
      color: #707070;
    }
    .paramPrice {
      margin: 0 20px;
      color: #0b2059;
    }
    .paramNum {
      color: #0b2059;
      margin: 0 20px;
    }
    .paramUnit {
      color: #0b2059;
      margin: 0 20px;
    }
    .delete {
      color: #0b2059;
      width: 50px;
      margin-left: 100px;
    }
  }
}
.addPartBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}
</style>
