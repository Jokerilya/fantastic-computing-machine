<template>
  <div class="checkPart">
    <div class="solutionTitle">解决方案</div>
    <div class="solutionPart">
      <div class="describe">
        故障描述：
        <textarea
          v-model="programmes[0].desc"
          name
          id
          cols="30"
          rows="10"
          placeholder="描述具体故障信息"
        ></textarea>
      </div>
      <div class="describe">
        故障分析：
        <textarea
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
          v-model="programmes[0].programme"
          name
          id
          cols="30"
          rows="10"
          placeholder="描述具体方案"
        ></textarea>
      </div>
    </div>

    <div class="onload">
      <div class="onloadTitle">质保周期:</div>
      <div class="onloadPart">
        <el-radio-group v-model="param.warrantyTime" style="display:flex">
          <el-radio label="10">10天</el-radio>
          <el-radio label="15">15天</el-radio>
          <el-radio label="30">30天</el-radio>
          <el-radio label="180">180天</el-radio>
          <el-radio label="orther">其他天数</el-radio>
          <el-input v-model="param.warrantyTime"></el-input>
        </el-radio-group>
      </div>
    </div>
    <!-- <div class="fishedTime">
      <div class="onloadTitle">预计完成时间:</div>
      <el-time-picker
        style="margin: 0 50px;"
        arrow-control
        v-model="param.serviceCompleteTime"
        :picker-options="{
      selectableRange: '请选中一个维修完成时间'
    }"
        placeholder="任意时间点"
      ></el-time-picker>
    </div>-->
    <div class="cut"></div>
    <div class="peijian">
      <div class="peijianTitle">配件明细:</div>
      <div class="addpeijian" @click="openAdd">添加/编辑配件</div>
    </div>
    <div class="addPart">
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="param.parts"
        style="width: 100%;"
      >
        <el-table-column prop="name" label="配件名称" show-overflow-tooltip width="200" align="center"></el-table-column>
        <el-table-column prop="price" label="价格" show-overflow-tooltip width="200" align="center"></el-table-column>
        <el-table-column prop="num" label="数量" show-overflow-tooltip width="200" align="center"></el-table-column>
        <el-table-column prop="unit" label="单位" show-overflow-tooltip width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="deleted(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pricing">
      <div class="pricingTitle">维保报价:</div>
      <div class="pricingPart">
        <div class="pricingLine" style="margin: 1px 0 ;">
          <div class="lineLeft">
            <div class="left1">上门费用</div>
            <div class="left2">建议每公里2元，估算距离费用</div>
          </div>
          <div class="lineRight">
            <el-input v-model="param.doorAmount"></el-input>
          </div>
        </div>
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">技术服务费</div>
            <div class="left2">含检测费用</div>
          </div>
          <div class="lineRight">
            <el-input v-model="param.technologyAmount"></el-input>
          </div>
        </div>
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">配件费</div>
            <div class="left2"></div>
          </div>
          <div class="lineRight">
            <el-input v-model="param.partsAmount"></el-input>
          </div>
        </div>
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1">其他费用</div>
            <div class="left2"></div>
          </div>
          <div class="lineRight">
            <el-input v-model="param.otherAmount"></el-input>
          </div>
        </div>
        <div class="pricingLine">
          <div class="lineLeft">
            <div class="left1" style="font-weight:bold">合计</div>
            <div class="left2"></div>
          </div>
          <div class="lineRight" style="color:red;font-weight:bold">{{sum}}</div>
        </div>
      </div>
      <div class="submitByn" style="margin-left:50px">
        <el-button type="primary" size="mini" plain @click="_handleMasterQuotation()">检测定价</el-button>
      </div>
    </div>

    <el-dialog
      title="添加配件"
      :visible.sync="dialogpop"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addBorder">
          <div class="addPart">
            <div class="addcontent">
              <div class="name">配件名称:</div>
              <el-input v-model="part.name" placeholder="请填写配件名称"></el-input>
            </div>
            <div class="addcontent">
              <div class="name">配件单价:</div>
              <el-input v-model="part.price" placeholder="请填写配件单价"></el-input>
            </div>
            <div class="addcontent">
              <div class="name">配件数量:</div>
              <el-input v-model="part.num" placeholder="请填写配件数量,例如：2"></el-input>
            </div>
            <div class="addcontent">
              <div class="name">配件单位:</div>
              <el-input v-model="part.unit" placeholder="请填写配件单位,例如：件、个"></el-input>
            </div>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="addFalse">取消</el-button>
        <el-button type="primary" @click="addTrue">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="配件列表"
      :visible.sync="dialogChosee"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addPart">
          <div class="addcontents" v-for="item in param.parts" :key="item">
            <div class="paramName">{{item.name}}</div>
            <div class="paramPrice">{{item.price}}元</div>
            <div class="paramNum">{{item.num}}</div>
            <div class="paramUnit">{{item.unit}}</div>
            <div class="delete" @click="deleted(item,index)">删除</div>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="addPartFalse">取消</el-button>
        <el-button type="primary" @click="addPartTrue">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { handleMasterQuotation } from "@/api/order.js";
import { getRepairOrderDetail } from "@/api/user.js";
export default {
  title: "checkPricing",
  data() {
    return {
      dialogChosee: false,
      dialogpop: false,

      orderDetail: [],
      orderSn: "",
      radio: "10天",
      otherRadio: "",

      part: {
        name: "",
        price: "",
        num: "",
        unit: ""
      },
      
      param: {
        orderSn: "",
        warrantyTime: "",
        parts: [],
        programme: [],
        partsAmount: "", //配件费
        doorAmount: "", //上门费用
        technologyAmount: "", //技术服务费
        otherAmount: "" //其他费用
      },
      programmes: [
        {
          desc: "",
          analysis: "",
          programme: ""
        }
      ]
    };
  },
  computed: {
    sum() {
      let {
        doorAmount,
        technologyAmount,
        partsAmount,
        otherAmount
      } = this.param;
      let sum =
        Number(doorAmount) +
        Number(technologyAmount) +
        Number(partsAmount) +
        Number(otherAmount);
      return sum ? sum.toFixed(2) : "0.00";
    }
  },
  methods: {
    addPartTrue() {
      (this.dialogChosee = false), (this.dialogpop = false);
    },
    deleted(item, index) {
      console.log(item, index);
      this.param.parts.splice(index, 1);
    },
    addPartFalse() {
      this.dialogChosee = false;
      this.dialogpop = true;
    },

    addTrue() {
      if (
        !this.part.name ||
        !this.part.price ||
        !this.part.num ||
        !this.part.unit
      ) {
        alert("表单未填写完整");
      } else {
        this.param.parts.push(this.part);
        this.part = {
          name: "",
          price: "",
          num: "",
          unit: ""
        };
        this.dialogpop = false;
        this.dialogChosee = true;
      }
    },
    openAdd() {
      this.dialogpop = true;
    },
    addFalse() {
      this.dialogpop = false;
    },
    //订单信息
    _getRepairOrderDetail() {
      let params = {
        enterpriseOrderSn: this.param.orderSn
      };
      getRepairOrderDetail(params).then(res => {
        console.log("订单详情", res);
        if (res.success) {
          this.orderDetail = res.data;
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
        }
      });
    },
    //定价
    _handleMasterQuotation() {
      this.param.programme = this.programmes;
      console.log(this.programmes);
      console.log("programme", this.param.programme);
      let param = {
        ...this.param
      };
      param.parts = JSON.stringify(param.parts);
      param.programme = JSON.stringify(param.programme);
      handleMasterQuotation(param).then(res => {
        if (res.success) {
          console.log("检测定价", res);
          this.$router.push(
        "/maintenance/maintenance_order_desc?orderSn=" + this.param.orderSn
      );
          this.$message({
            showClose: true,
            message: res.message,
            type: "success"
          });
        } else {
          alert(res.message);
        }
      });
    }
  },
  created() {
    this.param.orderSn = this.$route.query.orderSn;
    console.log("订单号", this.orderSn);
    this._getRepairOrderDetail();
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.addBorder {
  width: 100%;
  display: flex;
  justify-content: center;
}
.checkPart {
  height: 100vh;
  background: #fff;
  padding: 50px 114px;
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
        padding: 12px 30px;
        border: 1rpx solid #e9e9e9;
      }
    }
  }
  .onload {
    margin-top: 54px;
    display: flex;
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
    el-time-picker {
    }
  }
  .cut {
    margin: 50px 0;
    height: 2px;
    background: #ebebeb;
    width: 1500px;
  }
  .peijian {
    width: 260px;
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
    width: 900px;
    display: flex;
    margin: 53px 0;
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
  margin: 50px;
}
</style>