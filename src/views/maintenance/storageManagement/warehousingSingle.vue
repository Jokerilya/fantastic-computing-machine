<template>
  <div class="warehousingSingle">
    <el-card>
      <div class="Single">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="入库单" name="first">
            <h2 class="title">
              入库单
            </h2>
          </el-tab-pane>
          <el-tab-pane label="采购单" name="second">
            <h2 class="title">
              采购单
            </h2>
          </el-tab-pane>
          <el-tab-pane label="维修单" name="third">
            <h2 class="title">
              维修单
            </h2>
          </el-tab-pane>
        </el-tabs>

        <div class="table">
          <h3 class="label">
            商品信息:
          </h3>
          <el-table :data="tableData">
            <el-table-column prop="num" label="配件编号"></el-table-column>
            <el-table-column prop="name" label="配件名称"></el-table-column>
            <el-table-column prop="brand" label="配件品牌"></el-table-column>
            <el-table-column prop="type" label="配件型号"></el-table-column>
            <el-table-column
              prop="specification"
              label="配件规格"
            ></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column
              prop="reservoirArea"
              label="库区"
            ></el-table-column>
            <el-table-column
              prop="storageLocation"
              label="库位"
            ></el-table-column>
            <el-table-column
              prop="inventoryNum"
              label="库存数量"
            ></el-table-column>
            <el-table-column
              prop="availableNum"
              label="可用数量"
            ></el-table-column>
            <el-table-column
              prop="warehousingNum"
              label="入库量"
            ></el-table-column>
            <el-table-column prop="unitPrice" label="单价"></el-table-column>
            <el-table-column prop="price" label="金额"></el-table-column>
          </el-table>
        </div>
      </div>
      <br />
      <div class="footerTool">
        <el-button type="text" style="font-size: 20px;" @click="printBtn"
          >打印{{
            activeName === "first"
              ? "入库单"
              : activeName === "second"
              ? "采购单"
              : "维修单"
          }}</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
      tableData: [
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
        {
          num: "PJ001",
          name: "主轴",
          brand: "斯奈克",
          type: "SNK-36",
          specification: "800",
          unit: "个",
          reservoirArea: "正式库区",
          storageLocation: "01-02-03",
          inventoryNum: 100,
          availableNum: 100,
          warehousingNum: 10,
          unitPrice: 500.0,
          price: 500.0,
        },
      ],
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab._props.name, event);
    },
    printBtn() {
      alert("功能还未开发,打印不出来...");
    },
  },
  created() {},
};
</script>

<style scoped lang="less">
.warehousingSingle {
  padding: 20px;
  .Single {
    .title {
      text-align: center;
    }
    .info {
      .content {
        padding: 15px;
        width: 55vw;
        color: #919391;
        .line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
      }
    }
  }
  .footerTool {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
