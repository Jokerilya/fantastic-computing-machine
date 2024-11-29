<!--维保订单-->
<template>
  <div class="app-container">
    <!-- 顶部工具栏部分 -->
    <div class="manage-top">
      <el-form
        v-model="searchForm"
        ref="ruleForm"
        label-width="80px"
        class="rule-form"
        label-position="right"
      >
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="师傅名称">
              <el-select
                v-model="searchForm.masterUid"
                filterable
                placeholder="请选择"
                :remote-method="searchMaster"
                remote
              >
                <el-option
                  v-for="item in masterSearchList"
                  :key="item.uid"
                  :label="item.realName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="订单状态">
              <el-select v-model="searchForm.status" placeholder="请选择">
                <el-option
                  v-for="item in util.global.mainStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="订单类型">
              <el-select v-model="searchForm.orderType" placeholder="请选择">
                <el-option label="散单" :value="1">散单</el-option>
                <el-option label="年保" :value="2">年保</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="平台状态">
              <el-select
                v-model="searchForm.platformStatus"
                placeholder="请选择"
              >
                <el-option label="师傅取消" :value="-1">师傅取消</el-option>
                <el-option label="待检测定价" :value="0">待检测定价</el-option>
                <el-option label="待派发" :value="1">待派发</el-option>
                <el-option label="待审核定价" :value="2">待审核定价</el-option>
                <el-option label="待打款至师傅" :value="3"
                  >待打款至师傅</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="审核状态">
              <el-select
                v-model="searchForm.finalExamineStatus"
                placeholder="请选择"
              >
                <el-option label="未审核" :value="0">未审核</el-option>
                <el-option label="部分审核" :value="1">部分审核</el-option>
                <el-option label="已审核" :value="2">已审核</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="企业名称">
              <el-input
                v-model="searchForm.enterpriseName"
                placeholder="企业名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="设备编码">
              <el-input
                v-model="searchForm.no"
                placeholder="设备编码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="订单编号">
              <el-input
                v-model="searchForm.orderSn"
                placeholder="订单编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
        <el-row style="text-align: right">
          <el-col :span="24">
            <el-button type="warning" plain @click="openSyncDialog">
              同步
            </el-button>
            <el-button plain type="primary" @click="query_queryRepairOrderList"
              >查询</el-button
            >
            <el-button plain type="info" @click="resetFn">重置</el-button>
            <el-button type="success" plain @click="exportList">
              导出
            </el-button>
            <!-- <el-button
              type="success"
              plain
              @click="openReplacePlaceOrderDialog"
            >
              代下单
            </el-button> -->
          </el-col>
        </el-row>
        <!-- <el-row style="display: flex;">
          <el-button
            icon="el-icon-zoom-in"
            plain
            type="primary"
            @click="query_queryRepairOrderList"
            >查询</el-button
          >
          <el-button
            style="margin-right: 10px;"
            icon="el-icon-refresh"
            plain
            type="info"
            @click="resetFn"
            >重置</el-button
          >
          <el-upload
            class="upload-demo"
            action
            multiple
            :http-request="workOrderImport"
            :show-file-list="false"
          >
            <el-button class="importBtn">工单批量下单</el-button>
          </el-upload>
          <el-button
            style="margin-left: 10px;"
            type="warning"
            plain
            @click="templateDownload"
          >
            批量下单模板下载
          </el-button>
          <el-button
            style="margin-left: 10px;"
            type="success"
            plain
            @click="$router.push('/maintenance/agentOrder')"
          >
            代客户下单
          </el-button>
          <el-button type="success" plain @click="exportList">
            导出
          </el-button>
        </el-row> -->
      </el-form>
    </div>

    <!-- 空行 -->
    <div style="height: 16px"></div>

    <el-card>
      <!-- 维保订单列表表格部分 -->
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="dataList"
        height="65vh"
      >
        <el-table-column
          prop="orderSn"
          label="订单编号"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          label="工单类型"
          show-overflow-tooltip
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              row.orderType === 1
                ? "普通"
                : row.orderType === 2
                ? "年保"
                : "年卡"
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="订单价格"
          show-overflow-tooltip
          width="80"
          align="center"
        >
          <template slot-scope="{ row }"> ￥{{ row.totalAmount?row.totalAmount:'0' }} </template>
        </el-table-column> -->
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="230"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="no"
          label="机台码"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备编号"
          show-overflow-tooltip
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.enterpriseDeviceNo ? row.enterpriseDeviceNo : "/" }}
          </template>
        </el-table-column>
        <el-table-column
          label="设备位置"
          show-overflow-tooltip
          width="80"
          align="center"
        >
          <template slot-scope="{ row }">
            {{
              row.enterpriseDevicePosition ? row.enterpriseDevicePosition : "/"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="devicePlace"
          label="设备产地"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceTypeName"
          label="设备类型"
          show-overflow-tooltip
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceBrand"
          label="设备品牌"
          show-overflow-tooltip
          width="90"
          align="center"
        ></el-table-column>
        <!-- <el-table-column
          prop="num"
          label="设备数量"
          show-overflow-tooltip
          width="80"
          align="center"
        >
          <template slot-scope="{ row }"> {{ row.num?row.num:'0' }}台 </template>
        </el-table-column> -->

        <el-table-column
          prop="deviceSystemName"
          label="设备系统"
          show-overflow-tooltip
          width="140"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serviceTime"
          label="服务时间"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="simpleDesc"
          label="故障描述"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactsPeople"
          label="联系人"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="contactsPhone"
          label="联系电话"
          show-overflow-tooltip
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="masterRealName"
          label="师傅名称"
          show-overflow-tooltip
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="masterPhone"
          label="师傅联系电话"
          show-overflow-tooltip
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="promoterPeople"
          label="推广人"
          show-overflow-tooltip
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="comprehensiveScore"
          label="客户综合评分"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remarks"
          label="备注"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="platformVisitMessage"
          label="平台回访结果"
          show-overflow-tooltip
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="orderStatusName"
          label="状态"
          show-overflow-tooltip
          width="120"
          fixed="right"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
          width="120"
          fixed="right"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="finalExamineStatusName"
          label="审核状态"
          show-overflow-tooltip
          width="120"
          fixed="right"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right" align="center">
          <template slot-scope="{ row }">
            <div class="settings">
              <el-button type="info" size="mini" plain @click="queryDesc(row)"
                >详情</el-button
              >
              <el-button
                type="info"
                size="mini"
                plain
                v-if="row.orderType == 1"
                @click="openConvertToInsurance(row.orderSn)"
                >转类型</el-button
              >
              <el-button
                type="info"
                size="mini"
                plain
                @click="openRemarksDialog(row)"
                >备注</el-button
              >
              <!-- <el-button
                v-if="
                  row.orderStatusName === '待平台指派' ||
                    row.orderStatusName === '待师傅接单'
                "
                type="info"
                size="mini"
                plain
                @click="querySnatchList(row)"
                >指派列表</el-button
              > -->
            </div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="enterpriseName"
          label="企业名称"
          show-overflow-tooltip
          width="230"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="address"
          label="详细地址"
          show-overflow-tooltip
          width="350"
          align="center"
        ></el-table-column>   
        <el-table-column
          prop="type"
          label="故障类型"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="num"
          label="设备数量"
          show-overflow-tooltip
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          show-overflow-tooltip
          width="150"
          align="center"
        ></el-table-column> -->
      </el-table>

      <!-- 分页 -->

      <!-- @size-change="handleSizeChange" -->
      <div style="text-align: center; margin-top: 20px">
        <el-pagination
          background
          @current-change="updatePageNo"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 备注框 -->
    <el-dialog
      title="备注"
      width="30%"
      :visible="openRemarksShow"
      :before-close="closeRemarksDialog"
      center
    >
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="remarksparams.remarks"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRemarksDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmRemarks">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 转年保框 -->
    <el-dialog
      title="散单转年保"
      width="30%"
      :visible="openConvertToInsuranceShow"
      :before-close="closeConvertToInsurance"
      center
    >
      <el-form>
        <el-form-item label="类型选择" label-width="70px">
          <el-radio-group v-model="convertToInsuranceparams.type">
            <el-radio :label="2">转年保</el-radio>
            <el-radio :label="3">转年卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备编号" label-width="70px">
          <el-input
            :rows="4"
            placeholder="请输入设备编号"
            v-model="convertToInsuranceparams.no"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConvertToInsurance">取 消</el-button>
        <el-button type="primary" @click="convertToInsurance">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 指派列表模态框 -->
    <!-- <model
      ref="snatch"
      title="指派列表"
      :isSubmit="false"
      :column="2"
      @close="closeSnatch"
    >
      <el-form label-width="88px" class="rule-form" label-position="right">
        <el-row :gutter="20">
          <el-col :span="5" style="margin-right: 130px;">
            <el-form-item label="师傅名称">
              <el-input
                placeholder="请输入师傅名称"
                style="width: 200px;"
                v-model="Name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-button
              icon="el-icon-zoom-in"
              plain
              type="primary"
              @click="_getMasterList"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="seedIt"
              >提交</el-button
            >
            <el-button
              icon="el-icon-refresh"
              plain
              type="primary"
              @click="seedItout"
              >抛入市场</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <el-table
        highlight-current-row
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中"
        border
        element-loading-spinner="el-icon-loading"
        :data="masterList"
        style="width: 1500px;"
      >
        <el-table-column
          prop="realName"
          label="真实姓名"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="realPortrait"
          label="真实头像"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="{ row }">
            <el-image
              style="width: 80px; height: 80px"
              :src="row.realPortrait.split(',')[0]"
              :preview-src-list="row.realPortrait.split(',')"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-checkbox
              size="medium"
              v-model="row.isSelect"
              true-label="row.uid"
              @change="changeMaster(row)"
            ></el-checkbox>
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
        :total="pageCountMaster"
      ></el-pagination>
    </model> -->

    <!-- 代下单弹框 -->
    <el-dialog
      title="代下单"
      width="30%"
      :visible="replacePlaceOrderVisible"
      :close-on-click-modal="false"
      :before-close="closeReplacePlaceOrderDialog"
      center
    >
      <div>
        <el-form
          label-position="left"
          label-width="120px"
          :model="handleProxyCreateOrderParams"
          :rules="handleProxyCreateOrderRules"
          ref="handleProxyCreateOrderRef"
        >
          <el-form-item label="设备编码" prop="no">
            <el-input
              @blur="getDeviceInfoByNo"
              v-model="handleProxyCreateOrderParams.no"
              placeholder="请填写设备编码,例:粤Sxxxxxx"
            ></el-input>
          </el-form-item>
          <el-form-item label="故障类型" prop="type">
            <el-radio-group v-model="handleProxyCreateOrderParams.type">
              <el-radio :label="1">电气故障</el-radio>
              <el-radio :label="2">机械故障</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceTypeId">
            <el-cascader
              :disabled="formItemDisabled"
              @change="changeDeviceType"
              v-model="handleProxyCreateOrderParams.deviceTypeId"
              :options="deviceTypeListOptions"
              :show-all-levels="false"
              placeholder="请选择设备类型"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="设备品牌" prop="deviceBrand">
            <el-input
              :disabled="formItemDisabled"
              v-model="handleProxyCreateOrderParams.deviceBrand"
              placeholder="请填写设备品牌"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="deviceModel">
            <el-input
              :disabled="formItemDisabled"
              v-model="handleProxyCreateOrderParams.deviceModel"
              placeholder="请填写设备型号"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备系统" prop="deviceSystemId">
            <el-cascader
              :disabled="formItemDisabled"
              @change="changeDeviceSystem"
              v-model="handleProxyCreateOrderParams.deviceSystemId"
              :options="deviceSystemListOptions"
              :show-all-levels="false"
              placeholder="请选择设备系统"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="设备产地" prop="devicePlace">
            <el-select
              :disabled="formItemDisabled"
              placeholder="请选择设备产地"
              v-model="handleProxyCreateOrderParams.devicePlace"
            >
              <el-option
                v-for="item in devicePlaceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障部位" prop="position">
            <el-cascader
              @change="changePosition"
              v-model="handleProxyCreateOrderParams.position"
              :options="positionOptions"
              :show-all-levels="false"
              placeholder="请选择故障部位"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="联系人" prop="contactsPeople">
            <el-input
              v-model="handleProxyCreateOrderParams.contactsPeople"
              placeholder="请填写联系人"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contactsPhone">
            <el-input
              v-model="handleProxyCreateOrderParams.contactsPhone"
              placeholder="请填写联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="enterpriseName">
            <el-input
              :disabled="formItemDisabled"
              v-model="handleProxyCreateOrderParams.enterpriseName"
              placeholder="请填写公司名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="address">
            <el-input
              v-model="handleProxyCreateOrderParams.address"
              placeholder="请填写联系地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="期望时间" prop="serviceTime">
            <el-date-picker
              v-model="handleProxyCreateOrderParams.serviceTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择期望时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="故障描述" prop="simpleDesc">
            <el-input
              v-model="handleProxyCreateOrderParams.simpleDesc"
              placeholder="请填写故障描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="故障视图" prop="images">
            <div v-if="handleProxyCreateOrderParams.images">
              <el-button type="text" @click="openFaultImg">查看视图</el-button>
              <el-button type="text" @click="delFaultImg">删除视图</el-button>
            </div>
            <div v-else>
              <el-upload
                accept=".jpg,.jpeg,.png,.mp4"
                action="#"
                :http-request="uploadFaultImg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReplacePlaceOrderDialog">取 消</el-button>
        <el-button type="primary" @click="handleProxyCreateOrder"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 同步金蝶 -->
    <el-dialog
      title="同步"
      width="35%"
      :visible="syncDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeSyncDialog"
      center
    >
      <el-input
        v-model="testDataOrderSns"
        placeholder="填写同步的订单号,多个订单号逗号隔开,例:WBLPxxxxxxx,WBLPxxxxxxx"
      ></el-input>
      <div v-if="testDataTip" style="padding-top: 20px; color: red">
        {{ testDataTip }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSyncDialog">取 消</el-button>
        <el-button type="primary" @click="testData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped></style>

<script>
import {
  getMasterList,
  handleAssignMaster,
  queryAssignableMasterList,
} from "@/api/user.js";
import {
  uploadBatchRepairOrder,
  queryRepairOrderList,
  downloadBatchRepairOrderTemplate,
  handleRepairOrderExport,
  handleRepairRemarks,
  convertToInsurance,
  queryDeviceTypeList,
  queryDeviceSystemList,
  queryFaultPosition,
  getDeviceInfoByNo,
  testData,
} from "@/api/order.js";
import { handleProxyCreateOrder } from "@/api/proxy";
import { UploadImg } from "@/api/system.js";
// import tableMixin from "@/mixin/table";
import { localStorageData } from "@/utils";
export default {
  title: "course",
  // mixins: [tableMixin],
  data() {
    return {
      // 同步
      testDataTip: null,
      testDataOrderSns: null,
      syncDialogVisible: false,
      // 代下单模块 start
      formItemDisabled: false,
      handleProxyCreateOrderParams: {
        no: null,
        latitude: null,
        longitude: null,
        position: null,
        serviceTime: null,
        simpleDesc: null,
        type: null,
        images: null,
        enterpriseName: null,
        address: null,
        contactsPeople: null,
        areaId: null,
        contactsPhone: null,
        deviceBrand: null,
        deviceModel: null,
        devicePlace: null,
        deviceSystemId: null,
        deviceTypeId: null,
      },
      handleProxyCreateOrderRules: {
        type: [
          { required: true, message: "请选择故障类型", trigger: "change" },
        ],
        deviceTypeId: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
        deviceBrand: [
          { required: true, message: "请填写设备品牌", trigger: "blur" },
        ],
        deviceModel: [
          { required: true, message: "请填写设备型号", trigger: "blur" },
        ],
        deviceSystemId: [
          { required: true, message: "请选择设备系统", trigger: "change" },
        ],
        devicePlace: [
          { required: true, message: "请选择设备产地", trigger: "change" },
        ],
        position: [
          { required: true, message: "请选择故障部位", trigger: "change" },
        ],
        contactsPeople: [
          { required: true, message: "请填写联系人", trigger: "blur" },
        ],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }],
        serviceTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        simpleDesc: [
          { required: true, message: "请填写故障描述", trigger: "blur" },
        ],
        images: [
          { required: true, message: "请上传故障视图", trigger: "blur" },
        ],
        enterpriseName: [
          { required: true, message: "请填写公司名称", trigger: "blur" },
        ],
        contactsPhone: [
          { required: true, message: "请填写联系电话", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号码格式不正确",
            trigger: "blur",
          },
        ],
      },
      replacePlaceOrderVisible: false,
      deviceTypeListOptions: [],
      deviceSystemListOptions: [],
      positionOptions: [],
      devicePlaceOptions: [
        {
          value: "国产",
          label: "国产",
        },
        {
          value: "进口",
          label: "进口",
        },
      ],

      // 代下单模块 end

      masterSearchList: [],
      remarksparams: {
        remarks: null,
        orderSn: null,
      },
      openRemarksShow: false,
      convertToInsuranceparams: {
        orderSn: null,
        no: null,
        type: null,
      },
      openConvertToInsuranceShow: false,

      exportParams: null,
      searchForm: {
        masterUid: "",
        deviceTypeId: "",
        status: "",
        orderType: "",
        enterpriseName: "",
        no: "",
        platformStatus: "",
        orderSn: "",
        finalExamineStatus: null,
        queryTime: null,
      },
      queryTimeCopy: null,
      dataList: [],
      pageCount: null,
      pageCountMaster: "",
      currentPage: 1,
      tabelList: [],
      changeData: [],
      masterList: [],
      loading: false,
      typeData: [],
      courseList: [],
      snatchList: [],
      courseDistriList: [],
      Name: "",
      Phone: "",
      enterpriseOrderSn: "",
      url: {
        query: "/admin/maintenance/queryRepairOrderList",
        querySnatch: "/admin/maintenance/queryMasterGrabOrderList",
        assign: "/admin/maintenance/handleAssignMaster",
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation",
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
      param: {},
      quotationForm: {},
    };
  },
  created() {
    // 获取本地存储
    let queryRepairDataStr;
    if (localStorage.getItem("queryRepairData")) {
      queryRepairDataStr = JSON.parse(localStorage.getItem("queryRepairData"));
    }

    if (queryRepairDataStr) {
      const {
        pageNo,
        pageSize,
        enterpriseName,
        status,
        orderType,
        no,
        orderSn,
        platformStatus,
      } = queryRepairDataStr;
      this.currentPage = pageNo;
      this.pageSize = pageSize;
      this.searchForm.enterpriseName = enterpriseName;
      this.searchForm.status = status;
      this.searchForm.orderType = orderType;
      this.searchForm.no = no;
      this.searchForm.orderSn = orderSn;
      this.searchForm.platformStatus = platformStatus;
    } else {
      this.currentPage = 1;
      this.pageSize = 10;
    }

    // this._queryAssignableMasterList();
    this._queryRepairOrderList();
  },
  methods: {
    // 确定同步
    async testData() {
      if (!this.testDataOrderSns) {
        this.$message({
          message: "请填写要同步的订单号",
          type: "warning",
        });
        return;
      }
      this.testDataTip = null;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const res = await testData(this.testDataOrderSns);
      loading.close();
      if (res.code == "000" && res.data == "") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closeSyncDialog();
      } else {
        this.testDataOrderSns = null;
        this.testDataTip = res.data;
      }
    },
    // 关闭同步框
    closeSyncDialog() {
      this.testDataTip = null;
      this.testDataOrderSns = null;
      this.syncDialogVisible = false;
    },
    // 打开同步框
    openSyncDialog() {
      this.syncDialogVisible = true;
    },

    //  切换创建时间
    changeQueryTimeCopy() {
      this.searchForm.queryTime =
        this.queryTimeCopy[0] + "~" + this.queryTimeCopy[1];
    },
    // 代下单模块 start
    async handleProxyCreateOrder() {
      await this.$refs["handleProxyCreateOrderRef"].validate();
      const res = await handleProxyCreateOrder(
        this.handleProxyCreateOrderParams
      );
      if (res.message == "操作成功") {
        this.closeReplacePlaceOrderDialog();
        this._queryRepairOrderList();
      }
    },
    // 通过编码查询设备信息和企业信息
    async getDeviceInfoByNo() {
      const res = await getDeviceInfoByNo(this.handleProxyCreateOrderParams.no);
      if (res.data) {
        // 回显
        const {
          deviceBrand,
          deviceModel,
          devicePlace,
          deviceSystemId,
          deviceTypeId,
          enterpriseAddress,
          enterpriseName,
        } = res.data;
        this.handleProxyCreateOrderParams.deviceBrand = deviceBrand;
        this.handleProxyCreateOrderParams.deviceModel = deviceModel;
        this.handleProxyCreateOrderParams.devicePlace = devicePlace;
        this.handleProxyCreateOrderParams.deviceSystemId = deviceSystemId;
        this.handleProxyCreateOrderParams.deviceTypeId = deviceTypeId;
        this.handleProxyCreateOrderParams.address = enterpriseAddress;
        this.handleProxyCreateOrderParams.enterpriseName = enterpriseName;
        this.formItemDisabled = true;
      } else {
        this.handleProxyCreateOrderParams.deviceBrand = null;
        this.handleProxyCreateOrderParams.deviceModel = null;
        this.handleProxyCreateOrderParams.devicePlace = null;
        this.handleProxyCreateOrderParams.deviceSystemId = null;
        this.handleProxyCreateOrderParams.deviceTypeId = null;
        this.handleProxyCreateOrderParams.address = null;
        this.handleProxyCreateOrderParams.enterpriseName = null;
        this.formItemDisabled = false;
      }
    },
    // 打开代下单弹框
    async openReplacePlaceOrderDialog() {
      await this.queryDeviceTypeList();
      await this.queryDeviceSystemList();
      await this.queryFaultPosition();
      this.replacePlaceOrderVisible = true;
    },
    // 关闭代下单弹框
    closeReplacePlaceOrderDialog() {
      this.$refs["handleProxyCreateOrderRef"].resetFields();
      this.handleProxyCreateOrderParams = {
        no: null,
        latitude: null,
        longitude: null,
        position: null,
        serviceTime: null,
        simpleDesc: null,
        type: null,
        images: null,
        enterpriseName: null,
        address: null,
        contactsPeople: null,
        areaId: null,
        contactsPhone: null,
        deviceBrand: null,
        deviceModel: null,
        devicePlace: null,
        deviceSystemId: null,
        deviceTypeId: null,
      };
      this.replacePlaceOrderVisible = false;
    },
    // 切换故障部位
    changePosition(val) {
      this.handleProxyCreateOrderParams.position = val[val.length - 1];
    },
    // 切换设备系统
    changeDeviceSystem(val) {
      this.handleProxyCreateOrderParams.deviceSystemId = val[val.length - 1];
    },
    // 切换设备类型
    changeDeviceType(val) {
      this.handleProxyCreateOrderParams.deviceTypeId = val[val.length - 1];
    },
    // 查询故障部位
    async queryFaultPositionOne(sum, str) {
      const children = [];
      const res = await queryFaultPosition(sum);
      res.data.forEach((item) => {
        children.push({
          value: item,
          label: item,
        });
      });
      return {
        value: str,
        label: str,
        children,
      };
    },
    async queryFaultPosition() {
      let jiaGongArr = await this.queryFaultPositionOne(1, "加工中心");
      let shuKongArr = await this.queryFaultPositionOne(2, "数控车床");
      this.positionOptions = [jiaGongArr, shuKongArr];
    },
    // 查询设备系统
    async queryDeviceSystemList() {
      const res = await queryDeviceSystemList();
      if (res.data) {
        let arr = [];
        res.data.forEach((item) => {
          let children = [];
          if (item.list) {
            item.list.forEach((i) => {
              children.push({
                value: i.id,
                label: i.name,
              });
            });
          }

          arr.push({
            value: item.id,
            label: item.name,
            children,
          });
        });
        this.deviceSystemListOptions = arr;
      }
    },
    // 查询设备类型
    async queryDeviceTypeList() {
      const res = await queryDeviceTypeList();
      if (res.data) {
        let arr = [];
        res.data.forEach((item) => {
          let children = [];
          if (item.list) {
            item.list.forEach((i) => {
              children.push({
                value: i.id,
                label: i.name,
              });
            });
          }

          arr.push({
            value: item.id,
            label: item.name,
            children,
          });
        });
        this.deviceTypeListOptions = arr;
      }
    },
    // 上传故障视图
    async uploadFaultImg(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message == "操作成功") {
        this.handleProxyCreateOrderParams.images = res.data;
      }
    },
    // 删除故障视图
    delFaultImg() {
      this.handleProxyCreateOrderParams.images = "";
    },
    // 查看视图
    openFaultImg() {
      window.open(this.handleProxyCreateOrderParams.images, "_blank");
    },

    // 代下单模块 end

    // 确认散单转年保
    async convertToInsurance() {
      const res = await convertToInsurance(this.convertToInsuranceparams);
      if (res.message === "操作成功") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.closeConvertToInsurance();
        this._queryRepairOrderList();
      }
    },
    // 关闭转年保框
    closeConvertToInsurance() {
      this.openConvertToInsuranceShow = false;
      this.convertToInsuranceparams = {
        orderSn: null,
        no: null,
      };
    },
    // 打开转年保框
    openConvertToInsurance(orderSn) {
      this.convertToInsuranceparams.orderSn = orderSn;
      this.openConvertToInsuranceShow = true;
    },
    // 查询师傅列表
    async searchMaster(val) {
      const res = await getMasterList({
        realName: val,
      });
      this.masterSearchList = res.data.records;
      console.log(625, this.masterSearchList);
    },
    // 确定添加备注
    async comfirmRemarks() {
      const res = await handleRepairRemarks(this.remarksparams);
      if (res.message === "操作成功") {
        this.closeRemarksDialog();
        this._queryRepairOrderList();
      }
    },
    // 关闭备注框
    closeRemarksDialog() {
      this.remarksparams = {
        remarks: null,
        orderSn: null,
      };
      this.openRemarksShow = false;
    },
    // 打开备注框
    openRemarksDialog({ orderSn, remarks }) {
      this.remarksparams.orderSn = orderSn;
      this.remarksparams.remarks = remarks;
      this.openRemarksShow = true;
    },
    // 查询列表
    query_queryRepairOrderList() {
      this.currentPage = 1;
      this._queryRepairOrderList();
    },
    // 导出
    async exportList() {
      const loading = this.$loading({
        lock: true,
        text: "数据传输中",
        spinner: "el-icon-loading",
      });
      this.exportParams.pageSize = 10000;
      const res = await handleRepairOrderExport(this.exportParams);
      if (res) {
        const link = document.createElement("a");
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = "维保列表"; //下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loading.close();
      }
    },
    // 重置
    resetFn() {
      this.currentPage = 1;
      this.queryTimeCopy = null;
      this.searchForm = {
        deviceTypeId: "",
        status: "",
        orderType: "",
        enterpriseName: "",
        no: "",
        platformStatus: "",
        orderSn: "",
        finalExamineStatus: null,
        queryTime: "",
      };
      this._queryRepairOrderList();
    },
    // 批量下单模板下载
    async templateDownload() {
      const res = await downloadBatchRepairOrderTemplate();
      window.location.href = res.data;
    },
    // 点击工单导入
    async workOrderImport(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await uploadBatchRepairOrder(formData);
      if (res.message === "操作成功") {
        this.$message({
          message: "已成功批量下单",
          type: "success",
        });
        this._queryAssignableMasterList();
        this._queryRepairOrderList();
      }
    },
    // 获取指派列表模态框里的师傅列表
    _queryAssignableMasterList() {
      let data = {
        pageNo: this.currentPage,
        pageSize: 10,
        realName: this.Name,
      };
      queryAssignableMasterList(data).then((res) => {
        if (res) {
          this.masterList = res.data.records;
          this.pageCountMaster = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
    // 获取维保订单列表
    _queryRepairOrderList() {
      // const loading = this.$loading({ text: "加载中.." });
      let data = {
        pageNo: this.currentPage,
        pageSize: 10,
        ...this.searchForm,
      };
      localStorageData("queryRepairData", JSON.stringify(data));
      this.exportParams = data;
      queryRepairOrderList(data)
        .then((res) => {
          if (res) {
            this.dataList = res.data.records;
            this.pageCount = res.data.total;
          }
        })
        .finally(() => {});
    },
    // 点击页码触发的事件
    updatePageNo(val) {
      this.currentPage = val;
      this._queryRepairOrderList();
    },
    // 点击指派列表模态框的页码触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.currentPage2 = val;
      this._getMasterList();
    },
    // 点击指派列表模态框操作里多选框的事件
    changeMaster(row) {
      console.log("row", row.uid);
      this.tabelList.push(row.uid);
      // this.tabelList.forEach((item, index) => {
      //   if (item.isSelect == 0) {
      //     this.tabelList.splice(index, 1);
      //   }else{
      //      this.tabelList.push(row.uid);
      //   }
      // });
      console.log("list", this.tabelList);
    },
    // 点击派列表模态框抛入市场的事件
    seedItout() {
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: [],
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    // 点击派列表模态框提交的事件
    seedIt() {
      let id = this.tabelList;
      id.join(",");
      console.log("选中id", id);
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUidList: id,
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    //  点击查看详情触发的事件
    queryDesc(row) {
      this.$router.push({
        name: "maintenance_order_desc",
        query: { orderSn: row.orderSn },
      });
    },
    // 点击指派列表触发的事件
    // querySnatchList({ orderSn: enterpriseOrderSn }) {
    //   this.$refs.snatch.open();
    //   this.enterpriseOrderSn = enterpriseOrderSn;
    // },
    // 指派列表模态框关闭的事件
    closeSnatch(fn) {
      fn(false);
    },
    // 有用到 不知道干嘛
    assign(masterOrderSn) {
      this.$axios
        .post(this.url.assign, {
          enterpriseOrderSn: this.param.enterpriseOrderSn,
          masterOrderSn: masterOrderSn,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this.$refs.snatch.close();
            this.query();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getType(val) {
      return this.typeData.filter((item) => {
        if (item.id == val) {
          return item;
        }
      })[0].name;
    },
    _handleAssignMaster(row) {
      console.log(row);
      let params = {
        enterpriseOrderSn: this.enterpriseOrderSn,
        masterUid: row.uid,
      };
      handleAssignMaster(params).then((res) => {
        console.log("指派师傅", res);
        if (res.success) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$refs.snatch.close();
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "false",
          });
        }
      });
    },
    _addOrder() {
      this.$router.push({
        name: "maintenance",
      });
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
          this.masterList = res.data.records;
          console.log("师傅列表", this.masterList);
          this.pageCount = res.data.total;
          this.currentPage = res.data.current;
        }
      });
    },
  },
};
</script>
