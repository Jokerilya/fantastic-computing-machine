<template>
  <div class="workerDetails">
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
            <span>服务信息:</span>{{ workerDetailList.serviceTypesName }}
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
      <!-- <div class="approvalInfo">审批信息</div> -->
    </el-card>
  </div>
</template>

<script>
import { getMasterInfo } from "@/api/order";

export default {
  data() {
    return {
      workerDetailList: null,
      industryExperienceImages: [],
      skillCertificateImages: [],
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
