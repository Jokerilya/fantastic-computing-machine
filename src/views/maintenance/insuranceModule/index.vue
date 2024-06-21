<template>
  <div class="insuranceManage">
    <!-- 顶部 -->
    <div class="topControls">
      <div class="topControlsSearchInfo">
        <div class="topControlsSearchInfoItem">
          <div class="label">师傅姓名</div>
          <div>
            <el-input
              v-model="queryMasterInsuranceListParams.realName"
              placeholder="请输入师傅姓名"
            ></el-input>
          </div>
        </div>
        <div class="topControlsSearchInfoItem">
          <div class="label">投保时间</div>
          <div>
            <el-date-picker
              v-model="queryMasterInsuranceListParams.queryTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="topControlsBtn">
        <el-button type="primary" plain @click="searchMasterInsuranceList"
          >搜索</el-button
        >
        <el-button type="primary" plain @click="resetMasterInsuranceList"
          >重置</el-button
        >
        <el-button
          type="primary"
          plain
          @click="openAddEditInsuranceInfoDialog('add')"
          >新增</el-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-card style="padding: 20px">
      <el-table :data="masterInsuranceList" style="width: 100%">
        <el-table-column label="保险凭证" align="center">
          <template slot-scope="{ row }">
            <el-image
              style="width: 100px; height: 100px"
              :src="convertTabelImages(row.images)[0]"
              :preview-src-list="convertTabelImages(row.images)"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="orderSn" label="保单号" align="center">
        </el-table-column>
        <el-table-column prop="realName" label="师傅姓名" align="center">
        </el-table-column>
        <el-table-column prop="identityNumber" label="身份证号" align="center">
        </el-table-column>
        <el-table-column
          prop="insuranceCompany"
          label="保险公司"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="insurancePhone" label="保险电话" align="center">
        </el-table-column>
        <el-table-column prop="premiumQuota" label="保额" align="center">
        </el-table-column>
        <el-table-column prop="premiumAmount" label="保费金额" align="center">
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <div
              :style="{
                color:
                  row.status == 1 ? '#000' : row.status == 2 ? 'green' : 'red',
              }"
            >
              {{
                row.status == 1
                  ? "待校验"
                  : row.status == 2
                  ? "生效中"
                  : "已过保"
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="openAddEditInsuranceInfoDialog('edit', row)"
              >修改</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="tabelPagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="masterInsuranceListTotal"
          :page-size="10"
          :current-page="queryMasterInsuranceListParams.pageNo"
          @current-change="changemasterInsuranceListPage"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新增编辑框 -->
    <el-dialog
      center
      :title="addEditInsuranceInfoDialogTitle"
      :visible="addEditInsuranceInfoVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="40%"
    >
      <el-form
        :rules="insuranceInfoRules"
        ref="insuranceInfoForm"
        :model="insuranceInfo"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="保单号" prop="orderSn">
          <el-input
            v-model="insuranceInfo.orderSn"
            placeholder="请输入保单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="投保人" prop="realName">
          <el-input
            v-model="insuranceInfo.realName"
            placeholder="请输入投保人"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="identityNumber">
          <el-input
            v-model="insuranceInfo.identityNumber"
            placeholder="请输入身份证"
          ></el-input>
        </el-form-item>
        <el-form-item label="保险公司" prop="insuranceCompany">
          <el-input
            v-model="insuranceInfo.insuranceCompany"
            placeholder="请输入保险公司"
          ></el-input>
        </el-form-item>
        <el-form-item label="保险公司电话" prop="insurancePhone">
          <el-input
            v-model.number="insuranceInfo.insurancePhone"
            placeholder="请输入保险公司电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="保额" prop="premiumQuota">
          <el-input
            @mousewheel.native.prevent
            type="number"
            v-model.number="insuranceInfo.premiumQuota"
            placeholder="请输入保额"
          ></el-input>
        </el-form-item>
        <el-form-item label="保费金额" prop="premiumAmount">
          <el-input
            @mousewheel.native.prevent
            type="number"
            v-model.number="insuranceInfo.premiumAmount"
            placeholder="请输入保费金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="insuranceInfo.startTime"
            type="date"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="insuranceInfo.endTime"
            type="date"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="insuranceInfo.status" @input="changeStatus">
            <el-radio :label="1">待校验</el-radio>
            <el-radio :label="2">生效中</el-radio>
            <el-radio :label="3">已过保</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="保险凭证" prop="images">
          <el-upload
            action="#"
            list-type="picture-card"
            :limit="3"
            :file-list="imageFileList"
            :http-request="upLoadInsuranceImg"
            :on-remove="removeInsuranceImg"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEditInsuranceInfoDialog">取 消</el-button>
        <el-button type="primary" @click="confirmInsuranceInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryMasterInsuranceList, editMasterInsurance } from "@/api/order";
import { UploadImg } from "@/api/system.js";
export default {
  data() {
    return {
      queryMasterInsuranceListParams: {
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
        realName: null,
      },
      masterInsuranceList: [],
      masterInsuranceListTotal: null,

      addEditInsuranceInfoVisible: false,
      addEditInsuranceInfoDialogTitle: "新增保险",

      insuranceInfo: {
        realName: null,
        identityNumber: null,
        insuranceCompany: null,
        insurancePhone: null,
        premiumQuota: null,
        premiumAmount: null,
        startTime: null,
        endTime: null,
        status: null,
        orderSn: null,
        images: null,
      },
      imageFileList: [],

      insuranceInfoRules: {
        realName: [
          { required: true, message: "请填写投保人", trigger: "blur" },
        ],
        identityNumber: [
          {
            required: true,
            message: "请填写投保人身份证号码",
            trigger: "blur",
          },
        ],
        insuranceCompany: [
          {
            required: true,
            message: "请填写保险公司",
            trigger: "blur",
          },
        ],
        insurancePhone: [
          {
            required: true,
            message: "请填写保险公司电话",
            trigger: "blur",
          },
        ],
        premiumQuota: [
          {
            required: true,
            message: "请填写保额",
            trigger: "blur",
          },
        ],
        premiumAmount: [
          {
            required: true,
            message: "请填写保费金额",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择保险状态",
            trigger: "blur",
          },
        ],
        orderSn: [
          {
            required: true,
            message: "请填写保单号",
            trigger: "blur",
          },
        ],
        images: [
          {
            required: true,
            message: "请上传保险凭证",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 转换保险凭证表格展示
    convertTabelImages(str) {
      return str.split(",");
    },
    // 搜索保险列表
    searchMasterInsuranceList() {
      this.queryMasterInsuranceListParams.pageNo = 1;
      this.queryMasterInsuranceList();
    },
    // 重置保险列表
    resetMasterInsuranceList() {
      this.queryMasterInsuranceListParams = {
        pageNo: 1,
        pageSize: 10,
        queryTime: null,
        realName: null,
      };
      this.queryMasterInsuranceList();
    },
    // 修改保险页码
    changemasterInsuranceListPage(pageNo) {
      this.queryMasterInsuranceListParams.pageNo = pageNo;
      this.queryMasterInsuranceList();
    },
    // 修改保险状态校验表单
    changeStatus() {
      this.$refs["insuranceInfoForm"].validateField("status");
    },
    // 确定保险信息
    async confirmInsuranceInfo() {
      await this.$refs["insuranceInfoForm"].validate();
      const res = await editMasterInsurance(this.insuranceInfo);
      if (res.message == "操作成功") {
        this.queryMasterInsuranceList();
        this.closeAddEditInsuranceInfoDialog();
      }
    },
    // 关闭新增修改保险信息框
    closeAddEditInsuranceInfoDialog() {
      this.insuranceInfo = {
        realName: null,
        identityNumber: null,
        insuranceCompany: null,
        insurancePhone: null,
        premiumQuota: null,
        premiumAmount: null,
        startTime: null,
        endTime: null,
        status: null,
        orderSn: null,
        images: null,
      };
      this.imageFileList = [];
      this.$refs["insuranceInfoForm"].resetFields();
      this.addEditInsuranceInfoVisible = false;
    },
    // 将保险凭证字符串转化成数组
    jsonConverArr() {
      const arr = [];
      this.insuranceInfo.images.split(",").forEach((item) => {
        arr.push({
          url: item,
        });
      });
      this.imageFileList = arr;
    },
    // 将保险凭证数组转化成字符串
    arrConvertJson() {
      const arr = [];
      this.imageFileList.forEach((item) => {
        arr.push(item.url);
      });
      this.insuranceInfo.images = arr.join(",");
    },
    // 删除保险凭证
    removeInsuranceImg(data) {
      const index = this.imageFileList
        .map((item) => item.url)
        .indexOf(data.url);
      this.imageFileList.splice(index, 1);
      this.arrConvertJson();
    },
    // 上传保险凭证
    async upLoadInsuranceImg(data) {
      const loading = this.$loading({ text: "上传中.." });
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      if (res.data) {
        this.imageFileList.push({
          url: res.data,
        });
        this.arrConvertJson();
      }
      loading.close();
    },
    // 打开新增修改保险信息框
    openAddEditInsuranceInfoDialog(type, data) {
      if (type == "edit") {
        this.insuranceInfo = { ...data };
        this.jsonConverArr();
      }
      this.addEditInsuranceInfoVisible = true;
    },
    // 获取保险列表
    async queryMasterInsuranceList() {
      const res = await queryMasterInsuranceList(
        this.queryMasterInsuranceListParams
      );
      this.masterInsuranceList = res.data.records;
      this.masterInsuranceListTotal = res.data.total;
    },
  },
  created() {
    this.queryMasterInsuranceList();
  },
};
</script>

<style lang="less" scoped>
.insuranceManage {
  padding: 20px;
  .topControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .topControlsSearchInfo {
      display: flex;
      align-items: center;
      .topControlsSearchInfoItem {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .label {
          font-weight: 700;
          font-size: 16px;
          color: #606266;
          margin-right: 20px;
        }
      }
    }
  }

  .tabelPagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
