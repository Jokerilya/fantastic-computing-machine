<template>
  <div>
    <el-drawer
      size="460px"
      title="修改用户余额"
      :visible.sync="open"
      direction="rtl"
      ref="drawer"
      @close="$emit('close')"
    >
      <div class="content_box flex just-center">
        <el-form
          ref="form"
          :rules="rules"
          label-width="100px"
          :model="formdata"
        >
          <el-form-item label="收支类型：" prop="title">
            <el-select v-model="formdata.type" placeholder="请选择收支类型：">
              <el-option
                v-for="(item, i) in typeList"
                :key="i"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作金额：" prop="title">
            <el-input
              type="number"
              style="width: 250px"
              v-model="formdata.amount"
              placeholder="请输入操作金额"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="title">
            <el-input
              type="textarea"
              :rows="8"
              style="width: 250px"
              v-model="formdata.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" class="mr10" plain @click="$emit('close')"
              >取消</el-button
            >
            <el-button type="primary" :loading="loading" @click="submit">{{
              loading ? "提交中 ..." : "确 定"
            }}</el-button>
          </el-form-item>
        </el-form>
        <!-- <div class="demo-drawer__footer">
          <el-button @click="$emit('close')">取 消</el-button>
          <el-button type="primary" :loading="loading">{{
            loading ? "提交中 ..." : "确 定"
          }}</el-button>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { handleAccountEditFn } from "@/api/user.js";
export default {
  name: "",
  components: {},
  props: {
    userdetail: {
      type: Object,
      default: {},
    },
    opendrawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      open: false,
      typeList: [
        { type: 0, name: "支出" },
        { type: 1, name: "收入" },
      ],
      formdata: {
        amount: "",
        remark: "",
        type: "",
        uid: "",
      },
      rules: {},
    };
  },
  watch: {
    opendrawer(newval) {
      this.open = newval;
    },
  },
  methods: {
    //提交
    submit() {
      const postData = { ...this.formdata };
      postData.amount = Number(postData.amount);
      postData.type = Number(postData.type);
      postData.uid = this.userdetail.uid;
      this.loading = true;
      handleAccountEditFn(postData)
        .then((res) => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.$emit("close");
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        });
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
