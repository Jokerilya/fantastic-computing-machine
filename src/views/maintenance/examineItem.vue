<template>
  <div class="examineItem">
    <div class="operateBtn">
      <el-button
        type="primary"
        plain
        @click="
          examTemplate(
            'https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/%E5%B8%88%E5%82%85%E8%80%83%E9%A2%98%E6%A8%A1%E6%9D%BF.xlsx'
          )
        "
        >考题模板</el-button
      >
      <el-button type="primary" plain @click="openExamineVisible"
        >新增考核</el-button
      >
    </div>
    <el-card>
      <el-table border :data="masterAssessmentItemList">
        <el-table-column align="center" prop="title" label="标题">
        </el-table-column>
        <el-table-column align="center" prop="simpleDesc" label="描述">
        </el-table-column>
        <el-table-column align="center" prop="askPoint" label="积分要求">
        </el-table-column>
        <el-table-column align="center" prop="givePoint" label="赠送积分">
        </el-table-column>
        <el-table-column align="center" prop="passLine" label="及格线">
        </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="goToRecord(row.id)"
              >记录</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="openExamineVisible(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="考核"
      :visible="examineVisible"
      width="40%"
      :show-close="false"
    >
      <el-form
        label-width="100px"
        label-position="left"
        :model="editMasterAssessmentItemParams"
        :rules="editMasterAssessmentItemRules"
        ref="editMasterAssessmentItemForm"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="editMasterAssessmentItemParams.title"
            placeholder="请填写标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="simpleDesc">
          <el-input
            v-model="editMasterAssessmentItemParams.simpleDesc"
            placeholder="请填写描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分要求" prop="askPoint">
          <el-input
            v-model="editMasterAssessmentItemParams.askPoint"
            placeholder="请填写积分要求"
          ></el-input>
        </el-form-item>
        <el-form-item label="赠送积分" prop="givePoint">
          <el-input
            v-model="editMasterAssessmentItemParams.givePoint"
            placeholder="请填写成功赠送积分"
          ></el-input>
        </el-form-item>
        <el-form-item label="及格线" prop="passLine">
          <el-input
            v-model="editMasterAssessmentItemParams.passLine"
            placeholder="请填写及格线"
          ></el-input>
        </el-form-item>
        <el-form-item label="海报图片" prop="posterImage">
          <el-upload
            list-type="picture-card"
            action="#"
            :limit="1"
            :http-request="uploadImgFn"
            :file-list="posterImgList"
            :on-remove="delImgFn"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="学习视频" prop="assessmentVideo">
          <el-upload
            action="#"
            :limit="1"
            :http-request="uploadVideoFn"
            :file-list="posterVideoList"
            v-if="!editMasterAssessmentItemParams.assessmentVideo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
          </el-upload>
          <div v-else>
            <el-button size="small" type="primary" @click="viewVideo"
              >查看视频</el-button
            >
            <el-button size="small" type="primary" @click="delVideo"
              >删除视频</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="考题">
          <el-upload
            action="#"
            :limit="1"
            :http-request="uploadExamFile"
            :file-list="examFile"
            v-if="examFile.length == 0"
          >
            <el-button size="small" type="primary">上传文件</el-button>
          </el-upload>
          <div v-else style="display: flex; align-items: center">
            <div
              v-if="!editMasterAssessmentItemParams.url"
              style="margin-right: 10px"
            >
              已上传考题
            </div>
            <el-button
              v-else
              size="small"
              type="primary"
              @click="examTemplate(editMasterAssessmentItemParams.url)"
              >下载之前考题</el-button
            >
            <el-button size="small" type="primary" @click="delExamFile"
              >删除文件</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExamineVisible">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImg } from "@/api/system.js";
import {
  queryMasterAssessmentItemList,
  editMasterAssessmentItem,
} from "@/api/order";
export default {
  data() {
    return {
      masterAssessmentItemList: [],
      examineVisible: false,
      posterImgList: [],
      posterVideoList: [],
      examFile: [],
      editMasterAssessmentItemParams: {
        askPoint: null,
        assessmentVideo: null,
        givePoint: null,
        passLine: null,
        posterImage: null,
        simpleDesc: null,
        title: null,
      },
      editMasterAssessmentItemRules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        simpleDesc: [
          { required: true, message: "请填写描述", trigger: "blur" },
        ],
        askPoint: [
          { required: true, message: "请填写积分要求", trigger: "blur" },
        ],
        givePoint: [
          { required: true, message: "请填写赠送积分", trigger: "blur" },
        ],
        passLine: [
          { required: true, message: "请填写及格线", trigger: "blur" },
        ],
        posterImage: [
          { required: true, message: "请填写海报图片", trigger: "blur" },
        ],
        assessmentVideo: [
          { required: true, message: "请上传学习视频", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 删除文件
    delExamFile() {
      this.examFile = [];
      this.editMasterAssessmentItemParams.image = null;
    },
    // 关闭弹窗
    closeExamineVisible() {
      this.examineVisible = false;
      this.examFile = [];
      this.posterImgList = [];
      this.posterVideoList = [];
      this.editMasterAssessmentItemParams = {
        askPoint: null,
        assessmentVideo: null,
        givePoint: null,
        passLine: null,
        posterImage: null,
        simpleDesc: null,
        title: null,
      };
    },
    // 确定提交考题
    async confirmBtn() {
      // 1.校验
      await this.$refs["editMasterAssessmentItemForm"].validate();
      // 判断考题是否上传
      if (this.examFile.length == 0) {
        this.$message({
          message: "请上传考题文件",
          type: "warning",
        });
        return;
      }
      // 2.处理数据
      const montageData = Object.keys(this.editMasterAssessmentItemParams)
        .map((key) => `${key}=${this.editMasterAssessmentItemParams[key]}`)
        .join("&");
      let res;
      if (Array.isArray(this.examFile)) {
        res = await editMasterAssessmentItem("", "?" + montageData);
      } else {
        res = await editMasterAssessmentItem(this.examFile, "?" + montageData);
      }
      if (res.message == "操作成功") {
        console.log(254);
        await this.queryMasterAssessmentItemList();
        this.closeExamineVisible();
      }
    },
    // 上传文件
    uploadExamFile(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      this.examFile = formData;
    },
    // 删除视频
    delVideo() {
      this.editMasterAssessmentItemParams.assessmentVideo = null;
      this.posterVideoList = [];
    },
    // 查看视频
    viewVideo() {
      window.open(this.editMasterAssessmentItemParams.assessmentVideo);
    },
    // 下载考题模板
    async examTemplate(url) {
      window.location.href = url;
    },
    // 上传学习视频
    async uploadVideoFn(e) {
      const loading = this.$loading({
        lock: true,
        text: "上传视频中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.editMasterAssessmentItemParams.assessmentVideo = res.data;
      this.posterVideoList = [{ url: res.data }];
      this.$refs.editMasterAssessmentItemForm.validateField("assessmentVideo");
      loading.close();
    },
    // 删除海报图片
    delImgFn() {
      this.posterImgList = [];
      this.editMasterAssessmentItemParams.posterImage = null;
    },
    // 上传海报图片
    async uploadImgFn(e) {
      const loading = this.$loading({
        lock: true,
        text: "上传图片中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const formData = new FormData();
      formData.append("file", e.file);
      const res = await UploadImg(formData);
      this.editMasterAssessmentItemParams.posterImage = res.data;
      this.posterImgList = [{ url: res.data }];
      this.$refs.editMasterAssessmentItemForm.validateField("posterImage");
      loading.close();
    },
    // 打开新增考核框
    openExamineVisible(item) {
      if (item.id) {
        this.editMasterAssessmentItemParams = { ...item };
        this.posterImgList = [{ url: item.posterImage }];
        this.posterVideoList = [{ url: item.assessmentVideo }];
        this.examFile = [{ url: item.url }];
      }
      this.examineVisible = true;
    },
    // 查询考核项目列表
    async queryMasterAssessmentItemList() {
      const res = await queryMasterAssessmentItemList();
      this.masterAssessmentItemList = res.data;
    },
    // 跳转师傅考试记录
    goToRecord(id) {
      this.$router.push({
        path: "/maintenance/examineRecord?id=" + id,
      });
    },
  },
  created() {
    this.queryMasterAssessmentItemList();
  },
};
</script>

<style scoped lang="scss">
.examineItem {
  padding: 20px;

  .operateBtn {
    text-align: right;
    padding-bottom: 20px;
  }
}
</style>
