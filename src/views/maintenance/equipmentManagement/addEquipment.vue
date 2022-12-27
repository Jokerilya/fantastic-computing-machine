<template>
  <div class="equipmentDetails">
    <!-- 设备基本信息内容 -->
    <div class="equipmentDetails_basicInfo">
      <h2 class="basicInfo_title">{{ titleName }}</h2>
      <el-card>
        <div class="basicInfo_content">
          <div class="itemLine">
            <div class="item">
              <span class="item_title">贴片编码</span>
              <el-input
                v-model="equipmentAddForm.no"
                placeholder="请输入贴片编码"
              ></el-input>
            </div>
            <div class="item">
              <span class="item_title">保养周期</span>
              <el-input
                @input="judgmentInputValue('cycle')"
                v-model.number="equipmentAddForm.cycle"
                placeholder="请输入保养周期"
              ></el-input>
            </div>
            <div class="item">
              <span class="item_title">出厂时间</span>
              <el-date-picker
                style="width: 100%;"
                v-model="equipmentAddForm.factoryTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="请输入出厂时间"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">设备类型</span>
              <el-cascader
                style="width: 100%;"
                :props="{
                  label: 'name',
                  children: 'list',
                  checkStrictly: true,
                  emitPath: false,
                  value: 'id',
                }"
                clearable
                :show-all-levels="false"
                :collapse-tags="true"
                v-model="equipmentAddForm.deviceTypeId"
                :options="deviceTypeList"
                placeholder="请输入设备类型"
              ></el-cascader>
            </div>
            <div class="item">
              <span class="item_title">设备品牌</span>
              <el-input
                v-model="equipmentAddForm.deviceBrand"
                placeholder="请输入设备品牌"
              ></el-input>
            </div>
            <div class="item">
              <span class="item_title">设备型号</span>
              <el-input
                v-model="equipmentAddForm.deviceModel"
                placeholder="请输入设备型号"
              ></el-input>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">设备轴数</span>
              <el-input
                v-model="equipmentAddForm.axesNumber"
                placeholder="请输入设备轴数"
              ></el-input>
            </div>
            <div class="item">
              <span class="item_title">设备系统</span>
              <el-cascader
                style="width: 100%;"
                :props="{
                  label: 'name',
                  children: 'list',
                  checkStrictly: true,
                  emitPath: false,
                  value: 'id',
                }"
                clearable
                :show-all-levels="false"
                :collapse-tags="true"
                v-model="equipmentAddForm.deviceSystemId"
                :options="deviceSystemList"
                placeholder="请输入设备系统"
              ></el-cascader>
            </div>
            <div class="item">
              <span class="item_title">设备产地</span>
              <el-select
                v-model="equipmentAddForm.devicePlace"
                placeholder="请输入设备产地"
                style="width: 100%;"
              >
                <el-option label="进口" value="进口"> </el-option>
                <el-option label="国产" value="国产"> </el-option>
              </el-select>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">维保时间</span>
              <el-date-picker
                style="width: 100%;"
                v-model="equipmentAddForm.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>

            <div class="item">
              <span class="item_title">价格</span>
              <el-input
                @input="judgmentInputValue('price')"
                v-model.number="equipmentAddForm.price"
                placeholder="请输入价格"
              ></el-input>
            </div>
          </div>
          <div class="itemLine">
            <div class="item">
              <span class="item_title">企业设备编码</span>
              <el-input
                v-model="equipmentAddForm.enterpriseDeviceNo"
                placeholder="请输入企业设备编码"
              ></el-input>
            </div>
            <div class="item">
              <span class="item_title">企业设备位置</span>
              <el-input
                v-model="equipmentAddForm.enterpriseDevicePosition"
                placeholder="请输入企业设备位置"
              ></el-input>
            </div>
          </div>
          <div class="itemLine" style="height: 160px;">
            <div class="item">
              <span class="item_title">铭牌图片</span>
              <el-upload
                accept=".jpg, .jpeg, .JPG, .JPEG,.png"
                :on-remove="removeNameplatePic"
                :class="{ hide_box: upload_btn }"
                action="#"
                list-type="picture-card"
                :http-request="uploadNameplatePic"
                :limit="1"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
          <el-button class="btnTool" @click="addEditEquipment">{{
            titleName === "新增设备信息" ? "确定新增设备" : "确定编辑设备"
          }}</el-button>
        </div>
      </el-card>
    </div>
    <!-- 设备配置信息内容 -->
    <div
      class="equipmentDetails_configInfo"
      v-if="titleName !== '新增设备信息'"
    >
      <div class="tool">
        <h2 class="configInfo_title">设备配件信息</h2>
        <el-button
          style="background-color: #2f4d9e;color: #fffefd;"
          @click="addPartsList"
          >新增</el-button
        >
        <el-button style="color: #2f4d9e;border: 1px solid #2f4d9e;"
          >保存</el-button
        >
        <span style="margin-left: 10px;color: red;">注:配件修改完必须保存</span>
      </div>
      <el-card>
        <!-- 放配件表格 -->
        <el-table
          :data="partsList"
          :cell-style="{ 'text-align': 'center' }"
          style="width: 100%"
          :header-cell-style="{
            background: '#f6f8fc',
            color: '#707070',
            'text-align': 'center',
          }"
          :key="certinfoKey"
        >
          <el-table-column label="编号">
            <template slot-scope="scope">{{ scope.$index + 1 }} </template>
          </el-table-column>
          <el-table-column prop="category" label="项目大类"></el-table-column>
          <el-table-column prop="name" label="项目名称"> </el-table-column>
          <el-table-column prop="deviceBrand" label="品牌"> </el-table-column>
          <el-table-column prop="deviceModel" label="型号"> </el-table-column>
          <el-table-column label="单位">mm</el-table-column>
          <el-table-column prop="specification" label="规格"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a
                style="color: #2f4d9e;margin-right: 10px;"
                @click="editpartsList(scope.row, scope.$index)"
                >修改</a
              >
              <a
                style="color: #2f4d9e;"
                @click="delpartsList(scope.$index, scope.row)"
                >删除</a
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 新增设备配件 -->
    <el-dialog
      :visible="addPartsListDialogShow"
      width="40%"
      :center="true"
      :show-close="false"
    >
      <div
        slot="title"
        style="margin-top: 20px;color: #7a797c;font-weight: 700;"
      >
        {{ addPartsListName }}
      </div>
      <div style="padding: 0 20%;">
        <el-form
          :model="partsListForm"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="项目大类">
            <el-input v-model="partsListForm.category"></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="partsListForm.name"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
            <el-input v-model="partsListForm.deviceBrand"></el-input>
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="partsListForm.deviceModel"></el-input>
          </el-form-item>
          <el-form-item label="规格">
            <el-input v-model="partsListForm.specification"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button
          style="width: 100px;color: #2d4da0;border: 1px solid #2d4da0;"
          @click="closeAddPartsListDialog"
          >取消</el-button
        >
        <el-button
          style="width: 100px;background-color: #2d4da0;color: #fff;"
          @click="addPartsListComfirm(partsListForm.index)"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editDeviceInfo, getEquipmentDetails } from "@/api/equipmentManagement";
import { queryDeviceSystemList, queryDeviceTypeList } from "@/api/order";
import { UploadImg } from "@/api/system";

export default {
  data() {
    return {
      equipmentAddForm: {
        no: "",
        cycle: null,
        factoryTime: "",
        deviceTypeId: "",
        deviceBrand: "",
        deviceModel: "",
        axesNumber: "",
        deviceSystemId: "",
        devicePlace: "",
        startTime: "",
        endTime: "",
        price: null,
        enterpriseDeviceNo: "",
        enterpriseDevicePosition: "",
        nameplateImg: "",
        time: "",
        type: 0,
        orderSn: "SE447443",
      },
      deviceTypeList: null, // 所有设备类型
      deviceSystemList: null, // 所有设备系统
      upload_btn: false, // 是否隐藏上传图片按钮
      partsList: null, //配件列表
      titleName: "新增设备信息",
      addPartsListName: "新增设备配件",
      id: "", //编辑需要的id
      addPartsListDialogShow: false,
      partsListForm: {
        name: "",
        category: "",
        deviceBrand: "",
        deviveModel: "",
        specification: "",
      },
      certinfoKey: true,
    };
  },
  methods: {
    // 判断周期和价格
    judgmentInputValue(str) {
      var re = /^[0-9]+.?[0-9]*/;
      if (this.equipmentAddForm[str] === "") {
        this.equipmentAddForm[str] = 0;
      } else if (!re.test(this.equipmentAddForm[str])) {
        this.$message({
          message: "只能输数字哦",
          type: "warning",
        });
        this.equipmentAddForm[str] = 0;
      }
    },
    // 点击编辑设备配件弹窗
    editpartsList(row, index) {
      this.addPartsListName = "编辑设备配件";
      this.addPartsListDialogShow = true;
      this.partsListForm = { ...row, index };
    },
    // 确定添加设备配件
    addPartsListComfirm(index) {
      if (this.addPartsListName === "编辑设备配件") {
        this.partsList[index] = this.partsListForm;
        this.certinfoKey = !this.certinfoKey;
      } else {
        if (!this.partsList) {
          this.partsList = [];
        }
        this.partsList.push(this.partsListForm);
      }
      this.$message({
        type: "success",
        message:
          this.addPartsListName === "编辑设备配件" ? "编辑成功" : "添加成功",
      });
      this.closeAddPartsListDialog();
    },
    // 关闭新增设备配件弹窗
    closeAddPartsListDialog() {
      this.addPartsListDialogShow = false;
      this.partsListForm = {
        name: "",
        category: "",
        deviceBrand: "",
        deviveMoDEL: "",
        specification: "",
      };
    },
    //新增设备配件
    addPartsList() {
      this.addPartsListName = "新增设备配件";
      this.addPartsListDialogShow = true;
    },
    // 删除设备配件
    delpartsList(index, row) {
      this.$confirm("您确定删除" + row.name + "?", "删除", {
        type: "warning",
      }).then(() => {
        this.partsList.splice(index, 1);
        this.$message({
          type: "success",
          message: "删除成功",
        });
      });
    },
    // 新增编辑设备
    async addEditEquipment() {
      this.equipmentAddForm.endTime =
        this.equipmentAddForm.time[1] + " 00:00:00";
      this.equipmentAddForm.startTime =
        this.equipmentAddForm.time[0] + " 00:00:00";
      console.log(this.equipmentAddForm);
      const res = await editDeviceInfo(this.equipmentAddForm);
      console.log(res);
    },
    // 移除铭牌图片
    removeNameplatePic() {
      this.equipmentAddForm.nameplateImg = "";
      setTimeout(() => {
        this.upload_btn = false;
      }, 1050);
    },
    // 上传铭牌图片
    async uploadNameplatePic(fileData) {
      const formData = new FormData();
      this.upload_btn = true;
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      this.equipmentAddForm.nameplateImg = res.data;
    },
  },
  async created() {
    this.titleName = this.$route.query.titleName;
    if (this.titleName !== "新增设备信息") {
      this.id = this.$route.query.id;
      // 详情数据回显
      const res = await getEquipmentDetails({ id: this.id });
      this.equipmentAddForm = { ...res.data };
      if (this.equipmentAddForm.startTime) {
        this.equipmentAddForm.time = [
          res.data.startTime.substring(0, 10),
          res.data.endTime.substring(0, 10),
        ];
      }
      this.partsList = res.data.partsList;
    }
    // 所有的设备类型
    const deviceTypeList = await queryDeviceTypeList();
    this.deviceTypeList = deviceTypeList.data;
    // 所有的设备系统
    const deviceSystemList = await queryDeviceSystemList();
    this.deviceSystemList = deviceSystemList.data;
  },
};
</script>

<style lang="less" scoped>
.hide_box /deep/ .el-upload--picture-card {
  display: none;
}

// 设备基本信息内容
.equipmentDetails {
  padding: 20px;
  .equipmentDetails_basicInfo {
    .basicInfo_title {
      color: #0b2059;
      margin: 0 0 20px 30px;
    }
    .basicInfo_content {
      padding: 0 0 0 20px;
      position: relative;
      .btnTool {
        position: absolute;
        bottom: 10px;
        right: 60px;
        background-color: #2f4d9e;
        color: #fff;
      }
      .itemLine {
        height: 45px;
        display: flex;
        margin-bottom: 10px;

        .item {
          width: 33%;
          display: flex;
          align-items: center;
          color: #707070;
          font-size: 15px;
          padding: 0 20px;

          .item_title {
            font-size: 20px;
            font-weight: 700;
            width: 250px;
          }
        }
      }
    }
  }
}

// 设备配置信息内容
.equipmentDetails_configInfo {
  margin-bottom: 20px;
  .tool {
    display: flex;
    align-items: center;
    .el-button {
      height: 35px;
      width: 70px;
    }
  }
  .configInfo_title {
    color: #0b2059;
    margin: 20px 30px;
  }
}
</style>
