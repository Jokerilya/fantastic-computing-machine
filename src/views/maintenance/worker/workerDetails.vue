<template>
  <div class="workerDetails">
    <el-tabs v-model="activeName">
      <el-tab-pane label="师傅信息">
        <el-card v-if="workerDetailList">
          <div class="workerInfo">
            <div class="title">师傅信息</div>
            <div class="content">
              <div class="item">
                <span>姓名:</span>{{ workerDetailList.realName }}
              </div>
              <div class="item" v-if="workerDetailList.identityNumber">
                <span>证件号:</span>{{ workerDetailList.identityNumber }}
              </div>
              <div class="item">
                <span>身份证:</span>
                <el-image
                  :src="workerDetailList.identityFrontImage"
                  :preview-src-list="[workerDetailList.identityFrontImage]"
                >
                </el-image>
                <el-image
                  :src="workerDetailList.identityBackImage"
                  :preview-src-list="[workerDetailList.identityBackImage]"
                >
                </el-image>
              </div>
              <div class="item">
                <span>真实照片:</span>
                <el-image
                  :src="workerDetailList.realPortrait"
                  :preview-src-list="[workerDetailList.realPortrait]"
                >
                </el-image>
              </div>
            </div>
            <div class="content">
              <div class="item" style="line-height: 25px;">
                <span>服务类型:</span>{{ workerDetailList.serviceTypesName }}
              </div>
              <div class="item">
                <span>服务区域:</span>{{ workerDetailList.serviceAreasName }}
              </div>
              <div class="item">
                <span>联系地址:</span>{{ workerDetailList.address }}
              </div>
              <div class="item">
                <span>审核状态:</span
                >{{ workerDetailList.status === 1 ? "审核中" : "审核通过" }}
              </div>
            </div>
          </div>
          <div class="maintenanceMargin">
            <div class="title">维修范围</div>
            <div class="content">
              <div class="item">
                <span>服务部位</span>
                {{ workerDetailList.servePosition }}
              </div>
              <div class="item">
                <span>服务系统</span>
                {{ workerDetailList.serveSystemName }}
              </div>
            </div>
          </div>
          <div class="industryExperience">
            <div class="title">行业经验</div>
            <div class="content">
              <div class="item">{{ workerDetailList.industryExperience }}</div>
              <div class="item">
                <el-image
                  v-for="item in industryExperienceImages"
                  :key="item"
                  :src="item"
                  :preview-src-list="industryExperienceImages"
                >
                </el-image>
              </div>
            </div>
          </div>
          <div
            class="certificateSkill"
            v-if="workerDetailList.skillCertificateImages"
          >
            <div class="title">技能证书</div>
            <div class="content">
              <div class="item">
                <el-image
                  v-for="item in skillCertificateImages"
                  :key="item"
                  :src="item"
                  :preview-src-list="skillCertificateImages"
                >
                </el-image>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="师傅考核">
        <el-card>
          <!-- <div class="title" style="margin-bottom: 20px;">
            <el-select placeholder="请选择">
              <el-option
                v-for="item in yearList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div> -->
          <el-table style="width: 100%" :data="assessmentData">
            <el-table-column label="时间" prop="assessmentDate" align="center">
            </el-table-column>
            <el-table-column label="拒单次数" align="center">
              <template slot-scope="{ row }">
                {{ row.rejectionNum }}次
              </template>
            </el-table-column>
            <el-table-column label="好评次数" align="center">
              <template slot-scope="{ row }">
                {{ row.positiveNum }}次
              </template>
            </el-table-column>
            <el-table-column label="接单次数" align="center">
              <template slot-scope="{ row }"
                >{{ row.receiveNum ? row.receiveNum : 0 }}次
              </template>
            </el-table-column>
            <el-table-column label="准点到达率" align="center">
              <template slot-scope="{ row }">
                <div @click="openPunchInRecord(row)" style="color: #409eff;">
                  {{ Math.round(row.arriveRatio * 100) }}%
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="打卡记录"
      :visible="punchInRecordShow"
      width="70%"
      align="center"
      :before-close="closePunchInRecord"
    >
      <el-table :data="punchInRecordList">
        <el-table-column
          label="订单编号"
          align="center"
          prop="relationOrderSn"
        ></el-table-column>
        <el-table-column
          label="企业名称"
          align="center"
          prop="enterpriseName"
        ></el-table-column>
        <el-table-column
          label="预期服务时间"
          align="center"
          prop="serviceTime"
        ></el-table-column>
        <el-table-column
          label="实际到达时间"
          align="center"
          prop="punchTime"
        ></el-table-column>
        <el-table-column label="打卡照片" align="center">
          <template slot-scope="{ row }">
            <el-image
              style="width: 100px;height: 100px;"
              :src="row.punchImages"
              :preview-src-list="[row.punchImages]"
            ></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否合格" align="center">
          <template slot-scope="{ row }">
            <div :style="{ color: row.punchStatus === 0 ? 'red' : 'green' }">
              {{ row.punchStatus === 0 ? "不合格" : "合格" }}
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getMasterInfo, queryPunchList } from "@/api/order";
import { color } from "echarts/lib/export";

export default {
  data() {
    return {
      punchInRecordList: [],
      assessmentData: [],
      activeName: "",
      workerDetailList: null,
      industryExperienceImages: [],
      skillCertificateImages: [],
      punchInRecordShow: false,
    };
  },
  async created() {
    const res = await getMasterInfo(this.$route.query.id);
    this.workerDetailList = res.data;
    // 修改格式 后台的行业经验和技能证书
    if (this.workerDetailList.industryExperienceImages) {
      let arr = this.workerDetailList.industryExperienceImages.split(",");
      if (arr.length !== 1) {
        arr.pop();
      }
      this.industryExperienceImages = arr;
    }
    if (this.workerDetailList.skillCertificateImages) {
      let arr = this.workerDetailList.skillCertificateImages.split(",");
      if (arr.length !== 1) {
        arr.pop();
      }
      this.skillCertificateImages = arr;
    }
    console.log(199, res.data.list);
    this.assessmentData = res.data.list;
  },
  methods: {
    // 打开打卡记录
    async openPunchInRecord(row) {
      const data = {
        uid: row.uid,
        date: row.assessmentDate,
      };
      const res = await queryPunchList(data);
      this.punchInRecordList = res.data;
      console.log(228, this.punchInRecordList);
      this.punchInRecordShow = true;
    },
    // 关闭打卡记录
    closePunchInRecord() {
      this.punchInRecordShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.workerDetails {
  padding: 20px;
  .el-card {
    padding: 20px 100px;
    // 师傅信息
    .workerInfo {
      display: flex;
      margin-bottom: 20px;
      .title {
        flex: 2;
        color: #707070;
        font-size: 20px;
        font-weight: 700;
      }
      .content {
        flex: 6;
        .item {
          padding: 10px 0;
          color: #0b2059;
          font-size: 16px;
          span {
            display: inline-block;
            color: #707070;
            width: 90px;
          }
          .el-image {
            margin-right: 10px;
            width: 100px;
            height: 100px;
            vertical-align: text-top;
          }
        }
      }
    }

    // 维修范围  // 行业经验  // 技能证书
    .maintenanceMargin,
    .industryExperience,
    .certificateSkill {
      margin-bottom: 20px;
      display: flex;
      .title {
        flex: 2;
        color: #707070;
        font-size: 20px;
        font-weight: 700;
      }
      .content {
        flex: 12;
        .item {
          line-height: 25px;
          padding: 10px 0;
          color: #0b2059;
          font-size: 16px;
          span {
            display: inline-block;
            color: #707070;
            width: 90px;
          }
          .el-image {
            margin-right: 10px;
            width: 100px;
            height: 100px;
            vertical-align: text-top;
          }
        }
      }
    }
  }
}
</style>
