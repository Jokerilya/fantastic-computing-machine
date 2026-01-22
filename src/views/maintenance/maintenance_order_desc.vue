<template>
  <div class="maintenance-order-container" ref="maintenanceOrderDesc">
    <div
      class="todo-floating-btn"
      @click="goToOldMaintenance_order_desc"
      title="待办事项"
    >
      <!-- @click="openAddMessageReminderDialog(orderDetail.orderSn)" -->
      <!-- <el-image
        class="todo-icon"
        src="https://snk-1305456087.cos.ap-guangzhou.myqcloud.com/user/20251216/DM00004408.png"
        fit="cover"
      >
      </el-image> -->
      前往旧版
    </div>

    <div class="section-card status-section">
      <ProcessFlow
        :params="orderDetail.orderProcessList"
        v-if="
          orderDetail.orderProcessList &&
          orderDetail.orderProcessList.length > 0
        "
      ></ProcessFlow>

      <div class="status-list-wrapper" v-else>
        <div class="scroll-btn left" @click="scrollLeft">
          <i class="el-icon-arrow-left"></i>
        </div>

        <div class="status-list-scroller" ref="statusListFlex">
          <div
            class="status-step-item active"
            v-for="(
              orderTrackListItem, orderTrackListIndex
            ) in masterOrderTrackList[chooseMaster]"
            :key="orderTrackListItem.subStatus"
          >
            <div class="step-content">
              <div class="step-title">{{ orderTrackListItem.title }}</div>
              <div class="step-time">{{ orderTrackListItem.createTime }}</div>
            </div>
            <div
              class="step-arrow"
              v-if="
                orderTrackListIndex !=
                masterOrderTrackList[chooseMaster].length - 1
              "
            ></div>
          </div>
        </div>

        <div class="scroll-btn right" @click="scrollRight">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>

    <div class="main-content-grid">
      <div class="grid-item left-panel">
        <el-card class="modern-card" shadow="hover">
          <el-tabs v-model="leftTabActiveName">
            <el-tab-pane label="企业信息" name="企业信息">
              <div class="info-list">
                <div class="info-group header-group">
                  <div class="info-row">
                    <span class="label">企业订单号</span>
                    <div class="value highlight-value">
                      <span
                        :class="{
                          'text-danger': orderDetail.orderSn.includes('-F-'),
                        }"
                      >
                        {{ orderDetail.orderSn }}
                      </span>
                      <span class="copy-btn" @click="copyOrderInfo">复制</span>
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="label">紧急程度</span>
                    <div class="value">
                      <el-tag
                        size="mini"
                        :type="orderDetail.degree == 2 ? 'danger' : 'info'"
                      >
                        {{
                          orderDetail.degree == 0
                            ? "常规"
                            : orderDetail.degree == 1
                            ? "一般"
                            : "紧急"
                        }}
                      </el-tag>
                      <!-- 【不影响正常生产但对使用操作过程中带来不便的故障,需填写预约上门时间】 -->
                    </div>
                  </div>

                  <div class="info-row">
                    <span class="label">超时状态</span>
                    <div class="value text-danger">
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
                          ? "派发->接单超时"
                          : "--"
                      }}
                    </div>
                  </div>
                </div>

                <el-divider content-position="left">基础信息</el-divider>

                <div class="info-row">
                  <span class="label">订单类型</span>
                  <div class="value flex-center">
                    <el-tag size="small" effect="plain">
                      {{
                        orderDetail.orderType == 1
                          ? "散单"
                          : orderDetail.orderType == 2
                          ? "年保"
                          : "年卡"
                      }}
                    </el-tag>
                    <span
                      v-if="orderDetail.label"
                      class="tag-label text-danger"
                    >
                      【{{ orderDetail.label }}】
                    </span>
                  </div>
                </div>

                <div class="info-row">
                  <span class="label">下单时间</span>
                  <div class="value">{{ orderDetail.createTime }}</div>
                </div>
                <div class="info-row" v-if="orderDetail.lastOrderCreateTime">
                  <span class="label">上次下单</span>
                  <div class="value text-gray">
                    {{ orderDetail.lastOrderCreateTime }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">下单人</span>
                  <div class="value">
                    {{ orderDetail.createPeople || "无" }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">负责人</span>
                  <div class="value">
                    {{ orderDetail.operationPeople || "无" }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">业务员</span>
                  <div class="value">
                    {{ orderDetail.salesmanName || "未绑定" }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">期望时间</span>
                  <div class="value">{{ orderDetail.serviceTime }}</div>
                </div>

                <el-divider content-position="left">故障与设备</el-divider>

                <div class="info-row">
                  <span class="label">故障部位</span>
                  <div class="value">{{ orderDetail.position }}</div>
                </div>
                <div class="info-row">
                  <span class="label">故障描述</span>
                  <div class="value text-bold">
                    {{ orderDetail.simpleDesc }}
                  </div>
                </div>

                <div class="info-row">
                  <span class="label">故障视图</span>
                  <div
                    class="value action-text"
                    v-if="
                      (orderDetail.pictureList &&
                        orderDetail.pictureList.length > 0) ||
                      (orderDetail.videoList &&
                        orderDetail.videoList.length > 0)
                    "
                  >
                    <!-- 查看视图
                    <el-image
                      v-if="orderDetail.pictureList[0]"
                      class="hidden-preview"
                      :src="orderDetail.pictureList[0]"
                      :preview-src-list="orderDetail.pictureList"
                    >
                    </el-image> -->

                    <PrivateFilePreviewer
                      :file-paths="orderDetail.pictureList"
                      v-if="
                        orderDetail.pictureList &&
                        orderDetail.pictureList.length > 0
                      "
                    ></PrivateFilePreviewer>
                    <PrivateFilePreviewer
                      :file-paths="orderDetail.videoList"
                      v-if="
                        orderDetail.videoList &&
                        orderDetail.videoList.length > 0
                      "
                    ></PrivateFilePreviewer>
                  </div>
                  <div class="value text-gray" v-else>未上传</div>
                </div>

                <div
                  class="info-row"
                  v-if="
                    orderDetail.onlineAcceptanceNonePriceFile ||
                    orderDetail.onlineAcceptanceFile
                  "
                >
                  <span class="label">验收凭证</span>
                  <div class="value link-group">
                    <PrivateFilePreviewer
                      :file-paths="orderDetail.onlineAcceptanceFile"
                      v-if="orderDetail.onlineAcceptanceFile"
                      custom-text="有价版"
                    ></PrivateFilePreviewer>

                    <PrivateFilePreviewer
                      :file-paths="orderDetail.onlineAcceptanceNonePriceFile"
                      v-if="orderDetail.onlineAcceptanceNonePriceFile"
                      custom-text="无价版"
                    ></PrivateFilePreviewer>
                  </div>
                </div>

                <div class="info-row">
                  <span class="label">故障类型</span>
                  <div class="value">{{ orderDetail.type }}</div>
                </div>
                <div class="info-row" v-if="orderDetail.warrantyTime">
                  <span class="label">质保时间</span>
                  <div
                    class="value action-text"
                    @click="openEditWarrantyPeriodDialog(orderDetail)"
                  >
                    {{ orderDetail.warrantyTime }}天
                    <span
                      v-if="orderDetail.warrantyEndTime"
                      class="text-gray text-mini"
                      >({{ orderDetail.warrantyEndTime }})</span
                    >
                  </div>
                </div>

                <div class="bg-gray-box">
                  <div class="info-row small-row">
                    <span class="label">设备编号</span>
                    <div class="value">{{ orderDetail.no || "无" }}</div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">设备产地</span>
                    <div class="value">
                      {{ orderDetail.devicePlace || "无" }}
                    </div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">设备类型</span>
                    <div class="value">
                      {{ orderDetail.deviceTypeName || "无" }}
                    </div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">设备品牌</span>
                    <div class="value">
                      {{ orderDetail.deviceBrand || "无" }}
                    </div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">设备数量</span>
                    <div class="value">{{ orderDetail.num || "1" }}台</div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">设备系统</span>
                    <div class="value">
                      {{ orderDetail.deviceSystemName || "无" }}
                    </div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">型号</span>
                    <div class="value">
                      {{ orderDetail.deviceModel || "无" }}
                    </div>
                  </div>
                  <div class="info-row small-row">
                    <span class="label">出厂时间</span>
                    <div class="value">
                      {{ orderDetail.factoryTime || "无" }}
                    </div>
                  </div>
                </div>

                <el-divider content-position="left">联系信息</el-divider>
                <div class="info-row">
                  <span class="label">企业名称</span>
                  <div class="value text-bold">
                    {{ orderDetail.enterpriseName || "无" }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">联系人员</span>
                  <div class="value">
                    {{ orderDetail.contactsPeople || "无" }}
                  </div>
                </div>
                <div class="info-row">
                  <span class="label">联系电话</span>
                  <div class="value">{{ orderDetail.phone || "无" }}</div>
                </div>
                <div class="info-row">
                  <span class="label">联系地址</span>
                  <div class="value">{{ orderDetail.address || "无" }}</div>
                </div>

                <el-divider content-position="left">费用信息</el-divider>
                <div class="cost-card">
                  <div class="info-row">
                    <span class="label">人工费</span>
                    <div class="value">
                      <el-button
                        type="text"
                        size="mini"
                        v-if="
                          orderDetail.enterpriseSubStatus >= 2401 &&
                          orderDetail.enterpriseSubStatus < 2601
                        "
                        @click="
                          openSinglePartyNegotiationDialog(orderDetail.orderSn)
                        "
                      >
                        修改人工费
                      </el-button>
                      {{ orderDetail.doorAmount || 0 }}元
                    </div>
                  </div>
                  <div class="info-row">
                    <span class="label">配件费</span>
                    <div class="value">
                      {{ orderDetail.partsAmount || 0 }}元
                    </div>
                  </div>
                  <div class="info-row" v-if="orderDetail.invoiceAmount > 0">
                    <span class="label">含税金额</span>
                    <div class="value">+{{ orderDetail.invoiceAmount }}元</div>
                  </div>

                  <div class="info-row">
                    <span class="label">优惠减免</span>
                    <div class="value action-text">
                      <div
                        v-if="orderDetail.discountAmount > 0"
                        class="flex-center"
                        style="justify-content: flex-end"
                      >
                        <span @click="openUseDiscountDialog"
                          >-{{ orderDetail.discountAmount }}元 [{{
                            orderDetail.couponName
                          }}]</span
                        >
                        <i
                          class="el-icon-refresh-right text-danger ml-5"
                          v-if="orderDetail.enterpriseMainStatus == 5"
                          @click="resetOrderDiscount"
                          title="重置"
                        ></i>
                      </div>
                      <div
                        v-else
                        @click="openUseDiscountDialog"
                        :class="{
                          'text-gray': orderDetail.enterpriseSubStatus >= 2601,
                        }"
                        style="color: green"
                      >
                        未使用优惠
                      </div>
                    </div>
                  </div>

                  <div
                    class="info-row"
                    v-if="
                      ownedCouponsList[0].length > 0 ||
                      ownedCouponsList[1].length > 0
                    "
                  >
                    <span class="label">账户卡券</span>
                    <div class="value text-mini">
                      券:<span
                        :class="{ 'text-danger': ownedCouponsList[0].length }"
                        >{{ ownedCouponsList[0].length }}</span
                      >, 次卡:<span
                        :class="{ 'text-danger': ownedCouponsList[1].length }"
                        >{{ ownedCouponsList[1].length }}</span
                      >, 保养卡:<span
                        :class="{ 'text-danger': ownedCouponsList[2].length }"
                        >{{ ownedCouponsList[2].length }}</span
                      >
                    </div>
                  </div>

                  <div class="info-row total-row">
                    <span class="label">企业应付</span>
                    <div class="value price-text">
                      {{ orderDetail.payAmount || 0 }}
                      <span class="unit">元</span>
                      <div class="sub-text" v-if="orderDetail.orderType == 3">
                        (年卡订单包人工不包配件)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <div class="grid-item right-panel">
        <el-card class="modern-card" shadow="hover">
          <el-tabs
            v-model="rightTabActiveName"
            @tab-click="changeTabActiveName"
          >
            <template
              v-for="(item, index) in orderDetail.enrollRepairOrderOutList"
            >
              <el-tab-pane
                v-if="
                  showMasterUid == item.uid || orderDetail.orderProcessList == 0
                "
                :name="item.orderSn"
                :key="item.uid"
              >
                <template slot="label">
                  <span class="master-tab-label">
                    <span
                      class="index-badge"
                      v-if="orderDetail.enrollRepairOrderOutList.length > 1"
                      >{{ index + 1 }}</span
                    >
                    {{ item.realName }}
                  </span>
                </template>

                <div class="master-detail-container">
                  <div class="section-block info-section">
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="label">师傅订单号</span>
                        <span class="value">
                          {{ item.orderSn }}
                          <el-tag
                            v-if="item.statusFlag === 1"
                            type="danger"
                            size="mini"
                            >挂起</el-tag
                          >
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="label">师傅姓名</span>
                        <span class="value text-main">
                          {{ item.realName }}
                          <span class="sub-tag"
                            >({{ item.masterTypeName }})</span
                          >
                        </span>
                      </div>
                      <div class="info-item">
                        <span class="label">联系电话</span>
                        <span class="value">{{ item.phone }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">打卡时间</span>
                        <span class="value">{{ item.punchTime || "--" }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">提交验收时间</span>
                        <span class="value">{{
                          item.submitCheckTime || "--"
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="section-block desc-section">
                    <div
                      class="desc-box"
                      :class="{
                        'warning-border': item.dataExamineStatus == 1,
                        'danger-border': item.dataExamineStatus == 3,
                      }"
                    >
                      <div class="desc-row">
                        <div class="desc-item">
                          <span class="label">现场描述</span>
                          <div class="content">
                            {{ item.faultDescription || "暂无描述" }}
                          </div>
                        </div>
                        <div class="desc-item">
                          <span class="label">处理过程</span>
                          <div class="content">
                            {{ item.handleProcess || "暂无过程" }}
                          </div>
                        </div>
                      </div>
                      <div class="desc-editBtn">
                        <el-button type="text" @click="openIsEditVisibleEditor"
                          >修改</el-button
                        >
                      </div>
                      <div
                        class="reject-row"
                        v-if="
                          item.dataExamineStatus == 3 && item.dataExamineResult
                        "
                      >
                        <span class="label">驳回原因:</span>
                        <span class="content">{{
                          item.dataExamineResult
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="section-block image-section"
                    v-if="
                      (item.punchImages && item.punchImages.length) ||
                      (item.completeImages && item.completeImages.length)
                    "
                  >
                    <div class="label-title">图片记录</div>
                    <div class="img-group-wrapper">
                      <div
                        class="img-group"
                        v-if="item.punchImages && item.punchImages.length"
                      >
                        <span class="img-tag tag-blue">打卡</span>
                        <div class="img-list">
                          <PrivateFilePreviewer
                            :file-paths="item.punchImages"
                          />
                        </div>
                      </div>
                      <div
                        class="img-group"
                        v-if="item.completeImages && item.completeImages.length"
                      >
                        <span class="img-tag tag-green">提交验收</span>
                        <div class="img-list">
                          <PrivateFilePreviewer
                            :file-paths="item.completeImages"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="section-block table-section">
                    <div class="section-header">
                      <span class="title">故障项目</span>
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-plus"
                        @click="
                          openAddFaultDialog(
                            item.orderSn,
                            item.isDateAfter20250301Val
                          )
                        "
                        >新增故障项目</el-button
                      >
                    </div>
                    <div class="responsive-table-wrapper">
                      <el-table
                        :data="item.faults"
                        border
                        :key="Math.random()"
                        size="small"
                        :header-cell-style="{
                          background: '#f5f7fa',
                          color: '#606266',
                        }"
                      >
                        <el-table-column
                          label="故障编码"
                          prop="code"
                          align="center"
                          width="80"
                        ></el-table-column>
                        <el-table-column
                          width="80"
                          label="机床类型"
                          align="center"
                        >
                          <template slot-scope="{ row }">{{
                            row.machineType == 1 ? "加工中心" : "数控车床"
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          width="120"
                          label="故障部位"
                          prop="position"
                          align="center"
                        ></el-table-column>
                        <el-table-column
                          label="故障描述"
                          align="center"
                          min-width="180"
                        >
                          <template slot-scope="{ row }">
                            <div>{{ row.simpleDesc }}</div>
                            <div
                              v-if="row.previousMasterFlag"
                              style="color: red"
                            >
                              (前师傅转移)
                            </div>
                          </template>
                        </el-table-column>

                        <el-table-column
                          label="区间浮动价"
                          align="center"
                          width="100"
                          v-if="item.isDateAfter20250301Val"
                        >
                          <template slot-scope="{ row }">{{
                            row.generalAmount + "~" + row.annualAmount
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="师傅提交价"
                          width="100"
                          align="center"
                          v-if="item.isDateAfter20250301Val"
                        >
                          <template slot-scope="{ row }">{{
                            row.masterConsultAmount || 0
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="师傅价格"
                          width="100"
                          align="center"
                          v-if="!item.isDateAfter20250301Val"
                        >
                          <template slot-scope="{ row }">{{
                            row.masterAmount || "0"
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="年保企业价"
                          width="100"
                          align="center"
                          v-if="
                            orderDetail.orderType != 1 &&
                            !item.isDateAfter20250301Val
                          "
                        >
                          <template slot-scope="{ row }">{{
                            row.annualAmount
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="散单企业价"
                          width="100"
                          align="center"
                          v-if="
                            orderDetail.orderType == 1 &&
                            !item.isDateAfter20250301Val
                          "
                        >
                          <template slot-scope="{ row }">{{
                            row.generalAmount
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="师傅协商价"
                          width="100"
                          align="center"
                          v-if="!item.isDateAfter20250301Val"
                        >
                          <template slot-scope="{ row }">{{
                            row.masterConsultAmount || 0
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          label="企业协商价"
                          width="100"
                          align="center"
                          v-if="!item.isDateAfter20250301Val"
                        >
                          <template slot-scope="{ row }">{{
                            row.enterpriseConsultAmount || 0
                          }}</template>
                        </el-table-column>
                        <el-table-column
                          width="100"
                          label="耗卡量"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{ row.cardNum ? row.cardNum : "--" }}
                          </template>
                        </el-table-column>

                        <el-table-column
                          width="80"
                          label="故障视频"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            <PrivateFilePreviewer
                              v-if="row.image && row.image[1]"
                              :file-paths="row.image[1]"
                            />
                            <div v-else class="text-gray">无</div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="100"
                          label="故障图片"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            <PrivateFilePreviewer
                              :file-paths="row.image"
                              v-if="row.image && row.image"
                            />
                            <div v-else class="text-gray">无</div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="200"
                          label="故障原因"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{ row.reason ? row.reason : "--" }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="200"
                          label="解决方案"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{ row.solution ? row.solution : "--" }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="100"
                          label="实际耗时"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{ row.duration ? row.duration + "小时" : "--" }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="100"
                          label="质保天数"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{
                              row.warrantyDay ? row.warrantyDay + "天" : "--"
                            }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          width="100"
                          label="质保截止时间"
                          align="center"
                        >
                          <template slot-scope="{ row }">
                            {{
                              row.warrantyEndTime ? row.warrantyEndTime : "--"
                            }}
                          </template>
                        </el-table-column>

                        <el-table-column
                          label="操作"
                          align="center"
                          width="140"
                          fixed="right"
                        >
                          <template slot-scope="{ row }">
                            <div class="table-actions">
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
                                class="text-danger"
                                @click="delSolvePlan(row, item.orderSn)"
                                >删除</el-button
                              >
                              <el-button
                                type="text"
                                v-if="
                                  index !==
                                    orderDetail.enrollRepairOrderOutList
                                      .length -
                                      1 && !row.transFlag
                                "
                                @click="
                                  transferOrderFaultItem(row, item.orderSn)
                                "
                                >转项</el-button
                              >
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>

                  <div class="section-block table-section">
                    <div class="section-header">
                      <span class="title">配件明细</span>
                      <el-button
                        size="mini"
                        type="primary"
                        icon="el-icon-plus"
                        @click="openAddEditPart(null, null, item, index)"
                        >新增配件</el-button
                      >
                    </div>
                    <div class="responsive-table-wrapper">
                      <el-table
                        :data="item.parts"
                        border
                        :key="Math.random()"
                        size="small"
                        :header-cell-style="{
                          background: '#f5f7fa',
                          color: '#606266',
                        }"
                      >
                        <el-table-column
                          align="center"
                          label="配件名称"
                          min-width="120"
                        >
                          <template slot-scope="{ row }">
                            <div>{{ row.name }}</div>
                            <div v-if="row.isReturn" style="color: red">
                              (已退货)
                            </div>
                            <div v-if="!row.index" style="color: red">
                              (转移)
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="图片"
                          width="100"
                        >
                          <template slot-scope="{ row }">
                            <PrivateFilePreviewer :file-paths="row.image" />
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="模式" width="80">
                          <template slot-scope="{ row }">{{
                            row.model == 1 ? "外发维修" : "采买新件"
                          }}</template>
                        </el-table-column>
                        <el-table-column width="50" label="角色" align="center">
                          <template slot-scope="{ row }">
                            <span v-if="row.type !== 2">师</span
                            ><span v-else style="color: #409eff">平</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                          align="center"
                          label="品牌"
                          prop="brand"
                          width="90"
                        ></el-table-column>
                        <el-table-column
                          align="center"
                          label="参数"
                          prop="parameter"
                          width="100"
                          show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                          align="center"
                          label="供应商"
                          prop="supplierName"
                          width="100"
                          show-overflow-tooltip
                        >
                          <template slot-scope="{ row }">
                            {{ row.supplierName ? row.supplierName : "--" }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="预计到达"
                          width="130"
                        >
                          <template slot-scope="{ row }">
                            <div v-if="row.type === 2 && !row.arriveFlag">
                              <el-button
                                type="text"
                                @click="openPartsTimeDialog(row, item.orderSn)"
                                >{{
                                  row.estimateArriveData || "选择时间"
                                }}</el-button
                              >
                            </div>
                            <div v-else-if="row.type === 2">
                              {{ row.estimateArriveData }}
                            </div>
                            <div v-else>无</div>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="状态" width="80">
                          <template slot-scope="{ row }">
                            <el-button
                              type="text"
                              v-if="row.type === 2 && !row.arriveFlag"
                              @click="markArrivedFn(row, item.orderSn)"
                              >标记到达</el-button
                            >
                            <span
                              v-else-if="row.type === 2 && row.arriveFlag"
                              style="color: #67c23a"
                              >已到达</span
                            >
                            <span v-else>无</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="总金额"
                          width="100"
                        >
                          <template slot-scope="{ row }">
                            <span>{{ row.num }}*{{ row.price }}=</span
                            ><span style="color: red">{{
                              row.totalMoney
                            }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          prop="remarks"
                          label="备注"
                          show-overflow-tooltip
                        >
                          <template slot-scope="{ row }">
                            {{ row.remarks ? row.remarks : "无" }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          prop="warrantyDay"
                          label="质保天数"
                          show-overflow-tooltip
                        >
                          <template slot-scope="{ row }">
                            {{
                              row.warrantyDay ? row.warrantyDay + "天" : "--"
                            }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          prop="warrantyEndTime"
                          label="质保截止时间"
                          show-overflow-tooltip
                        >
                          <template slot-scope="{ row }">
                            {{
                              row.warrantyEndTime ? row.warrantyEndTime : "--"
                            }}
                          </template></el-table-column
                        >
                        <el-table-column
                          label="操作"
                          align="center"
                          width="150"
                          fixed="right"
                        >
                          <template slot-scope="{ row, $index }">
                            <div class="table-actions">
                              <el-button
                                type="text"
                                v-if="row.index"
                                @click="openAddEditPart(row, $index, item)"
                                >修改</el-button
                              >
                              <el-button
                                type="text"
                                class="text-danger"
                                @click="delPartsList(row, item.orderSn)"
                                >删除</el-button
                              >
                              <el-button
                                type="text"
                                v-if="row.type == 2"
                                @click="
                                  goToLogisticsDetails(
                                    row.id,
                                    row.model,
                                    item.orderSn
                                  )
                                "
                                >物流</el-button
                              >
                              <el-button
                                type="text"
                                v-if="row.type === 2"
                                @click="openSetLogistics(row, item.orderSn)"
                                >供应商</el-button
                              >
                              <el-button
                                type="text"
                                v-if="
                                  !row.isReturn &&
                                  index !==
                                    orderDetail.enrollRepairOrderOutList
                                      .length -
                                      1 &&
                                  row.transFlag != 1
                                "
                                @click="transferPartProduct(row, item.orderSn)"
                                >转件</el-button
                              >
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>

                  <div class="section-block settlement-section">
                    <div class="settlement-card">
                      <div class="card-header">
                        <span class="header-title">师傅应收总额</span>
                        <div class="total-price">
                          <span
                            v-if="
                              !(item.consultAmount || item.consultAmount == 0)
                            "
                            >{{ item.totalAmount || 0 }}</span
                          >
                          <span v-else>{{ item.consultAmount || 0 }}</span>
                          <span class="unit">元</span>
                        </div>
                      </div>

                      <div class="dashed-divider"></div>

                      <div class="card-body">
                        <div class="detail-grid">
                          <div
                            class="detail-item"
                            v-if="item.consultAmount == null"
                          >
                            <span class="d-label">人工费</span>
                            <span class="d-value">
                              {{ item.doorAmount }}
                              元
                              <span class="origin-price"
                                >(到手人工费:{{
                                  Number(
                                    (
                                      item.doorAmount -
                                      item.retentionMoney -
                                      item.serviceAmount
                                    ).toFixed(2)
                                  )
                                }})元</span
                              ></span
                            >
                          </div>
                          <div class="detail-item" v-else>
                            <span class="d-label">协商原人工费</span>
                            <span class="d-value"
                              >{{ item.consultDoorAmount || 0 }} 元</span
                            >
                          </div>

                          <div class="detail-item">
                            <span class="d-label">配件费</span>
                            <span class="d-value"
                              >{{ item.partsAmount || 0 }} 元</span
                            >
                          </div>

                          <div
                            class="detail-item"
                            v-if="item.subStatus >= 3201"
                          >
                            <span class="d-label"
                              >质保金<span v-if="item.subStatus <= 3203"
                                >(预)</span
                              ></span
                            >
                            <span class="d-value text-red"
                              >- {{ item.retentionMoney || 0 }} 元</span
                            >
                          </div>

                          <div
                            class="detail-item"
                            v-if="item.subStatus >= 3201"
                          >
                            <span class="d-label"
                              >平台抽成<span v-if="item.subStatus <= 3203"
                                >(预)</span
                              ></span
                            >
                            <span class="d-value text-red"
                              >- {{ item.serviceAmount || 0 }} 元</span
                            >
                          </div>
                        </div>
                        <div class="remark-row" v-if="item.consultRemarks">
                          <span class="d-label">备注:</span>
                          <span class="d-value">{{ item.consultRemarks }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style="height: 60px"></div>
                </div>

                <div class="operation-bar-wrapper">
                  <div class="scrollable-btns">
                    <el-button
                      size="small"
                      type="warning"
                      plain
                      icon="el-icon-video-pause"
                      v-if="
                        orderDetail.enrollRepairOrderOutList.length > 0 &&
                        !stopOrderStatus
                      "
                      @click="openOrderSuspendDialog(1)"
                      >挂起</el-button
                    >
                    <el-button
                      size="small"
                      type="primary"
                      @click="sumbitQuotation(item.orderSn)"
                      v-if="['3202'].includes(item.subStatus)"
                      >确认报价</el-button
                    >
                    <span v-if="!stopOrderStatus" style="margin-left: 8px">
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.remindStarted == 0 && item.subStatus == 3201"
                        @click="openRemindStartedDialog(item.orderSn)"
                        >代师傅出发</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="
                          !item.punchImages &&
                          item.subStatus == 3201 &&
                          item.remindStarted == 1
                        "
                        @click="openHandlePhotographPunchDialog(item.orderSn)"
                        >代拍照打卡</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3201 && item.punchImages"
                        @click="handleMasterQuotation(item.orderSn)"
                        >代检测报价</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3203"
                        @click="handleProxyConfirmQuotation(item.orderSn)"
                        >代确认报价</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3204"
                        @click="handleStartService(item.orderSn)"
                        >代开始服务</el-button
                      >
                      <!-- <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3301"
                        @click="openSubmitAcceptanceDialog(item.orderSn)"
                        >代提交验收</el-button
                      > -->
                      <el-button
                        size="small"
                        type="warning"
                        v-if="item.subStatus == 3401"
                        @click="rejectOrderCheck(item.orderSn)"
                        >驳回验收</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3401"
                        @click="handleEnterpriseCheck(item.orderSn)"
                        >代确认验收</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus == 3501"
                        @click="handleProxyPayment(item.orderSn)"
                        >标记付款</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="
                          orderDetail.enterpriseSubStatus == 2601 &&
                          orderDetail.enrollRepairOrderOutList.length ==
                            index + 1
                        "
                        @click="openEnterpriseEvaluateDialog(item.orderSn)"
                        >代企业评价</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus >= 3301"
                        @click="handleOnlineOrder(orderDetail.orderSn)"
                        >生成线上工单</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="goAssignedMasterPage"
                        v-if="
                          (orderDetail.enterpriseSubStatus == 2001 ||
                            orderDetail.enterpriseSubStatus == 2101 ||
                            item.consultDoorAmount != null) &&
                          orderDetail.enrollRepairOrderOutList.length ==
                            index + 1
                        "
                        >指派师傅</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        v-if="item.subStatus <= 3502"
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
                        size="small"
                        type="primary"
                        v-if="
                          orderDetail.enterpriseMainStatus > -1 &&
                          orderDetail.enterpriseMainStatus <= 4
                        "
                        @click="clickCancelOrderDialog"
                        >取消订单</el-button
                      >
                      <el-button
                        size="small"
                        type="danger"
                        v-if="
                          item.subStatus >= 3401 &&
                          (item.dataExamineStatus == 1 ||
                            item.dataExamineStatus == 0)
                        "
                        @click="openReviewDescDialog(item.orderSn)"
                        >审核描述</el-button
                      >
                      <el-button
                        size="small"
                        type="danger"
                        v-if="
                          item.subStatus >= 3502 &&
                          (name == '黄思超' || name == '张强')
                        "
                        @click="handleOrderRefund(orderDetail.orderSn)"
                        >订单退款</el-button
                      >
                      <!-- <el-button
                        size="small"
                        type="danger"
                        v-if="
                          orderDetail.timeoutFlag != 2301 &&
                          item.subStatus == 3301 &&
                          orderDetail.enrollRepairOrderOutList.length ==
                            index + 1
                        "
                        @click="
                          handleMasterOrderServiceTimeout(
                            item.orderSn,
                            item.realName
                          )
                        "
                        >标记超时</el-button
                      >
                      <el-button
                        size="small"
                        type="danger"
                        @click="handleMarkValidOrder(item.orderSn)"
                        >标记有效单</el-button
                      >
                      <el-button
                        size="small"
                        type="danger"
                        @click="openMarkRepairOrderDialog(orderDetail.orderSn)"
                        v-if="!orderDetail.orderSn.includes('-F-')"
                        >标记返修</el-button
                      > -->
                      <el-button
                        size="small"
                        type="danger"
                        @click="openComplaintDialog(item)"
                        v-if="item.subStatus > 3201"
                        >投诉</el-button
                      >
                    </span>
                  </div>
                </div>
              </el-tab-pane>
            </template>
            <el-tab-pane
              label="全流程跟踪"
              name="全流程跟踪"
              v-if="orderDetail.orderProcessList == 0"
            >
              <div class="timeline-container">
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in orderDetail.orderNodeOutList"
                    :key="index"
                    :timestamp="item.createTime"
                    placement="top"
                    color="#409eff"
                  >
                    <div class="timeline-card">
                      <div class="timeline-header">
                        <span class="person">{{ item.personnel }}</span>
                        <span class="action">{{ item.node }}</span>
                      </div>
                      <div class="timeline-desc">{{ item.simpleDesc }}</div>
                    </div>
                  </el-timeline-item>
                </el-timeline>
                <div class="operation-bar-wrapper">
                  <div class="scrollable-btns">
                    <el-button
                      size="small"
                      type="primary"
                      @click="goAssignedMasterPage"
                      v-if="
                        orderDetail.enterpriseSubStatus == 2001 ||
                        orderDetail.enterpriseSubStatus == 2101
                      "
                      >指派师傅</el-button
                    >
                    <el-button
                      v-if="
                        orderDetail.enterpriseMainStatus > -1 &&
                        orderDetail.enterpriseMainStatus <= 4
                      "
                      type="primary"
                      size="small"
                      @click="clickCancelOrderDialog"
                      >取消订单</el-button
                    >
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane
              label="全流程跟踪V2"
              name="全流程跟踪V2"
              v-if="
                orderDetail.orderProcessList &&
                orderDetail.orderProcessList.length > 0
              "
            >
              <ServiceTimeline
                :params="orderDetail.orderProcessList"
                @biz-click="handleBizClick"
                @upload-quotation-sheet="handleRepairProcessresultSnapshot"
              ></ServiceTimeline>
              <div class="operation-bar-wrapper">
                <div class="scrollable-btns">
                  <el-button
                    size="small"
                    type="warning"
                    plain
                    v-if="orderDetail.enrollRepairOrderOutList.length > 0"
                    @click="openOrderSuspendDialog()"
                    >{{ stopOrderStatus ? "取消挂起" : "挂起" }}</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="goAssignedMasterPage"
                    v-if="
                      orderDetail.enterpriseSubStatus == 2001 ||
                      orderDetail.enterpriseSubStatus == 2101
                    "
                    >指派师傅</el-button
                  >
                  <!-- 代操作 -->
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo &&
                      lastWorkMasterInfo.remindStarted == 0 &&
                      lastWorkMasterInfo.subStatus == 3201
                    "
                    @click="openRemindStartedDialog(lastWorkMasterInfo.orderSn)"
                    >代师傅出发</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    plain
                    v-if="
                      lastWorkMasterInfo &&
                      !lastWorkMasterInfo.punchImages &&
                      lastWorkMasterInfo.subStatus == 3201 &&
                      lastWorkMasterInfo.remindStarted == 1
                    "
                    @click="
                      openHandlePhotographPunchDialog(
                        lastWorkMasterInfo.orderSn
                      )
                    "
                    >代拍照打卡</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo &&
                      lastWorkMasterInfo.subStatus == 3201 &&
                      lastWorkMasterInfo.punchImages
                    "
                    @click="handleMasterQuotation(lastWorkMasterInfo.orderSn)"
                    >代检测报价</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3203
                    "
                    @click="
                      handleProxyConfirmQuotation(lastWorkMasterInfo.orderSn)
                    "
                    >代企业确认报价</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3204
                    "
                    @click="handleStartService(lastWorkMasterInfo.orderSn)"
                    >代开始服务</el-button
                  >
                  <!-- <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3301
                    "
                    @click="
                      openSubmitAcceptanceDialog(lastWorkMasterInfo.orderSn)
                    "
                    >代师傅提交验收</el-button
                  > -->
                  <el-button
                    size="small"
                    type="warning"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3401
                    "
                    @click="rejectOrderCheck(lastWorkMasterInfo.orderSn)"
                    >代企业驳回验收</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3401
                    "
                    @click="handleEnterpriseCheck(lastWorkMasterInfo.orderSn)"
                    >代企业确认验收</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus == 3501
                    "
                    @click="handleProxyPayment(lastWorkMasterInfo.orderSn)"
                    >标记企业付款</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      orderDetail.enterpriseSubStatus == 2601 &&
                      orderDetail.enrollRepairOrderOutList.length == index + 1
                    "
                    @click="
                      openEnterpriseEvaluateDialog(lastWorkMasterInfo.orderSn)
                    "
                    >代企业评价</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus >= 3301
                    "
                    @click="handleOnlineOrder(orderDetail.orderSn)"
                    >生成线上工单</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    v-if="
                      lastWorkMasterInfo && lastWorkMasterInfo.subStatus <= 3502
                    "
                    @click="
                      openConsultPriceDialog(
                        lastWorkMasterInfo.orderSn,
                        lastWorkMasterInfo.doorAmount,
                        lastWorkMasterInfo.consultRemarks,
                        lastWorkMasterInfo.consultDoorAmount,
                        lastWorkMasterInfo.masterTypeName
                      )
                    "
                    >协商{{ lastWorkMasterInfo.realName }}人工费</el-button
                  >
                  <el-button
                    v-if="
                      orderDetail.enterpriseMainStatus > -1 &&
                      orderDetail.enterpriseMainStatus <= 4
                    "
                    type="primary"
                    size="small"
                    @click="clickCancelOrderDialog"
                    >取消订单</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>

    <!-- 关联优惠 -->
    <el-dialog
      width="50%"
      center
      :close-on-click-modal="false"
      :visible="useDiscountVisible"
      :before-close="closeUseDiscountDialog"
    >
      <template slot="title">
        <div style="font-size: 20px; margin-top: 6px">
          使用减免<span style="color: red"
            >(该操作选择后,请点击标记企业付款按钮,该券或卡才算已核销)</span
          >
        </div>
      </template>
      <div class="useDiscountBox">
        <el-tabs
          type="card"
          v-model="activeDiscountType"
          @tab-click="changeActiveDiscountType"
        >
          <el-tab-pane label="优惠券" name="优惠券">
            <el-table
              :data="ownedCouponsList[0]"
              v-if="
                ownedCouponsList[0].length > 0 && activeDiscountType == '优惠券'
              "
              highlight-current-row
              @current-change="changeCouponCode"
              ref="useDiscountTableRef"
            >
              <el-table-column
                width="135"
                align="center"
                prop="couponCode"
                label="编码"
              >
                <template slot-scope="{ row }">
                  <el-radio
                    v-model="couponCodeNow"
                    :label="row.couponCode"
                  ></el-radio>
                </template>
              </el-table-column>
              <el-table-column
                width="160"
                align="center"
                prop="createTime"
                label="发放时间"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                width="180"
                label="优惠券名称"
              >
              </el-table-column>
              <el-table-column label="发放类型" align="center" width="120">
                <template slot-scope="{ row }">
                  {{ row.type == 0 ? "手动赠送" : "平台发放" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="关联订单号">
                <template slot-scope="{ row }">
                  {{ row.orderId || "无" }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="备注" prop="remark">
              </el-table-column>
            </el-table>
            <div v-if="ownedCouponsList[0].length == 0">未领取过优惠券</div>
          </el-tab-pane>

          <el-tab-pane label="维修次卡" name="维修次卡">
            <el-table
              :data="ownedCouponsList[1]"
              v-if="
                ownedCouponsList[1].length > 0 &&
                activeDiscountType == '维修次卡'
              "
              ref="useDiscountTableRef"
            >
              <el-table-column align="center" prop="couponCode" label="券码">
                <template slot-scope="{ row }">
                  <el-checkbox
                    v-model="checkCardList"
                    :label="row.couponCode"
                    :key="row.couponCode"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="支付时间"
              >
              </el-table-column>
              <el-table-column prop="name" align="center" label="优惠券名称">
              </el-table-column>
              <el-table-column align="center" label="备注">
                <template slot-scope="{ row }">
                  {{ row.remark ? row.remark : "机将维保小程序购买" }}
                </template>
              </el-table-column>
            </el-table>
            <div v-if="ownedCouponsList[1].length == 0">未购买过维修次卡</div>
            <el-form
              style="margin-top: 15px"
              v-if="activeDiscountType == '维修次卡'"
            >
              <el-form-item label="抵扣金额:">
                <el-input-number
                  v-model="useCouponParams.amount"
                  :min="1"
                  :max="orderDetail.doorAmount"
                  label="抵扣金额"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="保养卡" name="保养卡">
            <el-table
              :data="ownedCouponsList[2]"
              v-if="
                ownedCouponsList[2].length > 0 && activeDiscountType == '保养卡'
              "
              ref="useDiscountTableRef"
            >
              <el-table-column align="center" prop="couponCode" label="券码">
                <template slot-scope="{ row }">
                  <el-checkbox
                    v-model="checkCardList"
                    :label="row.couponCode"
                    :key="row.couponCode"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="支付时间"
              >
              </el-table-column>
              <el-table-column prop="name" align="center" label="优惠券名称">
              </el-table-column>
              <el-table-column align="center" label="备注">
                <template slot-scope="{ row }">
                  {{ row.remark ? row.remark : "机将维保小程序购买" }}
                </template>
              </el-table-column>
            </el-table>
            <div v-if="ownedCouponsList[2].length == 0">未购买过保养卡</div>
            <el-form
              style="margin-top: 15px"
              v-if="activeDiscountType == '保养卡'"
            >
              <el-form-item label="抵扣金额:">
                <el-input-number
                  v-model="useCouponParams.amount"
                  :min="1"
                  :max="orderDetail.payAmount"
                  label="抵扣金额"
                ></el-input-number>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUseDiscountDialog">取 消</el-button>
        <el-button type="primary" @click="useOrderDiscount">确 定</el-button>
      </span>
    </el-dialog>

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
        <el-form-item label="故障描述" prop="simpleDesc">
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
              <PrivateFilePreviewer
                :file-paths="examineFaultsFormVideoList[0].url"
              ></PrivateFilePreviewer>
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

        <el-form-item label="故障原因" prop="reason">
          <el-input
            placeholder="请输入故障原因"
            v-model="examineFaultsForm.reason"
          ></el-input>
        </el-form-item>
        <el-form-item label="解决方案" prop="solution">
          <el-input
            placeholder="请输入解决方案"
            v-model="examineFaultsForm.solution"
          ></el-input>
        </el-form-item>
        <el-form-item label="实际耗时" prop="duration">
          <el-select v-model="examineFaultsForm.duration" placeholder="请选择">
            <el-option
              v-for="item in 12"
              :key="'duration' + item"
              :label="item + '小时'"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质保天数" prop="warrantyDay">
          <el-select
            v-model="examineFaultsForm.warrantyDay"
            placeholder="请选择"
          >
            <el-option :key="30" label="30天" :value="30"> </el-option>
            <el-option :key="90" label="90天" :value="90"> </el-option>
            <el-option :key="180" label="180天" :value="180"> </el-option>
            <el-option :key="360" label="360天" :value="360"> </el-option>
          </el-select>
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
          <el-form-item label="质保天数" prop="warrantyDay">
            <el-select v-model="partInfo.warrantyDay" placeholder="请选择">
              <el-option :key="30" label="30天" :value="30"> </el-option>
              <el-option :key="90" label="90天" :value="90"> </el-option>
              <el-option :key="180" label="180天" :value="180"> </el-option>
              <el-option :key="360" label="360天" :value="360"> </el-option>
            </el-select>
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

    <!-- 挂起/取消挂起 -->
    <el-dialog
      width="50%"
      :visible="orderSuspendDialogVisible"
      :before-close="closeOrderSuspendDialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: center; padding: 0 70px">
        <div style="color: #707070; font-size: 20px; font-weight: 700">
          {{
            handleOrderPendingStatusParams.flag == 1 ? "订单挂起" : "取消挂起"
          }}
        </div>
        <el-input
          type="textarea"
          resize="none"
          :rows="10"
          v-model="handleOrderPendingStatusParams.remark"
          style="margin-top: 20px"
          :placeholder="`请输入${
            handleOrderPendingStatusParams.flag == 1 ? '订单挂起' : '取消挂起'
          }的原因`"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          style="width: 150px; background-color: #ffffff; color: #2e4c9e"
          @click="closeOrderSuspendDialog"
          >取 消</el-button
        >
        <el-button
          style="width: 150px; background-color: #2e4c9e"
          type="primary"
          @click="handleOrderPendingStatus"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--订单轨迹V2备注 -->
    <el-dialog
      width="50%"
      :visible="orderTrackingRemarkDialogVisible"
      :before-close="closeOrderTrackingRemarkDialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: center; padding: 0 70px">
        <div style="color: #707070; font-size: 20px; font-weight: 700">
          添加备注
        </div>
        <el-input
          type="textarea"
          resize="none"
          :rows="10"
          v-model="handleRepairProcessRemarkParams.remark"
          style="margin-top: 20px"
          placeholder="请填写备注"
        ></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button
          style="width: 150px; background-color: #ffffff; color: #2e4c9e"
          @click="closeOrderTrackingRemarkDialog"
          >取 消</el-button
        >
        <el-button
          style="width: 150px; background-color: #2e4c9e"
          type="primary"
          @click="handleRepairProcessRemark"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="取消订单"
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
      :visible="editWarrantyPeriodVisible"
      width="20%"
      :close-on-click-modal="false"
      :before-close="closeEditWarrantyPeriodDialog"
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

    <!-- 新增提醒 -->
    <el-dialog
      title="新增提醒"
      :visible="addMessageReminderDialogVisible"
      width="35%"
      :close-on-click-modal="false"
      :before-close="closeAddMessageReminderDialog"
      center
    >
      <el-form
        :model="saveOrderReminderParams"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="提醒时间">
          <el-date-picker
            type="date"
            v-model="datePickerVal"
            :picker-options="pickerOptionsDate"
            placeholder="选择提醒日期"
            value-format="yyyy-MM-dd"
            style="margin-right: 10px"
          >
          </el-date-picker>
          <el-time-select
            v-model="timePickerVal"
            :picker-options="{
              start: '09:00',
              end: '18:00',
              step: '00:15',
            }"
            placeholder="选择提醒时间"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="saveOrderReminderParams.content"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddMessageReminderDialog">取 消</el-button>
        <el-button type="primary" @click="saveOrderReminder">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 轨迹V2操作 -->
    <!-- 时效要求 -->
    <el-dialog
      title="变更订单响应级别"
      :visible="isPriorityPanelVisible"
      width="30vw"
      :before-close="dismissPanel"
      :close-on-click-modal="false"
    >
      <el-form
        ref="urgencyFormRef"
        :model="urgencyPayload"
        :rules="validationRules"
        label-width="110px"
      >
        <el-form-item label="响应等级" prop="degree ">
          <el-radio-group
            v-model="urgencyPayload.degree"
            class="urgency-radio-group"
          >
            <el-radio :label="1" border>一般</el-radio>
            <el-radio :label="0" border>常规</el-radio>
            <el-radio :label="2" border style="color: #e50014">紧急 </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dismissPanel">取 消</el-button>
        <el-button type="primary" @click="executeUrgencyUpdate">
          确 认
        </el-button>
      </span>
    </el-dialog>
    <!-- 修改现场描述/处理过程 -->
    <el-dialog
      title="工单详情处理"
      :visible="isEditVisible"
      width="40vw"
      custom-class="custom-edit-dialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="formRules"
        label-position="top"
        class="edit-form"
      >
        <el-form-item label="现场描述" prop="faultDescription ">
          <el-input
            v-model="editForm.faultDescription"
            type="textarea"
            :rows="4"
            placeholder="请详细描述到达现场时的情况..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="处理过程" prop="handleProcess ">
          <el-input
            v-model="editForm.handleProcess"
            type="textarea"
            :rows="6"
            placeholder="请记录具体的维修或处理步骤..."
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit"> 提 交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ProcessFlow from "../maintenance/components/maintenance_order_desc/processFlow.vue";
import ServiceTimeline from "../maintenance/components/maintenance_order_desc/serviceTimeline.vue";

import {
  saveOrderReminder,
  queryOrderReminderList,
  handleOrderReminder,
} from "@/api/orderReminder";
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
  useOrderDiscount,
  resetOrderDiscount,
  handleOrderPendingStatus,
  handleRepairProcessRemark,
  editRepairOrder,
  handleRepairProcessresultSnapshot,
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
import { Notification } from "element-ui";
export default {
  components: {
    ProcessFlow,
    ServiceTimeline,
  },
  data() {
    return {
      lastWorkMasterInfo: null,
      showMasterUid: null,

      orderTrackingRemarkDialogVisible: false,
      handleRepairProcessRemarkParams: {
        id: null,
        remark: null,
      },

      stopOrderStatus: false, // 点击了挂起 其他按钮隐藏

      handleOrderPendingStatusParams: {
        flag: null,
        orderSn: null,
        remark: null,
      },
      orderSuspendDialogVisible: false,
      // 初始化提醒框
      pickerOptionsDate: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0);
        },
      },
      datePickerVal: new Date(), // 默认选中今天,
      timePickerVal: null,

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
      rightTabActiveName: "全流程跟踪V2",

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
        warrantyDay: null,
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

      // 单方议价
      singlePartyNegotiationPriceVisible: false,
      handleEnterpriseNegotiatedPriceParams: {
        doorAmount: null,
        orderSn: null,
      },

      // 关联优惠
      useDiscountVisible: false,
      activeDiscountType: "优惠券",
      ownedCouponsList: [], //已领取的优惠券
      useCouponParams: {
        couponCode: null,
        orderSn: null,
        amount: 1,
        type: null,
      },
      couponCodeNow: null,
      checkCardList: [],

      // 提醒
      addMessageReminderDialogVisible: false,
      saveOrderReminderParams: {
        content: null,
        reminderTime: null,
        relationOrderSn: null,
      },
      queryOrderReminderListParams: {
        pageNo: 1,
        pageSize: 3,
        relationOrderSn: null,
        status: 0,
      },
      orderReminderList: [],
      NotificationList: [],

      // 轨迹V2操作
      // 修改现场描述/处理过程
      isPriorityPanelVisible: false,
      urgencyPayload: {
        relationOrderSn: null,
        degree: null, // 默认 Normal
      },
      validationRules: {
        degree: [
          {
            required: true,
            message: "必须指定一个新的响应等级",
            trigger: "change",
          },
        ],
      },
      // 修改现场描述/处理过程
      isEditVisible: false,
      editForm: {
        orderSn: null,
        faultDescription: null,
        handleProcess: null,
        relationOrderSn: null,
      },
      formRules: {
        faultDescription: [
          { required: true, message: "请输入现场描述", trigger: "blur" },
        ],
        handleProcess: [
          { required: true, message: "请输入处理过程", trigger: "blur" },
        ],
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
    // 跳转旧版
    goToOldMaintenance_order_desc() {
      this.$router.push({
        name: "maintenance_order_desc_copy",
        query: { orderSn: this.orderDetail.orderSn },
      });
    },
    // 订单流程快照
    async handleRepairProcessresultSnapshot(url, id, remarkType) {
      let params = {
        id,
        relationOrderSn: this.lastWorkMasterInfo.relationOrderSn,
        url,
        remarkType,
      };
      const res = await handleRepairProcessresultSnapshot(params);
      if (res.code == "000") {
        this.$message.success("操作成功");
        await this.getRepairOrderDetail();
      }
    },
    // 确认修改处理过程/现场描述
    async handleSubmit() {
      await this.$refs.editFormRef.validate();
      const res = await editRepairOrder(this.editForm);
      if (res.code == "000") {
        this.$message.success("操作成功");
        await this.getRepairOrderDetail();
        this.handleCancel();
      }
    },
    // 关闭修改处理过程/现场描述框
    handleCancel() {
      this.editForm = {
        orderSn: null,
        faultDescription: null,
        handleProcess: null,
        relationOrderSn: null,
      };
      this.$refs.editFormRef.resetFields();
      this.isEditVisible = false;
    },
    // 打开修改处理过程/现场描述框
    openIsEditVisibleEditor() {
      this.editForm.relationOrderSn = this.lastWorkMasterInfo.relationOrderSn;
      this.editForm.faultDescription = this.lastWorkMasterInfo.faultDescription;
      this.editForm.handleProcess = this.lastWorkMasterInfo.handleProcess;
      this.editForm.orderSn = this.lastWorkMasterInfo.orderSn;
      this.isEditVisible = true;
    },

    // 打开时效要求框
    triggerPriorityEditor() {
      this.urgencyPayload.relationOrderSn = this.orderDetail.orderSn;
      this.urgencyPayload.degree = this.orderDetail.degree;
      this.isPriorityPanelVisible = true;
    },
    // 关闭时效要求框
    dismissPanel() {
      this.$refs.urgencyFormRef.resetFields();
      this.urgencyPayload = {
        relationOrderSn: null,
        degree: null, // 默认 Normal
      };
      this.isPriorityPanelVisible = false;
    },
    // 确认时效要求框
    async executeUrgencyUpdate() {
      await this.$refs.urgencyFormRef.validate();
      const res = await editRepairOrder(this.urgencyPayload);
      if (res.code == "000") {
        this.$message.success("操作成功");
        await this.getRepairOrderDetail();
        this.dismissPanel();
      }
    },

    // 确定备注
    async handleRepairProcessRemark() {
      if (!this.handleRepairProcessRemarkParams.remark) {
        this.$message({
          message: `请填写备注信息`,
          type: "warning",
        });
      }
      const res = await handleRepairProcessRemark(
        this.handleRepairProcessRemarkParams
      );
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        await this.getRepairOrderDetail();
        this.closeOrderTrackingRemarkDialog();
      }
    },
    // 关闭轨迹备注框
    closeOrderTrackingRemarkDialog() {
      this.orderTrackingRemarkDialogVisible = false;
      this.handleRepairProcessRemarkParams = {
        id: null,
        remark: null,
      };
    },
    // 订单挂起
    async handleOrderPendingStatus() {
      if (!this.handleOrderPendingStatusParams.remark) {
        this.$message({
          message: `请填写${
            this.handleOrderPendingStatusParams.flag == 1
              ? "订单挂起"
              : "取消订单挂起"
          }的原因`,
          type: "warning",
        });
        return;
      }
      const res = await handleOrderPendingStatus(
        this.handleOrderPendingStatusParams
      );
      if (res.code == "000") {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        await this.getRepairOrderDetail();
        this.closeOrderSuspendDialog();
      }
    },
    // 关闭订单挂起/取消挂起弹框
    closeOrderSuspendDialog() {
      this.handleOrderPendingStatusParams = {
        flag: null,
        orderSn: null,
        remark: null,
      };
      this.orderSuspendDialogVisible = false;
    },
    // 打开订单挂起/取消挂起弹框
    openOrderSuspendDialog() {
      this.handleOrderPendingStatusParams.orderSn =
        this.lastWorkMasterInfo.orderSn;
      let flag = this.stopOrderStatus ? 0 : 1;
      this.handleOrderPendingStatusParams.flag = flag;
      this.orderSuspendDialogVisible = true;
    },

    // 点击了按钮
    handleBizClick(btnName, item) {
      // 所有备注统一处理
      if (btnName == "添加备注") {
        this.handleRepairProcessRemarkParams.id = item.id;
        this.orderTrackingRemarkDialogVisible = true;
      }

      // 点击时效要求
      if (
        item.processKey == "enterprise_create_order" &&
        btnName == "时效要求"
      ) {
        this.triggerPriorityEditor();
      }

      // 点击重新指派师傅
      if (
        item.processKey == "platform_assign_master" &&
        btnName == "重新指派师傅"
      ) {
        this.goAssignedMasterPage();
      }

      // 点击确认报价
      if (item.processKey == "master_submit_quote" && btnName == "确认报价") {
        this.sumbitQuotation(this.lastWorkMasterInfo.orderSn);
      }
      // 点击修改报价
      if (
        item.processKey == "master_submit_quote" &&
        btnName == "查看师傅报价"
      ) {
        let showMasterUid = item.resultSnapshot[0].targetId;
        this.showMasterUid = showMasterUid;
        this.rightTabActiveName = this.lastWorkMasterInfo.orderSn;
      }

      // 点击协商人工费
      if (item.processKey == "consult_cost" && btnName == "协商师傅费用") {
        let showMasterUid = item.resultSnapshot[0].targetId;
        this.showMasterUid = showMasterUid;
        const info = this.orderDetail.enrollRepairOrderOutList.find(
          (item) => item.uid == this.showMasterUid
        );
        this.rightTabActiveName = info.orderSn;
      }
    },
    //
    // handleJump(item) {
    //   console.log("点击了跳转:", item.stepName);
    // },

    // 获取该订单待办事项
    async queryOrderReminderList() {
      if (this.NotificationList.length > 0) {
        this.NotificationList.forEach((item) => {
          item.close();
        });
        this.NotificationList = [];
      }
      this.queryOrderReminderListParams.relationOrderSn = this.orderSn;
      const res = await queryOrderReminderList(
        this.queryOrderReminderListParams
      );
      if (res.code == "000") {
        this.orderReminderList = res.data.records;
        if (this.orderReminderList.length > 0) {
          this.orderReminderList.forEach((item, index) => {
            setTimeout(() => {
              const NotificationItem = Notification({
                title: "提醒",
                dangerouslyUseHTMLString: true,
                message: `${item.content} (点击则标记为已处理)<br />${item.reminderTime}`,
                duration: 10000,
                offset: 50,
                onClick: async () => {
                  let params = {
                    id: item.id,
                    handleType: 1,
                  };
                  const res = await handleOrderReminder(params);
                  if (res.code == "000") {
                    this.$message({
                      type: "success",
                      message: "操作成功",
                    });
                    this.NotificationList.forEach((i, idx) => {
                      if (index == idx) {
                        i.close();
                      }
                    });
                  }
                },
              });
              this.NotificationList.push(NotificationItem);
            }, 0 + 500 * (index + 1));
          });
        }
      }
    },
    // 判断是否超过当前时间并格式化日期时间
    checkAndFormat(dateStr, timeStr) {
      const now = new Date();
      const [Y, M, D] = dateStr.split("-");
      const [h, m] = timeStr.split(":").map(Number);
      const target = new Date(Y, M - 1, D, h, m);
      const isValid =
        target >=
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes()
        );
      return isValid
        ? `${dateStr} ${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:00`
        : false;
    },
    // 获取今日
    getTodayString() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需+1
      const day = String(now.getDate()).padStart(2, "0");
      this.datePickerVal = `${year}-${month}-${day}`;
    },
    // 确定新增消息提醒
    async saveOrderReminder() {
      if (!this.timePickerVal) {
        this.$message({
          message: "请选择提醒时间",
          type: "warning",
        });
        return;
      }
      if (!this.checkAndFormat(this.datePickerVal, this.timePickerVal)) {
        this.$message({
          message: "请选择正确的提醒时间，提醒时间不能早于当前时间",
          type: "warning",
        });
        return;
      } else {
        this.saveOrderReminderParams.reminderTime = this.checkAndFormat(
          this.datePickerVal,
          this.timePickerVal
        );
      }
      if (!this.saveOrderReminderParams.content) {
        this.$message({
          message: "请输入提醒内容",
          type: "warning",
        });
        return;
      }
      const res = await saveOrderReminder(this.saveOrderReminderParams);
      if (res.code == "000") {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.queryOrderReminderList();
        this.closeAddMessageReminderDialog();
      }
    },
    // 关闭新增消息提醒
    closeAddMessageReminderDialog() {
      this.addMessageReminderDialogVisible = false;
      this.getTodayString();
      this.timePickerVal = null;
      this.saveOrderReminderParams = {
        content: null,
        reminderTime: null,
        relationOrderSn: null,
      };
    },
    // 打开新增消息提醒
    openAddMessageReminderDialog(orderSn) {
      this.saveOrderReminderParams.relationOrderSn = orderSn;
      this.addMessageReminderDialogVisible = true;
    },
    // 切换减免优惠类型
    changeActiveDiscountType() {
      this.useCouponParams.amount = null;
      this.couponCodeNow = null;
      this.checkCardList = [];
    },
    // 重置减免优惠
    resetOrderDiscount() {
      this.$confirm(`您确定要重置减免优惠吗?`, "重置减免优惠", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const loading = this.$loading({
          lock: true,
          text: "正在重置中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        const res = await resetOrderDiscount(this.orderSn);
        if (res.code == "000") {
          this.$message({
            type: "success",
            message: res.message,
          });
          loading.close();
          this.getRepairOrderDetail();
        } else {
          loading.close();
        }
      });
    },
    // 判断维修次卡多张情况 用的是同一种
    allNamesEqual(knownList, ids) {
      const matched = knownList.filter((item) => ids.includes(item.couponCode));
      if (matched.length === 0) return true;
      const firstType = matched[0].couponId;
      return matched.every((item) => item.couponId === firstType);
    },
    // 减免优惠
    async useOrderDiscount() {
      if (this.activeDiscountType == "优惠券") {
        this.useCouponParams.type = 2;
        if (!this.useCouponParams.couponCode) {
          this.$message({
            type: "warning",
            message: "请选择优惠券",
          });
          return;
        }
      } else {
        if (this.checkCardList.length == 0) {
          this.$message({
            type: "warning",
            message: "请选择维修次卡",
          });
          return;
        }
        if (!this.allNamesEqual(this.ownedCouponsList[1], this.checkCardList)) {
          this.$message({
            type: "warning",
            message: "请选择同一种维修次卡",
          });
          return;
        }
        this.useCouponParams.type = 3;
        this.useCouponParams.couponCode = this.checkCardList.join(",");
      }
      const res = await useOrderDiscount(this.useCouponParams);
      if (res.code == "000") {
        await this.getRepairOrderDetail();
        this.closeUseDiscountDialog();
      }
    },
    // 修改使用的优惠券
    changeCouponCode(e) {
      this.couponCodeNow = e.couponCode;
      this.useCouponParams.couponCode = e.couponCode;
    },
    // 关闭使用优惠框
    closeUseDiscountDialog() {
      this.useCouponParams = {
        couponCode: null,
        orderSn: null,
        amount: 1,
        type: null,
      };
      this.couponCodeNow = null;
      this.checkCardList = [];
      this.useDiscountVisible = false;
      this.activeDiscountType = "优惠券";
      this.$refs.useDiscountTableRef.setCurrentRow(null);
    },
    // 打开使用优惠框
    openUseDiscountDialog() {
      if (this.orderDetail.enterpriseSubStatus >= 2601) {
        return;
      }
      this.useCouponParams.orderSn = this.orderDetail.orderSn;
      this.useDiscountVisible = true;
    },
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
      if (this.rightTabActiveName == "全流程跟踪V2") {
        this.showMasterUid = null;
      }
    },
    // 判断下单时间是不是大于20250301
    isDateAfter20250301(inputDate) {
      const date = new Date(inputDate.replace(" ", "T"));
      return date >= new Date(2025, 2, 1);
    },
    // 跳转故障视频
    goToVideoUrl(url) {
      console.log(4702, url);
      if (url) {
        window.open(url);
      }
    },
    // 状态内容左滑 右滑
    scrollLeft() {
      let container = this.$refs.statusListFlex;
      if (container && container.scrollLeft) {
        container.scrollLeft -= 300; // 每次左移100px
      }
    },
    scrollRight() {
      let container = this.$refs.statusListFlex;
      if (container && container.scrollLeft) {
        container.scrollLeft += 300; // 每次右移100px.
      }
    },
    // 获取详情
    async getRepairOrderDetail() {
      const res = await getRepairOrderDetail({
        enterpriseOrderSn: this.orderSn,
      });

      if (res.code == "000") {
        if (res.data.userCouponList) {
          // type == 2 优惠券 type == 3 维修次卡
          const type2Coupons = res.data.userCouponList.filter(
            (item) => item.type === 2
          );
          const type3Coupons = res.data.userCouponList
            .filter((item) => item.type === 3)
            .slice(0, 10);
          const type1Coupons = res.data.userCouponList
            .filter((item) => item.type === 1)
            .slice(0, 10);
          this.ownedCouponsList = [type2Coupons, type3Coupons, type1Coupons];
        }

        // Fn:图片字符串转数组方法
        let imgStrTurn = (str) => {
          return str
            .split(",")
            .map((i) => i.trim()) // 去除每项前后的空格
            .filter((i) => i);
        };

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

          // 状态默认到最新
          setTimeout(() => {
            let container = this.$refs.statusListFlex;
            container.scrollLeft += 1000; // 每次左移100px
          }, 1000);

          // 展示最后一个师傅的数据
          if (!this.rightTabActiveName) {
            this.rightTabActiveName =
              res.data.enrollRepairOrderOutList[
                res.data.enrollRepairOrderOutList.length - 1
              ].orderSn;
            this.chooseMaster = res.data.enrollRepairOrderOutList.length - 1;
          }
        } else {
          if (!this.rightTabActiveName) {
            this.rightTabActiveName = "全流程跟踪V2";
          }
        }

        const isBeforeDeadline = (timeStr) => {
          // 设定截止日期：2026年1月8日 0点0分0秒
          const deadline = new Date("2026-01-08T00:00:00");
          const inputDate = new Date(timeStr.replace(" ", "T"));
          return inputDate < deadline;
        };
        if (isBeforeDeadline(res.data.createTime)) {
          res.data.orderProcessList = [];
        }

        if (res.data.orderProcessList && res.data.orderProcessList.length > 0) {
          let lastOrderProcess =
            res.data.orderProcessList[res.data.orderProcessList.length - 1];
          if (lastOrderProcess.processKey == "order_stop") {
            this.stopOrderStatus = true;
          } else {
            this.stopOrderStatus = false;
          }
        }

        // 保存最后一个师傅 轨迹需要代操作
        if (res.data.enrollRepairOrderOutList) {
          let lastWorkMasterInfo =
            res.data.enrollRepairOrderOutList[
              res.data.enrollRepairOrderOutList.length - 1
            ];
          this.lastWorkMasterInfo = lastWorkMasterInfo;
          console.log(5372, this.lastWorkMasterInfo);
        }

        this.orderDetail = res.data;
      }
    },
  },
  beforeDestroy() {
    if (this.NotificationList.length > 0) {
      this.NotificationList.forEach((item) => {
        item.close();
      });
      this.NotificationList = [];
    }
  },
  async created() {
    if (process.env.NODE_ENV == "development") {
      this.nodeEnv = "development";
    }
    this.orderSn = this.$route.query.orderSn;
    this.getSysLabel();
    await this.getRepairOrderDetail();
    // 获取今日日期
    this.getTodayString();
    // 该订单是否有未读信息
    await this.queryOrderReminderList();
  },
};
</script>

<style lang="scss" scoped>
/* 提升视觉体验的样式 */
.custom-edit-dialog {
  border-radius: 12px;

  ::v-deep .el-dialog__header {
    padding: 20px 25px;
    border-bottom: 1px solid #f0f2f5;
    .el-dialog__title {
      font-weight: 600;
      color: #303133;
    }
  }

  ::v-deep .el-dialog__body {
    padding: 15px 25px 25px;
  }

  .edit-form {
    /* 将 Label 改为加粗，更有层次感 */
    ::v-deep .el-form-item__label {
      font-weight: bold;
      padding-bottom: 8px;
      line-height: 1;
      color: #606266;

      &::before {
        margin-right: 4px;
      }
    }

    /* 优化输入框焦点样式 */
    ::v-deep .el-textarea__inner {
      border-radius: 8px;
      padding: 12px;
      font-family: inherit;
      transition: all 0.3s;
      background-color: #fcfcfc;

      &:focus {
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      }
    }
  }

  .dialog-footer {
    padding: 10px 25px 20px;
    .el-button {
      padding: 10px 25px;
      border-radius: 6px;
    }
  }
}
.urgency-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 按钮之间的间距 */

  /* 移除 Element 默认的左外边距，确保对齐 */
  .el-radio.is-bordered + .el-radio.is-bordered {
    margin-left: 0;
  }

  /* 针对“紧急”状态的特殊样式 */
  .is-danger.is-checked {
    .el-radio__inner {
      background: #f56c6c;
      border-color: #f56c6c;
    }
    .el-radio__label {
      color: #f56c6c;
    }
    border-color: #f56c6c;
  }

  /* 鼠标悬停在“紧急”上的效果 */
  .is-danger:not(.is-checked):hover {
    border-color: #f56c6c;
    .el-radio__label {
      color: #f56c6c;
    }
  }
}

/* 统一弹窗内边距和圆角 */
::v-deep .priority-dialog {
  border-radius: 8px;
  .el-dialog__header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
  }
  .el-dialog__body {
    padding: 30px 20px;
  }
}

/* 变量定义 */
$spacing-base: 24px; // 模块之间的标准间距
$border-color: #ebeef5;
$text-main: #303133;
$text-secondary: #909399;
$danger-color: #e50014;
$bg-color: #f5f7fa;
/* 变量定义 */
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #e50014;
$text-main: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-color: #ebeef5;
$bg-color: #f5f7fa;

/* 通用样式 */
.maintenance-order-container {
  background-color: $bg-color;
  min-height: 100vh;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  padding-bottom: 80px; // 留出底部按钮空间
}

/* 现代化卡片 */
.modern-card {
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  background: #fff;
  height: 100%;

  ::v-deep .el-card__body {
    padding: 20px;
  }
}

/* 浮动按钮 */
.todo-floating-btn {
  position: fixed;
  right: 20px;
  top: 250px;
  z-index: 99;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  font-size: 14px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
}

/* 顶部状态流 - 优化版 */
.status-section {
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.status-list-wrapper {
  display: flex;
  align-items: center;
  position: relative;

  .scroll-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f6fc;
    border-radius: 50%;
    cursor: pointer;
    color: $text-secondary;
    flex-shrink: 0;
    &:hover {
      background: $primary-color;
      color: #fff;
    }
  }
}

.status-list-scroller {
  flex: 1;
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  margin: 0 10px;
  padding-bottom: 5px; // 避免滚动条挡住阴影

  /* 隐藏滚动条但保留功能 */
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #dcdfe6;
    border-radius: 2px;
  }

  .status-step-item {
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 4px;

    .step-content {
      background: #f4f4f5;
      color: $text-secondary;
      padding: 8px 24px;
      border-radius: 4px;
      text-align: center;
      min-width: 140px;
      transition: all 0.3s;

      .step-title {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .step-time {
        font-size: 12px;
        transform: scale(0.9);
      }
    }

    .step-arrow {
      margin-left: 4px;
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 8px solid #dcdfe6;
    }

    &.active {
      .step-content {
        background: $primary-color;
        color: #fff;
        box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
      }
      .step-arrow {
        border-left-color: $primary-color;
      }
    }
  }
}

/* 主布局 Grid */
.main-content-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .left-panel {
    flex: 1; // 约 30%
    min-width: 350px; // 最小宽度防止太窄
  }
  .right-panel {
    flex: 3.5; // 约 70%
    min-width: 0; // 防止 flex 子项撑开溢出
  }
}

/* 信息列表样式优化 */
.info-list {
  font-size: 14px;

  .header-group {
    background: #f0f9eb;
    padding: 12px 12px 0px 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    border: 1px solid #e1f3d8;

    .label {
      color: #67c23a;
      font-weight: bold;
    }
  }

  .info-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    line-height: 1.5;

    .label {
      width: 90px;
      color: $text-secondary;
      flex-shrink: 0;
    }
    .value {
      flex: 1;
      color: $text-main;
      word-break: break-all;

      &.text-bold {
        font-weight: 600;
      }
      &.text-danger {
        color: $danger-color;
      }
      &.text-gray {
        color: $text-secondary;
      }
      &.action-text {
        color: $primary-color;
        cursor: pointer;
        position: relative;
      }

      .copy-btn {
        margin-left: 8px;
        color: $primary-color;
        cursor: pointer;
        font-size: 12px;
      }
    }

    &.small-row {
      margin-bottom: 8px;
      font-size: 13px;
    }
  }

  .bg-gray-box {
    background: #f9fafc;
    padding: 10px;
    border-radius: 4px;
    margin: 10px 0;
  }

  .cost-card {
    background: #fff6f6;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #faecd8;

    .value {
      text-align: right;
    }
    .total-row {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px dashed #e6a23c;
      align-items: center;

      .label {
        font-size: 15px;
        font-weight: bold;
        color: #303133;
      }

      .price-text {
        font-size: 20px;
        color: $danger-color;
        font-weight: bold;

        .unit {
          font-size: 12px;
        }
        .sub-text {
          font-size: 12px;
          color: $text-secondary;
          font-weight: normal;
        }
      }
    }
  }
}

/* 右侧面板样式 */
.master-tab-label {
  display: flex;
  align-items: center;

  .index-badge {
    background: $text-secondary;
    color: #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
  }
}

.master-detail-container {
  padding: 10px 0 20px 0;

  /* 每个大板块的通用间距 */
  .section-block {
    margin-bottom: $spacing-base;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 1. 基础信息 Grid 布局 */
.info-section {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* PC端默认4列 */
    gap: 20px;
    align-items: flex-start;
  }

  .info-item {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 12px;
      color: $text-secondary;
      margin-bottom: 6px;
    }
    .value {
      font-size: 14px;
      color: $text-main;
      font-weight: 500;
      word-break: break-all;
      line-height: 1.4;

      &.text-main {
        font-weight: bold;
        font-size: 15px;
      }
      .sub-tag {
        font-size: 12px;
        color: #666;
        font-weight: normal;
        margin-left: 2px;
      }
    }
  }
}

/* 2. 描述区域 (背景色) */
.desc-section {
  .desc-box {
    background: #fdf6ec; /* 浅黄色背景，对应截图 */
    padding: 16px 20px;
    border-radius: 4px;
    position: relative;

    /* 审核状态边框 */
    &.warning-border {
      border: 1px solid #e6a23c;
    }
    &.danger-border {
      border: 1px solid #e50014;
    }

    .desc-row {
      display: flex;
      gap: 40px;

      .desc-item {
        flex: 1;
        display: flex;
        flex-direction: column;

        .label {
          font-size: 13px;
          color: #909399;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .content {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          white-space: pre-wrap;
          font-weight: bold;
        }
      }
    }

    .desc-editBtn {
      position: absolute;
      right: 10px;
      top: 2px;
    }

    .reject-row {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #faecd8;
      color: $danger-color;
      font-size: 13px;
      .label {
        margin-right: 8px;
        font-weight: bold;
      }
    }
  }
}

/* 3. 图片区域 */
.image-section {
  .label-title {
    font-size: 13px;
    color: #909399;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .img-group-wrapper {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
  }

  .img-group {
    display: flex;
    // align-items: flex-start;
    align-items: center;

    .img-tag {
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 2px;
      margin-right: 8px;
      // margin-top: 15px; /* 对齐图片中间大概位置 */

      &.tag-blue {
        background: #ecf5ff;
        color: #409eff;
      }
      &.tag-green {
        background: #f0f9eb;
        color: #67c23a;
      }
    }

    .img-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .tiny-img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        border: 1px solid #eee;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}

/* 4. 表格区域 */
.table-section {
  .section-header {
    display: flex;
    justify-content: flex-start; /* 靠左 */
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;

    .title {
      font-weight: bold;
      font-size: 14px;
      color: #303133;
    }
  }

  .empty-text {
    text-align: center;
    color: #909399;
    padding: 15px 0;
    font-size: 13px;
    background: #fff;
    border: 1px solid $border-color;
    border-top: none;
  }
}

/* 5. 结算卡片区域 */
.settlement-section {
  .settlement-card {
    background: #fff6f6; /* 浅红色背景，对应截图 */
    border: 1px solid #faecd8; /* 浅红边框 */
    border-radius: 4px;
    overflow: hidden;

    .card-header {
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-title {
        font-size: 15px;
        font-weight: bold;
        color: #303133;
      }
      .total-price {
        font-size: 20px;
        color: $danger-color;
        font-weight: bold;
        .unit {
          font-size: 12px;
          margin-left: 2px;
          font-weight: normal;
          color: #333;
        }
      }
    }

    .dashed-divider {
      border-bottom: 1px dashed #f5c6c6;
      margin: 0 20px;
    }

    .card-body {
      padding: 15px 20px;

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr); /* 2列显示明细 */
        gap: 15px;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        font-size: 13px;

        .d-label {
          color: #606266;
        }
        .d-value {
          font-weight: 500;
          color: #303133;
          text-align: right;
        }

        .text-red {
          color: $danger-color;
        }
        .origin-price {
          font-size: 12px;
          color: #999;
          margin-left: 5px;
        }
      }

      .remark-row {
        margin-top: 15px;
        font-size: 13px;
        background: rgba(255, 255, 255, 0.6);
        padding: 5px 10px;
        border-radius: 4px;

        .d-label {
          font-weight: bold;
          color: #606266;
          margin-right: 5px;
        }
        .d-value {
          color: #333;
        }
      }
    }
  }
}

/* ------------------ */
/* 响应式媒体查询     */
/* ------------------ */

/* 平板尺寸 (max-width: 992px) */
@media (max-width: 992px) {
  .info-section .info-grid {
    grid-template-columns: repeat(2, 1fr); /* 变2列 */
    gap: 15px;
  }

  .desc-section .desc-box .desc-row {
    flex-direction: column; /* 描述上下排列 */
    gap: 15px;
  }
}

/* 手机尺寸 (max-width: 480px) */
@media (max-width: 480px) {
  .master-detail-container {
    padding: 0;

    .section-block {
      margin-bottom: 20px;
    }
  }

  /* 基础信息变单列 */
  .info-section .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* 结算明细变单列 */
  .settlement-section .settlement-card .card-body .detail-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  /* 表格横向滚动处理 */
  .responsive-table-wrapper {
    width: 100%;
    overflow-x: auto;

    /* 优化表格在手机上的显示 */
    ::v-deep .el-table {
      min-width: 600px; /* 强制表格最小宽度，触发滚动 */
    }
  }

  /* 图片组间距缩小 */
  .image-section .img-group-wrapper {
    gap: 15px;
  }
}

.text-gray {
  color: #909399;
}
.text-danger {
  color: #e50014;
}

/* 修复底部按钮栏样式，防止被覆盖 */
.operation-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding: 10px 20px;
  z-index: 100;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));

  .scrollable-btns {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;

    @media (max-width: 768px) {
      justify-content: flex-start;
      padding-right: 16px;
    }
  }
}

/* ------------------- */
/* 响应式适配媒体查询 */
/* ------------------- */

@media (max-width: 992px) {
  .main-content-grid {
    flex-direction: column;

    .left-panel,
    .right-panel {
      width: 100%;
      min-width: unset;
    }
  }

  // 表格不再强制在一行，允许横向滚动
  .responsive-table-wrapper {
    ::v-deep .el-table__body-wrapper {
      overflow-x: auto;
    }
  }
}

@media (max-width: 480px) {
  .maintenance-order-container {
    padding: 8px;
  }

  .modern-card ::v-deep .el-card__body {
    padding: 12px;
  }

  .info-list .info-row {
    // flex-direction: column; // 手机端标签和内容换行
    .label {
      margin-bottom: 2px;
    }
  }

  .master-settlement-card .detail-grid {
    grid-template-columns: 1fr; // 结算信息单列
  }

  // 弹窗宽度适配
  ::v-deep .el-dialog {
    width: 90% !important;
  }
}

.flex-center {
  display: flex;
  align-items: center;
}
.ml-5 {
  margin-left: 5px;
}
.hidden-preview {
  position: absolute;
  left: 0;
  top: 0;
  width: 61px;
  height: 19px;
  overflow: hidden;
  opacity: 0;
}

.warehouseSearchDialogTop {
  display: flex;
  align-items: center;
  .warehouseSearchDialogTopInput {
    margin-right: 10px;
  }
}
.warehouseSearchDialogList {
  height: 65vh;
  overflow: auto;
  padding: 10px 0;
}

.addFaultDialog {
  .searchBox {
    display: flex;
    align-items: center;
    .searchInp {
      margin-right: 10px;
    }
  }
  .tabelBox {
    margin: 15px 0;
  }
}
</style> 