<!-- 代下单页面 -->
<template>
  <div class="agentOrder">
    <!-- 代下单需要的信息 -->
    <div class="agentOrder_info">
      <el-card>
        <div class="info_top">
          <div class="item">
            <div class="labelStyle">设备类型</div>
            <el-cascader
              :show-all-levels="false"
              v-model="typeValue"
              :options="typeOptions"
              :props="{ value: 'id', label: 'name', children: 'list' }"
            ></el-cascader>
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
            <el-cascader
              :show-all-levels="false"
              v-model="systemValue"
              :options="systemOptions"
              :props="{ value: 'id', label: 'name', children: 'list' }"
            ></el-cascader>
            <!-- <el-select
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
            </el-select> -->
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
              上传设备图片、故障部位图片或视频(最多上传3张图片)
            </div>
            <el-upload
              :limit="3"
              action="#"
              list-type="picture-card"
              :http-request="handlePictureCardPreview"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
        <div class="info_under">
          <div class="item">
            <div class="labelStyle" style="margin-right: 20px;">
              服务期望日期
            </div>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="data.serviceTime"
              type="datetime"
              placeholder="请选择预计服务日期"
            >
            </el-date-picker>
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
              @blur="phoneCheck"
              placeholder="请输入联系人电话"
              class="inp"
              v-model.number="data.contactsPhone"
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
      typeValue: null,
      typeOptions: null,
      systemValue: null,
      systemOptions: null,

      deviceTypeList: [], // 设备类型
      deviceSystemList: [], //设备系统
      checkList: [],
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
    // 判断手机号码格式
    phoneCheck() {
      if (!/^1[3456789]\d{9}$/.test(this.data.contactsPhone)) {
        this.$message({
          message: "手机号码格式不对",
          type: "warning",
        });
        this.data.contactsPhone = "";
      }
    },
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
      this.data.deviceTypeId = this.typeValue[1];
      this.data.deviceSystemId = this.systemValue[1];
      await this.checkType(this.checkList);
      await this.checkType(this.dialogImageUrl);
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
    this.typeOptions = list.data;
    this.systemOptions = list1.data;
    loading.close();
  },
};
</script>

<style lang="less" scoped>
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
