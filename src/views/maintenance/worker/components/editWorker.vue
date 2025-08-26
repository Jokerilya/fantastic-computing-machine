<template>
  <div v-if="dialogForm">
    <el-dialog
      title="编辑师傅"
      :visible="dialogVisible"
      :before-close="closeFn"
      width="35%"
      :style="{ height: '90vh' }"
    >
      <div style="height: 60vh; overflow: auto">
        <el-form label-width="120px" label-position="left">
          <el-form-item label="姓名">
            <el-input v-model="dialogForm.realName"></el-input>
          </el-form-item>
          <el-form-item label="身份证">
            <el-input v-model="dialogForm.identityNumber"></el-input>
          </el-form-item>
          <el-form-item label="行业经验">
            <el-input v-model="dialogForm.industryExperience"></el-input>
          </el-form-item>
          <el-form-item label="服务部位">
            <el-select
              v-model="dialogForm.servePosition"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in positionList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务地区">
            <el-cascader
              v-model="dialogForm.serviceAreas"
              :options="serviceAreasList"
              :props="serviceAreasProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-cascader
              v-model="dialogForm.serviceTypes"
              :options="typeList"
              :props="serviceTypesProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="师傅编号">
            <el-input
              v-model="dialogForm.number"
              @input="blurWorkerNum"
            ></el-input>
          </el-form-item>
          <el-form-item label="真实头像">
            <el-upload
              style="width: 50%"
              :file-list="avatarFileList"
              :limit="1"
              action="#"
              :http-request="avatarUploadFn"
              accept=".jpg,.png"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="身份证正面照">
            <el-upload
              style="width: 50%"
              :file-list="idJustFileList"
              :limit="1"
              action="#"
              accept=".jpg,.png"
              :http-request="idJustUploadFn"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="身份证反面照">
            <el-upload
              style="width: 50%"
              :file-list="idBackFileList"
              :http-request="idBackUploadFn"
              accept=".jpg,.png"
              :limit="1"
              action="#"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addressFn, UploadImg } from "@/api/system";
import {
  editMasterInfo,
  queryDevicePositionList,
  queryDeviceTypeList,
  queryMasterName,
} from "@/api/order";

export default {
  data() {
    return {
      dialogVisible: false,
      positionList: null,

      typeList: null,
      serviceAreasList: [],

      dialogForm: null,
      avatarFileList: [],
      idJustFileList: [],
      idBackFileList: [],
      serviceAreasProps: {
        checkStrictly: false,
        emitPath: false,
        multiple: true,
        value: "id",
        label: "name",
        children: "child",
      },
      serviceTypesProps: {
        checkStrictly: false,
        emitPath: false,
        multiple: true,
        value: "id",
        label: "name",
        children: "list",
      },
    };
  },
  async created() {
    const positionRes = await queryDevicePositionList();
    this.positionList = positionRes.data;
    const typeRes = await queryDeviceTypeList();
    this.typeList = typeRes.data;
  },
  mounted() {
    this.serviceAreasList = require("../../../../utils/address.json");
  },
  methods: {
    // 打开弹框
    async openEditworkerDialog(row) {
      if (row.servePosition) {
        row.servePosition = row.servePosition.split(",");
      }
      if (row.serviceAreas) {
        row.serviceAreas = row.serviceAreas.split(",");
      }
      if (row.serviceTypes) {
        row.serviceTypes = row.serviceTypes.split(",");
      }
      this.dialogForm = { ...row };
      // 对图片单独处理
      this.avatarFileList = [
        {
          url: row.realPortrait,
        },
      ];
      this.idJustFileList = [
        {
          url: row.identityFrontImage,
        },
      ];
      this.idBackFileList = [
        {
          url: row.identityBackImage,
        },
      ];
      this.dialogVisible = true;
    },
    // 判断师傅编号是否为数字或字母
    blurWorkerNum() {
      this.dialogForm.number = this.dialogForm.number.replace(/[^\w\/]/gi, "");
    },

    // 确定的事件
    async confirmFn() {
      if (this.dialogForm.servePosition) {
        this.dialogForm.servePosition = this.dialogForm.servePosition.join(",");
      }
      if (this.dialogForm.serviceAreas) {
        this.dialogForm.serviceAreas = this.dialogForm.serviceAreas.join(",");
      }

      if (this.dialogForm.serviceTypes) {
        this.dialogForm.serviceTypes = this.dialogForm.serviceTypes.join(",");
      }
      const res = await editMasterInfo(this.dialogForm);
      if (res.message === "操作成功") {
        this.$message({
          message: "编辑成功",
          type: "success",
        });
        this.closeFn();
      }
    },

    // 上传图片
    async idBackUploadFn(data) {
      const loading = this.$loading({
        text: "上传图片中,请耐心等待...",
      });
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.identityBackImage = res.data;
      this.idBackFileList = [
        {
          url: res.data,
        },
      ];
      loading.close();
    },
    async idJustUploadFn(data) {
      const loading = this.$loading({
        text: "上传图片中,请耐心等待...",
      });
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.identityFrontImage = res.data;
      this.idJustFileList = [
        {
          url: res.data,
        },
      ];
      loading.close();
    },
    async avatarUploadFn(data) {
      const loading = this.$loading({
        text: "上传图片中,请耐心等待...",
      });
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.realPortrait = res.data;
      this.avatarFileList = [
        {
          url: res.data,
        },
      ];
      loading.close();
    },
    // 关闭事件
    async closeFn() {
      await this.$emit("closeDialog");
      this.dialogVisible = false;
      this.dialogForm = null;
      this.avatarFileList = [];
      this.idJustFileList = [];
      this.idBackFileList = [];
    },
  },
};
</script>

<style lang="less">
.content {
  .oneLine {
    display: flex;
    margin-bottom: 20px;
    .item {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px 0 10px;
      .label {
        color: #1f1f1f;
        font-size: 15px;
        font-weight: 700;
      }

      .location {
        cursor: pointer;
        position: absolute;
        right: 13px;
        bottom: 9px;
        background-color: orange;
        color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
      }
    }
  }

  .imgLine {
    display: flex;
    height: 180px;
    overflow: hidden;
    .imgItem {
      flex: 1;
      padding: 0 5px;
      .title {
        color: #1f1f1f;
        font-size: 15px;
        margin-bottom: 10px;
        font-weight: 700;
      }
    }
  }
}
</style>
