<!--编程订单-->
<template>
  <div class="app-container">
    <el-form label-width="88px" class="rule-form" label-position="right">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item label="师傅名称">
            <el-input placeholder="请输入师傅名称" v-model="Name"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
          <el-form-item label="联系电话">
            <el-input placeholder="请输入联系电话" v-model="Phone"></el-input>
          </el-form-item>
        </el-col>-->
        <el-col :span="5">
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
            >导出</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <el-table
      highlight-current-row
      v-loading.fullscreen.isLock="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="masterList"
      style="width: 100%;"
      max-height="700"
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
              row.identityFrontImage ? row.identityFrontImage.split(',')[0] : ''
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
        width="150"
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
        width="150"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">{{
          util.global.getLabel("checkStatus", row.status)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="{ row }">
          <div class="settings">
            <el-button
              type="warning"
              size="mini"
              plain
              @click="open(row)"
              :disabled="row.status == 2"
              >审核</el-button
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
            <el-button type="warning" size="mini" plain @click="editInit(row)"
              >编辑</el-button
            >
            <el-button type="warning" size="mini" plain @click="checkTeam(row)"
              >查看成员</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageCount"
    ></el-pagination>
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
      :column="2"
      ref="editModel"
      title="编辑师傅信息"
      @ok="handleEdit"
      @close="resetEditForm"
    >
      <el-form
        label-position="left"
        :model="editForm"
        :rules="rules"
        ref="editForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="真实姓名"
              prop="realName"
              style="width:calc(100% - 120px)"
            >
              <el-input
                v-model="editForm.realName"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="身份证号"
              prop="identityNumber"
              style="width:calc(100% - 120px)"
            >
              <el-input
                v-model="editForm.identityNumber"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="服务地区"
              prop="serviceAreas"
              style="width:calc(100% - 120px)"
            >
              <el-cascader
                v-model="editForm.serviceAreas"
                :props="props"
                :show-all-levels="false"
                placeholder="请选择"
                :multiple-limit="5"
                style="width:100%"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="服务类型"
              prop="serviceTypes"
              style="width:calc(100% - 120px)"
            >
              <el-select
                multiple
                v-model="editForm.serviceTypes"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in typeData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="详细地址"
              prop="address"
              style="width:calc(100% - 120px)"
            >
              <el-input
                v-model="editForm.address"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="行业经验"
              prop="industryExperience"
              style="width:calc(100% - 120px)"
            >
              <el-input
                v-model="editForm.industryExperience"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序"
              prop="sort"
              style="width:calc(100% - 120px)"
            >
              <el-input
                v-model.number="editForm.sort"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="真实头像"
              prop="realPortrait"
              style="width:calc(100% - 120px)"
            >
              <upload
                ref="realPortrait"
                type="image/*"
                limit="1"
                :size="1024 ** 2 * 50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="行业经验照片"
              prop="industryExperienceImages"
              style="width:calc(100% - 120px)"
            >
              <upload
                ref="industryExperienceImages"
                type="image/*"
                limit="9"
                :size="1024 ** 2 * 50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="技能证书图书"
              prop="skillCertificateImages"
              style="width:calc(100% - 120px)"
            >
              <upload
                ref="skillCertificateImages"
                type="image/*"
                limit="9"
                :size="1024 ** 2 * 50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="身份证正面照"
              prop="identityFrontImage"
              style="width:calc(100% - 120px)"
            >
              <upload
                ref="identityFrontImage"
                type="image/*"
                limit="1"
                :size="1024 ** 2 * 50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="身份证反面照"
              prop="identityBackImage"
              style="width:calc(100% - 120px)"
            >
              <upload
                ref="identityBackImage"
                type="image/*"
                limit="1"
                :size="1024 ** 2 * 50"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
          prop="serviceTypes"
          label="服务范围"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceAreas"
          label="服务区域"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
      </el-table>
    </model>
  </div>
</template>

<style lang="less" scoped></style>

<script>
import tableMixin from "@/mixin/table";
import { getMasterList } from "@/api/user.js";
import { handleMasterInfoExport, queryMasterMemberList } from "@/api/order.js";
export default {
  title: "course",
  mixins: [tableMixin],
  data() {
    return {
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
      props: {
        value: "id",
        label: "name",
        multiple: true,
        lazy: true,
        emitPath: false,
        lazyLoad: async (node, resolve) => {
          let pid = 0;
          // let disabled = true
          if (node.level != 0) {
            pid = node.data.id;
            // disabled = false
          }
          if (node.level > 1) {
            console.info(node.level);
            resolve([]);
            return;
          }
          let res = await this.$axios.get(
            this.url.queryAddress + "?pid=" + pid
          );
          if (res.code == "000")
            resolve(
              res.data.map((item) => {
                return {
                  ...item,
                  // disabled:disabled
                };
              })
            );
          else resolve([]);
        },
      },
    };
  },
  created() {
    this._getMasterList();
  },
  methods: {
    _handleMasterInfoExport() {
      let data = {
        identityNumber: "",
        pageNo: 1,
        pageSize: 20,
        orderSn: "",
        realName: "",
      };
      handleMasterInfoExport(data).then((res) => {
        if (res) {
          console.log("导出", res);
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
    checkTeam(row) {
      this.$refs.masterTeamList.open();
      this._queryMasterMemberList(row);
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
          console.log("师傅团队列表", this.masterTeamList);
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._getMasterList();
    },
    _getMasterList() {
      let params = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
        phone: this.Phone,
      };
      getMasterList(params).then((res) => {
        if (res) {
          console.log(res);
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
        console.log("名称", Name);
        console.log("手机", Phone);
      });
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
        .then(({ code, message }) => {
          this.util.message(this, code, message);
          this.query();
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
    editInit(row) {
      this.editForm = row;
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
      this.$refs.editModel.open();
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
      fn(false);
      this.query();
    },
  },
};
</script>
