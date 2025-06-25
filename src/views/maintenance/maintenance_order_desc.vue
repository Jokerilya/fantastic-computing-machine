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
          <el-tab-pane label="工单信息" name="工单信息">
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
                  <div>
                    {{ orderDetail.orderSn }}
                  </div>
                  <div
                    style="color: #409eff; cursor: pointer"
                    @click="copyOrderInfo"
                  >
                    复制工单信息
                  </div>
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
                  <div
                    style="margin-bottom: 0"
                    v-for="item in lablelList"
                    :key="item.value"
                  >
                    <div
                      v-if="orderDetail.label == item.value"
                      :style="{
                        color:
                          orderDetail.label == '普通'
                            ? '#409eff'
                            : orderDetail.label == '199'
                            ? '#67c23a'
                            : '#e6a23c',
                      }"
                    >
                      【{{ item.value }}】
                    </div>
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
                <div class="label">期望时间</div>
                <div class="value">{{ orderDetail.serviceTime }}</div>
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
                  @click="
                    goToVideoUrl(
                      orderDetail.videoList ? orderDetail.videoList[0] : null
                    )
                  "
                >
                  查看视图
                  <el-image
                    v-if="orderDetail.pictureList.length > 0"
                    class="previewImg"
                    :src="orderDetail.pictureList[0]"
                    :preview-src-list="orderDetail.pictureList"
                  >
                  </el-image>
                </div>
              </div>
              <div class="mainOrderInfo_item" v-if="orderDetail.onlineImages">
                <div class="label">验收凭证</div>
                <div
                  class="value"
                  style="color: #409eff; cursor: pointer"
                  @click="
                    goToVideoUrl(
                      orderDetail.onlineImages ? orderDetail.onlineImages : null
                    )
                  "
                >
                  查看凭证
                </div>
              </div>

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
              <div class="mainOrderInfo_item" style="font-weight: 700">
                <div class="label">企业应付</div>
                <div class="value">
                  {{ orderDetail.payAmount ? orderDetail.payAmount : 0 }}元
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">人工费</div>
                <div class="value">
                  {{ orderDetail.doorAmount ? orderDetail.doorAmount : 0 }}元
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">配件费</div>
                <div class="value">
                  {{ orderDetail.partsAmount ? orderDetail.partsAmount : 0 }}元
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
                <div class="label">师傅订单号</div>
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
              <div class="mainOrderInfo_item">
                <div class="label">现场故障描述</div>
                <div class="value">
                  {{ item.faultDescription ? item.faultDescription : "无" }}
                </div>
              </div>
              <div class="mainOrderInfo_item">
                <div class="label">处理过程</div>
                <div class="value">
                  {{ item.handleProcess ? item.handleProcess : "无" }}
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
                    @click="openAddEditPart(null, null, item)"
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
                    <!-- <el-table-column
                      align="center"
                      prop="number"
                      label="物料编码"
                      width="120"
                    >
                    </el-table-column> -->
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
                  <span
                    v-if="orderDetail.label != '普通'"
                    style="
                      font-weight: 400;
                      font-size: 12px;
                      color: red;
                      margin-left: 8px;
                    "
                  >
                    该订单为{{ orderDetail.label }}订单,师傅人工费固定为{{
                      orderDetail.label == "199" ? 100 : 200
                    }}元,不扣除质保金及平台抽成</span
                  >
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
                v-if="item.subStatus >= 3301"
                @click="handleOnlineOrder(orderDetail.orderSn)"
              >
                生成线上工单
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="sumbitQuotation(item.orderSn)"
                v-if="['2202'].includes(orderDetail.enterpriseSubStatus)"
                >确认报价</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="goAssignedMasterPage"
                v-if="
                  orderDetail.enterpriseSubStatus == 2001 ||
                  orderDetail.enterpriseSubStatus == 2101 ||
                  item.consultDoorAmount != null
                "
              >
                指派师傅
              </el-button>
              <el-button
                v-if="item.subStatus < 3502"
                type="primary"
                size="mini"
                @click="
                  openConsultPriceDialog(
                    item.orderSn,
                    item.doorAmount,
                    item.consultRemarks,
                    item.consultDoorAmount
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
                v-if="item.subStatus >= 3502 && nodeEnv == 'development'"
                type="primary"
                size="mini"
                @click="handleOrderRefund(item.orderSn)"
                >订单退款</el-button
              >
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
        <!-- ps:3.19之前 -->
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
        <!-- ps:3.19之后 -->
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
    <el-dialog
      :visible="cancelOrderDialog"
      width="50%"
      :before-close="closecancelOrderDialog"
    >
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
  </div>
</template>

<script>
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
} from "@/api/order.js";
import { UploadImg } from "@/api/system.js";
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
} from "@/api/proxy";
export default {
  data() {
    return {
      nodeEnv: null,
      maintenanceOrderDescWidth: null, //大盒子宽度
      orderSn: null,
      orderDetail: null,
      masterOrderTrackList: [], //多个师傅订单轨迹数组
      chooseMaster: 0, // 点击了哪个师傅 回显订单轨迹

      leftTabActiveName: "工单信息",
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

      cancelOrderDialog: false,
      delOrderinpValue: null,
    };
  },
  computed: {
    laborCostTxt: function () {
      const { amount, serviceAmount, retentionMoney } = this.consultCostParams;
      if (amount && serviceAmount && retentionMoney) {
        return (
          Number(this.consultCostParams.amount) -
          Number(this.consultCostParams.serviceAmount) -
          Number(this.consultCostParams.retentionMoney)
        );
      } else {
        return null;
      }
    },
  },
  methods: {
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
      let params = {
        orderSn: this.orderSn,
        cancelReason: this.delOrderinpValue,
      };
      cancelRepairOrder(params).then((res) => {
        if (res) {
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
    blurAmount(e) {
      this.consultCostParams.serviceAmount = (
        this.consultCostParams.amount * 0.25
      ).toFixed(2);
      this.consultCostParams.retentionMoney = (
        this.consultCostParams.amount * 0.1
      ).toFixed(2);
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
      };
      this.$refs["consultCostForm"].resetFields();
      this.consultPriceVisible = false;
    },
    // 打开协商价格框
    openConsultPriceDialog(orderSn, doorAmount, remarks, consultDoorAmount) {
      this.consultCostParams.orderSn = orderSn;
      this.consultCostParams.remarks = remarks ? remarks : "无";
      this.consultPriceVisible = true;
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
    handleOnlineOrder(orderSn) {
      this.$confirm("您确定要为该企业生成线上工单?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleOnlineOrder(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.getRepairOrderDetail();
        }
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
    openAddEditPart(row, index, item) {
      console.log(2316, index);

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

        // 需要加一个index 金蝶需要
        let indexArr = [];
        if (item.parts) {
          item.parts.forEach((i) => {
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

        if (!res.data.label) {
          res.data.label = "普通";
        }

        if (
          res.data.enrollRepairOrderOutList &&
          res.data.enrollRepairOrderOutList.length > 0
        ) {
          this.masterOrderTrackList = [];
          res.data.enrollRepairOrderOutList.forEach((item) => {
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
    // 工单信息
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
</style>
