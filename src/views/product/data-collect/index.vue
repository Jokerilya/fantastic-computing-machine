<template>
  <div class="content_box">
    <first-title :title="'数据采集'" />
    <div class="bg-white" style="padding: 50px 20px; min-height: 800px">
      <el-form ref="form" :rules="rules" label-width="130px" :model="formdata">
        <el-form-item label="商品分类：" prop="title">
          <el-cascader
            style="width: 300px"
            v-model="formdata.categoryId"
            class=""
            placeholder="请选择商品分类"
            expand-trigger="hover"
            :props="categoryList"
            :show-all-levels="false"
          />
        </el-form-item>
        <el-form-item label="供应商：">
          <el-select
            v-model="formdata.supplierId"
            style="width: 300px"
            filterable
            clearable
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运费：">
          <el-input
            placeholder="请输入运费"
            style="width: 300px"
            v-model="formdata.freightMoney"
            type="number"
          />
        </el-form-item>
        <el-form-item label="网址：">
          <el-input
            style="width: 600px"
            type="textarea"
            :rows="8"
            placeholder="请输入网址（多个按回车隔开）"
            v-model="formdata.urlList"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="">
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
import {
  queryProductCategoryFn,
  querySupplierList,
  dataAcquisition,
} from "@/api/product";
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      formdata: {
        urlList: "",
        categoryId: "",
        supplierId: "",
        freightMoney: "",
      },
      rules: {},
      submitIng: false,
      supplierList: [], // 供应商列表
      categoryList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          queryProductCategoryFn({
            pid: node.value || 0,
          }).then((res) => {
            const resData = res.data;
            const nodes = resData.map((item) => ({
              value: item.id,
              label: item.name,
            }));
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes);
          });
        },
      },
    };
  },
  beforeMount() {
    this.init();
  },
  mounted() {},
  created() {},
  activated() {},
  watch: {},
  computed: {
    realcategoryId() {
      if (!this.formdata.categoryId) return 0;
      return this.formdata.categoryId.pop();
    },
  },
  methods: {
    //初始化
    init() {
      this.getQuerySupplierList();
    },
    // 获取供应商列表
    async getQuerySupplierList() {
      const res = await querySupplierList({
        pageNo: 1,
        pageSize: 1000,
      });
      if (res.code === "000") {
        this.supplierList = res.data.records;
      }
    },
    //提交
    submit() {
      let obj = {};
      const postData = { ...this.formdata };
      obj.categoryId = this.realcategoryId;
      obj.supplierId = postData.supplierId;
      obj.freightMoney = Number(postData.freightMoney);
      obj.list = postData.urlList.split(/[(\r\n)\r\n]+/);
      this.submitIng = true;
      dataAcquisition(obj)
        .then((res) => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "提交成功",
              type: "success",
            });
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.submitIng = false;
          }, 1000);
        });
    },
  },
};
</script>

<style>
</style>
