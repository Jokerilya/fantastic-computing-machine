<template>
  <el-popover placement="top" width="300" v-model="delOrderPopover">
    <div>
      <el-input
        v-model="delOrderinpValue"
        placeholder="请输入取消订单的原因"
      ></el-input>
    </div>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="delOrderPopover = false"
        >取消</el-button
      >
      <el-button type="primary" size="mini" @click="delOrderPopover = false"
        >确定</el-button
      >
    </div>
    <el-button slot="reference">删除</el-button>
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      delOrderPopover: false,
      delOrderinpValue: "",
    };
  },
};
</script>
