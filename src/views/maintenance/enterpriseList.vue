<!--企业列表-->
<template>
  <div class="app-container">
    <!-- 顶部工具栏部分 -->
    <div class="manage-top">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="25">
          <el-col :span="5" style="padding: 0;">
            <el-form-item label="公司名称">
              <el-input
                placeholder="请输入公司名称"
                v-model="enterpriseName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="padding: 0;">
            <el-form-item label="联系电话">
              <el-input
                placeholder="请输入联系电话"
                v-model="enterprisePhone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" style="padding: 0;">
            <el-form-item label="推荐人">
              <el-select
                filterable
                :remote-method="remoteMethod"
                remote
                v-model="referencePerson"
                placeholder="请输入推荐人"
              >
                <el-option
                  v-for="item in masterOptions"
                  :key="item.value"
                  :label="item.realName"
                  :value="item.realName"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="_getEnterpriseList(1)"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" plain type="info" @click="resetFn"
              >重置</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="_handleEnterpriseInfoExport()"
              >导出</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 空行 -->
    <div style="height: 16px;"></div>

    <el-card>
      <!-- 企业列表表格部分 -->
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="enterpriseList"
        height="65vh"
      >
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="250"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="maintenancePhone"
          label="联系电话"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="maintenancePeople"
          label="联系人"
          show-overflow-tooltip
          width="70"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
        prop="salesmanId"
        label="业务员"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column> -->
        <el-table-column
          prop="frname"
          label="法人代表"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="superiorEnterpriseName"
          label="团队长"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column> -->
        <!-- <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column> -->
        <!-- <el-table-column
        prop="enterpriseTypeId"
        label="企业类型"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column>-->
        <el-table-column
          label="营业执照"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <a
              :href="scope.row.businessLicense"
              target="_blank"
              title="营业执照"
              v-if="scope.row.businessLicense"
            >
              <el-image
                style="width:50px;height:50px"
                :src="scope.row.businessLicense"
              ></el-image>
            </a>
            <div v-else style="font-size: 25px;">
              /
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="enterpriseAddress"
          label="企业地址"
          show-overflow-tooltip
          width="350"
          align="center"
        ></el-table-column>

        <!-- <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column> -->
        <el-table-column
          label="认证状态"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.enterpriseFlag === 0" style="color: #ccc;">
              未认证
            </div>
            <div v-if="row.enterpriseFlag === 1" style="color: blue;">
              审核中
            </div>
            <div v-if="row.enterpriseFlag === 2" style="color: green;">
              审核成功
            </div>
            <div v-if="row.enterpriseFlag === 3" style="color: red;">
              审核失败
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="settledTime"
          label="入驻时间"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column> -->
        <!-- <el-table-column
          prop="portrait"
          label="微信头像"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <a
              v-if="scope.row.portrait"
              :href="scope.row.portrait"
              target="_blank"
              title="微信头像"
            >
              <el-image
                style="width:50px;height:50px"
                :src="scope.row.portrait"
              ></el-image>
            </a>
            <div v-else style="font-size: 25px;">
              /
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="deviceScale"
          label="公司规模"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceTypeIdsName"
          label="设备类型"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="220px"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <div class="settings">
              <el-button
                type="warning"
                size="mini"
                plain
                @click="auditFn(row)"
                v-if="row.enterpriseFlag !== 2 && row.enterpriseFlag !== 3"
                >审核</el-button
              >
              <el-button
                type="warning"
                size="mini"
                plain
                @click="openInvitationCode(row.id)"
                >邀请码</el-button
              >
              <el-button type="warning" size="mini" plain @click="openTeam(row)"
                >成员</el-button
              >
              <el-button type="warning" size="mini" plain @click="editTeam(row)"
                >编辑</el-button
              >
            </div>
          </template>

          <!-- <model
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
            <el-form-item
              label="审核状态"
              prop="name"
              style="width:calc(100% - 120px)"
            >
              <el-switch v-model="editForm.status"></el-switch>
            </el-form-item>
          </el-form>
        </model> -->

          <model
            :isSubmit="false"
            ref="enterpriseTeamList"
            title="企业团队列表"
            @ok="handleEnterpriseExamine"
            @close="resetTeamList"
            :column="2"
            width="45%"
            center
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
              >
                <template slot-scope="{ row }">
                  {{
                    row.workStatus === 1
                      ? "工作中"
                      : row.workStatus === 2
                      ? "外出中"
                      : "休息中"
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="权限"
                show-overflow-tooltip
                width="100"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{
                    row.enterpriseRoleId === 1
                      ? "超管"
                      : row.enterpriseRoleId === 2
                      ? "管理"
                      : "成员"
                  }}
                </template>
              </el-table-column>
            </el-table>
            <div style="height: 40px;"></div>
          </model>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div style="margin-top: 20px;display: flex;justify-content: center;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="updatePageNo"
          :current-page="currentPage"
          :page-size="20"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 放大邀请码图片 -->
    <div class="demo-image__preview">
      <el-image
        style="width: 0px; height: 0px"
        :src="enlargeInvitationCodeUrl"
        :preview-src-list="enlargeInvitationCodeUrlList"
        ref="enlargeInvitationCode"
      >
      </el-image>
    </div>

    <!-- 编辑企业弹窗 -->
    <div v-if="editForm">
      <el-dialog
        title="编辑企业"
        width="60%"
        :visible="editEnterprise"
        :before-close="closeEditEnterprise"
      >
        <div class="content">
          <div class="oneLine">
            <div class="item">
              <div class="title">
                联系人
              </div>
              <el-input class="inp" v-model="editForm.maintenancePeople">
              </el-input>
            </div>
            <div class="item">
              <div class="title">
                联系电话
              </div>
              <el-input class="inp" v-model="editForm.maintenancePhone">
              </el-input>
            </div>
            <div class="item">
              <div class="title">
                法人代表
              </div>
              <el-input class="inp" v-model="editForm.frname"> </el-input>
            </div>
          </div>
          <div class="oneLine">
            <div class="item">
              <div class="title">
                企业名称
              </div>
              <el-input class="inp" v-model="editForm.enterpriseName">
              </el-input>
            </div>
            <div class="item">
              <div class="title">
                企业地址
              </div>
              <el-input class="inp" v-model="editForm.enterpriseAddress">
              </el-input>
            </div>
            <div class="item">
              <div class="title">
                纳税人识别号
              </div>
              <el-input
                class="inp"
                v-model="editForm.taxpayerNo"
                :disabled="true"
              >
              </el-input>
            </div>
          </div>
          <div class="oneLine">
            <div class="item">
              <div class="title">
                设备类型
              </div>
              <el-cascader
                class="inp"
                :show-all-levels="false"
                :options="typeList"
                v-model="editForm.deviceTypeIds"
                :props="{
                  checkStrictly: true,
                  emitPath: false,
                  value: 'id',
                  label: 'name',
                  multiple: true,
                  children: 'list',
                }"
                collapse-tags
                clearable
              ></el-cascader>
            </div>
            <!-- <div class="item">
              <div class="title">
                成立日期
              </div>
              <el-date-picker
                class="inp"
                v-model="editForm.opfrom"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </div> -->
            <!-- <div class="item">
              <div class="title">
                注册资本
              </div>
              <el-input class="inp" v-model="editForm.regCapital"> </el-input>
            </div> -->
            <div class="item">
              <div class="title">
                直推师傅
              </div>
              <el-select
                filterable
                :remote-method="remoteMethod"
                disabled
                remote
                v-model="recommendMaster"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in masterOptions"
                  :key="item.value"
                  :label="item.realName"
                  :value="item.realName"
                >
                </el-option>
              </el-select>
            </div>

            <div class="item" style="position: relative;">
              <!-- <div class="title" style="flex:3">
                是否禁用
              </div>
              <div style="flex:6">
                <el-switch
                  v-model="editForm.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="0"
                  :inactive-value="1"
                >
                </el-switch>
              </div> -->
              <!-- <div
                style="position: absolute;bottom: 9px;right: 23px;color: red;"
              >
                (注意:绿色状态是禁用)
              </div> -->
            </div>
          </div>
          <!-- <div class="oneLine">
            <div class="item">
              <div class="title" style="flex:3">
                年保客户
              </div>
              <div style="flex:6">
                <el-switch
                  disabled
                  v-model="editForm.vipFlag"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </div>
            </div>
          </div> -->
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="closeEditEnterprise">取 消</el-button>
          <el-button type="primary" @click="confirmFn">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 企业审核弹窗 -->
    <el-dialog
      title="企业审核"
      :visible="auditDialog"
      width="30%"
      :before-close="auditDialogClose"
    >
      <div
        style="text-align: center;display: flex;justify-content: center;align-items: center;"
      >
        <div style="margin-right: 20px;font-size: 18px;font-weight: 700;">
          审核状态:
        </div>
        <el-select v-model="auditSelect" placeholder="请选择审核状态">
          <el-option label="已通过" :value="2"></el-option>
          <el-option label="已驳回" :value="3"></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogClose">取 消</el-button>
        <el-button type="primary" @click="auditDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.table-wrapper {
  height: calc(100%-200px);
}
.content {
  .oneLine {
    display: flex;
    margin-bottom: 25px;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      .title {
        color: #1f1f1f;
        font-size: 15px;
        font-weight: 700;
      }
      .inp {
        width: 200px;
      }
    }
  }
}
</style>

<script>
import tableMixin from "@/mixin/table";
import { getEnterpriseList } from "@/api/user.js";
import {
  handleEnterpriseInfoExport,
  queryDeviceTypeList,
  queryEnterpriseMemberList,
  queryMasterName,
} from "@/api/order.js";
import {
  handleEnterpriseExamine,
  getEnterpriseInfo,
  editEnterpriseInfo,
  queryEnterpriseName,
  getEnterpriseInvitationCode,
} from "@/api/boss";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      enlargeInvitationCodeUrl: null,
      enlargeInvitationCodeUrlList: null,

      editId: "",
      auditDialog: false, //审核弹窗默认
      auditSelect: "", //审核状态
      auditUid: "", //审核需要的uid
      referencePerson: null, //查询推荐人框

      typeList: null,
      masterOptions: [],
      VALE: "",
      recommendMaster: "",

      editEnterprise: false,
      dialogVisible: false,
      editForm: null,

      total: 0,
      currentPage: 1,
      enpTeamList: null,
      dataSumNum: "",
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
        handleEnterpriseExamine: "/admin/maintenance/handleEnterpriseExamine",
      },

      finishForm: {
        payAmount: 0,
      },
      param: {},
    };
  },
  async created() {
    this._getEnterpriseList();
    const res = await queryDeviceTypeList();
    this.typeList = res.data;
  },
  methods: {
    // 点击邀请码
    async openInvitationCode(id) {
      const res = await getEnterpriseInvitationCode(id);
      this.enlargeInvitationCodeUrl = res.data;
      this.enlargeInvitationCodeUrlList = [res.data];
      setTimeout(() => {
        this.$refs.enlargeInvitationCode.clickHandler();
      }, 1000);
    },
    // 确定审核
    async auditDialogConfirm() {
      const data = {
        status: this.auditSelect,
        id: this.auditUid,
      };
      const res = await handleEnterpriseExamine(data);
      if (res.message === "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.auditDialogClose();
        this._getEnterpriseList();
      }
    },
    // 关闭审核弹窗的事件
    auditDialogClose() {
      this.auditDialog = false;
    },
    // 点击审核触发的事件
    async auditFn(row) {
      if (row.enterpriseFlag === 1) {
        this.auditSelect = "";
      } else if (row.enterpriseFlag === 3) {
        this.auditSelect = 3;
      }
      this.auditUid = row.id;
      this.auditDialog = true;
    },
    // 重置事件
    resetFn() {
      this.enterpriseName = "";
      this.enterprisePhone = "";
      this._getEnterpriseList();
    },
    // 推荐人搜索
    async remoteMethod(query) {
      const res = await queryMasterName(query);
      this.masterOptions = res.data;
    },
    // 编辑确定按钮触发的事件
    async confirmFn() {
      // 修改设备类型格式
      let str = "";
      if (this.editForm.deviceTypeIds) {
        this.editForm.deviceTypeIds.forEach((el, index) => {
          if (index === 0) {
            str = "" + el;
          } else {
            str = str + "," + el;
          }
        });
        this.editForm.deviceTypeIds = str;
      }
      if (this.recommendMaster) {
        const res = await queryMasterName(this.recommendMaster);
        const uid = res.data && res.data[0].uid;
        this.editForm.recommendMasterUid = uid;
      }
      this.editForm.id = this.editId;
      this.editForm.address = this.editForm.enterpriseAddress;
      const res1 = await editEnterpriseInfo(this.editForm);
      if (res1.message === "操作成功") {
        this.$message({
          message: "编辑成功!",
          type: "success",
        });
        await this._getEnterpriseList();
        this.closeEditEnterprise();
      }
    },
    // 关闭编辑企业弹窗
    closeEditEnterprise() {
      this.editForm = null;
      this.editEnterprise = false;
    },
    // 点击编辑触发的事件
    async editTeam(row) {
      this.editId = row.id;
      const res = await getEnterpriseInfo(row);
      this.editForm = res.data;
      this.recommendMaster = res.data.recommendMasterRealName;
      console.log(this.editForm);
      if (
        this.editForm.deviceTypeIds &&
        this.editForm.deviceTypeIds.indexOf(",") !== -1
      ) {
        this.editForm.deviceTypeIds = this.editForm.deviceTypeIds.split(",");
      }
      const { data } = await queryEnterpriseName(res.data.enterpriseName);
      this.editForm.uid = data[0] && data[0].uid;
      this.editEnterprise = true;
    },
    // 页码发生变化触发的事件
    updatePageNo(val) {
      this.currentPage = val;
      this._getEnterpriseList();
    },
    // 关闭查看团队弹窗
    resetTeamList() {
      this.$refs.enterpriseTeamList.close();
    },
    // 获取企业团队列表
    _queryEnterpriseMemberList(row) {
      let data = {
        name: row.enterpriseName,
        pageNo: 1,
        pageSize: 99,
        query: "",
        id: row.id,
      };
      queryEnterpriseMemberList(data).then((res) => {
        if (res) {
          this.enpTeamList = res.data.records;
          console.log("企业团队列表", res);
        }
      });
    },
    // 点击导出触发的事件
    _handleEnterpriseInfoExport() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      let data = {
        name: this.enterpriseName,
        pageNo: 1,
        pageSize: 20,
        query: "",
        phone: this.enterprisePhone,
      };
      handleEnterpriseInfoExport(data).then((res) => {
        if (res) {
          console.log("导出", res);
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "企业列表"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          loading.close();
        }
      });
    },
    // 点击查看团队的事件
    openTeam(row) {
      console.log("团队参数", row);
      this._queryEnterpriseMemberList(row);
      this.$refs.enterpriseTeamList.open();
    },
    // 不清楚!!!!
    handleEnterpriseExamine() {
      this.$axios
        .post(this.url.handleEnterpriseExamine, {
          uid: this.editForm.uid,
          status: 2,
        })
        .then((data) => {
          this.util.message(this, data.enterpriseFlag, data.message);
          this._getEnterpriseList();
          this.resetEditForm(false);
        })
        .catch(function(error) {
          console.info(error);
        });
    },
    // 关闭查看团队弹窗
    resetEditForm(fn) {
      fn(false);
      this._getEnterpriseList();
    },
    // 点击审核触发的事件
    open(row) {
      return;
      console.log(row);
      this.$refs.enterpriseList.open();
      this.editForm = {
        uid: row.uid,
        status: false,
      };
    },
    //获取企业列表
    async _getEnterpriseList(id) {
      if (id === 1) {
        this.currentPage = 1;
      }
      let params = {
        pageNo: this.currentPage,
        pageSize: 20,
        name: this.enterpriseName,
        phone: this.enterprisePhone,
      };
      if (this.referencePerson) {
        const res = await queryMasterName(this.referencePerson);
        params.uid = res.data[0] && res.data[0].uid;
      }
      getEnterpriseList(params).then((res) => {
        if (res) {
          console.log(res);
          const { records, total, current } = res.data;
          this.enterpriseList = records;
          this.total = total;
          this.currentPage = current;
        }
      });
    },
  },
};
</script>
