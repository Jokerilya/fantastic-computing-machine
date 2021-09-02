<template>
  <div class="content_box">
    <first-title title="补货库存列表" />
    <el-table
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column label="商品图片" align="center" header-align="center">
        <template slot-scope="scope">
          <el-image
            class="head_url"
            :src="scope.row.coverUrl"
            :preview-src-list="[scope.row.coverUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总库存" align="center" header-align="center" width="250">
        <template slot-scope="scope">
			<el-input-number v-model="scope.row.num"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="已售数量" align="center" header-align="center" width="250">
        <template slot-scope="scope">
			<el-input-number v-model="scope.row.saleNum"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" align="center" header-align="center" width="250">
        <template slot-scope="scope">
			<el-input-number v-model="scope.row.lastNum"></el-input-number>
        </template>
      </el-table-column>
	  
	  <el-table-column
	  		  label="操作"
	  >
	    <template slot-scope="scope">
	      <el-button
	        plain
	        type="primary"
	        size="small"
	        @click="handleStockClick(scope.row)"
	      >
	        修改
	      </el-button>
	    </template>
	  		
	  </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryAgentStock,handleStockClick } from "@/api/user.js";
export default {
  name: "DetailedList",
  data() {
    return {
      dataList: [],
      queryData: {
        uid: "", // 1 2 3
      },
    };
  },
  beforeMount() {
    this.queryData.uid = this.$route.query.uid;
    this.getDataListFn();
  },
  methods: {
    getDataListFn() {
      if (!this.queryData.uid) return;
      queryAgentStock({
        uid: this.queryData.uid,
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData);
      });
    },
	handleStockClick(row){
		handleStockClick({
		  id: row.id,
		  lastNum: row.lastNum,
		  num: row.num,
		  saleNum: row.saleNum,
		}).then((res) => {
		  if (res.code == "000") {
		    this.$message({
		      showClose: true,
		      message: "操作成功！",
		      type: "success",
		    });
		  }
		});
	}
  },
};
</script>


<style lang="scss">
.head_url {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  display: inline-block;
}
</style>
