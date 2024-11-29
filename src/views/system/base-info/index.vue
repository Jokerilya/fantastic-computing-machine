<template>
  <div class="content_box">
    <first-title title="系统参数配置" />
    <el-table
      v-loading="dataConfig.loading"
      border
      stripe
      :data="dataList"
      class="list"
    >
      <el-table-column
        label="主键ID"
        width="80"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置键值" align="center" header-align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置值" align="center" header-align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.configVal"
            type="number"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" header-align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.remark"
            :rows="3"
            type="textarea"
            placeholder="请输入内容"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-button
            class="mg_r15 mg_t10"
            size="small"
            type="primary"
            @click="editDataFn(scope)"
            >提交编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { baseInfoFn, baseEditFn, addressFn } from "@/api/system.js";
export default {
  name: "BaseInfo",
  data() {
    return {
      dataList: [],
      dataConfig: {
        loading: true,
      },
      province: {},
      allCitys: {},
      allAreas: {},
    };
  },
  beforeMount() {
    this.baseInfoFn();
  },
  methods: {
    proIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allCitys = res;
        this.sysAddrList[0].cityId = null;
        this.sysAddrList[0].areaId = null;
      });
    },
    cityIdChangeFn(val) {
      this.addressFn(val).then((res) => {
        this.allAreas = res;
        this.sysAddrList[0].areaId = null;
      });
    },
    addressFn(pid) {
      return addressFn({ pid: pid }).then((res) => {
        const resData = this.resDataFn(res);
        return resData;
      });
    },
    editDataFn(scope) {
      baseEditFn({
        configKey: scope.row.configKey,
        configVal: scope.row.configVal,
        id: scope.row.id,
        remark: scope.row.remark,
      }).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.baseInfoFn();
        }
      });
    },
    editAddrDataFn(scope) {
      editSysAddrFn(scope.row).then((res) => {
        const resData = this.resDataFn(res);
        if (resData == "000") {
          this.$message({
            showClose: true,
            message: "操作成功！",
            type: "success",
          });
          this.sysInfoFn();
        }
      });
    },
    baseInfoFn() {
      baseInfoFn().then((res) => {
        const resData = this.resDataFn(res);
        console.log(137, resData);
        this.dataList = resData;
      });
    },
    sysInfoFn() {
      getSysAddrFn().then((res) => {
        const resData = this.resDataFn(res);
        resData.proId = resData.proId.toString();
        resData.cityId = resData.cityId.toString();
        resData.areaId = resData.areaId.toString();
        this.addressFn(0).then((res) => {
          this.province = res;
        });
        this.addressFn(resData.proId).then((res) => {
          this.allCitys = res;
        });
        this.addressFn(resData.cityId).then((res) => {
          this.allAreas = res;
        });
        this.sysAddrList = [resData];
      });
    },
  },
};
</script>

<style>
</style>
