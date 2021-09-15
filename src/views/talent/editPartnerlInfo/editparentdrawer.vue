<template>
  <div>
    <el-drawer
      size="900px"
      :title="parentId === 0 ? '添加学院/企业' : '编辑学院/企业'"
      :visible.sync="open"
      direction="rtl"
      ref="drawer"
      @close="$emit('close')"
    >
      <div class="content_box flex just-center">
        <el-form
          ref="form"
          :rules="rules"
          label-width="180px"
          :model="formdata"
        >
          <el-form-item label="学院/企业名称：" prop="title">
            <el-input
              style="width: 250px"
              v-model="formdata.title"
              placeholder="请输入学院/企业名称"
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
          <el-form-item label="添加类型(学院/企业)：" prop="type">
            <el-select v-model="formdata.type" placeholder="请选择添加类型">
              <el-option label="学院" value="0"></el-option>
              <el-option label="企业" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="观看次数：" prop="watchedNum">
            <el-input
              type="number"
              style="width: 250px"
              v-model="formdata.watchedNum"
              placeholder="请输入观看次数"
            />
          </el-form-item>
          <el-form-item label="排序(越小越前)：" prop="sort">
            <el-input
              type="number"
              style="width: 250px"
              v-model="formdata.sort"
              placeholder="请输入排序数"
            />
          </el-form-item>
          <el-form-item label="主要业务：" prop="workInfo">
            <el-input
              style="width: 250px"
              v-model="formdata.workInfo"
              placeholder="请输入学院/企业主要业务"
            />
          </el-form-item>
          <el-form-item
            style="clear: both"
            label="描述："
            prop="content"
            required
          >
            <tinymce
              :width="650"
              ref="ppp"
              :id="'parentdetail_' + parentId"
              v-model="formdata.content"
              :height="400"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import uploadImg from "@/components/uploadImg/upload-img.vue";
import { getOfflineTraining, editOfflineTraining } from "@/api/talent.js";
export default {
  name: "",
  components: {
    uploadImg,
    Tinymce,
  },
  props: {
    parentId: {
      type: Number,
      default: 0,
    },
    opendrawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
      typeList: [
        { type: 0, name: "学院" },
        { type: 1, name: "企业" },
      ],
      formdata: {
        content: "",
        coverImage: "",
        sort: 0,
        title: "",
        type: "",
        watchedNum: 0,
        workInfo: "",
      },
      rules: {},
    };
  },
  mounted() {},
  watch: {
    opendrawer(newval) {
      this.open = newval;
    },
  },
  methods: {
    //图片上传返回
    uploadSucFn(img) {
      this.formdata.coverImage = img;
    },
  },
};
</script>


<style  scoped>
.el-drawer__wrapper /deep/ .el-drawer__header span:focus,
.el-drawer__wrapper /deep/ .el-drawer__header button:focus {
  outline: 0;
  user-select: none;
}
.el-drawer__wrapper /deep/ .el-drawer {
  overflow: auto;
}
.el-drawer__wrapper /deep/ .el-drawer::-webkit-scrollbar {
  width: 1px;
  height: auto;
  background-color: transparent;
}
</style>
