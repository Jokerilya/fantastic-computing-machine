<template>
  <div v-if="dialogForm">
    <el-dialog
      title="编辑师傅信息"
      :visible.sync="dialogVisible"
      :before-close="closeFn"
      width="650px"
      :close-on-click-modal="false"
      top="8vh"
      custom-class="edit-worker-dialog"
    >
      <div class="scroll-form-container">
        <el-form
          ref="editForm"
          :model="dialogForm"
          label-width="90px"
          label-position="right"
          size="small"
        >
          <div class="form-section-header">基础信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="师傅姓名">
                <el-input
                  v-model="dialogForm.realName"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="师傅编号">
                <el-input
                  v-model="dialogForm.number"
                  @input="blurWorkerNum"
                  placeholder="请输入编号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="身份证号">
            <el-input
              v-model="dialogForm.identityNumber"
              placeholder="请输入身份证号码"
            ></el-input>
          </el-form-item>

          <el-form-item label="行业经验">
            <el-input
              type="textarea"
              :rows="2"
              v-model="dialogForm.industryExperience"
              placeholder="请简述行业经验"
            ></el-input>
          </el-form-item>

          <div class="form-section-header">服务配置</div>
          <el-form-item label="服务地区">
            <el-cascader
              v-model="dialogForm.serviceAreas"
              :options="serviceAreasList"
              :props="serviceAreasProps"
              style="width: 100%"
              placeholder="请选择服务地区 (可多选)"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label="服务类型">
            <el-cascader
              v-model="dialogForm.serviceTypes"
              :options="typeList"
              :props="serviceTypesProps"
              style="width: 100%"
              placeholder="请选择服务类型 (可多选)"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label="服务部位">
            <el-select
              v-model="dialogForm.servePosition"
              multiple
              collapse-tags
              placeholder="请选择服务部位"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in positionList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="form-section-header">证件照片</div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="真实头像" label-width="70px">
                <el-upload
                  class="avatar-uploader-mini"
                  action="#"
                  :http-request="avatarUploadFn"
                  :show-file-list="false"
                  accept=".jpg,.png,.jpeg"
                >
                  <img
                    v-if="dialogForm.realPortrait"
                    :src="dialogForm.realPortrait"
                    class="avatar"
                  />
                  <div v-else class="uploader-placeholder">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证正" label-width="70px">
                <el-upload
                  class="avatar-uploader-mini"
                  action="#"
                  :http-request="idJustUploadFn"
                  :show-file-list="false"
                  accept=".jpg,.png,.jpeg"
                >
                  <img
                    v-if="dialogForm.identityFrontImage"
                    :src="dialogForm.identityFrontImage"
                    class="avatar"
                  />
                  <div v-else class="uploader-placeholder">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证反" label-width="70px">
                <el-upload
                  class="avatar-uploader-mini"
                  action="#"
                  :http-request="idBackUploadFn"
                  :show-file-list="false"
                  accept=".jpg,.png,.jpeg"
                >
                  <img
                    v-if="dialogForm.identityBackImage"
                    :src="dialogForm.identityBackImage"
                    class="avatar"
                  />
                  <div v-else class="uploader-placeholder">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">保存修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg } from "@/api/system";
import {
  editMasterInfo,
  queryDevicePositionList,
  queryDeviceTypeList,
} from "@/api/order";

// 引入地址数据，建议改为 import 方式或者保留 require
import addressData from "../../../../utils/address.json";

export default {
  name: "EditWorker",
  data() {
    return {
      dialogVisible: false,
      positionList: [],
      typeList: [],
      serviceAreasList: addressData, // 直接赋值

      dialogForm: {
        realName: "",
        identityNumber: "",
        industryExperience: "",
        servePosition: [],
        serviceAreas: [],
        serviceTypes: [],
        number: "",
        realPortrait: "",
        identityFrontImage: "",
        identityBackImage: "",
      },

      // 级联配置
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
    // 并发请求，提高速度
    Promise.all([queryDevicePositionList(), queryDeviceTypeList()]).then(
      ([posRes, typeRes]) => {
        this.positionList = posRes.data;
        this.typeList = typeRes.data;
      }
    );
  },
  methods: {
    // 打开弹框
    openEditworkerDialog(row) {
      // 深拷贝，防止修改影响父组件列表显示
      const formData = JSON.parse(JSON.stringify(row));

      // 数据格式转换：字符串转数组 (加了非空判断)
      formData.servePosition = formData.servePosition
        ? formData.servePosition.split(",")
        : [];
      formData.serviceAreas = formData.serviceAreas
        ? formData.serviceAreas.split(",")
        : [];
      formData.serviceTypes = formData.serviceTypes
        ? formData.serviceTypes.split(",")
        : [];

      // 赋值
      this.dialogForm = formData;
      this.dialogVisible = true;
    },

    // 过滤编号特殊字符
    blurWorkerNum() {
      if (this.dialogForm.number) {
        this.dialogForm.number = this.dialogForm.number.replace(
          /[^\w\/]/gi,
          ""
        );
      }
    },

    // 确定提交
    async confirmFn() {
      // 构造提交参数，将数组转回字符串
      const params = { ...this.dialogForm };

      params.servePosition = Array.isArray(params.servePosition)
        ? params.servePosition.join(",")
        : "";
      params.serviceAreas = Array.isArray(params.serviceAreas)
        ? params.serviceAreas.join(",")
        : "";
      params.serviceTypes = Array.isArray(params.serviceTypes)
        ? params.serviceTypes.join(",")
        : "";

      try {
        const res = await editMasterInfo(params);
        if (res.message === "操作成功") {
          this.$message.success("编辑成功");
          this.closeFn();
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 通用上传处理逻辑
    async handleUpload(data, fieldName) {
      const loading = this.$loading({
        text: "上传中...",
        target: ".edit-worker-dialog", // loading只遮罩弹窗
      });
      try {
        const formData = new FormData();
        formData.append("file", data.file);
        const res = await UploadImg(formData);
        if (res.code === "000" || res.data) {
          this.dialogForm[fieldName] = res.data;
          this.$message.success("上传成功");
        }
      } catch (e) {
        this.$message.error("上传失败");
      } finally {
        loading.close();
      }
    },

    // 各个字段的上传入口
    avatarUploadFn(data) {
      this.handleUpload(data, "realPortrait");
    },
    idJustUploadFn(data) {
      this.handleUpload(data, "identityFrontImage");
    },
    idBackUploadFn(data) {
      this.handleUpload(data, "identityBackImage");
    },

    // 关闭事件
    async closeFn() {
      this.dialogVisible = false;
      this.$emit("closeDialog"); // 通知父组件刷新列表
      // 重置表单 (可选，因为每次打开都会重新赋值)
      this.dialogForm = null;
    },
  },
};
</script>

<style lang="less" scoped>
/* 弹窗整体美化 */
::v-deep .edit-worker-dialog {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  .el-dialog__header {
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    .el-dialog__title {
      font-weight: 600;
      color: #333;
    }
  }

  .el-dialog__body {
    padding: 0; /* padding交给内部容器 */
  }

  .el-dialog__footer {
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
    background: #fff;
  }
}

/* 滚动区域 */
.scroll-form-container {
  height: 60vh;
  overflow-y: auto;
  padding: 20px 25px;

  /* 滚动条美化 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
}

/* 分组标题 */
.form-section-header {
  font-size: 14px;
  font-weight: 700;
  color: #303133;
  margin: 5px 0 15px 0;
  padding-left: 10px;
  border-left: 3px solid #409eff;
  line-height: 1.4;
  background-color: #fcfcfc;
  padding-top: 5px;
  padding-bottom: 5px;
}

/* 上传组件美化 */
.avatar-uploader-mini {
  ::v-deep .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    transition: 0.3s;
    background-color: #fff;

    &:hover {
      border-color: #409eff;
      background-color: #f0f9eb;
    }
  }
}

.uploader-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8c939d;
  font-size: 24px;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>