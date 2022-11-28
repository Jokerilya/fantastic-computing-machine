<template>
  <div>
    <el-button @click="fn">
      测试代下单请求
    </el-button>
  </div>
</template>

<script>
import { agentCreateOrder } from "@/api/order";

export default {
  methods: {
    async fn() {
      const data = {
        address: "广东省汕头市",
        contactsPeople: "陈总",
        contactsPhone: "13568888888",
        degree: 1,
        deviceBrand: "东风",
        devicePlace: "国产",
        deviceSystemId: 20,
        deviceTypeId: 33,
        enterpriseName: "创由公司",
        images: "",
        num: 0,
        pageNo: 1,
        pageSize: 20,
        payAmount: "",
        payFlag: "",
        payTime: "",
        remarks: "",
        serviceTime: "2022-11-27T09:00:19.406Z",
        simpleDesc: "试试",
        type: "1",
        uid: "20",
      };

      const res = await agentCreateOrder(data);
      console.log(res);
    },
  },
};
</script>
