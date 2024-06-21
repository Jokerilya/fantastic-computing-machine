<!-- 实时库存 -->
<template>
  <div class="storeStockBox">
    <h2 class="bigTitle">实时库存</h2>
    <el-card>
      <el-table :data="tableData">
        <el-table-column prop="deviceBrand" label="配件品牌" align="center">
        </el-table-column>
        <el-table-column
          prop="devicePositionName"
          label="所属大类"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="deviceFaultName" label="设备部位" align="center">
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" align="center">
        </el-table-column>
        <el-table-column prop="deviceName" label="配件名称" align="center">
        </el-table-column>
        <el-table-column prop="num" label="数量" align="center">
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center">
          <template slot-scope="{ row }">
            <div style="color: red">{{ row.price }}￥</div>
          </template>
        </el-table-column>
        <el-table-column prop="productCode" label="商品编码" align="center">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
    </el-card>
  </div>
</template>

<script>
import { queryStoreStock } from "@/api/storeController";

export default {
  /**
   * @queryStoreStockData 获取实时库存需要的参数
   * @total 列表的总条数
   * @tableData 假设的数据 可删除
   */
  data() {
    return {
      queryStoreStockData: {
        pageNo: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [
        {
          deviceBrand: "斯耐克",
          deviceFaultName: "生锈老化",
          deviceModel: "SNK001",
          deviceName: "螺丝",
          devicePositionName: "机床顶部",
          id: 0,
          num: 20,
          price: 2,
          productCode: "Code001",
        },
        {
          deviceBrand: "斯耐克",
          deviceFaultName: "生锈变钝",
          deviceModel: "SNK002",
          deviceName: "刀片",
          devicePositionName: "机床内部",
          id: 1,
          num: 10,
          price: 5,
          productCode: "Code002",
        },
        {
          deviceBrand: "安川",
          deviceFaultName: "机不起来",
          deviceModel: "SNK003",
          deviceName: "电机",
          devicePositionName: "机床内部",
          id: 1,
          num: 10,
          price: 50,
          productCode: "Code003",
        },
      ],
    };
  },
  methods: {
    async getStoreStock(data) {
      const res = await queryStoreStock(data);
      console.log(res);
      const { total } = res;
      this.total = total;
    },
  },
  created() {
    this.getStoreStock(this.queryStoreStockData);
  },
};
</script>

<style scoped lang="less">
.storeStockBox {
  padding: 20px 30px;
  .bigTitle {
    color: #0b2059;
    margin-bottom: 20px;
  }
}
</style>
