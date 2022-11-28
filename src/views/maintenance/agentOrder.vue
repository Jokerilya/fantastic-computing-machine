<!-- 代下单页面 -->
<template>
  <div class="agentOrder">
    <!-- 代下单需要的信息 -->
    <div class="agentOrder_info">
      <el-card>
        <div class="info_top">
          <div class="item">
            <div class="labelStyle">设备类型</div>
            <el-select
              placeholder="请选择"
              class="inp"
              v-model="data.deviceTypeId"
            >
              <el-option
                v-for="item in deviceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <div class="labelStyle">设备品牌</div>
            <el-input
              placeholder="请输入设备品牌"
              class="inp"
              v-model="data.deviceBrand"
            ></el-input>
          </div>
        </div>
        <div class="info_top">
          <div class="item">
            <div class="labelStyle">设备系统</div>
            <el-select
              placeholder="请选择"
              class="inp"
              v-model="data.deviceSystemId"
            >
              <el-option
                v-for="item in deviceSystemList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <div class="labelStyle">设备数量</div>
            <el-input
              placeholder="请输入设备数量"
              class="inp"
              v-model.number="data.num"
            ></el-input>
          </div>
        </div>

        <hr color="#ebebeb" />

        <div class="info_under">
          <div class="item">
            <div class="labelStyle">设备产地</div>
            <el-radio v-model="data.devicePlace" label="国产">国产</el-radio>
            <el-radio v-model="data.devicePlace" label="进口">进口</el-radio>
          </div>
          <div class="item">
            <div class="labelStyle">故障类型</div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="1">机械故障</el-checkbox>
              <el-checkbox label="2">电气故障</el-checkbox>
              <el-checkbox label="3">系统故障</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="info_under twoHeight">
          <div class="item1">
            <div class="labelStyle">故障描述</div>
            <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入设备故障情况，异常，损坏原因等内容，方便师傅准确判断问题，准备工具，携带配件。"
              v-model="data.simpleDesc"
              resize="none"
              maxlength="500"
              show-word-limit
            >
            </el-input>
          </div>
          <div style="flex: 1;">
            <div style="color: #707070;font-weight: 700;margin-bottom: 20px;">
              上传设备图片、故障部位图片或视频(最多上传6个视频或图片)
            </div>
            <el-upload
              action="#"
              list-type="picture-card"
              :on-remove="handleRemove"
              :http-request="handlePictureCardPreview"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="info_under">
          <div class="item">
            <div style="margin-right: 20px;">
              <div class="labelStyle" style="margin-bottom: 5px;">
                服务期望日期
              </div>
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="expectDate"
                type="date"
                placeholder="请选择预计服务日期"
              >
              </el-date-picker>
            </div>
            <div>
              <div class="labelStyle" style="margin-bottom: 5px;">
                服务期望时间
              </div>
              <el-time-picker
                value-format="HH:mm:ss"
                arrow-control
                v-model="expectTime"
                placeholder="请选择预计服务日期"
              >
              </el-time-picker>
            </div>
          </div>
          <div class="item">
            <div class="labelStyle">紧急程度</div>
            <el-radio v-model="data.degree" :label="1">一般</el-radio>
            <el-radio v-model="data.degree" :label="2">紧急</el-radio>
          </div>
        </div>
        <div class="info_under">
          <div class="item">
            <div class="labelStyle">公司名称</div>
            <el-input
              placeholder="请输入公司名称"
              v-model="data.enterpriseName"
              class="inp"
            ></el-input>
          </div>
          <div class="item">
            <div class="labelStyle">联系人</div>
            <el-input
              placeholder="请输入联系人姓名"
              class="inp"
              v-model="data.contactsPeople"
            ></el-input>
          </div>
        </div>
        <div class="info_under">
          <div class="item">
            <div class="labelStyle">联系地址</div>
            <el-input
              placeholder="请输入联系地址"
              class="inp"
              v-model="data.address"
            ></el-input>
          </div>
          <div class="item">
            <div class="labelStyle">联系电话</div>
            <el-input
              placeholder="请输入联系人电话"
              class="inp"
              v-model="data.contactsPhone"
            ></el-input>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 底部工具栏 -->
    <div class="agentOrder_tool">
      <el-button class="btn btn1">取消</el-button>
      <el-button class="btn btn2" @click="confirmFn">提交订单</el-button>
    </div>
  </div>
</template>

<script>
import {
  agentCreateOrder,
  queryDeviceSystemList,
  queryDeviceTypeList,
} from "@/api/order";
import { UploadImg } from "@/api/system";

export default {
  data() {
    return {
      deviceTypeList: [], // 设备类型
      deviceSystemList: [], //设备系统
      checkList: [],
      expectDate: "",
      expectTime: "",
      dialogImageUrl: [],
      dialogVisible: false,

      data: {
        address: "",
        contactsPeople: "",
        contactsPhone: "",
        degree: null,
        deviceBrand: "",
        devicePlace: "",
        deviceSystemId: null,
        deviceTypeId: null,
        enterpriseName: "",
        images: "",
        num: null,
        serviceTime: "",
        simpleDesc: "",
        type: "",
        uid: "",
      },
    };
  },
  methods: {
    // 修改一下 data.type 数据类型
    checkType(arr) {
      let str = "";
      arr.forEach((el, index) => {
        if (index !== 0) {
          str = str + "," + el;
        } else {
          str = str + el;
        }
      });
      if (arr === this.checkList) {
        this.data.type = str;
      } else {
        this.data.images = str;
      }
    },
    // 点击提交订单
    async confirmFn() {
      await this.checkType(this.checkList);
      await this.checkType(this.dialogImageUrl);
      this.data.serviceTime = this.expectDate + " " + this.expectTime;
      const res = await agentCreateOrder(this.data);
      if (res.message === "操作成功") {
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
        setTimeout(() => {
          this.$router.push("/maintenance/maintenance_order");
        }, 1000);
      }
    },
    // 处理图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.dialogImageUrl);
    },
    async handlePictureCardPreview(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogImageUrl.push(res.data);
    },
  },
  async created() {
    const loading = this.$loading();
    const list = await queryDeviceTypeList();
    const list1 = await queryDeviceSystemList();
    this.deviceTypeList = list.data;
    this.deviceSystemList = list1.data;
    loading.close();
  },
};
</script>

<style lang="less">
// 标题样式
.labelStyle {
  width: 100px;
  color: #707070;
  font-weight: 700;
}
.inp {
  width: 250px;
}

.agentOrder {
  padding: 25px 40px;
  // 代下单需要的信息
  .agentOrder_info {
    margin-bottom: 20px;
    .info_top {
      display: flex;
      padding: 0 100px;
      margin-bottom: 20px;
      .item {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
    .twoHeight {
      height: 250px;
    }
    .info_under {
      margin-top: 20px;
      display: flex;
      padding: 0 100px;

      .item {
        flex: 1;
        display: flex;
        align-items: center;
      }
      .item1 {
        flex: 1;
        display: flex;
        padding-right: 20px;
      }
    }
  }
  // 工具栏
  .agentOrder_tool {
    display: flex;
    justify-content: flex-end;
    .btn {
      width: 160px;
      height: 40px;
    }
    .btn1 {
      color: #2e4c9e;
    }
    .btn2 {
      background-color: #2e4c9e;
      color: #fff;
    }
  }
}
</style>
