<!--企业列表-->
<template>
  <div class="app-container">
    <!-- 顶部工具栏部分 -->
    <div class="manage-top">
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="25">
          <el-col :span="5">
            <el-form-item label="公司名称">
              <el-input
                placeholder="请输入公司名称"
                v-model="queryEnterpriseListParms.name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="联系电话">
              <el-input
                placeholder="请输入联系电话"
                v-model="queryEnterpriseListParms.phone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="业务员">
              <el-select
                filterable
                :remote-method="remoteMethod"
                remote
                v-model="queryEnterpriseListParms.salesmanId"
                placeholder="请输入业务员"
              >
                <el-option
                  v-for="item in masterOptions"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="创建时间">
              <el-date-picker
                @change="changeQueryTimeCopy"
                v-model="queryTimeCopy"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="25" style="margin-bottom: 15px; text-align: right">
          <el-col>
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
              type="success"
              plain
              @click="_handleEnterpriseInfoExport"
            >
              导出
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 空行 -->
    <div style="height: 16px"></div>

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
          prop="createTime"
          label="入驻时间"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column label="企业身份" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.vipFlag == 1 ? '' : 'info'">
              {{ row.vipFlag == 1 ? "年保客户" : "普通客户" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="结算类型" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            {{ row.settlementType == 2 ? "月结" : "现结" }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          show-overflow-tooltip
          align="center"
          width="180px"
        >
          <template slot-scope="{ row }">
            {{ row.remark ? row.remark : "/" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="maintenancePhone"
          label="联系电话"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.maintenancePhone ? row.maintenancePhone : "/" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="maintenancePeople"
          label="联系人"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="enterpriseAddress"
          label="企业地址"
          width="170px"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="推广人" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            {{ row.promotionPeople ? row.promotionPeople : "/" }}
          </template>
        </el-table-column>
        <el-table-column
          label="业务员(旧版)"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.salesman ? row.salesman : "/" }}
          </template>
        </el-table-column>
        <!-- <el-table-column
        prop="salesmanId"
        label="业务员"
        show-overflow-tooltip
        width="100"
        align="center"
      ></el-table-column> -->
        <el-table-column
          label="法人代表"
          show-overflow-tooltip
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.frname ? row.frname : "/" }}
          </template>
        </el-table-column>
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
                style="width: 50px; height: 50px"
                :src="scope.row.businessLicense"
              ></el-image>
            </a>
            <div v-else>/</div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column> -->

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
        <!-- <el-table-column
          prop="deviceScale"
          label="公司规模"
          show-overflow-tooltip
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.deviceScale ? row.deviceScale : "/" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="deviceTypeIdsName"
          label="设备类型"
          show-overflow-tooltip
          width="200"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.deviceTypeIdsName ? row.deviceTypeIdsName : "/" }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="认证状态"
          show-overflow-tooltip
          width="120"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <div v-if="row.enterpriseFlag === 0" style="color: #ccc">
              未认证
            </div>
            <div v-if="row.enterpriseFlag === 1" style="color: blue">
              审核中
            </div>
            <div v-if="row.enterpriseFlag === 2" style="color: green">
              审核成功
            </div>
            <div v-if="row.enterpriseFlag === 3" style="color: red">
              审核失败
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template slot-scope="{ row }">
            <div class="settings">
              <!-- <el-button
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
              <el-button type="warning" size="mini" plain @click="editTeam(row)"
                >大屏</el-button
              > -->

              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button type="text"
                    >更多<i class="el-icon-arrow-down el-icon--right"></i
                  ></el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="row.enterpriseFlag !== 2 && row.enterpriseFlag !== 3"
                  >
                    <el-button type="text" @click="auditFn(row)"
                      >审核</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="openTeam(row)"
                      >成员</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item v-if="row.enterpriseFlag == 2">
                    <el-button type="text" @click="editTeam(row)"
                      >编辑</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item v-if="row.vipFlag == 1">
                    <el-button type="text" @click="openDataUrl(row.dataUrl)"
                      >大屏</el-button
                    >
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="text" @click="openRemarksDialog(row)"
                      >备注</el-button
                    >
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
              style="width: 1500px"
            >
              <el-table-column
                prop="realName"
                label="真实姓名"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="phone"
                label="联系电话"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="postName"
                label="岗位"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="workStatus"
                label="状态"
                show-overflow-tooltip
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
            <div style="height: 40px"></div>
          </model>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div style="margin-top: 20px; display: flex; justify-content: center">
        <el-pagination
          background
          @current-change="updatePageNo"
          :current-page="queryEnterpriseListParms.pageNo"
          :page-size="queryEnterpriseListParms.pageSize"
          layout="total,  prev, pager, next, jumper"
          :total="getEnterpriseListTotal"
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
        width="30%"
        :visible="editEnterprise"
        :close-on-click-modal="false"
        :before-close="closeEditEnterprise"
      >
        <el-form label-width="120px" label-position="left">
          <el-form-item label="企业名称">
            <el-input class="inp" v-model="editForm.enterpriseName"> </el-input>
          </el-form-item>
          <el-form-item label="结算类型">
            <el-select
              v-model="editForm.settlementType"
              placeholder="请选择"
              style="width: 240px"
            >
              <el-option label="现结" :value="1">现结</el-option>
              <el-option label="月结" :value="2">月结 </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业地址">
            <el-cascader
              v-model="editForm.areaId"
              :options="addressOptions"
              :props="addressOptionsProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input class="inp" v-model="editForm.maintenancePeople">
            </el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input class="inp" v-model="editForm.maintenancePhone">
            </el-input>
          </el-form-item>
          <el-form-item label="法人代表">
            <el-input class="inp" v-model="editForm.frname"> </el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号">
            <el-input
              class="inp"
              v-model="editForm.taxpayerNo"
              :disabled="true"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
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
      :close-on-click-modal="false"
      :before-close="auditDialogClose"
    >
      <div class="auditDialog">
        <div class="auditDialog_line">
          <div class="auditDialog_line_title">审核状态:</div>
          <div class="auditDialog_line_inp">
            <el-select
              v-model="auditSelect"
              @change="cleanReason"
              placeholder="请选择审核状态"
            >
              <el-option label="已通过" :value="2"></el-option>
              <el-option label="已驳回" :value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="auditDialog_line" v-if="auditSelect == 3">
          <div class="auditDialog_line_title">驳回原因:</div>
          <div class="auditDialog_line_inp">
            <el-input placeholder="请输入驳回原因" v-model="reason"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogClose">取 消</el-button>
        <el-button type="primary" @click="auditDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 备注 ＋ 标签 -->
    <el-dialog
      title="备注"
      width="30%"
      :before-close="closeRemarksDialog"
      :visible="remarksDialogVisible"
      :close-on-click-modal="false"
    >
      <div class="auditDialog">
        <el-form label-width="80px">
          <el-form-item
            label="标签:"
            v-if="enterpriseTag && enterpriseTag.length > 0"
          >
            <el-button
              :type="judgeTagSelected(item) ? 'primary' : ''"
              @click="addTag(item)"
              size="small"
              v-for="item in enterpriseTag"
              :key="item"
              >{{ item }}</el-button
            >
          </el-form-item>
          <el-form-item label="自定义:">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="handleEnterpriseRemarkParamsCopy.remark"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:" v-if="enterpriseRemark">
            {{ enterpriseRemark }}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRemarksDialog">取 消</el-button>
        <el-button type="primary" @click="handleEnterpriseRemark"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.auditDialog {
  .auditDialog_line {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    .auditDialog_line_title {
      margin-right: 20px;
      font-size: 18px;
      font-weight: 700;
      width: 100px;
    }
    .auditDialog_line_inp {
      flex: 1;
    }
  }
}

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
import { getSysLabel } from "@/api/system.js";
import { getEnterpriseList, querySalesmanList } from "@/api/user.js";
import {
  handleEnterpriseInfoExport,
  queryDeviceTypeList,
  queryEnterpriseMemberList,
  queryMasterName,
  handleEnterpriseRemark,
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
      remarksDialogVisible: false,
      handleEnterpriseRemarkParamsCopy: {
        labelList: [],
        remark: null,
      },
      chooseEnterpriseId: null,
      enterpriseTag: [],

      reason: "", //驳回原因

      enlargeInvitationCodeUrl: null,
      enlargeInvitationCodeUrlList: null,

      editId: "",
      auditDialog: false, //审核弹窗默认
      auditSelect: "", //审核状态
      auditUid: "", //审核需要的uid

      typeList: null,
      recommendMaster: "",

      editEnterprise: false,
      dialogVisible: false,
      editForm: null,

      getEnterpriseListTotal: 0,
      currentPage: 1,
      enpTeamList: null,
      dataSumNum: "",
      enterpriseList: [],
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

      masterOptions: [],
      queryTimeCopy: null,
      queryEnterpriseListParms: {
        name: null,
        pageNo: 1,
        pageSize: 10,
        phone: null,
        salesmanId: null,
        queryTime: null,
      },

      addressOptions: [],
      addressOptionsProps: {
        checkStrictly: false,
        emitPath: false,
        value: "id",
        label: "name",
        children: "child",
      },
    };
  },
  computed: {
    enterpriseRemark() {
      const { labelList, remark } = this.handleEnterpriseRemarkParamsCopy;
      const parts = [...labelList];
      if (remark) {
        parts.push(remark);
      }
      return parts.join(";");
    },
  },
  async created() {
    this._getEnterpriseList();
    const res = await queryDeviceTypeList();
    this.typeList = res.data;
  },
  mounted() {
    this.addressOptions = require("../../utils/address.json");
    this.getSysLabel();
  },
  methods: {
    // 确定企业备注
    async handleEnterpriseRemark() {
      let params = {
        id: this.chooseEnterpriseId,
        remark: this.enterpriseRemark,
      };
      const res = await handleEnterpriseRemark(params);
      if (res.code == "000") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closeRemarksDialog();
        this._getEnterpriseList();
      }
    },
    // 关闭备注弹窗
    closeRemarksDialog() {
      this.handleEnterpriseRemarkParamsCopy = {
        labelList: [],
        remark: null,
      };
      this.chooseEnterpriseId = null;
      this.remarksDialogVisible = false;
    },
    // 判断是否被选中
    judgeTagSelected(tag) {
      return this.handleEnterpriseRemarkParamsCopy.labelList.includes(tag);
    },
    // 点击标签
    addTag(tag) {
      const list = this.handleEnterpriseRemarkParamsCopy.labelList;
      const index = list.indexOf(tag);
      if (index > -1) {
        // 已存在，移除
        list.splice(index, 1);
      } else {
        // 不存在，添加
        list.push(tag);
      }
    },
    // 获取企业标签
    async getSysLabel() {
      const res = await getSysLabel("enterpriseTag");
      if (res.code == "000") {
        if (res.data) {
          this.enterpriseTag = res.data.split(",");
        }
      }
    },
    // 打开备注弹框
    openRemarksDialog(row) {
      if (row.remark) {
        let arr = row.remark.split(";");
        arr.forEach((item) => {
          if (this.enterpriseTag.includes(item)) {
            this.handleEnterpriseRemarkParamsCopy.labelList.push(item);
          } else {
            this.handleEnterpriseRemarkParamsCopy.remark = item;
          }
        });
      }
      this.chooseEnterpriseId = row.id;
      this.remarksDialogVisible = true;
    },

    // 复制大屏链接
    openDataUrl(url) {
      window.open(url, "_blank");
    },
    // 切换创建时间
    changeQueryTimeCopy() {
      this.queryEnterpriseListParms.queryTime =
        this.queryTimeCopy[0] + "~" + this.queryTimeCopy[1];
    },
    // 切换的时候 把审核原因清空
    cleanReason() {
      this.reason = "";
    },
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
        reason: this.reason,
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
      this.queryTimeCopy = null;
      this.masterOptions = [];
      this.queryEnterpriseListParms = {
        name: null,
        pageNo: 1,
        pageSize: 10,
        phone: null,
        salesmanId: null,
        queryTime: null,
      };
      this._getEnterpriseList();
    },
    // 推荐人搜索
    async remoteMethod(query) {
      const params = {
        pageNo: 1,
        pageSize: 999,
        realName: query,
      };
      const res = await querySalesmanList(params);
      this.masterOptions = res.data.records;
    },
    // 编辑确定按钮触发的事件
    async confirmFn() {
      // 修改设备类型格式
      let str = "";
      if (Array.isArray(this.editForm.deviceTypeIds)) {
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
      if (res.code == "000") {
        this.editForm = res.data;
        this.recommendMaster = res.data.recommendMasterRealName;
        if (
          this.editForm.deviceTypeIds &&
          this.editForm.deviceTypeIds.indexOf(",") !== -1
        ) {
          this.editForm.deviceTypeIds = this.editForm.deviceTypeIds.split(",");
        }
        const queryEnterpriseNameRes = await queryEnterpriseName(
          res.data.enterpriseName
        );
        if (queryEnterpriseNameRes.code == "000") {
          this.editForm.uid =
            queryEnterpriseNameRes.data[0] &&
            queryEnterpriseNameRes.data[0].uid;
          this.editEnterprise = true;
          console.log(897, this.editForm);
        }
      }
    },
    // 页码发生变化触发的事件
    updatePageNo(val) {
      this.queryEnterpriseListParms.pageNo = val;
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
        if (res.code == "000") {
          this.enpTeamList = res.data.records;
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
      const data = this.queryEnterpriseListParms;
      data.pageSize = 1000;
      handleEnterpriseInfoExport(data).then((res) => {
        if (res) {
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
    async openTeam(row) {
      await this._queryEnterpriseMemberList(row);
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
        .catch(function (error) {
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
        this.queryEnterpriseListParms.pageNo = 1;
      }
      const res = await getEnterpriseList(this.queryEnterpriseListParms);
      if (res.code == "000") {
        this.enterpriseList = res.data.records;
        this.getEnterpriseListTotal = res.data.total;
      }
    },
  },
};
</script>
