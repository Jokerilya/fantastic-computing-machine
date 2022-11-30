<template>
  <div v-if="dialogForm">
    <el-dialog
      title="编辑师傅"
      :visible="dialogVisible"
      width="70%"
      :before-close="closeFn"
    >
      <div class="content">
        <div class="oneLine">
          <div class="item">
            <div class="label">姓名</div>
            <el-input class="inp" v-model="dialogForm.realName"></el-input>
          </div>
          <div class="item">
            <span class="label">身份证</span
            ><el-input
              class="inp"
              v-model="dialogForm.identityNumber"
            ></el-input>
          </div>
          <div class="item">
            <span class="label">行业经验</span
            ><el-input
              class="inp"
              v-model="dialogForm.industryExperience"
            ></el-input>
          </div>
        </div>
        <div class="oneLine">
          <div class="item">
            <span class="label">推荐人</span>
            <el-input
              @blur="referrerBlurFn"
              class="inp"
              v-model="dialogForm.recommendMasterRealName"
            ></el-input>
          </div>
          <div class="item">
            <span class="label">服务部位</span>
            <el-input
              class="inp"
              v-if="servePositionShow"
              :disabled="true"
              :value="servePosition"
            >
            </el-input>
            <div class="location" @click="locationXiuFn(1)">
              修
            </div>
            <el-select
              collapse-tags
              class="inp"
              v-model="dialogForm.servePosition"
              multiple
              v-if="!servePositionShow"
              placeholder="请选择"
            >
              <el-option
                v-for="item in PartsList"
                :key="PartsList.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
          <div class="item">
            <span class="label">服务地区</span>
            <el-input
              v-if="serviceAreasShow"
              class="inp"
              :disabled="true"
              v-model="dialogForm.serviceAreasName"
            >
            </el-input>
            <div class="location" @click="locationXiuFn(2)">
              修
            </div>
            <el-cascader
              v-if="!serviceAreasShow"
              v-model="dialogForm.serviceAreas"
              collapse-tags
              class="inp"
              :props="props1"
              :show-all-levels="false"
            ></el-cascader>
          </div>
        </div>
        <div class="oneLine">
          <div class="item">
            <div class="label" style="width: 100px;">服务类型</div>
            <el-input
              class="inp"
              :disabled="true"
              v-model="dialogForm.serviceTypesName"
              v-if="serviceTypesNameShow"
            ></el-input>
            <div class="location" @click="locationXiuFn(3)">
              修
            </div>
            <el-cascader
              v-if="!serviceTypesNameShow"
              class="inp"
              :show-all-levels="false"
              v-model="dialogForm.serviceTypes"
              :options="typeList"
              :props="{
                checkStrictly: true,
                emitPath: false,
                value: 'id',
                label: 'name',
                multiple: true,
                children: 'list',
              }"
              collapse-tags
              clearable
            ></el-cascader>
          </div>
          <div class="item">
            <div class="label" style="width: 100px;">师傅编号</div>
            <el-input class="inp" v-model="dialogForm.number"></el-input>
          </div>
          <div class="item">
            <div class="label" style="width: 100px;">虚拟服务数量</div>
            <el-input
              class="inp"
              v-model="dialogForm.virtualServiceNum"
            ></el-input>
          </div>
        </div>
        <div class="imgLine">
          <div class="imgItem">
            <div class="title">真实头像</div>
            <el-upload
              :file-list="avatarFileList"
              :limit="1"
              action="#"
              :http-request="avatarUploadFn"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="imgItem">
            <div class="title">身份证正面照</div>
            <el-upload
              :file-list="idJustFileList"
              :limit="1"
              action="#"
              :http-request="idJustUploadFn"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
          <div class="imgItem">
            <div class="title">身份证反面照</div>
            <el-upload
              :file-list="idBackFileList"
              :http-request="idBackUploadFn"
              :limit="1"
              action="#"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
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
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      serviceAreasShow: true, //默认地区输入框显示
      serviceTypesNameShow: true,
      servePositionShow: true,

      servePosition: null,
      typeList: null,
      PartsList: null,

      dialogForm: null,
      avatarFileList: [],
      idJustFileList: [],
      idBackFileList: [],

      props1: {
        checkStrictly: true,
        value: "id",
        label: "name",
        multiple: true,
        lazy: true,
        emitPath: false,
        lazyLoad: async (node, resolve) => {
          let pid = 0;
          if (node.level != 0) {
            pid = node.data.id;
          }
          if (node.level > 2) {
            resolve([]);
            return;
          }
          let res = await addressFn(pid);
          if (res.code == "000")
            resolve(
              res.data.map((item) => {
                return {
                  ...item,
                };
              })
            );
        },
      },
    };
  },
  async created() {
    const res = await queryDevicePositionList();
    this.PartsList = res.data;
    const res1 = await queryDeviceTypeList();
    this.typeList = res1.data;
  },
  methods: {
    // 推荐人失焦事件
    async referrerBlurFn() {
      const res = await queryMasterName(
        this.dialogForm.recommendMasterRealName
      );
      const uid = res.data && res.data[0] && res.data[0].uid;
      if (uid) {
        this.dialogForm.recommendMasterUid = uid;
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
    // 修改服务地区的事件
    locationXiuFn(index) {
      if (index === 2) {
        this.serviceAreasShow = false;
      } else if (index === 3) {
        this.serviceTypesNameShow = false;
      } else {
        index === 1;
      }
      {
        this.servePositionShow = false;
      }
    },
    // 确定的事件
    async confirmFn() {
      // 服务部位
      if (
        this.dialogForm.servePosition &&
        this.dialogForm.servePosition.length > 1
      ) {
        this.dialogForm.servePosition = await this.repairData(
          this.dialogForm.servePosition
        );
      } else if (
        this.dialogForm.servePosition &&
        this.dialogForm.servePosition.length === 0
      ) {
        this.dialogForm.servePosition = "";
      }

      // 判断推荐人输入框为空 就都为空
      if (!this.dialogForm.recommendMasterRealName) {
        this.dialogForm.recommendMasterUid = "";
      }

      // 改造一下服务地区的数据
      if (this.serviceAreasShow === false) {
        this.dialogForm.serviceAreas = await this.repairData(
          this.dialogForm.serviceAreas
        );
      }

      // 改造一下服务类型的数据
      if (this.serviceTypesNameShow === false) {
        this.dialogForm.serviceTypes = await this.repairData(
          this.dialogForm.serviceTypes
        );
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
    // 上传触发的事件
    async idBackUploadFn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.identityBackImage = res.data;
    },
    // 上传触发的事件
    async idJustUploadFn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.identityFrontImage = res.data;
    },
    // 上传触发的事件
    async avatarUploadFn(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      this.dialogForm.realPortrait = res.data;
    },
    // 关闭事件
    closeFn() {
      this.servePositionShow = true;
      this.serviceAreasShow = true;
      this.serviceTypesNameShow = true;
      this.dialogForm = null;
      this.avatarFileList = [];
      this.idJustFileList = [];
      this.idBackFileList = [];
      this.$emit("closeFn");
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
      .inp {
        width: 200px;
      }
      .location {
        cursor: pointer;
        position: absolute;
        right: 25px;
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
