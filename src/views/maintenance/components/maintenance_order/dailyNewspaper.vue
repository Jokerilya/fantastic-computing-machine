<template>
  <div class="dailyNewspaper">
    <el-table :data="dailyNewspaperList" ref="dailyNewspaperRef">
      <el-table-column label="时间" width="180">
        <template> 12月12日 </template>
      </el-table-column>
      <el-table-column label="当日完成量">
        <template> 21 </template>
      </el-table-column>
      <el-table-column label="新客量">
        <template> 0 </template>
      </el-table-column>
      <el-table-column label="老客量">
        <template> 27 </template>
      </el-table-column>
      <el-table-column label="订单量">
        <template> 27 </template>
      </el-table-column>
      <el-table-column label="咨询量">
        <template> 0 </template>
      </el-table-column>
      <el-table-column label="转化率" width="180">
        <template> 5% </template>
      </el-table-column>
      <el-table-column label="人工费" width="180">
        <template> 3556 </template>
      </el-table-column>
      <el-table-column label="应收配件费" width="180">
        <template> 262593.83 </template>
      </el-table-column>
      <el-table-column label="应收总费用" width="180">
        <template> 266149.83 </template>
      </el-table-column>
      <el-table-column label="企业已支付人工费" width="180"> </el-table-column>
      <el-table-column label="企业已支付配件费" width="180"> </el-table-column>
      <el-table-column label="企业口支付总费用" width="180"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DailyNewspaper",
  props: {
    // 查询订单需要的参数
    params: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dailyNewspaperList: [[], [], [], []],
    };
  },
  computed: {},
  methods: {},
  created() {},
};
</script>

<style scoped>
</style>
