<template>
  <div class="mainPart">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="客户基本信息" name="first">客户基本信息</el-tab-pane>
      <el-tab-pane label="设备基本信息" name="second">设备基本信息</el-tab-pane>
      <el-tab-pane label="设备列表" name="third">设备列表</el-tab-pane>
      <el-tab-pane label="支付信息" name="fourth">支付信息</el-tab-pane>
    </el-tabs>
    <div class="titleOne" v-if="activeName=='first'">客户基本信息</div>
    <div class="topLine" v-if="activeName=='first'">
      <div class="custorName">
        <div class="name">客户名称</div>
        <div class="nameInput">
          <el-input v-model="param.enterpriseName" placeholder="输入关联认证公司名称"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">客户负责人</div>
        <div class="codeInput">
          <el-input v-model="param.contactsPeople" placeholder="输入负责人"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">客户电话</div>
        <div class="codeInput">
          <el-input v-model="param.contactsPhone" placeholder="输入联系电话"></el-input>
        </div>
      </div>
    </div>

    <div class="titleOne" v-if="activeName=='second'">设备基本信息</div>
    <!-- <div class="code" style="margin:20px 120px">
      设备编码
      <div class="codeInput" style=" margin-left: 20px;">
        <el-input v-model="param.no" placeholder="输入设备编码"></el-input>
      </div>
    </div>-->
    <div class="midLine" v-if="activeName=='second'">
      <div class="custorName">
        <div class="name">贴牌编码</div>
        <div class="nameInput">
          <el-input v-model="deviceList.no" placeholder="输入贴牌编码"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">保养周期</div>
        <div class="codeInput">
          <el-input v-model="time" placeholder="输入保养周期"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">出厂时间</div>
        <div class="codeInput">
          <el-date-picker
            v-model="deviceList.factoryTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <div class="midLine" v-if="activeName=='second'">
      <div class="custorName">
        <div class="name">设备品牌</div>
        <div class="nameInput">
          <el-input v-model="deviceList.deviceBrand" placeholder="输入贴牌编码"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">设备型号</div>
        <div class="codeInput">
          <el-input v-model="deviceList.deviceModel" placeholder="输入设备型号"></el-input>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">价格</div>
        <div class="codeInput">
          <el-input v-model="deviceList.price" placeholder="输入价格"></el-input>
        </div>
      </div>
    </div>
    <div class="midLine" v-if="activeName=='second'">
      <div class="custorName">
        <div class="name">设备系统</div>
        <div class="nameInput">
          <el-cascader
            v-model="value"
            :options="systemList"
            :props="{
              children:'list',
              label:'name',
              value:'id'
          }"
            @change="systemChange"
          ></el-cascader>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">设备类型</div>
        <div class="codeInput">
          <el-select v-model="type" placeholder="请选择设备类型" @change="typeChange">
            <el-option
              v-for="(item,index) in typeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">设备产地</div>
        <div class="codeInput">
          <el-select v-model="place" placeholder="选择产地" @change="placeChange">
            <el-option label="国产" value="国产"></el-option>
            <el-option label="进口" value="进口"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="bottomLine" v-if="activeName=='second'">
      <div class="custorName">
        <div class="name">维保时间</div>
        <div class="nameInput">
          <el-date-picker
            v-model="choseeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timeChange"
          ></el-date-picker>
        </div>
      </div>
      <div class="custorCode">
        <div class="code">铭牌图片</div>
        <div class="codeInput">
          <el-upload
            action
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :http-request="httpRequestFn"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <div class="btnSmbit" v-if="activeName=='second'">
        <el-button type="success" size plain @click="_editButlerOrder">保存基本信息</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="param.nameplateImg" alt />
    </el-dialog>

    <div class="titlePart" v-if="activeName=='second'">
      <div class="titleOne">设备配置信息</div>
      <el-button icon="el-icon-refresh" plain type="primary" @click="addPart">新增</el-button>
      <el-button icon="el-icon-refresh" plain type="primary" @click="delited">删除全部</el-button>
    </div>
    <div class="listPart" v-if="activeName=='second'">
      <el-table highlight-current-row :data="deviceList.partsList" style="width: 100%;">
        <el-table-column
          prop="category"
          label="项目大类"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="项目名称" show-overflow-tooltip width="200" align="center"></el-table-column>
        <el-table-column
          prop="deviceBrand"
          label="设备品牌"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceModel"
          label="型号"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column prop="unit" label="单位" show-overflow-tooltip width="150" align="center"></el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="changePart(row)">修改</el-button>
              <!-- <el-button type="info" size="mini" plain @click="querySnatchList(row)">删除</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="titlePart" v-if="activeName=='third'">
      <div class="titleOne">投保设备列表</div>
    </div>
    <div class="listPart" v-if="activeName=='third'">
      <el-table highlight-current-row :data="param.deviceList" style="width: 100%;">
        <el-table-column prop="no" label="设备编号" show-overflow-tooltip width="200" align="center"></el-table-column>
        <el-table-column prop="nameplateImg" label="设备铭牌" show-overflow-tooltip align="center">
          <template slot-scope="{row}">
            <y-image
              :src="row.nameplateImg?row.nameplateImg.split(',')[0]:''"
              :srcList="row.nameplateImg?row.nameplateImg.split(','):''"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceTypeId"
          label="设备类型"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceBrand"
          label="设备品牌"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceModel"
          label="设备型号"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="devicePlace"
          label="设备产地"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column prop="price" label="维保价格" show-overflow-tooltip width="150" align="center"></el-table-column>
        <el-table-column
          prop="startTime"
          label="投保时间"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="queryDesc(row)">修改</el-button>
              <el-button type="info" size="mini" plain @click="querySnatchList(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="titlePart" v-if="activeName=='fourth'">
      <div class="titleOne">支付信息列表</div>
    </div>
    <div class="listPart" v-if="activeName=='fourth'">
      <el-table highlight-current-row :data="param.payInfoList" style="width: 100%;">
        <el-table-column prop="payTime" label="时间" show-overflow-tooltip width="340" align="center"></el-table-column>
        <el-table-column
          prop="payAmount"
          label="金额"
          show-overflow-tooltip
          width="340"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="paymentEnterpriseName"
          label="客户名称"
          show-overflow-tooltip
          width="340"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="deviceModel"
          label="收款账号"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>-->
        <el-table-column label="操作" width="300px" fixed="right">
          <template slot-scope="{row}">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="_payDetail(row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btnSmbit" v-if="activeName=='fourth'">
      <el-button type="success" size plain @click="_addPay">新增支付流水</el-button>
      <el-button type="success" size plain @click="_editButlerOrderAll">保存表单</el-button>
    </div>
    <el-dialog
      title="添加配置"
      :visible.sync="dialogpop"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addPart">
          <div class="addcontent">
            <div class="name">项目大类:</div>
            <el-input
              v-model="partsList.category"
              :value="partsList.category"
              placeholder="请填写项目大类"
            ></el-input>
          </div>
          <div class="addcontent">
            <div class="name">项目名称:</div>
            <el-input v-model="partsList.name" :value="partsList.name" placeholder="请填写项目名称"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">品牌:</div>
            <el-input
              v-model="partsList.deviceBrand"
              :value="partsList.deviceBrand"
              placeholder="请输入品牌"
            ></el-input>
          </div>
          <div class="addcontent">
            <div class="name">型号:</div>
            <el-input
              v-model="partsList.deviceModel"
              :value="partsList.deviceModel"
              placeholder="请填写型号"
            ></el-input>
          </div>
          <div class="addcontent">
            <div class="name">单位:</div>
            <el-input v-model="partsList.unit" :value="partsList.unit" placeholder="请填写配件单位"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">规格:</div>
            <el-input
              v-model="partsList.specification"
              :value="partsList.specification"
              placeholder="请填写配件规格"
            ></el-input>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="addFalse">取消</el-button>
        <el-button type="primary" @click="addTrue">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="新增流水"
      :visible.sync="addPay"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addPart">
          <div class="addcontent">
            <div class="name">客户名称:</div>
            <el-input v-model="payInfoList.paymentEnterpriseName" placeholder="请填写支付方-企业名称"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">支付金额:</div>
            <el-input v-model="payInfoList.payAmount" placeholder="请输入支付金额"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">付款时间</div>
            <div class="codeInput">
              <el-date-picker
                v-model="payInfoList.payTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
          <div class="addcontent">
            <div class="name">备注:</div>
            <el-input v-model="payInfoList.remarks" placeholder="备注信息"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">上传附件</div>
            <div class="codeInput">
              <el-upload
                action
                list-type="picture-card"
                :on-remove="handleRemove"
                :http-request="httpRequestFnfujian"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="addPayFalse">取消</el-button>
        <el-button type="primary" @click="addPayTrue">添加</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="支付详情"
      :visible.sync="payDetail"
      :close-on-click-modal="true"
      :modal="true"
      :show-close="true"
      :center="true"
    >
      <el-from label-width="1000px">
        <div class="addPart">
          <div class="addcontent">
            <div class="name">客户名称</div>
            <el-input :value="partDetail.paymentEnterpriseName"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">支付金额</div>
            <el-input :value="partDetail.payAmount"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">付款时间</div>
            <el-input :value="partDetail.payTime"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">备注</div>
            <el-input :value="partDetail.remarks"></el-input>
          </div>
          <div class="addcontent">
            <div class="name">付款凭证:</div>
            <img :src="partDetail.enclosure" alt />
          </div>
        </div>
      </el-from>
      <div class="addPartBtn">
        <el-button type="primary" @click="_addFalse">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { UploadImg } from "@/api/system.js";
import { editButlerOrder } from "@/api/order.js";
import { queryDeviceTypeList, queryDeviceSystemList } from "@/api/order.js";
export default {
  data() {
    return {
      addPay: false,
      payDetail: false,
      activeName: "first",
      headers: "",
      choseeTime: "",
      place: "",
      time: "",
      systemList: [],
      type: "",
      typeList: [],
      dialogChosee: false,
      dialogpop: false,
      dataList: [],
      dialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      value: [],
      protecTime: [],
      value2: [],
      options: [
        {
          value: "",
          label: "",
          children: []
        },
        {
          value: "",
          label: "",
          children: []
        }
      ],
      param: {
        contactsPeople: "",
        contactsPhone: "",
        deviceList: [],
        payInfoList: []
      },
      partsList: {
        category: "",
        deviceBrand: "",
        deviceModel: "",
        name: "",
        specification: "",
        unit: ""
      },
      deviceList: {
        factoryTime: "",
        no: "",
        deviceTypeId: "",
        nameplateImg: "",
        devicePlace: "",
        deviceBrand: "",
        deviceModel: "",
        deviceSystemId: "",
        price: "",
        startTime: "",
        endTime: "",
        partsList: []
      },
      payInfoList: {
        enclosure: "",
        payAmount: "",
        payTime: "",
        paymentEnterpriseName: "",
        remarks: ""
      },
      partDetail: []
    };
  },
  created() {
    this._queryDeviceTypeList();
    this._queryDeviceSystemList();
  },
  methods: {
    changePart(row) {
      this.dialogpop = true;
      this.partsList = row;
    },
    queryDesc(row) {
      console.log(row);
      this.deviceList = row;
      this.activeName = "second";
    },
    _addFalse() {
      this.payDetail = false;
    },
    addPayTrue() {
      this.param.payInfoList.push(this.payInfoList);
      alert("添加成功");
      this.addPay = false;
      console.log(this.param.payInfoList);
    },
    addPayFalse() {
      this.addPay = false;
    },
    _addPay() {
      this.addPay = true;
    },
    _payDetail(row) {
      this.payDetail = true;
      console.log("详情", row);
      this.partDetail = row;
    },
    _editButlerOrder() {
      console.log(this.deviceList);
      this.param.deviceList.push(this.deviceList);
      console.log(this.param.deviceList);
      this.activeName = "third";
      this.deviceList = "";
    },
    _editButlerOrderAll() {
      let param = this.param;
      editButlerOrder(param).then(res => {
        if (res) {
          console.log("提交", res);
          alert("添加成功");
          this.$router.push({
            name: "customer",
          });
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event, this.activeName);
    },
    httpRequestFn(data) {
      const loading = this.$loading({ text: "上传中.." });
      const formData = new FormData();
      formData.append("file", data.file);
      UploadImg(formData)
        .then(res => {
          this.$emit("uploadSuc", res.data);
          this.$message({
            showClose: true,
            message: "文件上传成功！",
            type: "success"
          });
          loading.close();
          this.deviceList.nameplateImg = res.data;
          console.log(this.deviceList.nameplateImg, "图片上传");
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "文件上传失败！",
            type: "warning"
          });
          loading.close();
        });
    },
    httpRequestFnfujian(data) {
      const loading = this.$loading({ text: "上传中.." });
      const formData = new FormData();
      formData.append("file", data.file);
      UploadImg(formData)
        .then(res => {
          this.$emit("uploadSuc", res.data);
          this.$message({
            showClose: true,
            message: "文件上传成功！",
            type: "success"
          });
          loading.close();
          this.payInfoList.enclosure = res.data;
          console.log(this.payInfoList.enclosure, "支付凭证");
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "文件上传失败！",
            type: "warning"
          });
          loading.close();
        });
    },
    _queryDeviceTypeList() {
      queryDeviceTypeList().then(res => {
        console.log("设备类型", res);
        this.typeList = res.data;
      });
    },
    _queryDeviceSystemList() {
      queryDeviceSystemList().then(res => {
        console.log("系统类型", res);
        this.systemList = res.data;
      });
    },
    placeChange(value) {
      this.deviceList.devicePlace = value;
      console.log(this.deviceList.devicePlace, value, "产地");
    },
    systemChange(value) {
      console.log(value);
      this.deviceList.deviceSystemId = value[1];
      console.log("系统id", this.deviceList.deviceSystemId);
    },
    timeChange(e) {
      this.deviceList.startTime = e[0];
      this.deviceList.endTime = e[1];
      console.log(
        "时间",
        this.deviceList.startTime,
        this.deviceList.endTime,
        e
      );
    },
    typeChange(value) {
      console.log(value);
      this.deviceList.deviceTypeId = value;
      console.log("设备类型id", this.deviceList.deviceTypeId);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadSuccess(file, fileList) {
      this.param.nameplateImg = file.url;
      console.log(this.param.nameplateImg, file);
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    addPart() {
      this.dialogpop = true;
    },
    addFalse() {
      this.dialogpop = false;
    },
    addTrue() {
      if (
        !this.partsList.category ||
        !this.partsList.name ||
        !this.partsList.deviceBrand ||
        !this.partsList.deviceModel ||
        !this.partsList.unit ||
        !this.partsList.specification
      ) {
        alert("表单未填写完整");
      } else {
        this.deviceList.partsList.push(this.partsList);
        console.log(this.deviceList.partsList);
        this.partsList = {
          category: "",
          deviceBrand: "",
          deviceModel: "",
          name: "",
          specification: "",
          unit: ""
        };
        this.dialogpop = false;
      }
    },
    delited() {}
  }
};
</script>

<style lang="scss" scoped>
.mainPart {
  margin: 20px;
  background: #fff;
  .titleOne {
    padding: 20px;
    font-size: 26px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #0b2059;
  }
  .topLine {
    width: 1800px;
    padding: 30px 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .custorName {
      display: flex;
      justify-content: center;
      align-items: center;
      .name {
        font-size: 24px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .nameInput {
        margin-left: 20px;
        width: 400px;
      }
    }
    .custorCode {
      justify-content: center;
      align-items: center;
      display: flex;
      .code {
        display: flex;
        font-size: 24px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .codeInput {
        margin-left: 20px;
        width: 300px;
      }
    }
  }
  .cut {
    margin: 50px 0;
    height: 2px;
    background: #ebebeb;
    width: 1500px;
    margin-left: 10%;
  }
  .midLine {
    height: 40px;
    width: 1800px;
    padding: 30px 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .custorName {
      display: flex;
      justify-content: center;
      align-items: center;
      .name {
        font-size: 20px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .nameInput {
        margin-left: 20px;
        width: 300px;
      }
    }
    .custorCode {
      justify-content: center;
      align-items: center;
      display: flex;
      .code {
        display: flex;
        font-size: 20px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .codeInput {
        margin-left: 20px;
        width: 300px;
      }
    }
  }
  .bottomLine {
    width: 100vw;
    padding: 50px 120px;
    display: flex;
    justify-content: start;
    align-items: center;
    .custorName {
      display: flex;
      justify-content: center;
      align-items: center;
      .name {
        font-size: 20px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .nameInput {
        margin-left: 20px;
        width: 200px;
      }
    }
    .custorCode {
      height: 200px;
      margin-left: 12%;
      justify-content: start;
      align-items: center;
      display: flex;
      width: 1000px;
      .code {
        display: flex;
        font-size: 20px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #707070;
      }
      .codeInput {
        margin-left: 20px;
        width: auto;
      }
    }
  }
}
.must {
  color: red;
}
.code {
  display: flex;
  font-size: 20px;
  font-family: Microsoft YaHei-Bold, Microsoft YaHei;
  font-weight: bold;
  color: #707070;
  .codeInput {
    display: flex;
    width: 200px;
  }
}
.titlePart {
  display: flex;
  height: 40px;
  align-items: center;
}
.listPart {
  margin: 45px 100px;
  width: 1600px;
  height: auto;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #d5d5d5;
  display: flex;
  justify-content: center;
  //   padding-bottom: 20px;
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