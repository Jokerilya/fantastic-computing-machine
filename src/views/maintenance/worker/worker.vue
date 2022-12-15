<!--编程订单-->
<template>
  <div class="app-container">
    <el-form label-width="88px" class="rule-form" label-position="right">
      <el-row :gutter="20">
        <el-col :span="17" style="display: flex;">
          <el-form-item label="师傅名称">
            <el-input
              placeholder="请输入师傅名称"
              clearable
              v-model="Name"
            ></el-input>
          </el-form-item>
          <el-form-item label="团长名称">
            <el-select
              filterable
              :remote-method="remoteMethod"
              remote
              v-model="colonelName"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in referrerOptions"
                :key="item.value"
                :label="item.realName"
                :value="item.realName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推荐人名称">
            <el-select
              clearable
              filterable
              :remote-method="remoteMethod"
              remote
              v-model="referrerName"
              placeholder="请选择"
            >
              <el-option
                v-for="item in referrerOptions"
                :key="item.value"
                :label="item.realName"
                :value="item.realName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-button plain type="primary" @click="resetFn">重置</el-button>
          <el-button
            icon="el-icon-zoom-in"
            plain
            type="primary"
            @click="_getMasterList()"
            >查询</el-button
          >
          <el-button
            icon="el-icon-refresh"
            plain
            type="primary"
            @click="_handleMasterInfoExport()"
            >导出师傅</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <el-card>
      <el-table
        highlight-current-row
        v-loading.fullscreen.isLock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="masterList"
        height="65vh"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realPortrait"
          label="真实头像"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="row.realPortrait ? row.realPortrait.split(',')[0] : ''"
              :srcList="row.realPortrait ? row.realPortrait.split(',') : ''"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="superiorMasterName"
          label="团长"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="recommendMasterName"
          label="推荐人"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="identityFrontImage"
          label="身份证正面照"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.identityFrontImage
                  ? row.identityFrontImage.split(',')[0]
                  : ''
              "
              :srcList="
                row.identityFrontImage ? row.identityFrontImage.split(',') : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="identityBackImage"
          label="身份证反面照"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.identityBackImage ? row.identityBackImage.split(',')[0] : ''
              "
              :srcList="
                row.identityBackImage ? row.identityBackImage.split(',') : ''
              "
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="identityNumber"
          label="身份证号码"
          show-overflow-tooltip
          width="170"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="industryExperience"
          label="行业经验"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="industryExperienceImages"
          label="行业经验照片"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.industryExperienceImages
                  ? row.industryExperienceImages.split(',')[0]
                  : ''
              "
              :srcList="
                row.industryExperienceImages
                  ? row.industryExperienceImages.split(',')
                  : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务地区"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skillCertificateImages"
          label="技能证书图书"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <y-image
              :src="
                row.skillCertificateImages
                  ? row.skillCertificateImages.split(',')[0]
                  : ''
              "
              :srcList="
                row.skillCertificateImages
                  ? row.skillCertificateImages.split(',')
                  : ''
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceTypes"
          label="服务类型"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="servePosition"
          label="服务部位"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serveSystem"
          label="服务系统"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间 "
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="isLock"
          label="是否锁定"
          show-overflow-tooltip
          width="100"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row }">{{
            util.global.getLabel("isLock", row.isLock)
          }}</template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
          show-overflow-tooltip
          width="80"
          align="center"
          fixed="right"
        >
          <template slot-scope="{ row }">{{
            util.global.getLabel("checkStatus", row.status)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="{ row }">
            <div>
              <div style="margin-bottom: 10px;" class="row_button_item">
                <el-button
                  plain
                  type="primary"
                  href="#"
                  size="mini"
                  @click="
                    $router.push(
                      '/maintenance/worker/workerDetails?id=' + row.id
                    )
                  "
                  >详情</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  plain
                  @click="isLock(row)"
                  v-show="!row.isLock"
                  >锁定</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  plain
                  @click="isLock(row)"
                  v-show="row.isLock"
                  >解锁</el-button
                >
              </div>
              <div class="row_button_item">
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="open(row)"
                  v-if="!(row.status == 2)"
                  >审核</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="editInit(row)"
                  >编辑</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="checkTeam(row)"
                  >成员</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <div style="margin-top: 20px;display: flex;justify-content: center ;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </el-card>

    <model
      ref="editStatusModel"
      title="师傅审核"
      @ok="handleEditStatus"
      @close="resetEditForm"
    >
      <el-form
        :model="editForm"
        :rules="rules"
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
    </model>

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
        <el-form-item
          label="审核状态"
          prop="name"
          style="width:calc(100% - 120px)"
        >
          <el-switch v-model="editForm.status"></el-switch>
        </el-form-item>
      </el-form>
    </model>

    <model
      ref="masterTeamList"
      title="师傅团队列表"
      @ok="handleEnterpriseExamine"
      @close="resetEditForm"
      :column="2"
    >
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="masterTeamList"
        max-height="700"
        style="width: 1500px;"
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
          prop="serviceTypes"
          label="服务范围"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务区域"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
      </el-table>
    </model>

    <EditWorker
      ref="editWorker"
      :dialogVisible="dialogVisible"
      @closeFn="closeFn"
    ></EditWorker>
  </div>
</template>

<style lang="less" scoped>
.row_button_item {
  display: flex;
  justify-content: center;
}
</style>

<script>
import EditWorker from "./components/editWorker.vue";
import tableMixin from "@/mixin/table";
import { getMasterList } from "@/api/user.js";
import {
  handleMasterInfoExport,
  queryMasterMemberList,
  getMasterInfo,
  queryMasterName,
} from "@/api/order.js";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
      params: null,

      colonelName: null,
      dialogVisible: false,
      referrerName: null, //推荐人名字
      referrerOptions: [],

      masterTeamList: [],
      pageCount: 0,
      currentPage: 1,
      masterList: [],
      Name: "",
      Phone: "",
      loading: false,
      queryMethod: "get",
      typeData: [],
      systemData: [],
      courseList: [],
      courseDistriList: [],
      url: {
        query: "/admin/maintenance/queryMasterList",
        queryType: "/admin/maintenance/queryDeviceTypeList",
        queryAddress: "/admin/base/address",
        edit: "/admin/maintenance/editMasterInfo",
        lock: "/admin/maintenance/handleMasterLock",
        updateStatus: "/admin/maintenance/handleMasterExamine",
      },
      rules: {
        worker: [
          {
            required: true,
            message: "请输入接单人",
            trigger: "blur",
          },
        ],
        workerPhone: [
          {
            required: true,
            message: "请输入接单人手机",
            trigger: "blur",
          },
        ],
      },
      finishForm: {
        payAmount: 0,
      },
    };
  },
  components: {
    EditWorker: EditWorker,
  },
  created() {
    this._getMasterList();
  },
  methods: {
    // 重置按钮
    resetFn() {
      this.referrerName = null;
      this.colonelName = null;
      this.Name = null;
      this._getMasterList();
    },
    // 搜索推荐人/团长
    async remoteMethod(query) {
      const res = await queryMasterName(query);
      this.referrerOptions = res.data;
    },
    handleEnterpriseExamine() {},

    // 导出师傅
    async _handleMasterInfoExport() {
      const data = this.params;
      data.pageSize = 1000;
      handleMasterInfoExport(data).then((res) => {
        if (res) {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.download = "师傅列表"; //下载的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },

    // 点击查看成员触发的事件
    async checkTeam(row) {
      await this._queryMasterMemberList(row);
      this.$refs.masterTeamList.open();
    },
    _queryMasterMemberList(row) {
      let data = {
        uid: row.uid,
        pageNo: 1,
        pageSize: 10,
      };
      queryMasterMemberList(data).then((res) => {
        if (res) {
          this.masterTeamList = res.data.records;
        }
      });
    },

    // 切换页码触发的事件
    handleCurrentChange(page) {
      this.currentPage = page;
      this._getMasterList();
    },
    // 查询师傅列表
    async _getMasterList() {
      this.params = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      // 将团长推荐人名字 转化成 uid
      if (this.referrerName) {
        const res = await queryMasterName(this.referrerName);
        this.params.recommendMasterUid = res.data[0] && res.data[0].uid;
      }
      if (this.colonelName) {
        const res = await queryMasterName(this.colonelName);
        this.params.superiorMasterUid = res.data[0] && res.data[0].uid;
      }
      const res = await getMasterList(this.params);
      if (res.message === "操作成功") {
        this.masterList = res.data.records;
        this.pageCount = res.data.total;
        this.currentPage = res.data.current;
      }
    },
    querySelectData() {
      this.loading = true;
      this.$axios
        .post(this.url.queryType)
        .then(({ data }) => {
          this.typeData = data;
        })
        .catch(function(error) {
          console.info(error);
        });
      this.loading = false;
    },
    isLock(row) {
      this.$axios
        .post(this.url.lock, {
          id: row.id,
          lock: Number(!row.isLock),
        })
        .then(async ({ code, message }) => {
          await this.util.message(this, code, message);
          this._getMasterList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    open(row) {
      this.$refs.editStatusModel.open();
      this.editForm = {
        id: row.id,
        status: false,
      };
    },
    handleEditStatus(fn) {
      this.$axios
        .post(this.url.updateStatus, {
          ...this.editForm,
          status: this.editForm.status ? 2 : 3,
        })
        .then((data) => {
          this.util.message(this, data.status, data.message);
          // this.query();
          this._getMasterList();
          this.resetEditForm(false);
        })
        .catch(function(error) {
          console.info(error);
        });

      this.$refs.editStatusModel.close();
    },
    // 关闭编辑弹窗事件
    closeFn() {
      this._getMasterList();
      this.dialogVisible = false;
    },
    // 点击编辑触发的事件
    async editInit(row) {
      const loading = this.$loading();
      const res = await getMasterInfo(row.id);
      this.$refs.editWorker.dialogForm = res.data;
      this.$refs.editWorker.servePosition = [res.data.servePosition];

      // 对图片单独处理
      await this.$refs.editWorker.avatarFileList.push({
        url: res.data.realPortrait,
      });
      await this.$refs.editWorker.idJustFileList.push({
        url: res.data.identityFrontImage,
      });
      await this.$refs.editWorker.idBackFileList.push({
        url: res.data.identityBackImage,
      });
      loading.close();
      // 弹窗显示
      this.dialogVisible = true;
      return;

      // this.editForm.serviceAreas = this.editForm.serviceAreas
      //   ? this.editForm.serviceAreas.split(",")
      //   : [];
      // this.editForm.serviceTypes = this.editForm.serviceTypes
      //   ? this.editForm.serviceTypes.split(",").map(item => {
      //       return Number(item);
      //     })
      //   : [];
      // delete this.editForm.createTime;
      this.$nextTick(() => {
        this.$refs.realPortrait.reset([]);
        this.$refs.industryExperienceImages.reset([]);
        this.$refs.skillCertificateImages.reset([]);
        this.$refs.identityFrontImage.reset([]);
        this.$refs.identityBackImage.reset([]);
        this.$refs.realPortrait.reset(
          row.realPortrait.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.industryExperienceImages.reset(
          row.industryExperienceImages.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.skillCertificateImages.reset(
          row.skillCertificateImages.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.identityFrontImage.reset(
          row.identityFrontImage.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
        this.$refs.identityBackImage.reset(
          row.identityBackImage.split(",").map((item) => {
            return {
              url: item,
            };
          })
        );
      });
    },
    async handleEdit(fn) {
      this.edit(fn, {
        serviceAreas: this.editForm.serviceAreas.join(","),
        serviceTypes: this.editForm.serviceTypes.join(","),
        realPortrait: (await this.$refs.realPortrait.uploadFile()).join(","),
        industryExperienceImages: (
          await this.$refs.industryExperienceImages.uploadFile()
        ).join(","),
        skillCertificateImages: (
          await this.$refs.skillCertificateImages.uploadFile()
        ).join(","),
        identityFrontImage: (
          await this.$refs.identityFrontImage.uploadFile()
        ).join(","),
        identityBackImage: (
          await this.$refs.identityBackImage.uploadFile()
        ).join(","),
      });
    },
    resetEditForm(fn) {
      this.masterTeamList = null;
      fn(false);
      this.query();
    },
  },
};
</script>
