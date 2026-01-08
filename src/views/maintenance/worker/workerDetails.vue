<template>
  <div class="workerDetails" v-loading="loading">
    <el-tabs v-model="activeName" type="border-card" class="detail-tabs">
      <el-tab-pane label="师傅信息" name="info">
        <div v-if="workerDetailList" class="info-container">
          <section class="detail-section">
            <div class="section-title">
              <i class="el-icon-user-solid"></i> 基础信息
            </div>
            <div class="section-content">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="label">姓名:</span>
                    <span class="value">{{ workerDetailList.realName }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="label">证件号:</span>
                    <span class="value">{{
                      workerDetailList.identityNumber || "-"
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="label">审核状态:</span>
                    <el-tag
                      size="small"
                      :type="
                        workerDetailList.status === 1 ? 'warning' : 'success'
                      "
                      effect="dark"
                    >
                      {{
                        workerDetailList.status === 1 ? "审核中" : "审核通过"
                      }}
                    </el-tag>
                  </div>
                </el-col>
              </el-row>

              <div class="info-item image-row">
                <span class="label">证件照片:</span>
                <div class="image-list">
                  <div
                    class="img-wrapper"
                    v-if="workerDetailList.identityFrontImage"
                  >
                    <span class="sub-label">正面</span>
                    <el-image
                      class="auth-img"
                      :src="workerDetailList.identityFrontImage"
                      :preview-src-list="[
                        workerDetailList.identityFrontImage,
                        workerDetailList.identityBackImage,
                      ]"
                      fit="cover"
                    ></el-image>
                  </div>
                  <div
                    class="img-wrapper"
                    v-if="workerDetailList.identityBackImage"
                  >
                    <span class="sub-label">反面</span>
                    <el-image
                      class="auth-img"
                      :src="workerDetailList.identityBackImage"
                      :preview-src-list="[
                        workerDetailList.identityFrontImage,
                        workerDetailList.identityBackImage,
                      ]"
                      fit="cover"
                    ></el-image>
                  </div>
                </div>
              </div>

              <div class="info-item image-row">
                <span class="label">真实头像:</span>
                <el-image
                  class="avatar-img"
                  v-if="workerDetailList.realPortrait"
                  :src="workerDetailList.realPortrait"
                  :preview-src-list="[workerDetailList.realPortrait]"
                  fit="cover"
                ></el-image>
              </div>
            </div>
          </section>

          <el-divider></el-divider>

          <section class="detail-section">
            <div class="section-title">
              <i class="el-icon-s-shop"></i> 服务信息
            </div>
            <div class="section-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-item">
                    <span class="label">服务类型:</span>
                    <span class="value">{{
                      workerDetailList.serviceTypesName
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="info-item">
                    <span class="label">联系地址:</span>
                    <span class="value">{{ workerDetailList.address }}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="info-item">
                    <span class="label">服务区域:</span>
                    <span class="value" style="line-height: 1.5">{{
                      workerDetailList.serviceAreasName
                    }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </section>

          <el-divider></el-divider>

          <section class="detail-section">
            <div class="section-title">
              <i class="el-icon-s-tools"></i> 维修范围
            </div>
            <div class="section-content">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="info-item">
                    <span class="label">服务部位:</span>
                    <span class="value">{{
                      workerDetailList.servePosition
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="info-item">
                    <span class="label">服务系统:</span>
                    <span class="value">{{
                      workerDetailList.serveSystemName
                    }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </section>

          <el-divider></el-divider>

          <section class="detail-section">
            <div class="section-title">
              <i class="el-icon-s-claim"></i> 经验证书
            </div>
            <div class="section-content">
              <div class="info-item">
                <span class="label">行业经验:</span>
                <p class="value description-text">
                  {{ workerDetailList.industryExperience || "暂无描述" }}
                </p>
              </div>

              <div
                class="info-item image-row"
                v-if="industryExperienceImages.length"
              >
                <span class="label">经验展示:</span>
                <div class="image-group">
                  <el-image
                    v-for="(item, index) in industryExperienceImages"
                    :key="'exp_' + index"
                    :src="item"
                    :preview-src-list="industryExperienceImages"
                    class="evidence-img"
                    fit="cover"
                  ></el-image>
                </div>
              </div>

              <div
                class="info-item image-row"
                v-if="skillCertificateImages.length"
              >
                <span class="label">技能证书:</span>
                <div class="image-group">
                  <el-image
                    v-for="(item, index) in skillCertificateImages"
                    :key="'skill_' + index"
                    :src="item"
                    :preview-src-list="skillCertificateImages"
                    class="evidence-img"
                    fit="cover"
                  ></el-image>
                </div>
              </div>
            </div>
          </section>
        </div>
        <el-empty v-else description="暂无师傅数据"></el-empty>
      </el-tab-pane>

      <el-tab-pane label="师傅考核" name="assessment">
        <el-table
          :data="assessmentData"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        >
          <el-table-column
            label="考核周期"
            prop="assessmentDate"
            align="center"
          ></el-table-column>

          <el-table-column label="接单概况" align="center">
            <el-table-column label="接单数" align="center">
              <template slot-scope="{ row }"
                >{{ row.receiveNum || 0 }} 次</template
              >
            </el-table-column>
            <el-table-column label="拒单数" align="center">
              <template slot-scope="{ row }">
                <span :class="{ 'text-danger': row.rejectionNum > 0 }"
                  >{{ row.rejectionNum || 0 }} 次</span
                >
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column label="好评次数" align="center">
            <template slot-scope="{ row }">
              <span class="text-success">{{ row.positiveNum || 0 }} 次</span>
            </template>
          </el-table-column>

          <el-table-column label="准点到达率" align="center">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                :underline="false"
                @click="openPunchInRecord(row)"
                class="rate-link"
              >
                <el-progress
                  type="dashboard"
                  :percentage="Math.round(row.arriveRatio * 100)"
                  :width="50"
                  :color="colors"
                ></el-progress>
                <div class="rate-text">点击查看</div>
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="打卡记录详情"
      :visible.sync="punchInRecordShow"
      width="800px"
      append-to-body
    >
      <el-table
        :data="punchInRecordList"
        border
        stripe
        v-loading="dialogLoading"
      >
        <el-table-column
          label="订单编号"
          align="center"
          prop="relationOrderSn"
          width="180"
        ></el-table-column>
        <el-table-column
          label="企业名称"
          align="center"
          prop="enterpriseName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="预期服务时间"
          align="center"
          prop="serviceTime"
          width="160"
        ></el-table-column>
        <el-table-column
          label="实际打卡时间"
          align="center"
          prop="punchTime"
          width="160"
        >
          <template slot-scope="{ row }">
            <span :style="{ color: isLate(row) ? 'red' : 'green' }">{{
              row.punchTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现场照片" align="center" width="120">
          <template slot-scope="{ row }">
            <el-image
              v-if="row.punchImages"
              style="width: 60px; height: 60px; border-radius: 4px"
              :src="row.punchImages.split(',')[0]"
              :preview-src-list="row.punchImages.split(',')"
              fit="cover"
            ></el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="punchInRecordShow = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMasterInfo, queryPunchList } from "@/api/order";

export default {
  name: "WorkerDetails",
  data() {
    return {
      loading: false,
      dialogLoading: false,
      activeName: "info",
      punchInRecordShow: false,

      workerDetailList: null,
      assessmentData: [],
      punchInRecordList: [],

      industryExperienceImages: [],
      skillCertificateImages: [],

      // 进度条颜色配置
      colors: [
        { color: "#f56c6c", percentage: 60 },
        { color: "#e6a23c", percentage: 80 },
        { color: "#5cb87a", percentage: 100 },
      ],
    };
  },

  async created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const id = this.$route.query.id;
        if (!id) return;

        const res = await getMasterInfo(id);
        if (res.code === "000" || res.code === 200) {
          // 兼容常见code
          this.workerDetailList = res.data;
          this.assessmentData = res.data.list || [];

          // 处理图片字符串
          this.industryExperienceImages = this.parseImages(
            res.data.industryExperienceImages
          );
          this.skillCertificateImages = this.parseImages(
            res.data.skillCertificateImages
          );
        }
      } catch (error) {
        console.error("获取师傅详情失败", error);
        this.$message.error("获取数据失败");
      } finally {
        this.loading = false;
      }
    },

    // 统一处理图片字符串工具函数
    parseImages(imgStr) {
      if (!imgStr) return [];
      // 分割后过滤掉空字符串（防止末尾逗号导致空项）
      return imgStr.split(",").filter((item) => item && item.trim() !== "");
    },

    // 打开打卡记录
    async openPunchInRecord(row) {
      this.punchInRecordShow = true;
      this.dialogLoading = true;
      this.punchInRecordList = []; // 清空旧数据

      try {
        const data = {
          uid: row.uid,
          date: row.assessmentDate,
        };
        const res = await queryPunchList(data);
        this.punchInRecordList = res.data;
      } catch (error) {
        this.$message.error("获取打卡记录失败");
      } finally {
        this.dialogLoading = false;
      }
    },

    // 简单的判断是否迟到逻辑（仅作展示示例，具体依赖业务逻辑）
    isLate(row) {
      if (!row.serviceTime || !row.punchTime) return false;
      return new Date(row.punchTime) > new Date(row.serviceTime);
    },
  },
};
</script>

<style lang="scss" scoped>
.workerDetails {
  padding: 20px;
  min-height: calc(100vh - 84px);
  background-color: #f0f2f5;

  .detail-tabs {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    background: #fff;
    min-height: 600px;
  }

  // 信息部分通用样式
  .info-container {
    padding: 10px 20px;

    .detail-section {
      margin-bottom: 10px;

      .section-title {
        color: #303133;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
        display: flex;
        align-items: center;

        i {
          margin-right: 8px;
          color: #409eff;
          font-size: 18px;
        }
      }

      .section-content {
        padding-left: 26px; // 与标题图标对齐

        .info-item {
          display: flex;
          margin-bottom: 18px;
          line-height: 1.5;
          font-size: 14px;

          .label {
            color: #909399;
            width: 80px;
            flex-shrink: 0;
            font-weight: 500;
          }

          .value {
            color: #303133;
            flex: 1;
            word-break: break-all;
          }

          .description-text {
            margin: 0;
            white-space: pre-wrap; // 保留换行
          }
        }

        // 图片行特殊处理
        .image-row {
          flex-direction: column; // 图片换行显示更好看

          .label {
            margin-bottom: 10px;
            width: 100%;
          }

          .image-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
        }
      }
    }
  }

  // 图片通用样式
  .auth-img {
    width: 140px;
    height: 90px;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
  }

  .avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }

  .evidence-img {
    width: 120px;
    height: 120px;
    border-radius: 4px;
    border: 1px solid #e4e7ed;
    cursor: zoom-in;
  }

  .image-list {
    display: flex;
    gap: 20px;

    .img-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;

      .sub-label {
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
      }
    }
  }

  // 表格部分
  .text-danger {
    color: #f56c6c;
    font-weight: bold;
  }

  .text-success {
    color: #67c23a;
  }

  .rate-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .rate-text {
      font-size: 12px;
      margin-top: 5px;
    }

    ::v-deep .el-progress__text {
      font-size: 12px !important;
    }
  }
}
</style>