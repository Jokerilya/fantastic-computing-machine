<!-- 弹出框组件 -->
<template>
  <div class="text">
    <el-button @click="dialogVisible = true">添加配件</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      width="45%"
      show-close
      :before-close="handleClose"
      :center="true"
    >
      <!-- 弹窗的标题 -->
      <template slot="title">
        <div class="accessoriesText">
          添加配件
        </div>
      </template>
      <!-- 弹窗的内容 -->
      <el-form label-width="200px">
        <el-form-item>
          <template slot="label">
            <span class="accessoriesText">配件名称</span>
          </template>
          <el-input
            style="width: 300px;"
            v-model.trim="accessories.name"
            placeholder="请填写配件名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="accessoriesText">配件单价</span>
          </template>
          <el-input
            style="width: 300px;"
            v-model.number="accessories.price"
            placeholder="请填写配件单价"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="accessoriesText">配件数量</span>
          </template>
          <el-input
            style="width: 300px;"
            v-model.number="accessories.num"
            placeholder="请填写配件数量,例如: 2"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <span class="accessoriesText">配件单位</span>
          </template>
          <el-input
            style="width: 300px;"
            v-model.trim="accessories.unit"
            placeholder="请填写配件单位,例如: 件、个"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button class="cancelBtn" @click="dialogVisible = false"
          >返回</el-button
        >
        <el-button class="confirmBtn" @click="dialogVisible = false"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      // 配件表单
      accessories: {
        name: "",
        price: "",
        num: "",
        unit: "",
      },
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="less">
// 返回取消按钮样式
.cancelBtn {
  background-color: #fff;
  border: 1px solid #2e4c9e;
  color: #2e4c9e;
  width: 180px;
}
// 提交确定按钮样式
.confirmBtn {
  background-color: #2e4c9e;
  color: #fff;
  width: 180px;
}

// 标题文字样式
.accessoriesText {
  color: #707070;
  font-size: 18px;
  font-weight: 700;
}
</style>
