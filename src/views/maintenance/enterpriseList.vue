<!--维保订单-->
<template>
  <div class="app-container">
    <div class="manage-top">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="公司名称">
              <el-input placeholder="请输入公司名称" v-model="enterpriseName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系电话">
              <el-input placeholder="请输入联系电话" v-model="enterprisePhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-button icon="el-icon-zoom-in" plain type="primary" @click="_getEnterpriseList()">查询</el-button>
            <el-button icon="el-icon-refresh" plain type="info" @click="_getEnterpriseList()">重置</el-button>
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="_handleEnterpriseInfoExport()"
            >导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="height: 16px;"></div>
    <el-table
      highlight-current-row
      v-loading.fullscreen.lock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="enterpriseList"
      style="width: 100%;"
      max-height="700"
    >
      <el-table-column
        prop="enterpriseName"
        label="企业名称"
        show-overflow-tooltip
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="maintenancePhone"
        label="联系电话"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="maintenancePeople"
        label="联系人"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="salesmanId"
        label="业务员"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="superiorEnterpriseName"
        label="团长"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="recommendMasterName"
        label="直推师傅"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="nickName"
        label="用户昵称"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        prop="enterpriseTypeId"
        label="企业类型"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>-->
      <el-table-column label="营业执照" show-overflow-tooltip width="300" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.businessLicense" target="_blank" title="营业执照">
            <el-image style="width:50px;height:50px" :src="scope.row.businessLicense"></el-image>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="enterpriseAddress"
        label="企业地址"
        show-overflow-tooltip
        width="300"
        align="center"
      ></el-table-column>

      <el-table-column prop="phone" label="联系电话" show-overflow-tooltip width="150" align="center"></el-table-column>
      <el-table-column
        prop="enterpriseFlag"
        label="认证状态"
        show-overflow-tooltip
        width="150"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="settledTime"
        label="入驻时间"
        show-overflow-tooltip
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="portrait"
        label="微信头像"
        show-overflow-tooltip
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <a :href="scope.row.portrait" target="_blank" title="微信头像">
            <el-image style="width:50px;height:50px" :src="scope.row.portrait"></el-image>
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="regCapital "
        label="注册资本"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="frName" label="法人" show-overflow-tooltip width="200" align="center"></el-table-column>
      <el-table-column
        prop="taxpayerNo"
        label="纳税人识别号"
        show-overflow-tooltip
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{row}">
          <div class="settings">
            <el-button
              type="warning"
              size="mini"
              plain
              @click="open(row)"
              :disabled="row.enterpriseFlag == 2"
            >{{row.enterpriseFlag == 2? '已通过':row.enterpriseFlag == 3? '已驳回':'审核'}}</el-button>
            <el-button type="warning" size="mini" plain @click="openTeam(row)">查看团队</el-button>
          </div>
        </template>
        <model
          ref="enterpriseList"
          title="企业审核"
          @ok="handleEnterpriseExamine"
          @close="resetEditForm"
        >
          <el-form
            :model="editForm"
            ref="editForm"
            status-icon
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="审核状态" prop="name" style="width:calc(100% - 120px)">
              <el-switch v-model="editForm.status"></el-switch>
            </el-form-item>
          </el-form>
        </model>
        <model
          ref="enterpriseTeamList"
          title="企业团队列表"
          @ok="handleEnterpriseExamine"
          @close="resetTeamList"
          :column="2"
        >
          <el-table
            highlight-current-row
            v-loading.fullscreen.lock="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :data="enpTeamList"
            max-height="700"
            style="width: 1500px;"
          >
            <el-table-column
              prop="realName"
              label="真实姓名"
              show-overflow-tooltip
              width="200"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="联系电话"
              show-overflow-tooltip
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="postName"
              label="岗位"
              show-overflow-tooltip
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="workStatus"
              label="状态"
              show-overflow-tooltip
              width="100"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="enterpriseRoleId"
              label="权限"
              show-overflow-tooltip
              width="100"
              align="center"
            ></el-table-column>
          </el-table>
        </model>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="updatePageNo"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.dataNum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount"
    ></el-pagination>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import tableMixin from "@/mixin/table";
import { getEnterpriseList } from "@/api/user.js";
import {
  handleEnterpriseInfoExport,
  queryEnterpriseMemberList,
  exportMethod
} from "@/api/order.js";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      pageCount: 0,
      currentPage: 1,
      enpTeamList: [],
      dataSumNum: "",
      editForm: [],
      enterpriseList: "",
      enterpriseName: "",
      enterprisePhone: "",
      loading: false,
      typeData: [],
      courseList: [],
      snatchList: [],
      courseDistriList: [],
      url: {
        query: "/admin/maintenance/queryRepairOrderList",
        queryType: "/admin/maintenance/queryDeviceTypeList",
        querySnatch: "/admin/maintenance/queryMasterGrabOrderList",
        assign: "/admin/maintenance/handleAssignMaster",
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation",
        handleEnterpriseExamine: "/admin/maintenance/handleEnterpriseExamine"
      },

      finishForm: {
        payAmount: 0
      },
      param: {}
    };
  },
  created() {
    this._getEnterpriseList();
  },
  methods: {
    updatePageNo(val){
      this.currentPage = val;
      this._getEnterpriseList();
    },
    resetTeamList() {
      this.$refs.enterpriseTeamList.close();
    },
    _queryEnterpriseMemberList(row) {
      let data = {
        name: row.enterpriseName,
        pageNo: 1,
        pageSize: 10,
        query: "",
        uid: row.uid
      };
      queryEnterpriseMemberList(data).then(res => {
        if (res) {
          this.enpTeamList = res.data.records;
          console.log("企业团队列表", this.enpTeamList);
        }
      });
    },
    _handleEnterpriseInfoExport() {
      let data = {
        name: this.enterpriseName,
        pageNo: 1,
        pageSize: 20,
        query: "",
        phone: this.enterprisePhone
      };
      handleEnterpriseInfoExport(data).then(res => {
        if (res) {
          console.log("导出", res);
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);

          link.download = '企业列表'; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    openTeam(row) {
      console.log("团队参数", row);
      this._queryEnterpriseMemberList(row);
      this.$refs.enterpriseTeamList.open();
    },
    handleEnterpriseExamine() {
      this.$axios
        .post(this.url.handleEnterpriseExamine, {
          uid: this.editForm.uid,
          status: 2
        })
        .then(data => {
          // this.util.message(this, data.enterpriseFlag, data.message);
          this._getEnterpriseList();
          this.resetEditForm(false);
        })
        .catch(function(error) {
          console.info(error);
        });
    },
    resetEditForm(fn) {
      fn(false);
      this._getEnterpriseList();
    },
    open(row) {
      console.log(row);
      this.$refs.enterpriseList.open();
      this.editForm = {
        uid: row.uid,
        status: false
      };
    },
    _getEnterpriseList() {
      let params = {
        pageNo:this.currentPage,
        pageSize: 20,
        name: this.enterpriseName,
        phone: this.enterprisePhone
      };
      getEnterpriseList(params).then(res => {
        if (res) {
          //   console.log(res);
          this.enterpriseList = res.data.records;
          console.log("企业列表", this.enterpriseList);
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
        console.log("名称", this.enterpriseName);
        console.log("手机", this.enterprisePhone);
      });
    }
  }
};
</script>
