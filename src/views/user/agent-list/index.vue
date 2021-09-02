<template>
  <div class="content_box">
    <first-title title="代理列表" />
    <div class="select_view">
      筛选：
      <el-input
        v-model="queryData.userName"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户昵称"
      />
      <el-input
        v-model="queryData.phone"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请输入用户手机号"
      />
	  <el-select
	    v-model="queryData.agentId"
	    class="mg_r15 mg_t10"
	    style="width: 160px"
	    placeholder="请选择代理等级"
	    clearable
	  >
	    <el-option label="省代" :value="1" />
		<el-option label="市代" :value="2" />
		<el-option label="区代" :value="3" />
		<el-option label="镇代" :value="4" />
	  </el-select>
      <el-select
        v-model="queryData.proId"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择省"
        @change="proIdChangeFn"
      >
        <el-option
          v-for="item in province"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-if="queryData.proId"
        v-model="queryData.cityId"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择市"
        @change="cityIdChangeFn"
      >
        <el-option
          v-for="item in allCitys"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-if="queryData.cityId"
        v-model="queryData.areaId"
        @change="areaIdChangeFn"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择区"
      >
        <el-option
          v-for="item in allAreas"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-select
        v-if="queryData.areaId"
        v-model="queryData.streetId"
        style="width: 200px"
        class="mg_r15 mg_t10"
        placeholder="请选择镇代"
      >
        <el-option
          v-for="item in allStreets"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

      <el-button class="mg_t10" type="primary" @click="queryDataListFn"
        >查询</el-button
      >
      <el-button class="mg_t10" type="danger" @click="resSetQueryFn"
        >重置查询</el-button
      >
    </div>
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column label="昵称" align="center" header-align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
	  
      <el-table-column label="手机号" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
	  
      <el-table-column label="代理区域" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.agentName }}</span>
        </template>
      </el-table-column>
	  
	  
      <el-table-column
        label="代理库存数量"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.stockNum }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="招商库存数量"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.attractStock }}</div>
        </template>
      </el-table-column>
	  
	  
	  <el-table-column label="真实姓名" align="center" header-align="center" >
	    <template slot-scope="scope">
	      <span>{{ scope.row.realName }}</span>
	    </template>
	  </el-table-column>
	  
	  <el-table-column label="代理手机号" align="center" header-align="center" >
	    <template slot-scope="scope">
	      <span>{{ scope.row.agentPhone }}</span>
	    </template>
	  </el-table-column>
	  
	  <el-table-column label="代理等级" align="center" header-align="center" >
	    <template slot-scope="scope">
	      <span>
	  			  {{
	  			    scope.row.agentLevel === 1
	  			      ? "省代理"
	  			      : scope.row.agentLevel === 2
	  			      ? "市代理"
	  			      : scope.row.agentLevel === 3
	  			      ? "区代理"
	  			      : scope.row.agentLevel === 4
	  			      ? "镇代"
	  			      : "未成为代理"
	  			  }}
	  		  </span>
	    </template>
	  </el-table-column>
	  
	  <el-table-column label="成为代理时间" align="center" header-align="center" >
	    <template slot-scope="scope">
	      <span>{{ scope.row.createTime }}</span>
	    </template>
	  </el-table-column>
	  
      <el-table-column
		  label="操作"
		  fixed="right"
		  width="300"
		  align="center"
		  header-align="center"
	  >
		 
        <template slot-scope="scope">
			<el-button
			  plain
			  type="primary"
			  size="small"
			  @click="
				$router.push({
				  path: '/user/stock-list',
				  query: { uid: scope.row.uid },
				})
			  "
			>
			  补货库存
			</el-button>
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleTopupClick(scope.row)"
          >
            账户变更
          </el-button>
        </template>
		
      </el-table-column>
    </el-table>

    <div class="el_pagination">
      <el-pagination
        background
        layout="prev, pager, next,total,sizes"
        :current-page="dataConfig.pageNo"
        :total="dataConfig.total"
        :page-sizes="[20, 30, 40, 50]"
        @current-change="currentChangeFn"
        @size-change="handleSizeChange"
      />
    </div>
    <el-dialog
      title="余额变更"
      :visible.sync="dialogTopupVisible"
      width="800px"
    >
      <el-form ref="topupForm" label-width="130px" :model="topupForm">
        <el-form-item label="操作类型：" prop="type">
          <el-radio-group v-model="topupForm.type">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="0">扣除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作类型：" prop="amount">
          <el-radio-group v-model="topupForm.amount">
            <el-radio :label="1">代理余额</el-radio>
            <el-radio :label="2">招商库存</el-radio>
            <el-radio :label="3">余额</el-radio>
            <el-radio :label="4">股权</el-radio>
			<el-radio :label="5">积分</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 1">
          <el-input
            v-model="topupForm.agentAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 2">
          <el-input
            v-model="topupForm.attractStock"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 3">
          <el-input
            v-model="topupForm.balanceAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更数量：" v-if="topupForm.amount === 4">
          <el-input
            v-model="topupForm.thighAmount"
            placeholder="变更数量"
            style="width: 300px"
          ></el-input>
        </el-form-item>
		<el-form-item label="变更数量：" v-if="topupForm.amount === 5">
		  <el-input
		    v-model="topupForm.pointAmount"
		    placeholder="变更数量"
		    style="width: 300px"
		  ></el-input>
		</el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="topupForm.remark"
            type="textarea"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTopupVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleDialogClick"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryUserInfoAgentFn, handleAccountEditFn } from "@/api/user.js";
import { addressFn } from "@/api/system.js";
export default {
  name: "UserList",
  data() {
    return {
      dataList: [],
      dataConfig: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      },
      dialogTopupVisible: false,
      dialogLoading: false,
      topupForm: {
        uid: "", // 用户uid
        type: 1, // 操作类型 1赠送 0扣除
        amount: 1,
        balanceAmount: "",
        remark: "",
        attractStock: "",
        agentAmount: "",
        thighAmount: "",
		pointAmount:"",
      },
      queryData: {
        areaId: "",
        phone: "",
        userName: "",
		agentId:"",
        // isAgent: "",
      },
      userStatus: [
        { val: 1, name: "正常" },
        { val: 0, name: "禁用" },
      ],
      province: {},
      allCitys: {},
      allAreas: {},
      allStreets: {},
    };
  },
  beforeMount() {
    this.getDataListFn();
    this.addressFn(0).then((res) => {
      this.province = res;
    });
  },
  methods: {
    // 充值
    handleTopupClick(item) {
      this.topupForm = {
        uid: item.uid, // 用户uid
        type: 1, // 操作类型 1赠送 0扣除
        amount: 1,
        balanceAmount: "",
        topupForm: "",
        attractStock: "",
        agentAmount: "",
        thighAmount: "",
		pointAmount:"",
      };
      this.dialogTopupVisible = true;
    },
    handleDialogClick() {
      this.dialogLoading = true;
      handleAccountEditFn({
        uid: this.topupForm.uid,
        type: this.topupForm.type,
        balanceAmount: this.topupForm.balanceAmount,
        remark: this.topupForm.remark,
        attractStock: this.topupForm.attractStock,
        agentAmount: this.topupForm.agentAmount,
        thighAmount: this.topupForm.thighAmount,
		pointAmount: this.topupForm.pointAmount,
      })
        .then((res) => {
          this.dialogLoading = false;
          if (res.code == "000") {
            this.$message({
              showClose: true,
              message: "操作成功！",
              type: "success",
            });
            this.dialogTopupVisible = false;
            this.getDataListFn();
          }
        })
        .catch(() => {
          this.dialogLoading = false;
        });
    },
    resSetQueryFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.queryData = {
        areaId: "",
        phone: "",
        userName: "",
		agentId:"",
      };
      this.getDataListFn();
    },
    queryDataListFn() {
      this.dataConfig = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        loading: true,
      };
      this.getDataListFn();
    },
    proIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allCitys = res;
      });
    },
    cityIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allAreas = res;
      });
    },
    areaIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allStreets = res;
      });
    },
    addressFn(pid) {
      return addressFn({ pid: pid }).then((res) => {
        const resData = this.resDataFn(res);
        return resData;
      });
    },
    handleSizeChange(val) {
      this.dataConfig.pageSize = val;
      this.getDataListFn();
    },
    currentChangeFn(pageNo) {
      this.dataConfig.pageNo = pageNo;
      this.getDataListFn();
    },
    getDataListFn() {
      this.dataConfig.loading = true;
      let areaId = "";
      if (this.queryData.proId) {
        areaId = this.queryData.proId;
      }
      if (this.queryData.cityId) {
        areaId = this.queryData.cityId;
      }
      if (this.queryData.areaId) {
        areaId = this.queryData.areaId;
      }
      if (this.queryData.streetId) {
        areaId = this.queryData.streetId;
      }
      queryUserInfoAgentFn({
        pageNo: this.dataConfig.pageNo,
        pageSize: this.dataConfig.pageSize,
        userName: this.queryData.nickName,
        phone: this.queryData.phone,
        areaId: areaId,
		agentId:this.queryData.agentId
      }).then((res) => {
        const resData = this.resDataFn(res);
        this.dataList.splice(0, this.dataList.length, ...resData.records);
        this.dataConfig.total = resData.total;
      });
    },
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
.cell {
  .el-row {
    margin-bottom: 10px;
  }
}
</style>
