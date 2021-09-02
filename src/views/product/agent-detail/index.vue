<template>
  <div class="content_box">
    <first-title title="编辑代理商品" />
    <div class="edit_view">
      <el-form ref="form" :model="addEditData" label-width="100px">
        <el-form-item class="float_item" style="height: auto" label="商品名称">
          <el-input
            v-model="addEditData.title"
            rows="3"
            type="textarea"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item class="float_item" style="height: auto" label="商品图片">
          <upload-img
            width="80px"
            height="80px"
            :img="addEditData.images"
            @uploadSuc="uploadSucFn"
          />
        </el-form-item>
        <el-form-item class="float_item" label="代理等级">
          <el-select
            v-model="addEditData.level"
            style="width: 300px"
            placeholder="请选择代理等级"
          >
            <el-option
              v-for="item in agentLevel"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="float_item" label="状态">
          <el-select
            v-model="addEditData.status"
            style="width: 300px"
            placeholder="请选择上/下架"
          >
            <el-option
              v-for="item in isShelves"
              :key="item.val"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="float_item" label="价格">
          <el-input
            v-model="addEditData.price"
            style="width: 300px"
            min="0"
            type="number"
          />
        </el-form-item>
        <el-form-item class="float_item" label="赠送股权">
          <el-input
            v-model="addEditData.thighAmount"
            min="0"
            type="number"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item class="float_item" label="赠送招商库存">
          <el-input
            v-model="addEditData.num"
            style="width: 300px"
            min="0"
            type="number"
          />
        </el-form-item>

        <el-form-item class="float_item" label="直推奖励">
          <el-input
            v-model="addEditData.shareReward"
            style="width: 300px"
            min="0"
            type="number"
          />
        </el-form-item>

        <el-form-item class="float_item" label="简推奖励">
          <el-input
            v-model="addEditData.betweenReward"
            style="width: 300px"
            min="0"
            type="number"
          />
        </el-form-item>
        <el-form-item style="clear: both" label="商品详情">
          <tinymce
            :id="'agreement_' + addEditData.id"
            v-model="addEditData.content"
            :height="600"
          />
        </el-form-item>
        <el-form-item label="">
          <el-link
            v-if="productId"
            style="margin-right: 10px"
            :href="`#/product/product-list?pageNo=${pageNo}&pageSize=${pageSize}`"
          >
            <el-button type="primary" plain icon="el-icon-d-arrow-left"
              >返回</el-button
            >
          </el-link>
          <el-button type="primary" :disabled="submitIng" @click="submitFn">{{
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
import uploadImg from "@/components/uploadImg/upload-img.vue";
import Tinymce from "@/components/Tinymce";
import { editProductAgentFn } from "@/api/product.js";
import { qiniuHost } from "@/webConfig.js";
export default {
  name: "ProductList",
  components: {
    Tinymce,
    uploadImg,
  },
  data() {
    return {
      qiniuHost,
      pageNo: 0,
      pageSize: 0,
      submitIng: false,
      productId: "",
      agentLevel: [
        { name: "省代", val: 1 },
        { name: "市代", val: 2 },
        { name: "区代", val: 3 },
        { name: "镇代", val: 4 },
      ],
      isShelves: [
        { name: "正常", val: 1 },
        { name: "禁用", val: 0 },
      ],
      addEditData: {
        betweenReward: 0,
        content: "",
        id: 0,
        images: "",
        level: 0,
        num: 0,
        price: 0,
        productId: 0,
        shareReward: 0,
        status: 0,
        thighAmount: 0,
        title: "",
      },
    };
  },
  async beforeMount() {
    this.productId = JSON.parse(this.$route.query.data).id;
    this.pageNo = this.$route.query.pageNo;
    this.pageSize = this.$route.query.pageSize;
    this.getProductDetailFn();
  },
  methods: {
    submitFn() {
      const postData = JSON.parse(JSON.stringify(this.addEditData));
      postData.id = this.productId ? this.productId : undefined;
      this.submitIng = true;
      editProductAgentFn(postData)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
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
    uploadSucFn(img) {
      this.addEditData.images = img;
    },
    getProductDetailFn() {
      if (!this.productId) return;
      this.addEditData = JSON.parse(this.$route.query.data);
      delete this.addEditData.createTime;
    },
  },
};
</script>

<style lang="scss">
.edit_view {
  overflow: hidden;
  padding: 50px 20px;
  background: #ffffff;
  .el-form {
    overflow: hidden;
    padding: 10px;
    .el_cascader input {
      &::placeholder {
        color: #333;
      }
    }
    .spec_name {
      input {
        background: #303133;
        font-weight: bold;
        border-color: #303133;
        color: #ffffff;
      }
    }
  }
  .float_item {
    height: auto;
    width: 50%;
    float: left;
  }
  .list_table {
    .el-input__inner {
      height: 33px;
    }
    .el-input__icon {
      line-height: 33px;
    }
    .el-select {
      margin-right: 10px;
      margin-bottom: 5px;
    }
  }
  .value_item {
    float: left;
    margin-right: 5px;
    .item {
      width: 150px;
      padding: 5px 0;
      overflow: hidden;
      .el-input {
        float: left;
        width: 100px;
      }
    }
  }
}
</style>
