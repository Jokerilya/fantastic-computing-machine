<template>
  <div>
    <el-dialog
      width="40%"
      :visible="dialogVisible"
      :before-close="handleClose"
      :center="true"
    >
      <template slot="title">
        <div class="titleStyle" style="padding-top:20px ;">{{ title }}</div>
      </template>
      <div style="display: flex; justify-content: center;">
        <el-form
          label-position="left"
          label-width="120px"
          :model="accessoriesForm"
        >
          <el-form-item>
            <template slot="label">
              <span class="titleStyle">配件大类</span>
            </template>
            <el-input
              prop="category"
              class="inpstyle"
              v-model="accessoriesForm.category"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="titleStyle">配件名称</span>
            </template>
            <el-input
              prop="name"
              class="inpstyle"
              v-model="accessoriesForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="titleStyle">配件品牌</span>
            </template>
            <el-input
              prop="deviceBrand"
              class="inpstyle"
              v-model="accessoriesForm.deviceBrand"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="titleStyle">配件型号</span>
            </template>
            <el-input
              prop="deviceModel"
              class="inpstyle"
              v-model="accessoriesForm.deviceModel"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <template slot="label">
              <span class="titleStyle">配件规格</span>
            </template>
            <el-input
              prop="specification"
              class="inpstyle"
              v-model="accessoriesForm.specification"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="handleClose" class="cancelBtn">取 消</el-button>
        <el-button class="confirmBtn" type="primary" @click="confirmFn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editDeviceParts } from "@/api/equipmentManagement";

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 配件参数
      accessoriesForm: {
        category: "",
        deviceBrand: "",
        deviceId: "",
        deviceModel: "",
        name: "",
        specification: "",
      },
    };
  },
  methods: {
    // 确定按钮事件
    async confirmFn() {
      for (const key in this.accessoriesForm) {
        if (this.accessoriesForm[key] === null) {
          this.accessoriesForm[key] = "";
        }
      }
      await editDeviceParts(this.accessoriesForm);
      this.$emit("refreshList");
      this.handleClose("comfirm");
    },
    // 关闭按钮事件
    async handleClose() {
      this.accessoriesForm = {
        category: "",
        deviceBrand: "",
        deviceId: "",
        deviceModel: "",
        name: "",
        specification: "",
      };
      this.$emit("closeFn");
    },
  },
};
</script>

<style lang="less" scoped>
// 取消按钮样式
.cancelBtn {
  color: #2d4d9f;
  background-color: #fff;
  border: 1px solid #2d4d9f;
}
// 确定按钮样式
.confirmBtn {
  color: #fff;
  background-color: #304ba2;
}

// 标题样式
.titleStyle {
  color: #707070;
  font-size: 20px;
  font-weight: 700;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
