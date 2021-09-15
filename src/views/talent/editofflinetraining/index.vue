<template>
  <div class="content_box">
    <first-title title="线下培训信息配置" />
    <div class="mb10 bg-white pt10 pb10" style="padding-left: 150px">
      <el-button type="primary" @click="addDataFn">编辑</el-button>
      <span class="ml15" style="color: #f56c6c"
        >注意：“点击编辑”按钮才会生效哦</span
      >
    </div>
    <div class="flex bg-white pt20 pl20" style="min-height: 700px">
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
          label="商品封面图:"
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
        <el-form-item style="clear: both" label="线下培训描述：" prop="content" required>
          <tinymce
            ref="ppp"
            :id="'talent_' + formdata.id"
            v-model="formdata.content"
            :height="600"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import uploadImg from "@/components/uploadImg/upload-img.vue";
import { addressFn } from "@/api/system.js";
import { getOfflineTraining, editOfflineTraining } from "@/api/talent.js";
export default {
  name: "",
  components: {
    uploadImg,
    Tinymce,
  },
  data() {
    var validateContent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入描述内容"));
      } else {
        callback();
      }
    };
    return {
      props: {
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const { level } = node;
          // 处理回显
          if (!this.formdata.address.length) {
            this.formdata.address = await this.getAddressInfo();
          }
          let pid = node.data ? node.data.value : undefined;
          addressFn({ pid }).then((res) => {
            const nodes = res.data.map((item) => ({
              value: item.id,
              label: item.name,
              leaf: level >= 2,
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        },
      },
      detail: {},
      formdata: {
        address: "",
        content: "",
        coverImage: "",
        email: "",
        id: 1,
        latitude: "",
        longitude: "",
        phone: "",
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入培训标题", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细位置", trigger: "blur" },
        ],
        content: [{ validator: validateContent, trigger: "blur" }],
        coverImage: [
          { required: true, message: "请上传封面图", trigger: "change" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        latitude: [
          { required: true, message: "请输入地理纬度", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "请输入地理经度", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getOfflineTraining();
  },
  methods: {
    //获取线下培训详情
    async getOfflineTraining() {
      await getOfflineTraining(1).then((res) => {
        const resData = this.resDataFn(res);
        this.formdata = Object.assign(this.formdata, resData);
      });
    },
    //编辑
    addDataFn() {
      this.$refs["form"].validate(async (valid) => {
        if (!valid) {
          return false;
        } else {
          const res = await editOfflineTraining({
            ...this.formdata,
          });
          if (res.code === "000") {
            this.$message.success("编辑成功！");
          }
          this.getOfflineTraining();
        }
      });
    },
    //图片上传返回
    uploadSucFn(img) {
      this.formdata.coverImage = img;
    },
  },
};
</script>

<style>
</style>
