<template>
  <div class="content_box">
    <first-title
      :title="parentId === 0 ? '新增(学院/企业)' : '编辑(学院/企业)'"
    />
    <div class="bg-white" style="padding: 50px 20px">
      <el-form ref="form" :rules="rules" label-width="180px" :model="formdata">
        <el-form-item label="学院/企业名称：" prop="title">
          <el-input
            style="width: 250px"
            v-model="formdata.title"
            placeholder="请输入学院/企业名称"
          />
        </el-form-item>
        <el-form-item label="学院/企业主要方向：" prop="title">
          <el-input
            style="width: 350px"
            v-model="formdata.label"
            placeholder="请输入学院/企业主要方向(多个以/隔开)"
          />
        </el-form-item>
        <el-form-item
          class="float_item"
          style="height: auto"
          label="列表小图:"
          prop="coverImage"
        >
          <upload-img
            width="80px"
            height="80px"
            :img="formdata.coverImage"
            @uploadSuc="uploadSucFn"
          />
        </el-form-item>
        <el-form-item
          class="float_item"
          style="height: auto"
          label="详情大图:"
          prop="coverImage"
        >
          <upload-img
            width="80px"
            height="80px"
            :img="formdata.inImage"
            @uploadSuc="uploadSucFnbig"
          />
        </el-form-item>
        <el-form-item label="添加类型(学院/企业)：" prop="type">
          <el-select v-model="formdata.type" placeholder="请选择添加类型">
            <el-option :label="'学院'" :value="1"></el-option>
            <el-option :label="'企业'" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="观看次数：" prop="watchedNum">
          <el-input
            min="0"
            type="number"
            style="width: 250px"
            v-model="formdata.watchedNum"
            placeholder="请输入观看次数"
          />
        </el-form-item>
        <el-form-item label="排序(越小越前)：" prop="sort">
          <el-input
            min="0"
            type="number"
            style="width: 250px"
            v-model="formdata.sort"
            placeholder="请输入排序数"
          />
        </el-form-item>
        <el-form-item style="clear: both" label="学院/企业就业学员信息：">
          <el-table
            class="list_table"
            :data="formdata.workInfo"
            border
            style="width: 800px"
          >
            <el-table-column
              label="就业类型名称(例如:数控)"
              width="250"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.name"
                  class="spec_name"
                  placeholder="填写就业类型名称"
                />
              </template>
            </el-table-column>
            <el-table-column label="就业数量" width="200" align="center">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-model="scope.row.num"
                  class="spec_name"
                  placeholder="填写就业数量"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              header-align="center"
              min-width="300"
            >
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="delListFn(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button
            size="small"
            icon="el-icon-plus"
            style="margin-top: 15px"
            type="primary"
            @click="addListItemFn"
            >添加就业类型信息</el-button
          >
        </el-form-item>
        <el-form-item style="clear: both" label="描述：" prop="content">
          <tinymce
            :width="650"
            ref="ppp"
            :id="'parentdetail_' + parentId"
            v-model="formdata.content"
            :height="400"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            class="mr10"
            plain
            @click="$router.push({ name: 'editPartnerlInfo' })"
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
import { editPartnerlInfo, getPartnerlInfo } from "@/api/talent.js";
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
      parentId: "",
      submitIng: false,
      typeList: [
        { type: 0, name: "学院" },
        { type: 1, name: "企业" },
      ],
      formdata: {
        label: "",
        inImage: "",
        content: "",
        coverImage: "",
        sort: "",
        title: "",
        type: "",
        watchedNum: "",
        workInfo: [],
      },
      rules: {},
    };
  },
  mounted() {
    let aaa = this.$route.query.parentId;
    this.parentId = Number(aaa);
    if (Number(aaa) !== 0) {
      this.getPartnerDetail();
    }
  },
  created() {},
  activated() {},
  watch: {
    parentId(newval) {
      if (newval !== 0) {
        this.$refs.ppp.setContent("");
      }
    },
  },
  methods: {
    //添加就业信息
    addListItemFn() {
      this.formdata.workInfo.push({ name: "", num: "" });
    },
    //删除就业学员信息
    delListFn(index) {
      this.formdata.workInfo.splice(index, 1);
    },
    //submit
    submit() {
      // return console.log(this.formdata);
      const postData = { ...this.formdata };
      postData.workInfo = JSON.stringify(postData.workInfo);
      postData.id = this.parentId;
      postData.sort = Number(postData.sort);
      postData.type = Number(postData.type);
      postData.watchedNum = Number(postData.watchedNum);
      this.submitIng = true;
      editPartnerlInfo(postData)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: this.parentId === 0 ? "新增成功！" : "编辑成功！",
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
    getPartnerDetail() {
      if (this.parentId == 0) return;
      getPartnerlInfo(this.parentId).then((res) => {
        const resData = this.resDataFn(res);
        this.formdata.workInfo = resData.list;
        this.formdata.content = resData.content;
        this.formdata.inImage = resData.inImage;
        this.formdata.label = resData.label;
        this.formdata.coverImage = resData.coverImage;
        this.formdata.sort = resData.sort;
        this.formdata.title = resData.title;
        this.formdata.type = resData.type;
        this.formdata.watchedNum = resData.watchedNum;
      });
    },
    //图片上传返回
    uploadSucFn(img) {
      this.formdata.coverImage = img;
    },
    //图片上传返回详情大图
    uploadSucFnbig(img) {
      this.formdata.inImage = img;
    },
  },
};
</script>

<style lang="scss">
</style>
