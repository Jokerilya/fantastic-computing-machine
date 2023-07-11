<!-- 检测定价 -->
<template>
  <div class="checkPart">
    <!-- 故障解决方案 -->
    <h2 style="color: #0b2059;margin-bottom: 20px;">故障解决方案</h2>
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

    <div class="solutionTitle">解决方案</div>
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

    <!-- 维保报价部分 -->
    <div class="pricing">
      <div class="pricingTitle">维保报价:</div>
      <div class="pricingPart">
        <div class="pricingLine" style="margin: 1px 0 ;">
          <div class="lineLeft">
            <div class="left1">上门费用</div>
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
        <div class="pricingLine">
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
        </div>
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
        <div class="pricingLine">
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
        </div>
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
              <div class="name">配件采购:</div>
              <div style="width: 230px;">
                <el-radio v-model="part.type" :label="2">平台采购</el-radio>
                <el-radio v-model="part.type" :label="1">师傅采购</el-radio>
              </div>
            </div>
            <div class="addcontent" style="position:relative">
              <div class="name">配件品牌:</div>
              <el-input
                style="width: 230px;"
                v-model.trim="part.brand"
                placeholder="请填写配件品牌"
                v-if="!searchBrandToggle"
              ></el-input>
              <el-select
                style="width: 230px;"
                v-else
                clearable
                v-model="part.brand"
                filterable
                remote
                :remote-method="searchBrand"
                placeholder="请填写配件品牌"
              >
                <el-option
                  v-for="item in searchBrandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
              <el-button
                @click="searchBrandToggle = !searchBrandToggle"
                style="position:absolute;right:10px;top:0"
                >{{ searchBrandToggle ? "增" : "选" }}</el-button
              >
            </div>
            <div class="addcontent" style="position:relative">
              <div class="name">配件名称:</div>
              <el-input
                v-if="!searchNameToggle"
                style="width: 230px;"
                v-model.trim="part.name"
                placeholder="请填写配件名称"
              ></el-input>
              <el-select
                v-else
                style="width: 230px;"
                clearable
                v-model="part.name"
                filterable
                remote
                @change="
                  () => {
                    part.parameter = null;
                  }
                "
                :remote-method="searchName"
                placeholder="请填写配件名称"
              >
                <el-option
                  v-for="item in searchNameList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-button
                @click="searchNameToggle = !searchNameToggle"
                style="position:absolute;right:10px;top:0"
                >{{ searchNameToggle ? "增" : "选" }}</el-button
              >
            </div>
            <div class="addcontent" style="position:relative">
              <div class="name">配件参数:</div>
              <el-input
                v-if="!searchParameterToggle"
                style="width: 230px;"
                v-model.trim="part.parameter"
                placeholder="请填写配件参数"
              ></el-input>
              <el-select
                v-else
                clearable
                style="width: 230px;"
                v-model="part.parameter"
                filterable
                remote
                @focus="searchParameterFocus"
                :disabled="!part.name"
                :remote-method="searchParameter"
                placeholder="请填写配件参数"
              >
                <el-option
                  v-for="item in searchParameterList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-button
                @click="searchParameterToggle = !searchParameterToggle"
                style="position:absolute;right:10px;top:0"
                >{{ searchParameterToggle ? "增" : "选" }}</el-button
              >
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
      searchNameToggle: true,
      searchParameterToggle: true,
      searchBrandToggle: true,

      searchParameterList: [],
      searchBrandList: [],
      searchNameList: [],

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
      let {
        doorAmount,
        technologyAmount,
        partsAmount,
        otherAmount,
      } = this.param;
      let sum =
        Number(doorAmount) +
        Number(technologyAmount) +
        Number(partsAmount) +
        Number(otherAmount);
      return sum ? sum.toFixed(2) : "0.00";
    },
  },
  methods: {
    // 聚焦触发查询规格
    async searchParameterFocus() {
      const res = await queryJdProductList({
        name: this.part.name,
        model: "",
        type: 2,
      });
      this.searchParameterList = res.data;
    },
    // 查询名称规格
    async searchName(name) {
      const res = await queryJdProductList({
        name,
        type: 1,
      });
      this.searchNameList = res.data;
    },
    async searchParameter(model) {
      const res = await queryJdProductList({
        name: this.part.name,
        model,
        type: 2,
      });
      this.searchParameterList = res.data;
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
      if (
        !this.part.name ||
        !this.part.price ||
        !this.part.num ||
        !this.part.type ||
        !this.part.brand ||
        !this.part.parameter
      ) {
        this.$message({
          message: "表单未填写完整",
          type: "warning",
        });
      } else {
        if (this.accessoriesTitle === "添加配件") {
          let brandId = null;
          this.searchBrandList.forEach((item) => {
            if (item.name === this.part.brand) {
              brandId = item.id;
              return;
            }
          });
          this.param.parts.push({ ...this.part, brandId });
        } else {
          let brandId = null;
          this.searchBrandList.forEach((item) => {
            if (item.name === this.part.brand) {
              brandId = item.id;
              return;
            }
          });
          this.param.parts[index] = { ...this.part, brandId };
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
      this.param.programme = this.programmes;
      let param = {
        ...this.param,
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
      flex: 1;
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
