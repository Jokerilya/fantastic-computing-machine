<template>
  <div class="content_box">
    <first-title title="小程序首页商品推荐" />
    <div class="content-view" v-for="(item, i) in dataList" :key="i">
      <div class="flex just-sb">
        <div class="font20 color-333 font-bold">
          {{
            item.type === 1
              ? "装机商品"
              : item.type === 2
              ? "星选商品"
              : item.type === 3
              ? "配件大全"
              : "耗材专区"
          }}
        </div>
        <el-button
          type="primary"
          size="small"
          @click="
            $router.push({
              path: '/product/updateproducttuijianList',
              query: { typeID: item.id },
            })
          "
          >更换商品</el-button
        >
      </div>
      <el-table border :data="item.list" class="mt20">
        <el-table-column
          label="ID"
          width="60px"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center"
          min-width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品图"
          width="110"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.coverImage"
              fit="cover"
              :preview-src-list="[scope.row.coverImage]"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="商品原价"
          align="center"
          width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.originalPrice || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="商品价格"
          align="center"
          width="350px"
          header-align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getqueryRecommendProduct } from "@/api/product.js";
export default {
  name: "",
  data() {
    return {
      dataList: [],
      dataConfig: {
        loading: true,
      },
    };
  },
  beforeMount() {
    this.getDataListFn();
  },
  methods: {
    async getDataListFn() {
      const res = await getqueryRecommendProduct();
      if (res.code === "000") {
        const list = res.data;
        this.dataList = list;
      }
    },
  },
};
</script>

<style lang="scss">
.content-view {
  padding: 20px;
  background: #fff;
}
</style>
