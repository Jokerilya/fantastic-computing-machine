<template>
  <div class="maintenanceOrderDesc" ref="maintenanceOrderDesc">
    <!-- 状态步骤 -->
    <el-card v-if="masterOrderTrackList.length > 0">
      <div class="statusListBox">
        <div class="goLeftBtn" @click="scrollLeft">
          <el-image
            src="https://res.bangwo8.com/osp2016/images/ui/arrow_left_0.svg?v=a556e390"
          ></el-image>
        </div>
        <div class="goRightBtn" @click="scrollRight">
          <el-image
            src="https://res.bangwo8.com/osp2016/images/ui/arrow_right_0.svg?v=a23798a7"
          ></el-image>
        </div>
        <div class="statusList">
          <div class="statusListFlex" ref="statusListFlex">
            <div
              class="statusItem"
              :style="{
                backgroundColor:
                  orderTrackListIndex ==
                  masterOrderTrackList[chooseMaster].length - 1
                    ? '#59a2f4'
                    : '#fff',
                color:
                  orderTrackListIndex ==
                  masterOrderTrackList[chooseMaster].length - 1
                    ? '#fff'
                    : '#000',
              }"
              v-for="(
                orderTrackListItem, orderTrackListIndex
              ) in masterOrderTrackList[chooseMaster]"
              :key="orderTrackListItem.subStatus"
            >
              <div>{{ orderTrackListItem.title }}</div>
              <div>{{ orderTrackListItem.createTime }}</div>
              <div
                :style="{
                  backgroundColor:
                    orderTrackListIndex ==
                    masterOrderTrackList[chooseMaster].length - 1
                      ? '#59a2f4'
                      : '#fff',
                }"
                class="statusItem_rightLing"
                v-if="
                  orderTrackListIndex !=
                  masterOrderTrackList[chooseMaster].length - 1
                "
              ></div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 订单信息 -->
    <div class="orderInfo">
      <!-- 订单和企业信息 -->
      <el-card style="flex: 1; margin-right: 10px">
        <el-tabs v-model="leftTabActiveName">
          <el-tab-pane label="企业信息" name="企业信息">
            <div class="mainOrderInfo">
              <!-- 订单信息 -->
              <div class="mainOrderInfo_item">
                <div class="label">企业订单号</div>
                <div
                  class="value"
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <div
                    :style="{
                      color: orderDetail.orderSn.includes('-F-')
                        ? '#f56c6c'
                        : '#000',
                    }"
                  >
                    {{ orderDetail.orderSn }}
                  </div>
                  <div
                    style="color: #409eff; cursor: pointer"
                    @click="copyOrderInfo"
                  >
                    复制
                  </div>
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                style="color: red"
                v-if="orderDetail.timeoutFlag"
              >
                <div class="label">超时状态</div>
                <div class="value">
                  {{
                    orderDetail.timeoutFlag == "2001"
                      ? "指派超时"
                      : orderDetail.timeoutFlag == "2101"
                      ? "接单超时"
                      : orderDetail.timeoutFlag == "2201"
                      ? "打卡超时"
                      : orderDetail.timeoutFlag == "2301"
                      ? "服务中超时"
                      : orderDetail.timeoutFlag == "3001"
                      ? "派发->接单超时 "
                      : "/"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">订单类型</div>
                <div class="value" style="display: flex; align-items: center">
                  <div>
                    {{
                      orderDetail.orderType == 1
                        ? "散单"
                        : orderDetail.orderType == 2
                        ? "年保"
                        : "年卡"
                    }}
                  </div>
                  <!-- orderDetail.label !== '普通' && matchedLabelItem -->
                  <div
                    v-if="orderDetail.label"
                    style="color: red; margin-left: 5px"
                  >
                    <!-- <div :class="labelClass">
                      【{{ matchedLabelItem.value }}】
                    </div> -->
                    【{{ orderDetail.label }}】
                  </div>
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">下单时间</div>
                <div class="value">{{ orderDetail.createTime }}</div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">下单人</div>
                <div class="value">
                  {{
                    orderDetail.createPeople ? orderDetail.createPeople : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">负责人</div>
                <div class="value">
                  {{
                    orderDetail.operationPeople
                      ? orderDetail.operationPeople
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">业务员</div>
                <div class="value">
                  {{
                    orderDetail.salesmanName
                      ? orderDetail.salesmanName
                      : "未绑定"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">期望时间</div>
                <div class="value">{{ orderDetail.serviceTime }}</div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">期望时间</div>
                <div class="value">
                  {{
                    orderDetail.degree == 1
                      ? "一般"
                      : orderDetail.degree == 2
                      ? "紧急"
                      : "常规"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">故障部位</div>
                <div class="value">{{ orderDetail.position }}</div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">故障描述</div>
                <div class="value">{{ orderDetail.simpleDesc }}</div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">故障视图</div>
                <div
                  class="value"
                  style="color: #409eff; cursor: pointer"
                  v-if="
                    orderDetail.pictureList &&
                    orderDetail.pictureList.length > 0
                  "
                  @click="
                    goToVideoUrl(
                      orderDetail.videoList ? orderDetail.videoList[0] : null
                    )
                  "
                >
                  查看视图
                  <el-image
                    v-if="
                      orderDetail.pictureList &&
                      orderDetail.pictureList.length > 0
                    "
                    class="previewImg"
                    :src="orderDetail.pictureList[0]"
                    :preview-src-list="orderDetail.pictureList"
                  >
                  </el-image>
                </div>
                <div v-else>未上传故障视图</div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="
                  orderDetail.onlineAcceptanceNonePriceFile ||
                  orderDetail.onlineAcceptanceFile
                "
              >
                <div class="label">验收凭证</div>
                <div
                  class="value"
                  v-if="orderDetail.onlineAcceptanceFile"
                  style="color: #409eff; cursor: pointer"
                  @click="goToVideoUrl(orderDetail.onlineAcceptanceFile)"
                >
                  验收单(有价格版)
                </div>
                <div
                  class="value"
                  style="color: #409eff; cursor: pointer"
                  v-if="orderDetail.onlineAcceptanceNonePriceFile"
                  @click="
                    goToVideoUrl(orderDetail.onlineAcceptanceNonePriceFile)
                  "
                >
                  验收单(无价格版)
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">故障类型</div>
                <div class="value">
                  {{ orderDetail.type }}
                </div>
              </div>
              <div class="mainOrderInfo_item" v-if="orderDetail.warrantyTime">
                <div class="label">质保时间</div>
                <div
                  class="value"
                  style="color: #409eff; cursor: pointer"
                  @click="openEditWarrantyPeriodDialog(orderDetail)"
                >
                  {{ orderDetail.warrantyTime }}天<span
                    v-if="orderDetail.warrantyEndTime"
                    >({{ orderDetail.warrantyEndTime }})</span
                  >
                </div>
              </div>
              <!-- <div
                class="mainOrderInfo_item"
                v-if="orderDetail.enterpriseSubStatus == '2602'"
              >
                <div class="label">企业评价</div>
                <div class="value">
                  {{
                    orderDetail.enrollRepairOrderOutList[0].repairComment
                      .content
                  }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="
                  orderDetail.enterpriseSubStatus == '2602' &&
                  orderDetail.enrollRepairOrderOutList[0] &&
                  orderDetail.enrollRepairOrderOutList[0].repairComment &&
                  orderDetail.enrollRepairOrderOutList[0].repairComment.images
                "
              >
                <div class="label">评价图片</div>
                <div class="value" style="color: #409eff; cursor: pointer">
                  查看图片
                  <el-image
                    class="previewImg"
                    :src="
                      orderDetail.enrollRepairOrderOutList[0].repairComment
                        .images[0]
                    "
                    :preview-src-list="
                      orderDetail.enrollRepairOrderOutList[0].repairComment
                        .images
                    "
                  >
                  </el-image>
                </div>
              </div> -->

              <div class="mainOrderInfo_item"></div>
              <!-- 设备信息 -->
              <div class="mainOrderInfo_item">
                <div class="label">设备编号</div>
                <div class="value">
                  {{ orderDetail.no ? orderDetail.no : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备产地</div>
                <div class="value">
                  {{ orderDetail.devicePlace ? orderDetail.devicePlace : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备类型</div>
                <div class="value">
                  {{
                    orderDetail.deviceTypeName
                      ? orderDetail.deviceTypeName
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备品牌</div>
                <div class="value">
                  {{ orderDetail.deviceBrand ? orderDetail.deviceBrand : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备数量</div>
                <div class="value">
                  {{ orderDetail.num ? orderDetail.num : "1" }}台
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备系统</div>
                <div class="value">
                  {{
                    orderDetail.deviceSystemName
                      ? orderDetail.deviceSystemName
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">企业设备编号</div>
                <div class="value">
                  {{
                    orderDetail.enterpriseDeviceNo
                      ? orderDetail.enterpriseDeviceNo
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">企业设备位置</div>
                <div class="value">
                  {{
                    orderDetail.enterpriseDevicePosition
                      ? orderDetail.enterpriseDevicePosition
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">设备型号</div>
                <div class="value">
                  {{ orderDetail.deviceModel ? orderDetail.deviceModel : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">出厂时间</div>
                <div class="value">
                  {{ orderDetail.factoryTime ? orderDetail.factoryTime : "无" }}
                </div>
              </div>
              <!-- 企业信息 -->
              <div class="mainOrderInfo_item">
                <div class="label">企业名称</div>
                <div class="value">
                  {{
                    orderDetail.enterpriseName
                      ? orderDetail.enterpriseName
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">联系人员</div>
                <div class="value">
                  {{
                    orderDetail.contactsPeople
                      ? orderDetail.contactsPeople
                      : "无"
                  }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">联系电话</div>
                <div class="value">
                  {{ orderDetail.phone ? orderDetail.phone : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">联系地址</div>
                <div class="value">
                  {{ orderDetail.address ? orderDetail.address : "无" }}
                </div>
              </div>

              <div class="mainOrderInfo_item"></div>

              <!-- 企业付款 -->

              <div class="mainOrderInfo_item">
                <div class="label">人工费</div>
                <div class="value">
                  {{ orderDetail.doorAmount ? orderDetail.doorAmount : 0 }}元
                  <span
                    style="
                      margin-left: 10px;
                      color: #409eff;
                      cursor: pointer;
                      font-weight: 400;
                    "
                    v-if="
                      orderDetail.enterpriseSubStatus >= 2401 &&
                      orderDetail.enterpriseSubStatus < 2601
                    "
                    @click="
                      openSinglePartyNegotiationDialog(orderDetail.orderSn)
                    "
                    >单方议价</span
                  >
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">配件费</div>
                <div class="value">
                  {{ orderDetail.partsAmount ? orderDetail.partsAmount : 0 }}元
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="orderDetail.invoiceAmount > 0"
              >
                <div class="label">含税金额</div>
                <div class="value">
                  +{{
                    orderDetail.invoiceAmount ? orderDetail.invoiceAmount : 0
                  }}元
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                style="color: red"
                v-if="orderDetail.discountAmount > 0"
              >
                <div class="label">优惠减免</div>
                <div class="value">
                  -{{
                    orderDetail.discountAmount ? orderDetail.discountAmount : 0
                  }}元 [{{ orderDetail.couponName }}]
                </div>
              </div>
              <div class="mainOrderInfo_item" style="font-weight: 700">
                <div class="label">企业应付</div>
                <div class="value">
                  {{ orderDetail.payAmount ? orderDetail.payAmount : 0 }}元
                  <span v-if="orderDetail.orderType == 3"
                    >(年卡订单包人工不包配件)</span
                  >
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 订单轨迹和多师傅订单 -->
      <el-card style="flex: 4">
        <el-tabs v-model="rightTabActiveName" @tab-click="changeTabActiveName">
          <el-tab-pane
            :name="item.orderSn"
            v-for="(item, index) in orderDetail.enrollRepairOrderOutList"
            v-bind:key="item.uid"
          >
            <template slot="label">
              <div style="display: flex; align-items: center; gap: 3px">
                <span v-if="orderDetail.enrollRepairOrderOutList.length > 1">{{
                  index == 0
                    ? "①"
                    : index == 1
                    ? "②"
                    : index == 2
                    ? "③"
                    : index == 3
                    ? "④"
                    : "⑤"
                }}</span>
                <span>{{ item.realName }}</span>
              </div></template
            >
            <div class="masterOrderInfo">
              <div class="mainOrderInfo_item">
                <div class="label" style="margin-top: 3px">师傅订单号</div>
                <div class="value">
                  {{ item.orderSn
                  }}<el-tag
                    v-if="item.statusFlag"
                    :type="item.statusFlag == 1 ? 'success' : 'danger'"
                    size="mini"
                    style="margin-left: 8px"
                    >{{
                      item.statusFlag == 1 ? "再次上门维修" : "订单挂起"
                    }}</el-tag
                  >
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">师傅名称</div>
                <div class="value">
                  {{ item.realName }}（{{ item.masterTypeName }}）
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">联系电话</div>
                <div class="value">{{ item.phone }}</div>
              </div>
              <div class="mainOrderInfo_item" v-if="item.punchTime">
                <div class="label">打卡时间</div>
                <div class="value">{{ item.punchTime }}</div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.punchImages && item.punchImages.length > 0"
              >
                <div class="label">打卡图片</div>
                <div class="value" style="color: #409eff; cursor: pointer">
                  查看图片
                  <el-image
                    class="previewImg"
                    :src="item.punchImages[0]"
                    :preview-src-list="item.punchImages"
                  >
                  </el-image>
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                :style="{
                  color:
                    item.dataExamineStatus == 1
                      ? '#e6a23c'
                      : item.dataExamineStatus == 2
                      ? ''
                      : item.dataExamineStatus == 3
                      ? 'red'
                      : '',
                }"
              >
                <div class="label">现场故障描述</div>
                <div class="value">
                  {{ item.faultDescription ? item.faultDescription : "无" }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                :style="{
                  color:
                    item.dataExamineStatus == 1
                      ? '#e6a23c'
                      : item.dataExamineStatus == 2
                      ? ''
                      : item.dataExamineStatus == 3
                      ? 'red'
                      : '',
                }"
              >
                <div class="label">处理过程</div>
                <div class="value">
                  {{ item.handleProcess ? item.handleProcess : "无" }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                style="color: red"
                v-if="item.dataExamineStatus == 3 && item.dataExamineResult"
              >
                <div class="label">驳回原因</div>
                <div class="value">
                  {{ item.dataExamineResult }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.completeImages && item.completeImages.length > 0"
              >
                <div class="label">完工照片</div>
                <div class="value" style="color: #409eff; cursor: pointer">
                  查看图片
                  <el-image
                    class="previewImg"
                    :src="item.completeImages[0]"
                    :preview-src-list="item.completeImages"
                  >
                  </el-image>
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">有效单量</div>
                <div class="value">
                  {{ item.validOrderNum ? item.validOrderNum : 1 }}单
                </div>
              </div>
              <div class="mainOrderInfo_item" v-if="item.repairComment">
                <div class="label">企业评分:</div>
                <div class="value">
                  {{
                    item.repairComment.comprehensiveScore == 2
                      ? "太赞了"
                      : item.repairComment.comprehensiveScore == 0
                      ? "一般般"
                      : "很糟糕"
                  }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.repairComment && item.repairComment.content"
              >
                <div class="label"></div>
                <div class="value">
                  {{ item.repairComment.content }}
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.repairComment && item.repairComment.labels"
              >
                <div class="label"></div>
                <div class="value">
                  <el-tag
                    style="margin-right: 15px"
                    v-for="tag in item.repairComment.labels"
                    :type="
                      item.repairComment.comprehensiveScore == 2
                        ? ''
                        : item.repairComment.comprehensiveScore == 0
                        ? 'info'
                        : 'danger'
                    "
                    :key="tag"
                    >{{ tag }}</el-tag
                  >
                </div>
              </div>
              <!-- 空行 -->
              <div class="mainOrderInfo_item"></div>

              <!-- 故障项 -->
              <div class="mainOrderInfo_item" style="align-items: center">
                <div class="label">故障项目</div>
                <div class="value">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="
                      openAddFaultDialog(
                        item.orderSn,
                        item.isDateAfter20250301Val
                      )
                    "
                  >
                    新增故障项目
                  </el-button>
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label"></div>
                <div class="value">
                  <el-table
                    :data="item.faults"
                    style="width: 60vw"
                    border
                    :key="Math.random()"
                    :cell-style="{ fontSize: '12px' }"
                    :header-row-style="{ fontSize: '12px' }"
                  >
                    <el-table-column
                      label="故障编码"
                      prop="code"
                      align="center"
                      width="70"
                    >
                    </el-table-column>
                    <el-table-column width="70" label="机床类型" align="center">
                      <template slot-scope="{ row }">
                        {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      width="110"
                      label="故障部位"
                      prop="position"
                      align="center"
                    >
                    </el-table-column>
                    <el-table-column label="故障描述" align="center">
                      <template slot-scope="{ row }">
                        <div>{{ row.simpleDesc }}</div>
                        <div v-if="row.previousMasterFlag" style="color: red">
                          (前师傅转移)
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="区间浮动价"
                      align="center"
                      width="90"
                      v-if="item.isDateAfter20250301Val"
                      key="区间浮动价"
                    >
                      <template slot-scope="{ row }">
                        {{ row.generalAmount + "~" + row.annualAmount }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="师傅提交价格"
                      width="100"
                      align="center"
                      v-if="item.isDateAfter20250301Val"
                      key="师傅提交价格"
                    >
                      <template slot-scope="{ row }">
                        {{
                          row.masterConsultAmount ? row.masterConsultAmount : 0
                        }}
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="师傅价格"
                      width="100"
                      align="center"
                      key="师傅价格"
                      v-if="!item.isDateAfter20250301Val"
                    >
                      <template slot-scope="{ row }">
                        {{ row.masterAmount ? row.masterAmount : "0" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="年保企业价格"
                      width="100"
                      align="center"
                      key="年保企业价格"
                      v-if="
                        orderDetail.orderType != 1 &&
                        !item.isDateAfter20250301Val
                      "
                    >
                      <template slot-scope="{ row }">
                        {{ row.annualAmount }}
                      </template>
                    </el-table-column>
                    <el-table-
                      width="100"
                      label="散单企业价格"
                      align="center"
                      key="散单企业价格"
                      v-if="
                        orderDetail.orderType == 1 &&
                        !item.isDateAfter20250301Val
                      "
                    >
                      <template slot-scope="{ row }">
                        {{ row.generalAmount }}
                      </template>
                    </el-table->
                    <el-table-column
                      width="100"
                      label="师傅协商价格"
                      align="center"
                      key="师傅协商价格"
                      v-if="!item.isDateAfter20250301Val"
                    >
                      <template slot-scope="{ row }">
                        {{
                          row.masterConsultAmount ? row.masterConsultAmount : 0
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      width="100"
                      label="企业协商价格"
                      align="center"
                      key="企业协商价格"
                      v-if="!item.isDateAfter20250301Val"
                    >
                      <template slot-scope="{ row }">
                        {{
                          row.enterpriseConsultAmount
                            ? row.enterpriseConsultAmount
                            : 0
                        }}
                      </template>
                    </el-table-column>

                    <el-table-column width="80" label="故障视频" align="center">
                      <template slot-scope="{ row }">
                        <el-button
                          v-if="row.image && row.image[1]"
                          size="small"
                          type="text"
                          @click="goToVideoUrl(row.image[1])"
                          >查看视频</el-button
                        >
                        <div v-else>无</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      width="100"
                      label="故障图片"
                      align="center"
                    >
                      <template slot-scope="{ row }">
                        <el-image
                          v-if="row.image && row.image[0]"
                          style="width: 40px; height: 40px; margin-right: 20px"
                          :src="row.image[0]"
                          :preview-src-list="[row.image[0]]"
                        ></el-image>
                        <div v-else>无</div>
                      </template>
                    </el-table-column>
                    <el-table-column width="150" label="操作" align="center">
                      <template slot-scope="{ row }">
                        <el-button
                          type="text"
                          @click="
                            openExamineFaultsDialog(
                              row,
                              item.orderSn,
                              item.isDateAfter20250301Val
                            )
                          "
                          >修改</el-button
                        >
                        <el-button
                          type="text"
                          @click="delSolvePlan(row, item.orderSn)"
                          >删除</el-button
                        >
                        <el-button
                          v-if="
                            index !==
                              orderDetail.enrollRepairOrderOutList.length - 1 &&
                            (row.transFlag != 1 || !row.transFlag)
                          "
                          type="text"
                          @click="transferOrderFaultItem(row, item.orderSn)"
                        >
                          转故障项
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 故障项 -->
              <div class="mainOrderInfo_item" style="align-items: center">
                <div class="label">配件明细</div>
                <div class="value">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="openAddEditPart(null, null, item, index)"
                  >
                    新增配件
                  </el-button>
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label"></div>
                <div class="value">
                  <el-table
                    :data="item.parts"
                    style="width: 60vw"
                    border
                    :key="Math.random()"
                    :cell-style="{ fontSize: '12px' }"
                    :header-row-style="{ fontSize: '12px' }"
                  >
                    <el-table-column
                      align="center"
                      prop="name"
                      label="配件图片"
                      width="80"
                    >
                      <template slot-scope="{ row }">
                        <div v-if="row.image">
                          <el-image
                            style="width: 40px; height: 40px"
                            :src="row.image && row.image.split(',')[0]"
                            :preview-src-list="
                              row.image && row.image.split(',')
                            "
                          ></el-image>
                          <div
                            v-if="row.image && row.image.split(',').length > 1"
                            style="font-weight: 700; color: #999"
                          >
                            有多张图片
                          </div>
                        </div>
                        <div v-else>无</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="name"
                      label="配件模式"
                      width="80"
                    >
                      <template slot-scope="{ row }">
                        {{ row.model == 1 ? "外发维修" : "采买新件" }}
                      </template>
                    </el-table-column>
                    <el-table-column width="80" label="采买角色" align="center">
                      <template slot-scope="{ row }">
                        <img
                          src="@/assets/logo/masterPurchase.png"
                          width="28px"
                          v-if="row.type !== 2"
                        />
                        <img
                          src="@/assets/logo/platformPurchase.png"
                          width="28px"
                          v-if="row.type === 2"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="配件名称">
                      <template slot-scope="{ row }">
                        <div>{{ row.name }}</div>
                        <div v-if="row.isReturn" style="color: red">
                          (金蝶已退货)
                        </div>
                        <div v-if="!row.index" style="color: red">
                          (前师傅转移)
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="配件品牌">
                      <template slot-scope="{ row }">
                        <div
                          :class="[
                            row.type === 1 && !row.brandId
                              ? 'inquireBrandNone'
                              : '',
                          ]"
                        >
                          {{ row.brand }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="parameter"
                      label="配件参数"
                    >
                    </el-table-column>
                    <el-table-column align="center" label="供应商">
                      <template slot-scope="{ row }">
                        {{ row.supplierName ? row.supplierName : "无" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="预计到达时间"
                      width="140"
                    >
                      <template slot-scope="{ row }">
                        <div v-if="row.type === 2 && !row.arriveFlag">
                          <el-button
                            type="text"
                            @click="openPartsTimeDialog(row, item.orderSn)"
                            >{{
                              row.estimateArriveData
                                ? row.estimateArriveData
                                : "选择时间"
                            }}</el-button
                          >
                        </div>
                        <div v-else-if="row.type === 2 && row.arriveFlag">
                          {{ row.estimateArriveData }}
                        </div>
                        <div v-else>无</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="到达状态"
                      width="120"
                    >
                      <template slot-scope="{ row }">
                        <div v-if="row.type === 2 && !row.arriveFlag">
                          <el-button
                            type="text"
                            @click="markArrivedFn(row, item.orderSn)"
                            >标记到达</el-button
                          >
                        </div>
                        <div v-else-if="row.type === 2 && row.arriveFlag">
                          已到达
                        </div>
                        <div v-else>无</div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="总金额" width="120">
                      <template slot-scope="{ row }">
                        <div>
                          <span>{{ row.num }}*{{ row.price }}元 = </span
                          ><span style="color: red"
                            >{{ row.totalMoney }}元</span
                          >
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="remarks" label="备注">
                      <template slot-scope="{ row }">
                        {{ row.remarks ? row.remarks : "无" }}
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="{ row, $index }">
                        <el-button
                          v-if="row.index"
                          type="text"
                          @click="openAddEditPart(row, $index, item)"
                          >修改</el-button
                        >
                        <el-button
                          type="text"
                          @click="delPartsList(row, item.orderSn)"
                          >删除</el-button
                        >
                        <el-button
                          type="text"
                          v-if="
                            (row.type == 2 &&
                              orderDetail.enterpriseSubStatus > 2202) ||
                            (orderDetail.enterpriseSubStatus > 2202 &&
                              row.model == 2 &&
                              row.type == 2)
                          "
                          @click="
                            goToLogisticsDetails(
                              row.id,
                              row.model,
                              item.orderSn
                            )
                          "
                          >物流详情</el-button
                        >
                        <!-- v-if="row.status == 1 && row.model == 1" -->
                        <el-button
                          v-if="row.type === 2"
                          type="text"
                          @click="openSetLogistics(row, item.orderSn)"
                        >
                          选供应商
                        </el-button>
                        <el-button
                          v-if="
                            !row.isReturn &&
                            index !==
                              orderDetail.enrollRepairOrderOutList.length - 1 &&
                            row.transFlag != 1 &&
                            row.saleOrderId
                          "
                          type="text"
                          @click="transferPartProduct(row, item.orderSn)"
                        >
                          转配件
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 空行 -->
              <div class="mainOrderInfo_item"></div>
              <div
                class="mainOrderInfo_item"
                v-if="!(item.consultAmount || item.consultAmount == 0)"
                style="font-weight: 700"
              >
                <div class="label">师傅应收</div>
                <div class="value" style="font-weight: 700">
                  <span>{{ item.totalAmount ? item.totalAmount : 0 }}元 </span>
                  <!-- <span
                    v-if="orderDetail.label != '普通'"
                    style="
                      font-weight: 400;
                      font-size: 12px;
                      color: red;
                      margin-left: 8px;
                    "
                  >
                    师傅人工费固定为{{
                      orderDetail.label == "199" ? 100 : 200
                    }}元,不扣除质保金及平台抽成</span
                  > -->
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.consultAmount || item.consultAmount == 0"
                style="font-weight: 700"
              >
                <div class="label">最终协商金额</div>
                <div class="value" style="font-weight: 700">
                  {{ item.consultAmount ? item.consultAmount : 0 }}元
                </div>
              </div>
              <div class="mainOrderInfo_item" v-if="item.consultAmount == null">
                <div class="label">人工费</div>
                <div class="value">
                  {{
                    Number(
                      (
                        item.doorAmount -
                        item.retentionMoney -
                        item.serviceAmount
                      ).toFixed(2)
                    )
                  }}元 (原人工费：{{ item.doorAmount ? item.doorAmount : 0 }}元)
                </div>
              </div>

              <div class="mainOrderInfo_item">
                <div class="label">配件费</div>
                <div class="value">
                  {{ item.partsAmount ? item.partsAmount : 0 }}元
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.consultAmount || item.consultAmount == 0"
              >
                <div class="label">协商原人工费</div>
                <div class="value">
                  {{ item.consultDoorAmount ? item.consultDoorAmount : 0 }}元
                </div>
              </div>
              <div v-if="item.subStatus >= 3201">
                <div class="mainOrderInfo_item">
                  <div class="label">
                    质保金<span v-if="item.subStatus <= 3203">预</span>扣款
                  </div>
                  <div class="value">
                    <span style="color: red">
                      {{
                        item.retentionMoney ? item.retentionMoney : 0
                      }}元</span
                    >
                    <span v-if="!item.consultAmount"> (原人工费 * 10%)</span>
                  </div>
                </div>
                <div class="mainOrderInfo_item">
                  <div class="label">
                    平台<span v-if="item.subStatus <= 3203">预</span>抽成
                  </div>
                  <div class="value">
                    <span style="color: red">
                      {{ item.serviceAmount ? item.serviceAmount : 0 }}元</span
                    >
                    <span v-if="!item.consultAmount"> (原人工费 * 25%)</span>
                  </div>
                </div>
              </div>
              <div
                class="mainOrderInfo_item"
                v-if="item.consultAmount || item.consultAmount == 0"
              >
                <div class="label">备注</div>
                <div class="value">
                  <span> {{ item.consultRemarks }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="operationBtnList">
              <el-button
                size="mini"
                type="primary"
                v-if="item.remindStarted == 0 && item.subStatus == 3201"
                @click="openRemindStartedDialog(item.orderSn)"
              >
                代师傅开始出发
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="
                  !item.punchImages &&
                  item.subStatus == 3201 &&
                  item.remindStarted == 1
                "
                @click="openHandlePhotographPunchDialog(item.orderSn)"
              >
                代师傅拍照打卡
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3201 && item.punchImages"
                @click="handleMasterQuotation(item.orderSn)"
              >
                代师傅检测报价
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3203"
                @click="handleProxyConfirmQuotation(item.orderSn)"
              >
                代企业确认师傅报价
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3204"
                @click="handleStartService(item.orderSn)"
              >
                代师傅开始服务
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3301"
                @click="openSubmitAcceptanceDialog(item.orderSn)"
              >
                代师傅提交验收
              </el-button>
              <el-button
                size="mini"
                type="warning"
                v-if="item.subStatus == 3401"
                @click="rejectOrderCheck(item.orderSn)"
              >
                驳回师傅验收申请
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3401"
                @click="handleEnterpriseCheck(item.orderSn)"
              >
                代企业确认验收
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus == 3501"
                @click="handleProxyPayment(item.orderSn)"
              >
                标记企业付款
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="
                  orderDetail.enterpriseSubStatus == 2601 &&
                  orderDetail.enrollRepairOrderOutList.length == index + 1
                "
                @click="openEnterpriseEvaluateDialog(item.orderSn)"
              >
                代企业评价
              </el-button>
              <el-button
                size="mini"
                type="primary"
                v-if="item.subStatus >= 3301"
                @click="handleOnlineOrder(orderDetail.orderSn)"
              >
                生成线上工单
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="sumbitQuotation(item.orderSn)"
                v-if="['3202'].includes(item.subStatus)"
                >确认报价</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="goAssignedMasterPage"
                v-if="
                  (orderDetail.enterpriseSubStatus == 2001 ||
                    orderDetail.enterpriseSubStatus == 2101 ||
                    item.consultDoorAmount != null) &&
                  orderDetail.enrollRepairOrderOutList.length == index + 1
                "
              >
                指派师傅
              </el-button>
              <el-button
                v-if="item.subStatus <= 3502"
                type="primary"
                size="mini"
                @click="
                  openConsultPriceDialog(
                    item.orderSn,
                    item.doorAmount,
                    item.consultRemarks,
                    item.consultDoorAmount,
                    item.masterTypeName
                  )
                "
                >协商人工费</el-button
              >
              <el-button
                v-if="
                  orderDetail.enterpriseMainStatus > -1 &&
                  orderDetail.enterpriseMainStatus <= 4
                "
                type="primary"
                size="mini"
                @click="clickCancelOrderDialog"
                >取消订单</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-if="
                  item.subStatus >= 3401 &&
                  (item.dataExamineStatus == 1 || item.dataExamineStatus == 0)
                "
                @click="openReviewDescDialog(item.orderSn)"
              >
                审核描述/过程
              </el-button>
              <el-button
                v-if="item.subStatus >= 3502 && name == '管理员'"
                type="danger"
                size="mini"
                @click="handleOrderRefund(orderDetail.orderSn)"
                >订单退款</el-button
              >
              <el-button
                size="mini"
                type="danger"
                v-if="
                  orderDetail.timeoutFlag != 2301 &&
                  item.subStatus == 3301 &&
                  orderDetail.enrollRepairOrderOutList.length == index + 1
                "
                @click="
                  handleMasterOrderServiceTimeout(item.orderSn, item.realName)
                "
              >
                标记服务超时
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleMarkValidOrder(item.orderSn)"
              >
                标记师傅有效单
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="openMarkRepairOrderDialog(orderDetail.orderSn)"
                v-if="!orderDetail.orderSn.includes('-F-')"
              >
                标记返修单
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="openComplaintDialog(item)"
                v-if="item.subStatus > 3201"
              >
                投诉
              </el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="全流程跟踪" name="全流程跟踪">
            <div style="padding: 20px">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in orderDetail.orderNodeOutList"
                  :key="index"
                  :timestamp="item.createTime"
                >
                  <div>
                    <span style="color: #409eff">{{ item.personnel }}</span>
                    {{ item.node }}
                  </div>
                  <div style="margin: 5px 0 10px">
                    {{ item.simpleDesc }}
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <!-- 操作按钮 -->
            <div class="operationBtnList">
              <el-button
                size="mini"
                type="primary"
                @click="goAssignedMasterPage"
                v-if="
                  orderDetail.enterpriseSubStatus == 2001 ||
                  orderDetail.enterpriseSubStatus == 2101
                "
              >
                指派师傅
              </el-button>
              <el-button
                v-if="
                  orderDetail.enterpriseMainStatus > -1 &&
                  orderDetail.enterpriseMainStatus <= 4
                "
                type="primary"
                size="mini"
                @click="clickCancelOrderDialog"
                >取消订单</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 空行 -->
    <div style="height: 50px"></div>

    <!-- 单方议价 -->
    <el-dialog
      width="30%"
      center
      title="单方议价"
      :close-on-click-modal="false"
      :visible="singlePartyNegotiationPriceVisible"
      :before-close="closeSinglePartyNegotiationDialog"
    >
      <div class="consultPriceDialog">
        <!--  
          :rules="consultCostRules"
          ref="consultCostForm" -->
        <el-form
          :model="handleEnterpriseNegotiatedPriceParams"
          label-position="left"
          label-width="120px"
        >
          <el-form-item label="企业原人工费" prop="amount">
            {{ orderDetail.doorAmount }}
          </el-form-item>
          <el-form-item label="企业现人工费" prop="amount">
            <el-input
              type="number"
              placeholder="请输入企业现人工费"
              @input="blurAmount"
              v-model.number="handleEnterpriseNegotiatedPriceParams.doorAmount"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSinglePartyNegotiationDialog">取 消</el-button>
        <el-button type="primary" @click="handleEnterpriseNegotiatedPrice"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 审核描述/过程 -->
    <el-dialog
      title="审核描述/过程"
      width="30%"
      :visible="reviewDescVisible"
      :before-close="closeReviewDescDialog"
      :close-on-click-modal="false"
      center
    >
      <el-form
        label-width="120px"
        label-position="left"
        :model="examineMasterOrderDataParmas"
        :rules="examineMasterOrderDataRules"
        ref="examineMasterOrderDataRef"
      >
        <el-form-item label="审核状态" prop="status">
          <el-radio-group
            v-model="examineMasterOrderDataParmas.status"
            @change="changeStatus"
          >
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="常用驳回语"
          prop="rejectionDesc"
          v-if="examineMasterOrderDataParmas.status == 3"
        >
          <el-radio-group v-model="examineMasterOrderDataParmas.rejectionDesc">
            <el-radio label="现场故障描述驳回"></el-radio>
            <el-radio label="处理过程驳回"></el-radio>
            <el-radio label="两者驳回"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="备注"
          v-if="examineMasterOrderDataParmas.status == 3"
        >
          <el-input
            type="textarea"
            v-model="examineMasterOrderDataParmas.result"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReviewDescDialog">取 消</el-button>
        <el-button type="primary" @click="examineMasterOrderData"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增故障项目 -->
    <el-dialog
      title="新增故障项目"
      width="50%"
      :visible="addFaultVisible"
      :close-on-click-modal="false"
      :before-close="closeAddFaultDialog"
      center
    >
      <div class="addFaultDialog">
        <!-- 搜索框 -->
        <div class="searchBox">
          <el-input
            class="searchInp"
            v-model="queryFaultItemsParams.query"
            placeholder="请填写故障描述"
          ></el-input>
          <el-button type="primary" @click="searchFaultList">搜索</el-button>
        </div>
        <!-- 列表 -->
        <div class="tabelBox">
          <el-table
            ref="faultTable"
            :data="faultItemList"
            border
            highlight-current-row
            @current-change="chooseFaultItem"
          >
            <el-table-column label="故障编码" prop="code" align="center">
            </el-table-column>
            <el-table-column label="机床类型" align="center">
              <template slot-scope="{ row }">
                {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
              </template>
            </el-table-column>
            <el-table-column label="项目部位" prop="position" align="center">
            </el-table-column>
            <el-table-column label="项目描述" prop="simpleDesc" align="center">
            </el-table-column>
            <el-table-column
              label="区间浮动价"
              align="center"
              v-if="chooseFaultItemVal.isDateAfter20250301Val"
            >
              <template slot-scope="{ row }">
                {{ row.generalAmount + "~" + row.annualAmount }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="paginationBox">
          <el-pagination
            @current-change="changeFaultDialogPage"
            :current-page="queryFaultItemsParams.pageNo"
            background
            :total="faultItemTotal"
            layout="prev, pager, next"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddFaultDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAddFault">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改故障项目 -->
    <el-dialog
      title="修改故障项目"
      width="40%"
      :before-close="closeExamineFaultsDialog"
      :visible="examineFaults"
      :close-on-click-modal="false"
    >
      <el-form label-position="left" label-width="120px">
        <el-form-item label="故障描述">
          <el-input
            placeholder="请输入故障描述"
            v-model="examineFaultsForm.simpleDesc"
          ></el-input>
        </el-form-item>
        <!-- 3月19之前 -->
        <el-form-item
          label="师傅展示价格"
          v-if="!examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入师傅展示价格"
            type="number"
            @mousewheel.native.prevent
            disabled
            v-model="examineFaultsForm.masterAmount"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="年保企业价格"
          v-if="!examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入年保企业价格"
            type="number"
            disabled
            @mousewheel.native.prevent
            v-model="examineFaultsForm.annualAmount"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="散单企业价格"
          v-if="!examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入散单企业价格"
            type="number"
            disabled
            @mousewheel.native.prevent
            v-model="examineFaultsForm.generalAmount"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="师傅协商价格"
          v-if="!examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入师傅协商价格"
            type="number"
            @mousewheel.native.prevent
            v-model="examineFaultsForm.masterConsultAmount"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="企业协商价格"
          v-if="!examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入企业协商价格"
            type="number"
            @input="changeEnterpriseConsultAmount"
            v-model="examineFaultsForm.enterpriseConsultAmount"
          ></el-input>
        </el-form-item>
        <!-- 3月19之后 -->
        <el-form-item
          label="区间浮动价"
          v-if="examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入区间浮动价"
            disabled
            v-model="examineFaultsForm.intervalPrice"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="师傅提交价格"
          v-if="examineFaultsForm.isDateAfter20250301Val"
        >
          <el-input
            placeholder="请输入师傅提交价格"
            type="number"
            @mousewheel.native.prevent
            v-model="examineFaultsForm.masterConsultAmount"
          ></el-input>
        </el-form-item>

        <el-form-item label="故障视频">
          <div style="display: flex">
            <div
              v-if="
                examineFaultsFormVideoList &&
                examineFaultsFormVideoList[0] &&
                examineFaultsFormVideoList[0].url
              "
            >
              <el-button
                size="small"
                type="text"
                style="margin-left: 30px"
                @click="goToVideoUrl(examineFaultsFormVideoList[0].url)"
                >查看视频</el-button
              >
              <el-button
                size="small"
                type="text"
                style="margin-left: 30px"
                @click="delExamineFaultsFormVideo"
                >删除视频</el-button
              >
            </div>
            <el-upload
              class="upload-demo"
              action="#"
              :limit="1"
              :http-request="uploadExamineFaultsFormVideoList"
              :file-list="examineFaultsFormVideoList"
              :show-file-list="false"
              v-else
            >
              <el-button type="text">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="故障图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="examineFaultsFormPicList"
            :limit="1"
            :on-remove="delExamineFaultsFormPicList"
            :http-request="uploadExamineFaultsFormPicList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExamineFaultsDialog">取 消</el-button>
        <el-button @click="comfirmExamineFaults" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 新增修改配件框 -->
    <el-dialog
      :title="addEditPartTitle"
      width="35%"
      top="5vh"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible="addEditPartDialogShow"
      :before-close="closeAddEditPart"
    >
      <div style="width: 100%; height: 70vh; overflow: auto">
        <el-form
          label-position="left"
          label-width="80px"
          :model="partInfo"
          :rules="partInfoRules"
          ref="partInfoRuleForm"
        >
          <el-form-item label="配件模式" prop="model">
            <el-radio-group v-model="partInfo.model" @input="changeModel">
              <el-radio :label="1">外发维修</el-radio>
              <el-radio :label="2">采买新件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="采买角色" prop="type" @input="changeType">
            <el-radio-group v-model="partInfo.type">
              <el-radio :label="1">师傅自费</el-radio>
              <el-radio :label="2">平台购买</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="配件来源">
            <el-radio-group
              v-model="partInfo.stashPartsWay"
              @input="changeStashPartsWay"
            >
              <el-radio :label="1">新增配件</el-radio>
              <el-radio :label="2">仓库搜索</el-radio>
              <el-button
                v-if="partInfo.stashPartsWay == 2"
                size="mini"
                icon="el-icon-search"
                @click="openWarehouseSearch"
              >
              </el-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="物料编码" v-if="partInfo.stashPartsWay == 2">
            <el-input
              v-model="partInfo.number"
              :disabled="partInfo.stashPartsWay == 2"
              placeholder="请输入物料编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件名称" prop="name">
            <el-input
              v-model="partInfo.name"
              :disabled="partInfo.stashPartsWay == 2"
              placeholder="请输入配件名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件品牌" prop="brand">
            <el-input
              v-model="partInfo.brand"
              :disabled="partInfo.stashPartsWay == 2"
              placeholder="请输入配件品牌"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件参数" prop="parameter">
            <el-input
              v-model="partInfo.parameter"
              :disabled="partInfo.stashPartsWay == 2"
              placeholder="请输入配件参数"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件单价" prop="price">
            <el-input
              type="number"
              v-model="partInfo.price"
              placeholder="请输入配件单价"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件数量">
            <el-input-number
              v-model.number="partInfo.num"
              :min="1"
              :max="999"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="partInfo.remarks"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件图片">
            <div class="hiddenUploadBox">
              <el-upload
                action="#"
                list-type="picture-card"
                :http-request="uploadPartImg"
                :file-list="uploadPartImgList"
                :on-remove="delUploadPartImg"
                :multiple="true"
                :limit="3"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEditPart">取 消</el-button>
        <el-button type="primary" @click="confirmAddEditPart">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 仓库搜索配件框 -->
    <el-dialog
      title="仓库搜索"
      width="30%"
      top="5vh"
      :before-close="closeWarehouseSearch"
      :visible="warehouseSearchDialogShow"
      :close-on-click-modal="false"
    >
      <div class="warehouseSearchDialog">
        <div class="warehouseSearchDialogTop">
          <el-input
            v-model="queryJdProductListParams.query"
            class="warehouseSearchDialogTopInput"
            placeholder="输入配件名称"
          ></el-input>
          <el-button @click="queryJdProductList">搜索</el-button>
        </div>
        <div class="warehouseSearchDialogList">
          <el-radio-group v-model="choosePartIndex">
            <el-radio
              v-for="(item, index) in jdProductList"
              :key="index"
              style="display: flex; align-items: center; padding: 8px"
              :label="index"
            >
              <p>商品名称:{{ item.name }}({{ item.number }})</p>
              <p style="margin: 5px 0">商品品牌:{{ item.brandName }}</p>
              <p>商品型号:{{ item.model }}</p>
              <p style="margin: 5px 0">库存:{{ item.num }}</p>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeWarehouseSearch">取 消</el-button>
        <el-button type="primary" @click="comfirmWarehousePart"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 代师傅开始出发 -->
    <el-dialog
      title="代师傅开始出发"
      width="40%"
      center
      :visible="remindStartedDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeRemindStartedDialog"
    >
      <div>
        <el-form
          :model="handleRemindStartedParams"
          :rules="handleRemindStartedParamsRules"
          ref="handleRemindStartedParamsRef"
        >
          <el-form-item label="出发时间" prop="punchTime">
            <el-date-picker
              v-model="handleRemindStartedParams.punchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择出发时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRemindStartedDialog"> 取 消</el-button>
        <el-button type="primary" @click="handleRemindStarted">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 代师傅拍照打卡 -->
    <el-dialog
      title="代师傅拍照打卡"
      width="40%"
      center
      :visible="photographPunchDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeHandlePhotographPunchDialog"
    >
      <div>
        <el-form
          :model="handlePhotographPunchParams"
          :rules="handlePhotographPunchParamsRules"
          ref="handlePhotographPunchParamsRef"
        >
          <el-form-item label="打卡时间" prop="punchTime">
            <el-date-picker
              v-model="handlePhotographPunchParams.punchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择打卡时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="打卡照片" prop="punchImages">
            <el-upload
              :file-list="punchImagesList"
              ref="uploadPunchImagesRef"
              :http-request="uploadPunchImages"
              :on-remove="delPunchImages"
              :limit="1"
              action="#"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeHandlePhotographPunchDialog">取 消</el-button>
        <el-button type="primary" @click="handlePhotographPunch"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 代师傅提交验收 -->
    <el-dialog
      title="代师傅提交验收"
      width="40%"
      center
      :visible="submitAcceptanceDialogVisible"
      :close-on-click-modal="false"
      :before-close="closeSubmitAcceptanceDialog"
    >
      <div>
        <el-form
          :model="handleSubmitAcceptanceParams"
          :rules="handleSubmitAcceptanceParamsRules"
          ref="handleSubmitAcceptanceParamsRef"
        >
          <el-form-item label="验收时间" prop="time">
            <el-date-picker
              v-model="handleSubmitAcceptanceParams.time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择验收时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="完工照片" prop="completeImages">
            <div>
              <el-upload
                :file-list="completeImagesList"
                ref="uploadCompleteImagesRef"
                :http-request="uploadCompleteImages"
                :on-remove="delCompleteImages"
                :multiple="true"
                :limit="6"
                action="#"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSubmitAcceptanceDialog"> 取 消</el-button>
        <el-button type="primary" @click="handleSubmitAcceptance"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 协商人工费 -->
    <el-dialog
      width="40%"
      center
      :visible="consultPriceVisible"
      :close-on-click-modal="false"
      :before-close="closeConsultPriceDialog"
    >
      <div slot="title" style="font-size: 18px; padding-top: 10px">
        协商人工费<span style="color: red"
          >(需要重新指派师傅才可使用该功能)</span
        >
      </div>
      <div class="consultPriceDialog">
        <el-form
          :model="consultCostParams"
          :rules="consultCostRules"
          ref="consultCostForm"
          label-position="left"
          label-width="120px"
        >
          <!-- <el-form-item label="是否纳入折扣" prop="flag">
            <el-radio-group v-model="consultCostParams.flag">
              <el-radio :label="0">不纳入</el-radio>
              <el-radio :label="1">纳入</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="协商原人工费" prop="amount">
            <el-input
              type="number"
              v-model.number="consultCostParams.amount"
              placeholder="请输入协商原人工费"
              @input="blurAmount"
            ></el-input>
          </el-form-item>
          <el-form-item label="协商平台抽成" prop="serviceAmount">
            <el-input
              v-model.number="consultCostParams.serviceAmount"
              type="number"
              placeholder="请输入协商的平台抽成"
            ></el-input>
          </el-form-item>
          <el-form-item label="协商质保金" prop="retentionMoney">
            <el-input
              type="number"
              :disabled="masterTypeNameChoose == '全职'"
              v-model.number="consultCostParams.retentionMoney"
              placeholder="请输入协商质保金"
            ></el-input>
          </el-form-item>
          <el-form-item label="到手人工费">
            <el-input
              type="number"
              disabled
              v-model.number="laborCostTxt"
              placeholder="自动计算"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input
              v-model="consultCostParams.remarks"
              placeholder="请输入想备注的内容"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeConsultPriceDialog">取 消</el-button>
        <el-button type="primary" @click="confirmConsultPrice">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 填写配件到达时间 -->
    <el-dialog
      title="配件到达时间"
      width="40%"
      center
      :visible="partsTimeDialogVisible"
      :before-close="closePartsTimeDialog"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :rules="handlePartsTimeParamsRules"
          ref="handlePartsTimeParamsRef"
          :model="handlePartsTimeParams"
        >
          <el-form-item label="到达时间" prop="estimateArriveData">
            <el-date-picker
              @change="changeEstimateArriveData"
              v-model="estimateArriveDataCopy"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择到达时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePartsTimeDialog"> 取 消</el-button>
        <el-button type="primary" @click="handlePartProductArriveInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 取消订单的原因弹窗 -->
    <el-dialog width="50%" :before-close="closecancelOrderDialog">
      <div style="text-align: center; padding: 0 70px">
        <div style="color: #707070; font-size: 20px; font-weight: 700">
          取消说明
        </div>
        <el-input
          type="textarea"
          resize="none"
          :rows="10"
          v-model="delOrderinpValue"
          style="margin-top: 20px"
          placeholder="请输入取消订单的原因"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          style="width: 150px; background-color: #ffffff; color: #2e4c9e"
          @click="closecancelOrderDialog"
          >取 消</el-button
        >
        <el-button
          style="width: 150px; background-color: #2e4c9e"
          type="primary"
          @click="_cancelRepairOrder"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 备注 ＋ 标签 -->
    <el-dialog
      title="备注"
      width="30%"
      :before-close="closecancelOrderDialog"
      :visible="cancelOrderDialog"
      :close-on-click-modal="false"
    >
      <div class="auditDialog">
        <el-form label-width="80px">
          <el-form-item
            label="标签:"
            v-if="orderCancelTag && orderCancelTag.length > 0"
          >
            <el-button
              :type="index == chooseOrderCancelTagNum ? 'primary' : ''"
              size="small"
              @click="changeOrderCancelTag(index)"
              v-for="(item, index) in orderCancelTag"
              :key="item"
              >{{ item }}</el-button
            >
          </el-form-item>
          <el-form-item label="自定义:">
            <el-input
              v-model="delOrderinpValue"
              type="textarea"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:" v-if="orderCancelRemark">
            {{ orderCancelRemark }}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closecancelOrderDialog">取 消</el-button>
        <el-button type="primary" @click="_cancelRepairOrder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 投诉弹窗 -->
    <el-dialog
      :visible="complaintDialogVisible"
      width="50%"
      :before-close="closeComplaintDialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: center; padding: 0 70px">
        <div style="color: #707070; font-size: 20px; font-weight: 700">
          投诉师傅【{{ complaintWorkerName }}】
        </div>
        <el-input
          type="textarea"
          resize="none"
          :rows="10"
          v-model="saveRepairOrderComplaintParams.content"
          style="margin-top: 20px"
          placeholder="请输入投诉该师傅的原因"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          style="width: 150px; background-color: #ffffff; color: #2e4c9e"
          @click="closeComplaintDialog"
          >取 消</el-button
        >
        <el-button
          style="width: 150px; background-color: #2e4c9e"
          @click="saveRepairOrderComplaint"
          type="primary"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 物流设置 -->
    <el-dialog
      title="选择供应商"
      width="40%"
      top="5vh"
      :visible="setLogisticsDialogShow"
    >
      <div class="setLogisticsDialog">
        <div class="setLogisticsDialogSearch">
          <el-input
            style="margin-right: 20px"
            placeholder="输入供应商名字搜索"
            v-model="supplierInfoListParams.query"
          ></el-input>
          <el-button type="primary" @click="searchMaintenanceSupplierInfo"
            >搜索</el-button
          >
        </div>
        <div class="supplierList">
          <el-radio-group
            v-model="setLogisticsData.supplierName"
            @change="changeSupplier"
          >
            <el-radio
              v-for="(item, index) in supplierList"
              :key="index"
              style="display: flex; align-items: center; padding: 8px"
              :label="item.supplierName"
            >
              <div>供应商名称:{{ item.supplierName }}</div>
              <div style="margin: 5px 0">地址 :{{ item.supplierAddress }}</div>
              <div>范围:{{ item.businessScope }}</div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="tabelPagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="supplierInfoListTotal"
            :page-size="10"
            :current-page="supplierInfoListParams.pageNo"
            @current-change="changesupplierInfoListPage"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSetLogistics">取 消</el-button>
        <el-button type="primary" @click="confirmSetLogistics">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 标记返修单对话框 -->
    <el-dialog
      width="40%"
      :visible="markRepairOrderDialogShow"
      :close-on-click-modal="false"
      :before-close="closeMarkRepairOrderDialog"
      center
    >
      <div slot="title">
        标记返修单
        <span style="color: red">(该功能需在订单节点[平台审核报价]前操作)</span>
      </div>
      <div class="markRepairOrderDialog">
        <el-form
          ref="markRepairOrderForm"
          :model="handleOrderReworkParams"
          :rules="handleOrderReworkParamsRules"
          label-width="120px"
          label-position="left"
        >
          <el-form-item label="返修原因" prop="reason">
            <el-input
              v-model="handleOrderReworkParams.reason"
              placeholder="请输入返修原因"
            ></el-input>
          </el-form-item>
          <el-form-item label="原企业订单号" prop="sourceRelationOrderSn">
            <el-input
              v-model="handleOrderReworkParams.sourceRelationOrderSn"
              placeholder="请输入原企业订单号"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMarkRepairOrderDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderRework">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 代企业评价 -->
    <el-dialog
      title="代企业评价"
      :visible.sync="evaluateDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      :before-close="closeEnterpriseEvaluateDialog"
      center
    >
      <div class="evaluateDiv">
        <div class="title">师傅评价</div>
        <div
          class="block"
          v-for="item in handleReleaseCommentParams.masterInfoEvaluationGrade"
          :key="item.uid"
        >
          <span class="demonstration">对{{ item.realName }}评价:</span>
          <el-rate
            :max="3"
            show-text
            :texts="['差评', '一般', '好评']"
            v-model="item.evaluationGrade"
          ></el-rate>
        </div>
        <div class="title">订单服务描述</div>
        <div class="block">
          <el-input
            v-model="handleReleaseCommentParams.content"
            type="textarea"
            :rows="3"
            placeholder="请联系客户了解订单情况后进行描述,尽量从多角度评价本服务"
          >
          </el-input>
        </div>
        <div class="title">
          <div>上传图片说明</div>
        </div>
        <div class="block">
          <el-upload
            action="#"
            list-type="picture-card"
            multiple
            :file-list="evaluateImgFileList"
            :http-request="updataEvaluateImg"
            :on-remove="removeEvaluateImg"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEnterpriseEvaluateDialog">取 消</el-button>
        <el-button type="primary" @click="handleReleaseComment"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 质保时间 -->
    <el-dialog
      title="修改质保时间"
      :visible.sync="editWarrantyPeriodVisible"
      width="20%"
      :close-on-click-modal="false"
      before-close="closeEditWarrantyPeriodDialog"
      center
    >
      <el-form
        label-width="80px"
        label-position="left"
        :model="handleOrderWarrantyParmas"
        :rules="handleOrderWarrantyParmasRules"
        ref="handleOrderWarrantyParmasRef"
      >
        <el-form-item label="质保时间" prop="days">
          <el-input
            placeholder="请输入质保时间"
            v-model.number="handleOrderWarrantyParmas.days"
            type="number"
          >
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditWarrantyPeriodDialog">取 消</el-button>
        <el-button type="primary" @click="handleOrderWarranty">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { handleEnterpriseNegotiatedPrice } from "@/api/proxy.js";
import { getRepairOrderDetail } from "@/api/user.js";
import {
  queryFaultItems,
  addOrderFaultItem,
  examineFaultItem,
  deleteOrderFaultItem,
  queryJdProductList,
  editPartProduct,
  transferOrderFaultItem,
  deletePartProduct,
  transferPartProduct,
  examineMasterQuotation,
  consultCost,
  handlePartProductArriveInfo,
  rejectOrderCheck,
  cancelRepairOrder,
  handleOrderRefund,
  queryMaintenanceSupplierInfo,
  fillLogisticsInformation,
  handleOrderRework,
  handleMasterOrderValidOrderNum,
  handleMasterOrderServiceTimeout,
  saveRepairOrderComplaint,
  examineMasterOrderData,
  handleOrderWarranty,
} from "@/api/order.js";
import { UploadImg, getSysLabel } from "@/api/system.js";
import {
  handleRemindStarted,
  handlePhotographPunch,
  handleMasterQuotation,
  handleProxyConfirmQuotation,
  handleStartService,
  handleSubmitAcceptance,
  handleEnterpriseCheck,
  handleOnlineOrder,
  handleProxyPayment,
  handleReleaseComment,
} from "@/api/proxy";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      editWarrantyPeriodVisible: false,
      handleOrderWarrantyParmas: {
        days: null,
        orderSn: null,
      },
      handleOrderWarrantyParmasRules: {
        days: [{ required: true, message: "请输入质保时间", trigger: "blur" }],
      },

      orderCancelTag: [],
      chooseOrderCancelTagNum: null,

      reviewDescVisible: false,
      examineMasterOrderDataParmas: {
        orderSn: null,
        result: null,
        status: null,
        rejectionDesc: null,
      },
      examineMasterOrderDataRules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" },
        ],
        rejectionDesc: [
          { required: true, message: "请选择常用驳回语", trigger: "change" },
        ],
      },

      nodeEnv: null,
      maintenanceOrderDescWidth: null, //大盒子宽度
      orderSn: null,
      orderDetail: null,
      masterOrderTrackList: [], //多个师傅订单轨迹数组
      chooseMaster: 0, // 点击了哪个师傅 回显订单轨迹

      leftTabActiveName: "企业信息",
      rightTabActiveName: "全流程跟踪",

      // 标签类型
      lablelList: [
        {
          value: "普通",
          type: "",
        },
        {
          value: "199",
          type: "success",
        },
        {
          value: "299",
          type: "warning",
        },
      ],

      // 故障项目
      chooseFaultItemVal: {},
      queryFaultItemsParams: {
        pageNo: 1,
        pageSize: 10,
        query: null,
      },
      addFaultVisible: false,
      faultItemTotal: null,
      examineFaults: false,
      examineFaultsForm: {},
      examineFaultsFormVideoList: [],
      examineFaultsFormPicList: [],
      faultItemList: [],

      // 配件
      partInfo: {
        remarks: null,
        stashPartsWay: 1, //默认新增配件
        brand: "",
        brandId: "",
        image: "",
        model: "",
        name: "",
        num: "",
        number: "",
        parameter: "",
        price: "",
        type: "",
        id: "",
        partId: "",
        operationType: "add",
      },
      addEditPartDialogShow: false,
      addEditPartTitle: "新增配件",
      partInfoRules: {
        model: [{ required: true, message: "请选择配件模式", trigger: "blur" }],
        type: [{ required: true, message: "请选择采买角色", trigger: "blur" }],
        name: [{ required: true, message: "请填写配件名称", trigger: "blur" }],
        brand: [{ required: true, message: "请填写配件品牌", trigger: "blur" }],
        parameter: [
          { required: true, message: "请填写配件参数", trigger: "blur" },
        ],
        price: [{ required: true, message: "请填写配件单价", trigger: "blur" }],
      },
      uploadPartImgList: [],
      warehouseSearchDialogShow: false,
      choosePartIndex: null, //选中配件的下标
      jdProductList: [],
      queryJdProductListParams: {
        pageNo: 1,
        pageSize: 100,
        query: "",
      },

      // 代师傅开始出发
      remindStartedDialogVisible: false,
      handleRemindStartedParams: {
        orderSn: null,
        punchTime: null,
      },
      handleRemindStartedParamsRules: {
        punchTime: [
          { required: true, message: "请选择上门时间", trigger: "change" },
        ],
      },
      // 代师傅拍照打卡
      handlePhotographPunchParams: {
        orderSn: null,
        punchImages: null,
        punchTime: null,
      },
      handlePhotographPunchParamsRules: {
        punchImages: [
          { required: true, message: "请上传打卡照片", trigger: "change" },
        ],
        punchTime: [
          { required: true, message: "请选择打卡时间", trigger: "change" },
        ],
      },
      punchImagesList: [],
      photographPunchDialogVisible: false,

      // 代师傅提交验收
      handleSubmitAcceptanceParams: {
        completeImages: "",
        orderSn: "",
        time: "",
      },
      submitAcceptanceDialogVisible: false,
      handleSubmitAcceptanceParamsRules: {
        time: [
          { required: true, message: "请选择验收时间", trigger: "change" },
        ],
        completeImages: [
          { required: true, message: "请上传完工照片", trigger: "change" },
        ],
      },
      completeImagesList: [],

      // 协商价格
      consultPriceVisible: false,
      consultCostParams: {
        orderSn: null,
        amount: null,
        remarks: null,
        retentionMoney: null,
        serviceAmount: null,
        flag: 1,
      },
      consultCostRules: {
        amount: [
          { required: true, message: "请填写协商原人工费", trigger: "blur" },
        ],
        remarks: [{ required: true, message: "请填写备注", trigger: "blur" }],
        retentionMoney: [
          { required: true, message: "请填写协商质保金", trigger: "blur" },
        ],
        serviceAmount: [
          { required: true, message: "请填写协商平台抽成", trigger: "blur" },
        ],
        // flag: [
        //   { required: true, message: "请选择是否纳入折扣", trigger: "change" },
        // ],
      },

      partsTimeDialogVisible: false,
      handlePartsTimeParams: {
        arriveFlag: false,
        estimateArriveData: null,
        id: null,
        orderSn: null,
      },
      estimateArriveDataCopy: null,
      handlePartsTimeParamsRules: {
        estimateArriveData: [
          { required: true, message: "请选择到达时间", trigger: "change" },
        ],
      },

      // 取消订单
      cancelOrderDialog: false,
      delOrderinpValue: null,

      // 投诉
      complaintDialogVisible: false,
      complaintWorkerName: "",

      // 供应商
      setLogisticsDialogShow: false,
      supplierInfoListTotal: null,
      supplierInfoListParams: {
        pageNo: 1,
        pageSize: 10,
        query: "",
      },
      setLogisticsData: {
        supplierId: null,
        supplierName: null,
      },
      supplierList: [],

      // 标记返修单
      markRepairOrderDialogShow: false,
      handleOrderReworkParams: {
        currentRelationOrderSn: null, //现企业订单号
        reason: null, //返修原因
        sourceRelationOrderSn: null, //原企业订单号
      },
      handleOrderReworkParamsRules: {
        reason: [
          { required: true, message: "请输入返修原因", trigger: "blur" },
        ],
        sourceRelationOrderSn: [
          { required: true, message: "请输入原企业订单号", trigger: "blur" },
        ],
      },

      // 投诉
      saveRepairOrderComplaintParams: {
        content: null,
        masterUid: null,
        orderSn: null,
        relationOrderSn: null,
      },

      // 评价
      evaluateDialogVisible: false,
      handleReleaseCommentParams: {
        content: null,
        images: null,
        masterInfoEvaluationGrade: null,
        orderSn: null,
        serviceScore: 0,
      },
      evaluateImgFileList: [],

      masterTypeNameChoose: null,

      // 单反议价
      singlePartyNegotiationPriceVisible: false,
      handleEnterpriseNegotiatedPriceParams: {
        doorAmount: null,
        orderSn: null,
      },
    };
  },
  computed: {
    ...mapGetters(["name"]),
    // 根据当前 label 找到匹配的 labelList 项
    matchedLabelItem() {
      return this.lablelList.find(
        (item) => item.value === this.orderDetail.label
      );
    },
    // 根据 type 返回对应 class
    labelClass() {
      const type = this.matchedLabelItem?.type || "";
      const typeClassMap = {
        success: "label-success",
        warning: "label-warning",
        // 可扩展更多类型
      };
      return typeClassMap[type] || "label-default";
    },
    orderCancelRemark() {
      const str1 = this.orderCancelTag[this.chooseOrderCancelTagNum];
      const str2 = this.delOrderinpValue;
      if (!str1) return str2;
      if (!str2) return str1;
      return `${str1},${str2}`;
    },
    laborCostTxt: function () {
      let { amount, serviceAmount, retentionMoney } = this.consultCostParams;
      amount = Number(amount);
      serviceAmount = Number(serviceAmount);
      retentionMoney = Number(retentionMoney);
      const isNumberAndNotEmpty = (value) => {
        return (
          value != null && value !== "" && !isNaN(value) && isFinite(value)
        );
      };
      if (
        isNumberAndNotEmpty(amount) &&
        isNumberAndNotEmpty(serviceAmount) &&
        isNumberAndNotEmpty(retentionMoney)
      ) {
        return (amount - serviceAmount - retentionMoney).toFixed(2);
      } else {
        return null;
      }
    },
  },
  methods: {
    // 确定单反议价
    async handleEnterpriseNegotiatedPrice() {
      const res = await handleEnterpriseNegotiatedPrice(
        this.handleEnterpriseNegotiatedPriceParams
      );
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        await this.getRepairOrderDetail();
        this.closeSinglePartyNegotiationDialog();
      }
    },
    // 关闭单方议价弹窗
    closeSinglePartyNegotiationDialog() {
      this.singlePartyNegotiationPriceVisible = false;
      this.handleEnterpriseNegotiatedPriceParams = {
        doorAmount: null,
        orderSn: null,
      };
    },
    // 打开单方议价弹窗
    openSinglePartyNegotiationDialog(orderSn) {
      this.handleEnterpriseNegotiatedPriceParams.orderSn = orderSn;
      this.singlePartyNegotiationPriceVisible = true;
    },
    // 确定修改质保时间
    async handleOrderWarranty() {
      await this.$refs["handleOrderWarrantyParmasRef"].validate();
      if (this.handleOrderWarrantyParmas.days <= 0) {
        this.$message({
          type: "warning",
          message: "请设置大于0天的质保时间",
        });
        return;
      }
      const res = await handleOrderWarranty(this.handleOrderWarrantyParmas);
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        await this.getRepairOrderDetail();
        this.closeEditWarrantyPeriodDialog();
      }
    },
    // 关闭修改质保时间框
    closeEditWarrantyPeriodDialog() {
      this.editWarrantyPeriodVisible = false;
      this.$refs["handleOrderWarrantyParmasRef"].resetFields();
      this.handleOrderWarrantyParmas = {
        days: null,
        orderSn: null,
      };
    },
    // 打开修改质保时间框
    openEditWarrantyPeriodDialog(orderDetail) {
      this.editWarrantyPeriodVisible = true;
      this.handleOrderWarrantyParmas.days =
        orderDetail.warrantyTime == null ? 30 : orderDetail.warrantyTime;
      this.handleOrderWarrantyParmas.orderSn = orderDetail.orderSn;
    },
    // 切换取消订单标签
    changeOrderCancelTag(index) {
      this.chooseOrderCancelTagNum = index;
    },
    // 获取订单取消标签
    async getSysLabel() {
      const res = await getSysLabel("orderCancelTag");
      if (res.code == "000") {
        if (res.data) {
          this.orderCancelTag = res.data.split(",");
        }
      }
    },
    // 关闭审核描述过程框
    async closeReviewDescDialog() {
      await this.$refs["examineMasterOrderDataRef"].resetFields();
      this.examineMasterOrderDataParmas = {
        orderSn: null,
        result: null,
        status: null,
        rejectionDesc: null,
      };
      this.reviewDescVisible = false;
    },
    // 审核描述过程
    async examineMasterOrderData() {
      await this.$refs["examineMasterOrderDataRef"].validate();
      let obj = { ...this.examineMasterOrderDataParmas };
      if (obj.result) {
        obj.result = obj.rejectionDesc + "、" + obj.result;
      } else {
        obj.result = obj.rejectionDesc;
      }
      delete obj.rejectionDesc;
      const res = await examineMasterOrderData(obj);
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        await this.getRepairOrderDetail();
        this.closeReviewDescDialog();
      }
    },
    // 修改审核描述过程状态
    changeStatus(e) {
      this.examineMasterOrderDataParmas.rejectionDesc = null;
    },
    // 打开审核描述过程框
    openReviewDescDialog(orderSn) {
      this.examineMasterOrderDataParmas.orderSn = orderSn;
      this.reviewDescVisible = true;
    },
    // 跳转物流详情
    goToLogisticsDetails(partId, model, orderSn) {
      this.$router.push({
        name: "logisticsDetails",
        query: { partId, model, orderSn },
      });
    },
    // 确定代企业评价
    async handleReleaseComment() {
      if (!this.handleReleaseCommentParams.content) {
        this.$message({
          message: "请填写订单服务描述",
          type: "warning",
        });
        return;
      }
      this.handleReleaseCommentParams.masterInfoEvaluationGrade.forEach(
        (item) => {
          if (!item.evaluationGrade) {
            this.$message({
              message: "请对全部师傅进行评价",
              type: "warning",
            });
          }
          return;
        }
      );
      if (this.evaluateImgFileList.length > 0) {
        this.handleReleaseCommentParams.images = this.evaluateImgFileList
          .map((item) => item.url)
          .join(",");
      }
      const res = await handleReleaseComment(this.handleReleaseCommentParams);
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.getRepairOrderDetail();
        this.closeEnterpriseEvaluateDialog();
      }
    },
    // 删除评价图片
    removeEvaluateImg(e) {
      const index = this.evaluateImgFileList.findIndex(
        (item) => item.url === e.url
      );
      this.evaluateImgFileList.splice(index, 1);
    },
    // 上传评价图片
    async updataEvaluateImg(fileData) {
      const loading = this.$loading({
        lock: true,
        text: "上传评价图片...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res) {
        loading.close();
        if (res.code == "000") {
          this.evaluateImgFileList.push({
            url: res.data,
          });
        }
      }
    },
    // 关闭代企业评价
    closeEnterpriseEvaluateDialog() {
      this.handleReleaseCommentParams = {
        content: null,
        images: null,
        masterInfoEvaluationGrade: null,
        orderSn: null,
        serviceScore: 0,
      };
      this.evaluateImgFileList = [];
      this.evaluateDialogVisible = false;
    },
    // 打开代企业评价
    openEnterpriseEvaluateDialog(orderSn) {
      this.handleReleaseCommentParams.orderSn = orderSn;
      this.handleReleaseCommentParams.masterInfoEvaluationGrade =
        this.orderDetail.serviceMasterInfoList;
      this.evaluateDialogVisible = true;
    },
    // 设置订单为返修单
    async handleOrderRework() {
      if (this.handleOrderReworkParams.sourceRelationOrderSn.includes("-F-")) {
        this.$message({
          type: "warning",
          message: "原企业订单号不能是返修单!",
        });
        return;
      }
      await this.$refs["markRepairOrderForm"].validate();
      const res = await handleOrderRework(this.handleOrderReworkParams);
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.closeMarkRepairOrderDialog();
        this.orderSn = res.data;
        this.getRepairOrderDetail();
      }
    },
    // 关闭标记返修单对话框
    closeMarkRepairOrderDialog() {
      this.$refs["markRepairOrderForm"].resetFields();
      this.markRepairOrderDialogShow = false;
      this.handleOrderReworkParams = {
        currentRelationOrderSn: null,
        reason: null,
        sourceRelationOrderSn: null,
      };
    },
    // 打开标记返修单对话框
    openMarkRepairOrderDialog(orderSn) {
      this.markRepairOrderDialogShow = true;
      this.handleOrderReworkParams.currentRelationOrderSn = orderSn;
    },
    // 供应商改变时
    changeSupplier(e) {
      const index = this.supplierList.findIndex(
        (item) => item.supplierName == e
      );
      this.setLogisticsData.supplierId = this.supplierList[index].id;
    },
    // 确定供应商
    async confirmSetLogistics() {
      const res = await fillLogisticsInformation(this.setLogisticsData);
      if (res.message == "操作成功") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.getRepairOrderDetail();
        this.closeSetLogistics();
      }
    },
    // 关闭选择供应商框
    closeSetLogistics() {
      this.setLogisticsData = {
        supplierId: null,
        supplierName: null,
      };
      this.supplierInfoListParams = {
        pageNo: 1,
        pageSize: 10,
        query: "",
      };
      this.setLogisticsDialogShow = false;
    },
    // 打开选择供应商框
    async openSetLogistics(row, orderSn) {
      this.setLogisticsData.orderSn = orderSn;
      this.setLogisticsData.id = row.id;
      this.setLogisticsData.model = row.model;
      if (row.supplierId) {
        const { supplierId, supplierName } = row;
        this.setLogisticsData.supplierId = supplierId;
        this.setLogisticsData.supplierName = supplierName;
      }
      const res = await queryMaintenanceSupplierInfo(
        this.supplierInfoListParams
      );
      this.supplierList = res.data.records;
      this.supplierInfoListTotal = res.data.total;
      this.setLogisticsDialogShow = true;
    },
    // 改变供应商页码
    async changesupplierInfoListPage(page) {
      this.supplierInfoListParams.pageNo = page;
      const res = await queryMaintenanceSupplierInfo(
        this.supplierInfoListParams
      );
      this.supplierList = res.data.records;
      this.supplierInfoListTotal = res.data.total;
    },
    // 查找供应商
    async searchMaintenanceSupplierInfo() {
      this.supplierInfoListParams.pageNo = 1;
      const res = await queryMaintenanceSupplierInfo(
        this.supplierInfoListParams
      );
      this.supplierList = res.data.records;
      this.supplierInfoListTotal = res.data.total;
    },
    // 标记师傅有效单
    handleMarkValidOrder(orderSn) {
      this.$prompt("请输入师傅有效单量", "标记师傅有效单量", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d+$/,
        inputErrorMessage: "请输入正确的数字",
        // closeOnClickModal: false,
      }).then(async ({ value }) => {
        const res = await handleMasterOrderValidOrderNum({
          validOrderNum: value,
          orderSn,
        });
        if (res.code == "000") {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 标记服务超时
    handleMasterOrderServiceTimeout(orderSn, realName) {
      this.$confirm(
        `您确定要标记该师傅【${realName}】订单服务超时吗?`,
        "标记服务超时",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const res = await handleMasterOrderServiceTimeout(orderSn);
        if (res.code == "000") {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 确定投诉
    async saveRepairOrderComplaint() {
      if (!this.saveRepairOrderComplaintParams.content) {
        this.$message({
          type: "warning",
          message: "请填写投诉原因",
        });
        return;
      }
      const res = await saveRepairOrderComplaint(
        this.saveRepairOrderComplaintParams
      );
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.getRepairOrderDetail();
        this.closeComplaintDialog();
      }
    },
    // 关闭投诉框
    closeComplaintDialog() {
      this.complaintDialogVisible = false;
      this.saveRepairOrderComplaintParams = {
        content: null,
        masterUid: null,
        orderSn: null,
        relationOrderSn: null,
      };
      this.complaintWorkerName = "";
    },
    // 打开投诉框
    openComplaintDialog(item) {
      this.complaintWorkerName = item.realName;
      this.saveRepairOrderComplaintParams.masterUid = item.uid;
      this.saveRepairOrderComplaintParams.orderSn = item.orderSn;
      this.saveRepairOrderComplaintParams.relationOrderSn =
        item.relationOrderSn;
      this.complaintDialogVisible = true;
    },
    // 订单退款
    async handleOrderRefund(orderSn) {
      const x = await this.$confirm(`您确定将订单退款吗?`, "订单退款", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (x == "confirm") {
        const res = await handleOrderRefund({ orderSn });
        if (res.code == "000") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      }
    },
    // 点击取消订单弹窗确定的事件
    _cancelRepairOrder() {
      if (!this.delOrderinpValue && this.chooseOrderCancelTagNum == null) {
        this.$message({
          message: "请勾选任一标签或填写取消原因",
          type: "warning",
        });
        return;
      }
      let cancelReason;
      if (this.chooseOrderCancelTagNum != null) {
        cancelReason =
          this.orderCancelTag[this.chooseOrderCancelTagNum] +
          "," +
          this.delOrderinpValue;
      } else {
        cancelReason = this.delOrderinpValue;
      }
      let params = {
        orderSn: this.orderSn,
        cancelReason,
      };
      cancelRepairOrder(params).then((res) => {
        if (res.code == "000") {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$router.push("/maintenance/maintenance_order");
        }
      });
    },
    // 关闭取消订单弹窗的时间
    closecancelOrderDialog() {
      this.cancelOrderDialog = false;
      this.delOrderinpValue = "";
      this.chooseOrderCancelTagNum = null;
    },
    // 点击取消订单触发的时间
    clickCancelOrderDialog() {
      this.cancelOrderDialog = true;
    },
    // 标记配件到达
    async markArrivedFn(row, orderSn) {
      this.handlePartsTimeParams.id = row.id;
      this.handlePartsTimeParams.orderSn = orderSn;
      this.handlePartsTimeParams.arriveFlag = true;
      const x = await this.$confirm(
        `您确定标记【${row.name}】已到达吗?`,
        "标记配件到达",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      if (x == "confirm") {
        const res = await handlePartProductArriveInfo(
          this.handlePartsTimeParams
        );
        if (res.code == "000") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      }
    },
    // 设置订单配件商品到达信息
    async handlePartProductArriveInfo() {
      await this.$refs["handlePartsTimeParamsRef"].validate();
      const res = await handlePartProductArriveInfo(this.handlePartsTimeParams);
      if (res.code == "000") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closePartsTimeDialog();
        this.getRepairOrderDetail();
      }
    },
    // 改造预计到达时间
    formatDate(input) {
      const date = new Date(input);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份从0开始
      const day = date.getDate();
      const hour = date.getHours();
      return `${year}年${month}月${day}号${hour}点`;
    },
    // 修改预计到达时间
    changeEstimateArriveData(e) {
      this.handlePartsTimeParams.estimateArriveData = this.formatDate(e);
    },
    // 打开配件预计到达时间弹框
    openPartsTimeDialog(row, orderSn) {
      this.handlePartsTimeParams.id = row.id;
      this.handlePartsTimeParams.orderSn = orderSn;
      this.partsTimeDialogVisible = true;
    },
    // 关闭配件预计到达时间弹框
    closePartsTimeDialog() {
      this.estimateArriveDataCopy = null;
      this.handlePartsTimeParams = {
        arriveFlag: false,
        estimateArriveData: null,
        id: null,
        orderSn: null,
      };
      this.$refs["handlePartsTimeParamsRef"].resetFields();
      this.partsTimeDialogVisible = false;
    },
    // 修改协商人工费计算一下平台抽成和质保金
    blurAmount() {
      this.consultCostParams.serviceAmount = (
        this.consultCostParams.amount * 0.25
      ).toFixed(2);
      if (this.masterTypeNameChoose == "全职") {
        this.consultCostParams.retentionMoney = 0;
      } else {
        this.consultCostParams.retentionMoney = (
          this.consultCostParams.amount * 0.1
        ).toFixed(2);
      }
    },
    // 复制信息
    async copyOrderInfo() {
      let orderDetail = this.orderDetail;
      let orderText = `企业订单号:${orderDetail.orderSn}
订单类型:${
        orderDetail.orderType == 1
          ? "散单"
          : orderDetail.orderType == 2
          ? "年保"
          : "年卡"
      }${orderDetail.label}
设备编号:${orderDetail.no ? orderDetail.no : "无"}
设备产地:${orderDetail.devicePlace ? orderDetail.devicePlace : "无"}
设备类型:${orderDetail.deviceTypeName ? orderDetail.deviceTypeName : "无"}
设备品牌:${orderDetail.deviceBrand ? orderDetail.deviceBrand : "无"}
设备数量:${orderDetail.num ? orderDetail.num : "1"}台
设备系统:${orderDetail.deviceSystemName ? orderDetail.deviceSystemName : "无"}
期望时间:${orderDetail.serviceTime}
企业设备编号:${
        orderDetail.enterpriseDeviceNo ? orderDetail.enterpriseDeviceNo : "无"
      }
企业设备位置:${
        orderDetail.enterpriseDevicePosition
          ? orderDetail.enterpriseDevicePosition
          : "无"
      }
设备型号:${orderDetail.deviceModel ? orderDetail.deviceModel : "无"}
出厂时间:${orderDetail.factoryTime ? orderDetail.factoryTime : "无"}
故障描述:${orderDetail.simpleDesc ? orderDetail.simpleDesc : "无"}
故障部位:${orderDetail.position ? orderDetail.position : "无"}
联系地址:${orderDetail.address ? orderDetail.address : "无"}`;
      await navigator.clipboard.writeText(orderText);
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    // 确定协商费用
    async confirmConsultPrice() {
      if (this.laborCostTxt < 0) {
        this.$message({
          message: "协商到手人工费不能小于0",
          type: "warning",
        });
        return;
      }
      await this.$refs["consultCostForm"].validate();
      const res = await consultCost(this.consultCostParams);
      if (res.message === "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closeConsultPriceDialog();
        this.getRepairOrderDetail();
      }
    },
    // 关闭协商价格框
    closeConsultPriceDialog() {
      this.consultCostParams = {
        orderSn: null,
        amount: null,
        remarks: null,
        flag: 1,
        serviceAmount: null,
        retentionMoney: null,
      };
      this.laborCostTxt = null;
      this.$refs["consultCostForm"].resetFields();
      this.consultPriceVisible = false;
    },
    // 打开协商价格框
    openConsultPriceDialog(
      orderSn,
      doorAmount,
      remarks,
      consultDoorAmount,
      masterTypeName
    ) {
      const h = this.$createElement;
      this.$msgbox({
        title: "绩效",
        message: h("p", null, [
          h(
            "span",
            { style: "color: red" },
            "协商人工费前请删除该师傅无效故障项目及配件"
          ),
        ]),
        showCancelButton: true,
        confirmButtonText: "我已知晓",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            done();
            this.consultCostParams.orderSn = orderSn;
            this.consultCostParams.remarks = remarks ? remarks : "无";
            this.masterTypeNameChoose = masterTypeName;
            this.consultPriceVisible = true;
          } else {
            done();
            console.log(2921);
          }
        },
      });
    },
    // 标记企业付款(手动后标记企业已付款)
    handleProxyPayment(orderSn) {
      this.$confirm(
        "您确定要标记企业已付款(请核实该企业线下是否打款至平台)?",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const res = await handleProxyPayment(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 生成线上工单
    async handleOnlineOrder(orderSn) {
      let loading;
      this.$confirm("您确定要为该企业生成线上工单?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          loading = this.$loading({
            lock: true,
            text: "正在生成工单...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          const res = await handleOnlineOrder(orderSn);
          if (res.message === "操作成功") {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.getRepairOrderDetail();
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    // 驳回师傅验收申请
    rejectOrderCheck(orderSn) {
      this.$confirm("您确定要驳回师傅提交的验收申请吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await rejectOrderCheck(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 代企业确认签收
    handleEnterpriseCheck(orderSn) {
      this.$confirm("您确定要操作代企业确认验收?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleEnterpriseCheck(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 代师傅提交验收
    async handleSubmitAcceptance() {
      await this.$refs["handleSubmitAcceptanceParamsRef"].validate();
      const res = await handleSubmitAcceptance(
        this.handleSubmitAcceptanceParams
      );
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getRepairOrderDetail();
        this.closeSubmitAcceptanceDialog();
      }
    },
    // 删除完工照片
    delCompleteImages(e) {
      const imageList = [];
      this.completeImagesList.forEach((item) => {
        imageList.push(item.url);
      });
      const delIndex = imageList.indexOf(e.url);
      this.completeImagesList.splice(delIndex, 1);
      imageList.splice(delIndex, 1);
      this.handleSubmitAcceptanceParams.completeImages = imageList.join(",");
      this.$refs.uploadCompleteImagesRef.$children[1].$el.style.display = "";
      this.$refs.handleSubmitAcceptanceParamsRef.validateField(
        "completeImages"
      );
    },
    // 上传完工照片
    async uploadCompleteImages(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message == "操作成功") {
        this.completeImagesList.push({ url: res.data });
        const imageList = [];
        this.completeImagesList.forEach((item) => {
          imageList.push(item.url);
        });
        this.handleSubmitAcceptanceParams.completeImages = imageList.join(",");
        if (imageList.length >= 6) {
          this.$refs.uploadCompleteImagesRef.$children[1].$el.style.display =
            "none";
        }
        this.$refs.handleSubmitAcceptanceParamsRef.validateField(
          "completeImages"
        );
      }
    },
    //  关闭代师傅提交验收弹框
    closeSubmitAcceptanceDialog() {
      this.$refs["handleSubmitAcceptanceParamsRef"].resetFields();
      this.handleSubmitAcceptanceParams = {
        completeImages: "",
        offlineImages: "",
        orderSn: "",
        time: "",
      };
      this.completeImagesList = [];
      this.offlineImagesList = [];
      this.$refs.uploadCompleteImagesRef.$children[1].$el.style.display = "";
      this.submitAcceptanceDialogVisible = false;
    },
    // 打开代师傅提交验收弹框
    openSubmitAcceptanceDialog(orderSn) {
      this.handleSubmitAcceptanceParams.orderSn = orderSn;
      this.submitAcceptanceDialogVisible = true;
    },
    // 代师傅开始服务
    handleStartService(orderSn) {
      this.$confirm("您确定要操作代师傅开始服务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleStartService(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 代企业确认师傅报价
    handleProxyConfirmQuotation(orderSn) {
      this.$confirm("您确定要操作代企业确认师傅报价?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleProxyConfirmQuotation({
          orderSn,
        });
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 确定报价
    sumbitQuotation(orderSn) {
      this.$confirm("确认定价无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let data = {
          orderSn,
          status: 2,
          rejectReason: "",
        };
        const res = await examineMasterQuotation(data);
        if (res.code == "000") {
          loading.close();
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 代师傅提交检测报价
    handleMasterQuotation(orderSn) {
      this.$confirm("您确定要操作代师傅提交检测报价?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleMasterQuotation({
          orderSn,
        });
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 代师傅拍照打卡
    async handlePhotographPunch() {
      await this.$refs["handlePhotographPunchParamsRef"].validate();
      const res = await handlePhotographPunch(this.handlePhotographPunchParams);
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getRepairOrderDetail();
        this.closeHandlePhotographPunchDialog();
      }
    },
    // 删除师傅打卡照片
    delPunchImages() {
      this.handlePhotographPunchParams.punchImages = "";
      this.$refs.uploadPunchImagesRef.$children[1].$el.style.display = "";
      this.$refs.handlePhotographPunchParamsRef.validateField("punchImages");
    },
    // 上传师傅打卡照片
    async uploadPunchImages(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message == "操作成功") {
        this.handlePhotographPunchParams.punchImages = res.data;
        this.punchImagesList = [{ url: res.data }];
        this.$refs.uploadPunchImagesRef.$children[1].$el.style.display = "none";
        this.$refs.handlePhotographPunchParamsRef.validateField("punchImages");
      }
    },
    // 关闭代师傅拍照弹框
    closeHandlePhotographPunchDialog() {
      this.$refs["handlePhotographPunchParamsRef"].resetFields();
      this.handlePhotographPunchParams = {
        orderSn: null,
        punchImages: null,
        punchTime: null,
      };
      this.punchImagesList = [];
      this.$refs.uploadPunchImagesRef.$children[1].$el.style.display = "";
      this.photographPunchDialogVisible = false;
    },
    // 打开代师傅拍照弹框
    openHandlePhotographPunchDialog(orderSn) {
      this.handlePhotographPunchParams.orderSn = orderSn;
      this.photographPunchDialogVisible = true;
    },
    // 代师傅开始出发
    async handleRemindStarted() {
      await this.$refs["handleRemindStartedParamsRef"].validate();
      const res = await handleRemindStarted(this.handleRemindStartedParams);
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.getRepairOrderDetail();
        this.closeRemindStartedDialog();
      }
    },
    // 关闭代师傅开始出发弹框
    closeRemindStartedDialog() {
      this.$refs["handleRemindStartedParamsRef"].resetFields();
      this.handleRemindStartedParams = {
        orderSn: null,
        punchTime: null,
      };
      this.remindStartedDialogVisible = false;
    },
    // 打开代师傅开始出发弹框
    openRemindStartedDialog(orderSn) {
      this.handleRemindStartedParams.orderSn = orderSn;
      this.remindStartedDialogVisible = true;
    },
    // 跳转指派师傅页面
    goAssignedMasterPage() {
      const { orderSn, masterUidList, masterNameList } = this.orderDetail;
      this.$router.push({
        path: "/maintenance/assignedWorker",
        query: {
          orderSn,
          masterUidList,
          masterNameList,
        },
      });
    },
    // 转移订单配件商品
    transferPartProduct(row, orderSn) {
      this.$confirm(
        `您确定要将此配件[${row.name}]转移至最后一个师傅,该操作只能执行一次`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const transferPartProductParams = {
          saleOrderId: row.saleOrderId,
          orderSn,
        };
        const res = await transferPartProduct(transferPartProductParams);
        if (res.code == "000") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 删除配件模式
    async delPartsList(row, orderSn) {
      this.$confirm("您确定删除该配件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deletePartProduct({
          id: row.id,
          orderSn,
        });
        if (res.message == "操作成功") {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    //转移订单故障项目
    transferOrderFaultItem(row, orderSn) {
      this.$confirm(
        `您确定要将此故障项[${row.position}]转移至最后一个师傅,该操作只能执行一次`,
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const transferOrderFaultItemParams = {
          id: row.id,
          orderSn,
        };
        const res = await transferOrderFaultItem(transferOrderFaultItemParams);
        if (res.code == "000") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 确定选中的仓库配件
    comfirmWarehousePart() {
      const { brandId, brandName, id, model, name, number, unitId, price } =
        this.jdProductList[this.choosePartIndex];
      this.partInfo.brand = brandName;
      this.partInfo.brandId = brandId;
      this.partInfo.partId = id;
      this.partInfo.parameter = model;
      this.partInfo.name = name;
      this.partInfo.number = number;
      this.partInfo.unitId = unitId;
      this.partInfo.price = price;
      this.closeWarehouseSearch();
    },
    // 关闭仓库搜索框
    async closeWarehouseSearch() {
      this.queryJdProductListParams.query = "";
      this.jdProductList = [];
      this.queryJdProductList();
      this.warehouseSearchDialogShow = false;
    },
    // 确定新增修改配件
    async confirmAddEditPart() {
      if (this.partInfo.stashPartsWay == 2) {
        if (!this.partInfo.brand) {
          this.partInfo.brand = "无";
        }
        if (!this.partInfo.parameter) {
          this.partInfo.parameter = "无";
        }
      } else {
        // 新增的配件才需要  仓库选择的配件不需要 && this.addEditPartTitle == "新增配件"
        if (!this.partInfo.id) {
          let id = Date.now();
          id = id.toString().slice(-4);
          this.partInfo.id = "undefined-" + Number(id);
        }
      }
      await this.$refs["partInfoRuleForm"].validate();
      const data = { ...this.partInfo };
      const res = await editPartProduct(data);
      if (res.message == "操作成功") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.getRepairOrderDetail();
        this.closeAddEditPart();
      }
    },
    // 删除配件图片
    delUploadPartImg(e) {
      const delIndex = this.uploadPartImgList
        .map((item) => item.url)
        .indexOf(e.url);
      this.uploadPartImgList.splice(delIndex, 1);
      let imgStrArr = [];
      this.uploadPartImgList.forEach((item) => {
        imgStrArr.push(item.url);
      });
      this.partInfo.image = imgStrArr.join(",");
    },
    // 上传配件图片
    async uploadPartImg(fileData) {
      const loading = this.$loading({
        lock: true,
        text: "图片上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 7000);
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (!this.uploadPartImgList) {
        this.uploadPartImgList = [];
      }
      this.uploadPartImgList.push({ url: res.data });

      let imgStrArr = [];
      this.uploadPartImgList.forEach((item) => {
        imgStrArr.push(item.url);
      });
      this.partInfo.image = imgStrArr.join(",");
      loading.close();
    },
    // 查询金蝶仓库配件
    async queryJdProductList() {
      this.choosePartIndex = null;
      const res = await queryJdProductList(this.queryJdProductListParams);
      this.jdProductList = res.data.records;
    },
    // 打开仓库搜索框
    openWarehouseSearch() {
      if (!this.partInfo.model) {
        this.$message({
          message: "请先选择配件模式",
          type: "warning",
        });
        return;
      }
      this.warehouseSearchDialogShow = true;
      this.queryJdProductListParams.type = this.partInfo.model;
      this.queryJdProductList();
    },
    // 选择配件来源触发
    changeStashPartsWay() {
      this.partInfo.brand = "";
      this.partInfo.brandId = "";
      this.partInfo.parameter = "";
      this.partInfo.name = "";
      this.partInfo.number = "";
      this.partInfo.unitId = "";
      this.partInfo.price = "";
      this.partInfo.partId = "";
      this.partInfo.id = "";
    },
    changeType() {
      this.$refs.partInfoRuleForm.validateField("type");
    },
    changeModel() {
      this.$refs.partInfoRuleForm.validateField("model");
    },
    // 关闭配件新增修改框
    closeAddEditPart() {
      this.partInfo = {
        stashPartsWay: 1,
        brand: "",
        brandId: "",
        image: "",
        model: "",
        name: "",
        num: "",
        number: "",
        parameter: "",
        price: "",
        type: "",
        id: "", //配件项id
        partId: "", //配件id
        operationType: "add",
        index: null,
      };
      this.uploadPartImgList = [];
      this.addEditPartDialogShow = false;
      this.$refs["partInfoRuleForm"].resetFields();
    },
    // 打开新增修改配件
    // index: 配件在配件列表中的下标  item: 故障项目对象  itemIndex: 师傅的下标
    async openAddEditPart(row, index, item, itemIndex) {
      if (index || index == 0) {
        this.partInfo.operationType = "edit";
        this.partInfo = { ...row };
        if (row.image) {
          let imgArr = row.image.split(",");
          this.uploadPartImgList = [];
          imgArr.forEach((item) => {
            this.uploadPartImgList.push({
              url: item,
            });
          });
        }
        this.addEditPartTitle = "修改配件";
        this.partInfo.operationType = "edit";
      } else {
        this.addEditPartTitle = "新增配件";
        this.partInfo.operationType = "add";

        // 防止客服一直存在同一个页面 重新获取一下最新的配件列表
        const res = await getRepairOrderDetail({
          enterpriseOrderSn: this.orderSn,
        });
        let partList = res.data.enrollRepairOrderOutList[itemIndex].parts;
        partList = JSON.parse(partList);
        // 需要加一个index 金蝶需要
        let indexArr = [];
        if (partList) {
          partList.forEach((i) => {
            if (i.index) {
              indexArr.push(i.index);
            }
          });
        }
        if (indexArr.length > 0) {
          // 取最大值
          let max = Math.max(...indexArr);
          this.partInfo.index = max + 1;
        } else {
          // 默认赋值1
          this.partInfo.index = 1;
        }
        console.log(4033, this.partInfo.index);
      }
      this.partInfo.orderSn = item.orderSn;
      this.addEditPartDialogShow = true;
    },
    // 删除故障项目
    async delSolvePlan(row, orderSn) {
      this.$confirm("您确定删除该故障项目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteOrderFaultItem({
          id: row.id,
          orderSn,
        });
        if (res.code == "000") {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getRepairOrderDetail();
        }
      });
    },
    // 修改企业协商价格
    changeEnterpriseConsultAmount() {
      this.examineFaultsForm.masterConsultAmount =
        this.examineFaultsForm.enterpriseConsultAmount;
    },
    // 确定修改故障项目
    async comfirmExamineFaults() {
      if (Array.isArray(this.examineFaultsForm.image)) {
        this.examineFaultsForm.image = JSON.stringify(
          this.examineFaultsForm.image
        );
      }
      const res = await examineFaultItem(this.examineFaultsForm);
      if (res.message == "操作成功") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        await this.closeExamineFaultsDialog();
        await this.getRepairOrderDetail();
      }
    },
    // 删除视频
    delExamineFaultsFormVideo() {
      this.examineFaultsFormVideoList = [];
      this.examineFaultsForm.image[1] = null;
    },
    // 上传故障视频
    async uploadExamineFaultsFormVideoList(fileData) {
      const loading = this.$loading({
        lock: true,
        text: "上传故障视频...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res) {
        loading.close();
        if (res.data) {
          if (!this.examineFaultsForm.image) {
            this.examineFaultsForm.image = [];
          }
          this.examineFaultsForm.image[1] = res.data;
          this.examineFaultsFormVideoList = [{ url: res.data }];
        }
      }
    },
    // 上传故障图片
    async uploadExamineFaultsFormPicList(fileData) {
      const loading = this.$loading({
        lock: true,
        text: "上传故障图片...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res) {
        loading.close();
        if (res.data) {
          if (!this.examineFaultsForm.image) {
            this.examineFaultsForm.image = [];
          }
          this.examineFaultsForm.image[0] = res.data;
          this.examineFaultsFormPicList = [{ url: res.data }];
        }
      }
    },
    // 删除故障项目图片
    delExamineFaultsFormPicList() {
      this.examineFaultsForm.image[0] = null;
      this.examineFaultsFormPicList = [];
    },
    // 关闭故障项目审核框
    async closeExamineFaultsDialog() {
      this.examineFaultsFormVideoList = [];
      this.examineFaultsFormPicList = [];
      this.examineFaultsForm = {};
      this.examineFaults = false;
    },
    // 点击修改故障项
    openExamineFaultsDialog(row, orderSn, isDateAfter20250301Val) {
      this.examineFaultsForm = { ...row };
      this.examineFaultsForm.isDateAfter20250301Val = isDateAfter20250301Val;
      // 区间价格回显
      this.examineFaultsForm.intervalPrice =
        this.examineFaultsForm.generalAmount +
        "~" +
        this.examineFaultsForm.annualAmount;

      // 默认赋值年报价 没有散单价这个东西
      if (!this.examineFaultsForm.enterpriseConsultAmount) {
        this.examineFaultsForm.enterpriseConsultAmount =
          this.examineFaultsForm.annualAmount;
      }
      if (this.examineFaultsForm.image) {
        if (this.examineFaultsForm.image[0]) {
          this.examineFaultsFormPicList = [
            { url: this.examineFaultsForm.image[0] },
          ];
        }
        if (this.examineFaultsForm.image[1]) {
          this.examineFaultsFormVideoList = [
            { url: this.examineFaultsForm.image[1] },
          ];
        }
      }
      if (Array.isArray(row.image) && row.image.length > 0) {
        this.examineFaultsForm.image = [...row.image];
      }
      this.examineFaultsForm.orderSn = orderSn;
      this.examineFaults = true;
    },
    // 确定新增
    async confirmAddFault() {
      if (!this.chooseFaultItemVal.id) {
        this.$message({
          showClose: true,
          message: "请选择要新增的故障项目",
          type: "warning",
        });
        return;
      }
      const res = await addOrderFaultItem(this.chooseFaultItemVal);
      if (res.message == "操作成功") {
        await this.getRepairOrderDetail();
        this.closeAddFaultDialog();
      }
    },
    // 通过故障描述查询故障项目列表
    async searchFaultList() {
      this.queryFaultItemsParams.pageNo = 1;
      await this.queryFaultItems();
    },
    // 修改故障项目页数
    async changeFaultDialogPage(page) {
      this.queryFaultItemsParams.pageNo = page;
      await this.queryFaultItems();
    },
    // 选择故障项目
    chooseFaultItem(val) {
      this.chooseFaultItemVal = { ...this.chooseFaultItemVal, ...val };
    },
    // 查询故障描述
    async queryFaultItems() {
      const res = await queryFaultItems(this.queryFaultItemsParams);
      this.faultItemList = res.data.records;
      this.faultItemPages = res.data.pages;
      this.faultItemTotal = res.data.total;
    },
    // 关闭故障项目框
    closeAddFaultDialog() {
      this.chooseFaultItemVal = {};
      this.queryFaultItemsParams = {
        pageNo: 1,
        pageSize: 10,
        query: null,
      };
      this.addFaultVisible = false;
    },
    // 打开新增项目框
    async openAddFaultDialog(orderSn, isDateAfter20250301Val) {
      this.chooseFaultItemVal.isDateAfter20250301Val = isDateAfter20250301Val;
      await this.queryFaultItems();
      this.chooseFaultItemVal.orderSn = orderSn;
      this.addFaultVisible = true;
    },
    // 切换订单栏
    changeTabActiveName() {
      if (this.rightTabActiveName != "全流程跟踪") {
        this.chooseMaster = this.orderDetail.enrollRepairOrderOutList.findIndex(
          (item) => item.orderSn === this.rightTabActiveName
        );
      }
    },
    // 判断下单时间是不是大于20250301
    isDateAfter20250301(inputDate) {
      const date = new Date(inputDate.replace(" ", "T"));
      return date >= new Date(2025, 2, 1);
    },
    // 跳转故障视频
    goToVideoUrl(url) {
      if (url) {
        window.open(url);
      }
    },
    // 状态内容左滑 右滑
    scrollLeft() {
      let container = this.$refs.statusListFlex;
      container.scrollLeft -= 300; // 每次左移100px
    },
    scrollRight() {
      let container = this.$refs.statusListFlex;
      container.scrollLeft += 300; // 每次右移100px.
    },
    // 获取详情
    async getRepairOrderDetail() {
      const res = await getRepairOrderDetail({
        enterpriseOrderSn: this.orderSn,
      });
      if (res.code == "000") {
        // Fn:图片字符串转数组方法
        let imgStrTurn = (str) => {
          return str
            .split(",")
            .map((i) => i.trim()) // 去除每项前后的空格
            .filter((i) => i);
        };

        // if (!res.data.label) {
        //   res.data.label = "普通";
        // }

        if (
          res.data.enrollRepairOrderOutList &&
          res.data.enrollRepairOrderOutList.length > 0
        ) {
          this.masterOrderTrackList = [];
          res.data.enrollRepairOrderOutList.forEach((item) => {
            if (item.repairComment && item.repairComment.labels) {
              item.repairComment.labels = item.repairComment.labels.split(",");
            }
            // 将多个师傅状态列表存储
            if (item.orderTrackList) {
              item.statusListData = [
                {
                  title: "企业发布订单",
                  subStatus: "2001",
                },
                {
                  title: "平台指派师傅",
                  subStatus: "2101",
                },
                {
                  title: "师傅接单",
                  subStatus: "3201",
                },
                {
                  title: "师傅提交报价",
                  subStatus: "3202",
                },
                {
                  title: "平台审核定价",
                  subStatus: "2203",
                },
                {
                  title: "师傅服务中",
                  subStatus: "3301",
                },
                {
                  title: "师傅提交验收",
                  subStatus: "3401",
                },
                {
                  title: "企业验收",
                  subStatus: "2501",
                },
                {
                  title: "企业支付",
                  subStatus: "2601",
                },
                {
                  title: "订单完成",
                  subStatus: "2602",
                },
                {
                  title: "师傅取消订单",
                  subStatus: "-3001",
                },
                {
                  title: "企业取消订单",
                  subStatus: "-2001",
                },
              ];
              const hasMinus2001 = item.orderTrackList.some(
                (i) => i.subStatus == "-2001"
              );
              const hasMinus3001 = item.orderTrackList.some(
                (i) => i.subStatus == "-3001"
              );
              if (hasMinus2001 && hasMinus3001) {
                // 同时存在 -2001 和 -3001，剔除 -3001
                item.orderTrackList = item.orderTrackList.filter(
                  (i) => i.subStatus !== "-3001"
                );
              }

              const subMap = new Map(
                item.orderTrackList.map((item) => [item.subStatus, item])
              );
              // 相同状态码 赋值时间
              const result = item.statusListData.map((i) => {
                const subItem = subMap.get(i.subStatus);
                return subItem ? { ...i, createTime: subItem.createTime } : i;
              });
              // 剔除没有时间
              let resultFiltered = result.filter(
                (item) => item.createTime != null && item.createTime !== ""
              );
              this.masterOrderTrackList.push(resultFiltered);
            }

            // 故障项日期20250301
            item.isDateAfter20250301Val = this.isDateAfter20250301(
              item.createTime
            );

            // 回显完工图片
            if (item.completeImages) {
              item.completeImages = imgStrTurn(item.completeImages);
            }
            // 回显打卡图片
            if (item.punchImages) {
              item.punchImages = imgStrTurn(item.punchImages);
            }

            // 回显故障项
            if (item.faults) {
              item.faults = JSON.parse(item.faults);
              if (item.faults?.length > 0) {
                item.faults.forEach((item1) => {
                  if (typeof item1.image == "string" && item1.image != "") {
                    item1.image = JSON.parse(item1.image);
                  }
                });
              }
            }
            // 回显配件
            if (item.parts) {
              item.parts = JSON.parse(item.parts);
              item.parts.forEach((item) => {
                const num = item.num * item.price;
                item.totalMoney = Number(num.toFixed(2));
              });
            }
          });

          // 展示最后一个师傅的数据
          this.rightTabActiveName =
            res.data.enrollRepairOrderOutList[
              res.data.enrollRepairOrderOutList.length - 1
            ].orderSn;
          this.chooseMaster = res.data.enrollRepairOrderOutList.length - 1;
        } else {
          this.rightTabActiveName = "全流程跟踪";
        }

        // 状态默认到最新
        setTimeout(() => {
          let container = this.$refs.statusListFlex;
          container.scrollLeft += 1000; // 每次左移100px
        }, 1000);
        this.orderDetail = res.data;
      }
    },
  },
  async created() {
    if (process.env.NODE_ENV == "development") {
      this.nodeEnv = "development";
    }
    this.orderSn = this.$route.query.orderSn;
    this.getSysLabel();
    await this.getRepairOrderDetail();
  },
};
</script>

<style scoped lang="scss">
.maintenanceOrderDesc {
  padding: 10px;
  // font: 12px/1.5 Tahoma, Helvetica, Arial, "宋体", sans-serif;

  // 状态步骤
  .statusListBox {
    width: 93vw;
    height: 60px;
    display: flex;
    padding-left: 3vw;
    position: relative;

    .goLeftBtn {
      position: absolute;
      top: 16px;
      left: 24px;
      width: 90px;
      height: 90px;
    }
    .goRightBtn {
      position: absolute;
      top: 16px;
      right: -63px;
      width: 90px;
      height: 90px;
    }
    .goLeftBtn > image,
    .goRightBtn > image {
      width: 100%;
      height: 100%;
    }

    .statusList_leftBtn {
      position: absolute;
      left: 10px;
      top: 15px;
      height: 20px;
      width: 20px;
    }
    .statusList_rightBtn {
      position: absolute;
      right: 10px;
      top: 15px;
    }
    .statusList {
      max-width: 87vw;
      display: flex;

      .statusListFlex {
        width: max-content; /* 让内部盒子横向排列 */
        scroll-behavior: smooth;
        overflow-x: auto; /* 横向滚动 */
        display: flex;
        height: 70px;
      }

      .statusItem {
        border: 1px solid #dcdee2;
        border-right: none;
        box-sizing: border-box;
        width: 250px;
        position: relative;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        height: 52px;
        // border-radius: 5px 0 0 5px;
      }
      .statusItem_rightLing {
        z-index: 5;
        position: absolute;
        right: -19px;
        top: 8px;
        height: 35px;
        width: 35px;
        transform: rotateZ(45deg);
        border-top: 1px solid #dcdee2;
        border-right: 1px solid #dcdee2;
        box-sizing: border-box;
      }
    }
  }

  // 订单信息
  .orderInfo {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    // 企业信息
    .mainOrderInfo,
    .masterOrderInfo {
      font-size: 13px;

      .mainOrderInfo_item {
        display: flex;
        justify-content: start;
        margin-bottom: 15px;
        .label {
          width: 100px;
        }
        .value {
          flex: 1;
          position: relative;
          .paymentIcon {
            z-index: 999;
            position: absolute;
            right: 0;
            bottom: -70px;
            width: 80px;
            height: 80px;
          }
          .previewImg {
            z-index: 1;
            opacity: 0;
            position: absolute;
            width: 60px;
            height: 15px;
            left: 0;
            top: 0;
          }
        }
      }
    }
  }

  // 操作按钮
  .operationBtnList {
    z-index: 10;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-top: 2px solid #efefef;
    text-align: right;
    padding: 10px 20px;
  }

  // 新增故障项目框
  .addFaultDialog {
    .searchBox {
      display: flex;
      align-items: center;
      .searchInp {
        margin-right: 20px;
      }
    }

    .tabelBox {
      margin: 20px 0;
    }

    .paginationBox {
      text-align: center;
    }
  }

  .warehouseSearchDialog {
    .warehouseSearchDialogTop {
      display: flex;
      margin-bottom: 10px;
      .warehouseSearchDialogTopInput {
        margin-right: 20px;
      }
    }
    .warehouseSearchDialogList {
      padding: 10px 0;
      height: 70vh;
      overflow: auto;
    }
  }
}

.setLogisticsDialog {
  .setLogisticsDialogSearch {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .supplierList {
    padding: 20px 0;
    height: 550px;
    overflow: auto;
  }

  .tabelPagination {
    margin-top: 20px;
    text-align: center;
  }
}

// 评价弹框
.evaluateDiv {
  .title {
    font-size: 18px;
    font-weight: 700;
    padding-bottom: 10px;
  }
  .block {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .demonstration {
      padding-right: 10px;
    }
  }
}

.label-success {
  color: #67c23a;
}
.label-warning {
  color: #e6a23c;
}
.label-default {
  color: #409eff;
}
</style>
