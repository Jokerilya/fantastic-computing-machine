<template>
  <div>
    <el-select
      filterable
      :remote-method="remoteMethod"
      remote
      clearable
      v-model="value"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.realName"
        :value="item.uid"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { queryMasterName } from "@/api/order";
export default {
  data() {
    return {
      options: [],
      value: "",
    };
  },
  methods: {
    async remoteMethod(query) {
      const res = await queryMasterName(query);
      this.options = res.data;
    },
  },
};
</script>
