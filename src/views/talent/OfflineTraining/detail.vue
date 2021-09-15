<template>
  <div class="content_box">
    <first-title :title="offlineId === 0 ? '新增培训' : '编辑培训'" />
    <div class="bg-white" style="padding: 50px 20px">
      <el-form ref="form" :rules="rules" label-width="130px" :model="formdata">
        <el-form-item label="标题：" prop="title">
          <el-input
            style="width: 250px"
            v-model="formdata.title"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item
          class="float_item"
          style="height: auto"
          label="封面图:"
          prop="coverImage"
        >
          <upload-img
            width="80px"
            height="80px"
            :img="formdata.coverImage"
            @uploadSuc="uploadSucFn"
          />
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input
            style="width: 250px"
            v-model="formdata.phone"
            placeholder="请输入电话"
          />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input
            style="width: 250px"
            v-model="formdata.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="地理纬度：" prop="latitude">
          <el-input
            style="width: 250px"
            v-model="formdata.latitude"
            placeholder="请输入纬度"
          />
        </el-form-item>
        <el-form-item label="地理经度：" prop="longitude">
          <el-input
            style="width: 250px"
            v-model="formdata.longitude"
            placeholder="请输入经度"
          />
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input
            style="width: 350px"
            v-model="formdata.address"
            placeholder="请输入地址"
          />
        </el-form-item>
        <el-form-item style="clear: both" label="线下培训描述：" prop="content">
          <tinymce
            :width="650"
            ref="ppp"
            :id="'offline_' + offlineId"
            v-model="formdata.content"
            :height="400"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            class="mr10"
            plain
            @click="$router.push({ name: 'offlinetrainingList' })"
            >取消</el-button
          >
          <el-button type="primary" :disabled="submitIng" @click="submit">{{
            submitIng ? "提交中..." : "确认提交"
          }}</el-button>
          <span v-show="submitIng" style="margin-left: 15px; color: #f56c6c"
            >提交中,请勿重复点击!</span
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getOfflineTraining, editOfflineTraining } from "@/api/talent.js";
import uploadImg from "@/components/uploadImg/upload-img.vue";
import Tinymce from "@/components/Tinymce";
export default {
  name: "",
  components: {
    Tinymce,
    uploadImg,
  },
  props: {},
  data() {
    return {
      offlineId: "",
      submitIng: false,
      formdata: {
        address: "",
        content: "",
        coverImage: "",
        email: "",
        latitude: "",
        longitude: "",
        phone: "",
        title: "",
      },
      rules: {},
    };
  },
  mounted() {
    let aaa = this.$route.query.offlineId;
    this.offlineId = Number(aaa);
    if (Number(aaa) !== 0) {
      this.getofflineDetail();
    }
  },
  created() {},
  activated() {},
  watch: {},
  methods: {
    //提交
    submit() {
      const postData = { ...this.formdata };
      postData.id = this.offlineId;
      this.submitIng = true;
      editOfflineTraining(postData)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: this.offlineId === 0 ? "新增成功！" : "编辑成功！",
              type: "success",
            });
            this.$router.go(-1);
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
        });
    },
    //获取详情
    getofflineDetail() {
      if (this.offlineId == 0) return;
      getOfflineTraining(this.offlineId).then((res) => {
        const resData = this.resDataFn(res);
        this.formdata = Object.assign(this.formdata, resData);
      });
    },
    //图片上传返回
    uploadSucFn(img) {
      this.formdata.headUrl = img;
    },
  },
};
</script>

<style lang="scss">
</style>
