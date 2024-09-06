<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <!-- 企业描述tab -->
      <el-tab-pane
        :label="
          data.examineStatus == 0 ? '(未审核)企业描述' : '(已审核)企业描述'
        "
        name="desc"
      >
        <div class="big_title">
          <div class="bigTitleLeft">
            <!-- <div class="item" style="color: red; font-size: 18px">
            <i style="font-style: normal" v-if="data.platformStatus === -1">
              师傅</i
            >{{ data.orderStatusName }}
          </div> -->
            <div class="item" style="margin-right: 40px">
              <div>企业订单号:</div>
              <div>{{ data.orderSn }}</div>
            </div>
            <div class="item">
              <div>下单时间:</div>
              <div>{{ data.createTime }}</div>
            </div>
          </div>
          <div>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="synchronizationJdOrder(data.orderSn)"
              >同步金蝶单据</el-button
            >
            <!-- <el-button
              size="mini"
              type="primary"
              plain
              @click="handleSystemCreateOrder(data.orderSn)"
              v-if="!(data.enterpriseSubStatus == -2001)"
            >
              机将大师傅接单
            </el-button> -->
            <el-button
              size="mini"
              type="primary"
              plain
              @click="goAssignedMasterPage"
              v-if="!(data.enterpriseSubStatus == -2001)"
            >
              指派师傅
            </el-button>
            <el-button
              v-if="
                data.enterpriseMainStatus > -1 && data.enterpriseMainStatus <= 4
              "
              type="primary"
              size="mini"
              plain
              @click="clickCancelOrderDialog"
              >取消订单</el-button
            >
          </div>
        </div>

        <div class="information" style="padding: 20px">
          <!-- 需求信息+企业信息 -->
          <div class="oneline">
            <div class="item1">需求信息:</div>
            <div class="item2">
              <div v-if="data.no">
                订单类型:
                <span>{{
                  data.orderType == 1
                    ? "散单"
                    : data.orderType == 2
                    ? "年保"
                    : "年卡"
                }}</span>
              </div>
              <div v-if="data.no">
                设备编码: <span>{{ data.no }}</span>
              </div>
              <div>
                设备产地: <span>{{ data.devicePlace }}</span>
              </div>
              <div>
                设备类型: <span>{{ data.deviceTypeName }}</span>
              </div>
              <div>
                设备品牌: <span>{{ data.deviceBrand }}</span>
              </div>
              <div>
                设备数量: <span>{{ data.num }}台</span>
              </div>
              <div>
                设备系统: <span>{{ data.deviceSystemName }}</span>
              </div>
              <div>
                期望时间: <span>{{ data.serviceTime }}</span>
              </div>
              <div>
                企业设备编号: <span>{{ data.enterpriseDeviceNo }}</span>
              </div>
              <div>
                企业设备位置: <span>{{ data.enterpriseDevicePosition }}</span>
              </div>
              <div>
                设备型号: <span>{{ data.deviceModel }}</span>
              </div>
              <div>
                出厂时间: <span>{{ data.factoryTime }}</span>
              </div>
              <div>
                故障描述: <span>{{ data.simpleDesc }}</span>
              </div>

              <div
                v-if="
                  (data.videoList && data.videoList[0]) ||
                  (data.pictureList && data.pictureList[0])
                "
              >
                故障部位: <span>{{ data.position }}</span>
              </div>
              <div
                v-if="
                  (data.videoList && data.videoList[0]) ||
                  (data.pictureList && data.pictureList[0])
                "
              >
                故障视图:
                <span>
                  <el-button
                    size="small"
                    type="text"
                    @click="viewVideo(data.videoList[0] || data.pictureList[0])"
                    >查看视图</el-button
                  >
                </span>
              </div>
            </div>
            <div class="item3">企业信息:</div>
            <div class="item4">
              <div>
                企业名称: <span>{{ data.enterpriseName }}</span>
              </div>
              <div>
                联系人员: <span>{{ data.contactsPeople }}</span>
              </div>
              <div>
                联系电话: <span>{{ data.phone }}</span>
              </div>
              <div>
                联系地址: <span>{{ data.address }}</span>
              </div>
            </div>
          </div>
          <!-- 创建人 操作人 -->
          <div class="people">
            <div class="createPeople" v-if="data.createPeople">
              <div class="title">创建人:</div>
              <div class="content">{{ data.createPeople }}</div>
            </div>
            <div class="handlePeople" v-if="data.operationPeople">
              <div class="title">负责人:</div>
              <div class="content">{{ data.operationPeople }}</div>
            </div>
          </div>

          <!-- 故障描述 -->
          <!-- <div class="twoline">
            <div class="title">故障描述:</div>
            <div class="content">{{ data.simpleDesc }}</div>
          </div>
          <div class="twoline" v-if="data.originType">
            <div class="title">故障类型:</div>
            <div class="content">
              <span v-if="data.originType.includes(1)">电气故障 </span>
              <span v-if="data.originType.includes(2)"> 机械故障 </span>
              <span v-if="data.originType.includes(3)"> 系统故障</span>
            </div>
          </div>
          <div
            class="threeline"
            v-if="!(data.pictureList === null && data.videoList === null)"
          >
            <div class="title">设备视图:</div>
            <div>
              <el-image
                v-for="item in data.pictureList"
                :key="item"
                :src="item"
                style="width: 300px; height: 300px; margin-right: 40px"
                :preview-src-list="data.pictureList"
              />
              <video
                style="margin-right: 40px"
                width="300px"
                height="300px"
                v-for="item in data.videoList"
                :key="item"
                :src="item"
                controls="true"
              ></video>
            </div>
          </div> -->
        </div>

        <!-- 故障解决方案 -->
        <el-descriptions title="故障解决方案" v-if="judgeFault()" :column="1">
          <el-descriptions-item
            v-for="(item, index) in data.programmeList"
            :key="item.desc + index"
            :label="'解决方案'"
          >
            <el-row style="font-size: 12px !important">
              <el-col :span="24">
                <span>故障描述：</span>
                {{ item.desc }}
              </el-col>
              <el-col :span="24">
                <span>故障分析：</span>
                {{ item.analysis }}
              </el-col>
              <el-col :span="24">
                <span>维保方案:</span>
                {{ item.programme }}
              </el-col>
            </el-row>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>

      <!-- 检测结果tab -->
      <el-tab-pane
        :label="`${item.realName}报价明细`"
        :name="`meg${index}`"
        v-for="(item, index) in data.enrollRepairOrderOutList"
        :key="item.realName"
      >
        <div class="big_title">
          <div class="bigTitleLeft">
            <!-- <div class="item" style="color: red; font-size: 18px">
            <i style="font-style: normal" v-if="data.platformStatus === -1">
              师傅</i
            >{{ data.orderStatusName }}
          </div> -->
            <!-- <div class="item" style="margin-right: 40px">
              <div>企业订单号:</div>
              <div>{{ data.orderSn }}</div>
            </div>
            <div class="item" style="margin-right: 40px">
              <div>师傅订单号:</div>
              <div>{{ item.orderSn }}</div>
            </div> -->
            <div class="item" style="margin-right: 40px">
              <div>{{ data.orderSn }}</div>
              /
              <div>{{ item.orderSn }}</div>
            </div>
            <div class="item" style="margin-right: 40px">
              <div>设备编码:</div>
              <div>{{ data.no }}</div>
            </div>
            <div class="item" style="margin-right: 40px">
              <div>订单状态:</div>
              <div>{{ item.subStatusName }}</div>
            </div>
            <div class="item" style="color: red">
              <span v-if="item.discountFlag === 0">(不纳入折扣)</span>
            </div>
          </div>
          <div v-if="index != data.enrollRepairOrderOutList.length - 1">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="
                openConsultPriceDialog(
                  item.orderSn,
                  item.doorAmount,
                  item.partsAmount
                )
              "
              >协商费用</el-button
            >
          </div>
          <div v-if="index == data.enrollRepairOrderOutList.length - 1">
            <!-- 代企业操作 -->
            <el-dropdown style="margin-right: 10px">
              <el-button size="mini" plain type="success">
                代企业操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><div @click="handleProxyConfirmQuotation(item.orderSn)">
                    代企业确认师傅报价
                  </div></el-dropdown-item
                >
                <el-dropdown-item
                  ><div @click="handleEnterpriseCheck(item.orderSn)">
                    代企业确认验收
                  </div></el-dropdown-item
                >
                <el-dropdown-item
                  ><div @click="handleProxyPayment(item.orderSn)">
                    代企业付款
                  </div></el-dropdown-item
                >
                <!-- <el-dropdown-item>代企业发布评价</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 代师傅操作 -->
            <el-dropdown style="margin-right: 10px">
              <el-button type="warning" size="mini" plain>
                代师傅操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><div @click="openRemindStartedDialog(item.orderSn)">
                    代师傅开始出发
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="openHandlePhotographPunchDialog(item.orderSn)">
                    代师傅拍照打卡
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleMasterQuotation(item.orderSn)">
                    代师傅提交检测报价
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleStartService(item.orderSn)">
                    代师傅开始服务
                  </div>
                </el-dropdown-item>
                <el-dropdown-item
                  ><div @click="openSubmitAcceptanceDialog(item.orderSn)">
                    代师傅提交验收
                  </div></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>

            <!-- <el-button
              type="primary"
              size="mini"
              plain
              v-if="item.subStatus >= 3201"
              @click="markOrderCompletion(item.orderSn)"
              >标记完成</el-button
            > -->
            <el-button
              type="primary"
              size="mini"
              plain
              @click="openOrderDiscountDialog(item.orderSn, item.discountFlag)"
              >订单折扣</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="
                openConsultPriceDialog(
                  item.orderSn,
                  item.doorAmount,
                  item.partsAmount
                )
              "
              >协商费用</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              @click="sumbitQuotation(item.orderSn)"
              v-if="['2202'].includes(data.enterpriseSubStatus)"
              >确认报价</el-button
            >
            <!-- <el-button type="primary" size="mini" plain @click="platformPayInit()">打款至师傅</el-button> -->
            <!-- v-if="data.platformStatus > 0 && data.enterpriseMainStatus <= 4" -->
            <el-button
              size="mini"
              type="primary"
              plain
              @click="goAssignedMasterPage"
              v-if="!(data.enterpriseSubStatus == -2001)"
            >
              指派师傅
            </el-button>
            <el-button
              v-if="
                data.enterpriseMainStatus > -1 && data.enterpriseMainStatus <= 4
              "
              type="primary"
              size="mini"
              plain
              @click="clickCancelOrderDialog"
              >取消订单</el-button
            >

            <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="_handleMasterPayment()"
            v-if="['3502'].includes(data.masterSubStatus)"
            >打款至师傅</el-button
          > -->
          </div>
        </div>

        <div class="meg">
          <!-- 师傅联系方式 -->
          <div class="masterContact">
            <div class="title">师傅联系方式:</div>
            <div class="item">
              <span class="label">联系人:</span>
              <span class="content">{{ item.realName }}</span>
            </div>
            <div class="item">
              <span class="label">联系电话:</span>
              <span class="content">{{ item.phone }}</span>
            </div>
          </div>
          <div class="masterContact" v-if="item.punchTime">
            <div class="title">师傅到点打卡:</div>
            <div class="item">
              <span class="label">打卡时间:</span>
              <span class="content">{{ item.punchTime }}</span>
            </div>
            <div class="item">
              <span class="label">打卡图片:</span>
              <span class="content">
                <el-image
                  style="height: 80px; width: 80px"
                  :src="item.punchImages"
                  :preview-src-list="[item.punchImages]"
                ></el-image>
              </span>
            </div>
          </div>
          <!-- 故障解决方案 -->
          <div class="solvePlan">
            <div class="title">
              <div>故障项目方案:</div>
              <el-button
                type="primary"
                @click="openAddFaultDialog(item.orderSn)"
              >
                新增故障项目</el-button
              >
            </div>

            <el-table :data="item.faults" :key="Math.random()">
              <el-table-column label="故障编码" prop="code" align="center">
              </el-table-column>
              <el-table-column label="机床类型" align="center">
                <template slot-scope="{ row }">
                  {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
                </template>
              </el-table-column>
              <el-table-column label="故障部位" prop="position" align="center">
              </el-table-column>
              <el-table-column
                label="故障描述"
                prop="simpleDesc"
                align="center"
              ></el-table-column>
              <el-table-column label="师傅价格" align="center">
                <template slot-scope="{ row }">
                  {{ row.masterAmount ? row.masterAmount : "0" }}
                </template>
              </el-table-column>
              <el-table-column
                label="年保企业价格"
                align="center"
                v-if="data.orderType != 1"
              >
                <template slot-scope="{ row }">
                  {{ row.annualAmount }}
                </template>
              </el-table-column>
              <el-table-column
                label="散单企业价格"
                align="center"
                v-if="data.orderType == 1"
              >
                <template slot-scope="{ row }">
                  {{ row.generalAmount }}
                </template>
              </el-table-column>
              <el-table-column label="师傅协商价格" align="center">
                <template slot-scope="{ row }">
                  {{ row.masterConsultAmount ? row.masterConsultAmount : 0 }}
                </template>
              </el-table-column>
              <el-table-column label="企业协商价格" align="center">
                <template slot-scope="{ row }">
                  {{
                    row.enterpriseConsultAmount
                      ? row.enterpriseConsultAmount
                      : 0
                  }}
                </template>
              </el-table-column>
              <el-table-column label="故障视频" align="center">
                <template slot-scope="{ row }">
                  <!-- <video
                    v-if="row.image && row.image[1]"
                    height="100px"
                    width="100px"
                    :src="row.image[1]"
                    controls
                    preload
                  ></video> -->
                  <el-button
                    v-if="row.image && row.image[1]"
                    size="small"
                    type="text"
                    @click="viewVideo(row.image[1])"
                    >查看视频</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="故障图片" align="center">
                <template slot-scope="{ row }">
                  <el-image
                    v-if="row.image && row.image[0]"
                    style="width: 100px; height: 100px; margin-right: 20px"
                    :src="row.image[0]"
                    :preview-src-list="[row.image[0]]"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button
                    type="text"
                    @click="
                      openExamineFaultsDialog(row, item.orderSn, data.orderType)
                    "
                    >修改</el-button
                  >
                  <el-button
                    type="text"
                    @click="delSolvePlan(row, item.orderSn)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 配件明细部分 -->
          <div class="peijian" style="margin-top: 30px">
            <div class="peijianTitle">配件明细:</div>
            <!-- 确认报价前都可新增 -->
            <el-button
              type="primary"
              @click="openAddEditPart(null, null, item.orderSn)"
              >新增配件</el-button
            >
            <el-button type="primary" v-if="false" @click="oneClickSendrepairFn"
              >一键寄修</el-button
            >
          </div>
          <div class="addPartcs">
            <el-table :data="item.parts" :key="Math.random()">
              <el-table-column
                align="center"
                prop="name"
                label="配件图片"
                width="110"
              >
                <template slot-scope="{ row }">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="row.image && row.image.split(',')[0]"
                    :preview-src-list="row.image && row.image.split(',')"
                  ></el-image>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="配件模式">
                <template slot-scope="{ row }">
                  {{ row.model == 1 ? "外发维修" : "采买新件" }}
                </template>
              </el-table-column>
              <el-table-column label="采买角色" align="center" width="100">
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
              <el-table-column align="center" prop="name" label="配件名称">
              </el-table-column>
              <el-table-column
                align="center"
                prop="num"
                label="配件数量"
                width="80"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="price"
                label="配件单价"
                width="80"
              >
              </el-table-column>
              <el-table-column align="center" label="配件品牌">
                <template slot-scope="{ row }">
                  <div
                    :class="[
                      row.type === 1 && !row.brandId ? 'inquireBrandNone' : '',
                    ]"
                  >
                    {{ row.brand }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="parameter" label="配件参数">
              </el-table-column>
              <el-table-column align="center" prop="number" label="物料编码">
              </el-table-column>

              <el-table-column align="center" label="配件总金额" width="100">
                <template slot-scope="{ row }">
                  <div style="color: red">￥{{ row.num * row.price }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="快递公司" width="100">
                <template slot-scope="{ row }">
                  {{
                    row.expressType == 1
                      ? "顺丰"
                      : row.expressType == 2
                      ? "货拉拉"
                      : "无"
                  }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="供应商">
                <template slot-scope="{ row }">
                  {{ row.supplierName ? row.supplierName : "无" }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="remarks" label="备注">
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="text"
                    v-if="
                      (row.type == 2 && data.enterpriseSubStatus > 2202) ||
                      (data.enterpriseSubStatus > 2202 &&
                        row.model == 2 &&
                        row.type == 2)
                    "
                    @click="
                      goToLogisticsDetails(row.id, row.model, item.orderSn)
                    "
                    >物流详情</el-button
                  >
                  <el-button
                    v-if="row.status == 1 && row.model == 1"
                    type="text"
                    @click="openSetLogistics(row, item.orderSn)"
                  >
                    物流设置
                  </el-button>
                  <el-button
                    type="text"
                    @click="openAddEditPart(row, $index, item.orderSn)"
                    >修改</el-button
                  >
                  <!-- <el-button
                    v-if="row.status == 1"
                    type="text"
                    @click="openExaminePartsDialog(row, item.orderSn)"
                    >审核</el-button
                  > -->
                  <el-button
                    type="text"
                    @click="delPartsList(row, item.orderSn)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 完工信息 -->
          <div class="finishWork" v-if="item.completePictureList">
            <div class="title">完工信息:</div>
            <div
              class="pic"
              v-for="item in item.completePictureList"
              :key="item"
            >
              <el-image
                v-if="item"
                style="width: 150px; height: 150px; margin-right: 20px"
                lazy
                :src="item"
                :preview-src-list="item.completePictureList"
              ></el-image>
            </div>
          </div>

          <!-- 完工照片 -->
          <div class="finishWork" v-if="item.completeImages">
            <div class="title">完工照片</div>
            <div v-for="src in item.completeImages" :key="src">
              <el-image
                v-if="src"
                :src="src"
                style="width: 150px; height: 150px; margin-right: 20px"
                lazy
                :preview-src-list="[src]"
              ></el-image>
            </div>
          </div>

          <!-- 工单图片 -->
          <div class="finishWork">
            <div class="title">
              <div>工单图片</div>
              <el-upload
                action="#"
                :data="{ orderSn: item.orderSn }"
                :show-file-list="false"
                :http-request="handleOfflineImages"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </div>
            <div v-if="item.offlineImages">
              <el-image
                :src="item.offlineImages"
                style="width: 150px; height: 150px; margin-right: 20px"
                lazy
                :preview-src-list="[item.offlineImages]"
              ></el-image>
            </div>
          </div>

          <!-- 客户评价 -->
          <div class="customerEvaluate" v-if="item.repairComment">
            <div
              class="title"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 250px;
              "
            >
              <div>客户评价:</div>
            </div>
            <div class="descPic">
              <div class="item">
                <div class="label">满意程度:</div>
                <div>
                  {{ markTrunText[item.repairComment.serviceScore + 2] }}
                </div>
              </div>
              <div class="item">
                <div class="label">评价内容:</div>
                <div>
                  {{ item.repairComment.content }}
                </div>
              </div>
              <div class="item" v-if="repairCommentImage">
                <div class="label">评价图片:</div>
                <el-image
                  v-for="item1 in repairCommentImage"
                  :key="item1"
                  lazy
                  :src="item1"
                  style="width: 150px; height: 150px; margin-right: 20px"
                  :preview-src-list="repairCommentImage"
                ></el-image>
              </div>
              <div class="item">
                <div class="label1">客服回访描述:</div>
                <div v-if="item.repairComment.platformVisitMessage">
                  {{ item.repairComment.platformVisitMessage }}
                </div>
                <div style="position: relative" v-else>
                  <el-input
                    v-model="platformVisitMessage"
                    type="textarea"
                    :rows="4"
                    style="width: 500px"
                    placeholder="填写电话回访记录,以便考核师傅"
                    resize="none"
                  ></el-input>
                  <div style="position: absolute; right: 15px; bottom: 10px">
                    <el-button
                      style="
                        width: 85px;
                        background-color: #2e4c9e;
                        height: 35px;
                        color: #fff;
                      "
                      @click="addReturnVistInfo"
                      >确定</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 订单费用 v-if="judgeOrderCost()" -->
          <div class="information">
            <div class="oneline">
              <div class="item1">订单费用:</div>
              <div class="item2">
                <div v-if="index == data.enrollRepairOrderOutList.length - 1">
                  <div style="font-weight: 700">企业付款</div>
                  <div>
                    上门费: <span>￥{{ item.enterpriseDoorAmount }}元</span>
                  </div>
                  <div>
                    配件费: <span>￥{{ item.enterprisePartsAmount }}元</span>
                  </div>
                  <div>
                    支付金额: <span>￥{{ item.enterprisePayAmount }}元</span>
                  </div>
                  <div>
                    总金额:
                    <span style="color: red"
                      >￥{{ item.enterpriseTotalAmount }}元</span
                    >
                  </div>
                </div>

                <div style="font-weight: 700">师傅收款</div>
                <div>
                  人工费: <span>￥{{ item.doorAmount }}元</span>
                </div>

                <div>
                  配件费: <span>￥{{ item.partsAmount }}元</span>
                </div>
                <div>
                  交通费: <span>￥{{ item.otherAmount }}元</span>
                </div>

                <!-- <div v-if="data.enterpriseSubStatus >= 2201">
                  <div style="font-weight: 700">师傅收款</div>
                  <div>
                    人工费: <span>￥{{ item.masterDoorAmount }}元</span>
                  </div>
                  <div>
                    配件费: <span>￥{{ item.masterPartsAmount }}元</span>
                  </div>
                  <div>
                    交通费: <span>￥{{ item.otherAmount }}元</span>
                  </div>
                  <div v-if="item.repairComment">
                    评价扣款:
                    <span style="margin-right: 10px"
                      >￥{{ item.deductAmount }}元</span
                    >
                    <el-button
                      v-if="!(item.orderStatusName == '已完成')"
                      size="small"
                      style="background-color: #2e4c9e; color: #fff"
                      @click="openEditBadPirce"
                      >修改</el-button
                    >
                  </div>
                </div> -->
                <div v-if="data.enterpriseSubStatus >= 2202">
                  <div>
                    权益奖励:
                    <span
                      >￥{{
                        item.premiumAmount ? item.premiumAmount : 0
                      }}元</span
                    >
                  </div>
                  <div>
                    平台抽成:
                    <span
                      >￥{{
                        item.serviceAmount ? item.serviceAmount : 0
                      }}元</span
                    >
                  </div>
                  <div>
                    评价扣款:
                    <span style="color: red"
                      >￥{{ item.deductAmount ? item.deductAmount : 0 }}元</span
                    >
                  </div>
                </div>
                <div>
                  <div>
                    订单费用调整:
                    <span
                      >￥{{
                        item.faultReductionAmount
                          ? item.faultReductionAmount
                          : 0
                      }}元</span
                    >
                    <!-- <span v-if="item.discountRemark"
                      >({{ item.discountRemark }})</span
                    > -->
                    <el-button
                      style="margin-left: 20px"
                      type="primary"
                      @click="
                        openFaultDeratePriceDialog(
                          item.orderSn,
                          item.faultReductionAmount,
                          item.faultReductionRemark
                        )
                      "
                      >设置</el-button
                    >
                  </div>
                  <div>
                    调整费用备注:
                    <span>{{ item.faultReductionRemark }}</span>
                  </div>
                  <div>
                    折扣金额:
                    <span>￥{{ item.discountAmount }}元</span>
                  </div>
                  <div>
                    折扣标识描述:
                    <span>{{ item.discountRemark }}</span>
                  </div>
                  <div>
                    最终协商价:
                    <span style="color: red"
                      >￥{{
                        item.consultAmount ? item.consultAmount : 0
                      }}元</span
                    >
                    <span v-if="item.consultRemarks">
                      (备注:{{ item.consultRemarks }})
                    </span>
                  </div>
                  <div>
                    合计:
                    <span style="color: red">￥{{ item.totalAmount }}元</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 取消订单原因 -->
          <div class="cancelOrder" v-if="item.cancelReason">
            <div class="title">取消订单原因:</div>
            <div class="content">{{ item.cancelReason }}</div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 操作日志tab -->
      <el-tab-pane label="操作日志" name="log">
        <!-- <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{
            util.global.getLabel("mainStatus", data.enterpriseMainStatus)
          }}</span>
        </div> -->
        <el-table :data="data.orderNodeOutList" border style="width: 100%">
          <el-table-column prop="createTime" label="时间"></el-table-column>
          <el-table-column prop="type" label="状态所属方">
            <template slot-scope="{ row }">{{
              util.global.getLabel("operator", row.operator)
            }}</template>
          </el-table-column>
          <el-table-column prop="node" label="操作节点"></el-table-column>
          <el-table-column prop="personnel" label="操作人员"> </el-table-column>
          <el-table-column prop="simpleDesc" label="节点描述"></el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 操作日志(旧)tab -->
      <el-tab-pane label="操作日志(旧)" name="oldLog">
        <!-- <div class="big_title">
          <span>订单号：{{ data.orderSn }}</span>
          <span>{{
            util.global.getLabel("mainStatus", data.enterpriseMainStatus)
          }}</span>
        </div> -->
        <el-table :data="data.orderTrackOutList" border style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="simpleDesc" label="描述"></el-table-column>
          <el-table-column fixed prop="operator" label="业务触发方">
            <template slot-scope="{ row }">{{
              util.global.getLabel("operator", row.operator)
            }}</template>
          </el-table-column>
          <el-table-column prop="type" label="状态所属方">
            <template slot-scope="{ row }">{{
              util.global.getLabel("operator", row.type)
            }}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="触发时间"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 确认报价的模态框 -->
    <model
      ref="quotationForm"
      title="确认报价"
      @ok="sumbitQuotation"
      @close="resetQuotationForm"
    >
      <el-form
        :model="quotationForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="状态"
          prop="status"
          style="width: calc(100% - 120px)"
        >
          <el-radio-group v-model="quotationForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
              @change="changeStuta(item)"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="驳回原因"
          prop="rejectReason"
          style="width: calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="quotationForm.rejectReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </model>

    <!-- 确认验收的模态框 -->
    <!-- <model
      ref="checkForm"
      title="确认验收"
      @ok="sumbitCheck"
      @close="resetCheckForm"
    >
      <el-form
        :model="checkForm"
        status-icon
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="状态"
          prop="status"
          style="width: calc(100% - 120px)"
        >
          <el-radio-group v-model="checkForm.status">
            <el-radio
              v-for="item in util.global.rejectStatus"
              :key="item.label"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="驳回原因"
          prop="rejectReason"
          style="width: calc(100% - 120px)"
        >
          <el-input
            type="text"
            v-model="checkForm.rejectReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </model> -->

    <!-- 打款信息的模态框 -->
    <model
      ref="platform"
      title="打款信息"
      @ok="sumbitPlatformPay()"
      @close="resetPlatformPay"
    >
      <el-form status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="师傅卡号" style="width: calc(100% - 120px)">{{
          data.bankCode
        }}</el-form-item>
        <el-form-item label="所属银行" style="width: calc(100% - 120px)">{{
          data.bankName
        }}</el-form-item>
        <!-- 请核实打款信息，再点击确认按钮 -->
      </el-form>
    </model>

    <!-- 设置故障减免费用 -->
    <el-dialog
      title="设置故障减免费用"
      width="40%"
      center
      :show-close="false"
      :visible="faultDeratePriceVisible"
    >
      <el-form
        :model="faultDeratePriceParams"
        :rules="faultDeratePriceParamsRules"
        ref="faultDeratePriceParamsRef"
        label-width="150px"
      >
        <el-form-item label="订单费用调整" prop="amount">
          <el-input
            @mousewheel.native.prevent
            type="number"
            v-model.number="faultDeratePriceParams.amount"
            placeholder="填写订单费用调整"
          ></el-input>
        </el-form-item>
        <el-form-item label="调整费用备注" prop="remark">
          <el-input
            v-model="faultDeratePriceParams.remark"
            placeholder="填写调整费用备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeFaultDeratePriceDialog">取 消</el-button>
        <el-button type="primary" @click="confirmSetFaultDeratePrice"
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

    <!-- 审核配件 -->
    <el-dialog
      title="审核配件"
      width="30%"
      :visible="examineParts"
      :before-close="closeExaminePartsDialog"
      :close-on-click-modal="false"
    >
      <el-form label-position="left" label-width="80px">
        <el-form-item label="物料编码">
          <el-input
            placeholder="请输入物料编码"
            v-model.trim="examinePartsForm.number"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件名称">
          <el-input
            placeholder="请输入配件名称"
            v-model.trim="examinePartsForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件参数">
          <el-input
            placeholder="请输入配件参数"
            v-model.trim="examinePartsForm.parameter"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件单价">
          <el-input-number
            :min="1"
            :max="9999"
            v-model="examinePartsForm.price"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="配件品牌">
          <el-input
            placeholder="请输入配件品牌"
            v-model.trim="examinePartsForm.brand"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件数量">
          <el-input-number
            :min="1"
            :max="99"
            v-model="examinePartsForm.num"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeExaminePartsDialog">取 消</el-button>
        <el-button @click="comfirmExamineParts" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 审核项目 -->
    <el-dialog
      title="审核故障项目"
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
        <el-form-item label="师傅展示价格">
          <el-input
            placeholder="请输入师傅展示价格"
            type="number"
            @mousewheel.native.prevent
            disabled
            v-model.number="examineFaultsForm.masterAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="年保企业价格">
          <el-input
            placeholder="请输入年保企业价格"
            type="number"
            disabled
            @mousewheel.native.prevent
            v-model.number="examineFaultsForm.annualAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="散单企业价格">
          <el-input
            placeholder="请输入散单企业价格"
            type="number"
            disabled
            @mousewheel.native.prevent
            v-model.number="examineFaultsForm.generalAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="师傅协商价格">
          <el-input
            placeholder="请输入师傅协商价格"
            type="number"
            @mousewheel.native.prevent
            v-model.number="examineFaultsForm.masterConsultAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业协商价格">
          <el-input
            placeholder="请输入企业协商价格"
            type="number"
            @mousewheel.native.prevent
            v-model.number="examineFaultsForm.enterpriseConsultAmount"
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
                @click="viewVideo(examineFaultsFormVideoList[0].url)"
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

    <!-- 一键寄修 -->
    <el-dialog
      title="一键寄修"
      width="25%"
      :before-close="closeOneClickSendrepair"
      :close-on-click-modal="false"
      :visible="oneClickSendrepair"
      center
    >
      <div class="oneClickSendrepair">
        <h3>请确定寄修信息:</h3>
        <div class="oneClickSendrepairList">
          <div
            class="oneClickSendrepairItem"
            v-for="item in data.partsList"
            :key="item.name"
          >
            <div v-if="item.model == 1">
              <div class="oneClickSendrepairItem_top">
                <el-image
                  :src="item.image"
                  class="oneClickSendrepairItem_image"
                  :preview-src-list="[item.image]"
                ></el-image>
                <div class="oneClickSendrepairItem_top_line">
                  <div style="font-weight: 700">{{ item.name }}</div>
                  <div>数量:{{ item.num }}</div>
                  <div>品牌:{{ item.brand }}</div>
                  <div>参数:{{ item.parameter }}</div>
                </div>
              </div>
              <div class="oneClickSendrepairItem_line">
                维修公司:{{ item.supplierName }}
              </div>
              <div class="oneClickSendrepairItem_line">
                维修范围:{{ item.businessScope }}
              </div>
              <div class="oneClickSendrepairItem_line">
                物流方式:{{ item.expressType == 1 ? "顺丰" : "货拉拉" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOneClickSendrepair">取 消</el-button>
        <el-button @click="confirmSendrepair" type="primary">确 定</el-button>
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
      <div style="width: 100%">
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
          <!-- v-if="partInfo.type == 2" -->
          <el-form-item label="物料编码">
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
          <el-form-item label="配件故障">
            <el-input
              v-model="partInfo.remarks"
              placeholder="请输入配件故障"
            ></el-input>
          </el-form-item>
          <el-form-item label="配件单价" prop="price">
            <el-input
              type="number"
              v-model.number="partInfo.price"
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

    <!-- 修改差评金额 -->
    <el-dialog
      title="修改差评金额"
      width="30%"
      :visible="editBadPirceShow"
      center
    >
      <div>
        <el-form label-position="left" label-width="60px">
          <el-form-item label="方式:">
            <el-radio-group v-model="editBadPirceData.operateType">
              <el-radio :label="1">增加</el-radio>
              <el-radio :label="2">扣除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="金额:">
            <el-input
              v-model.number="editBadPirceData.amount"
              type="number"
              placeholder="请填写您要修改的差评金额"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="confirmEditBadPirce">确 定</el-button>
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
            <el-table-column label="故障编码" prop="code"> </el-table-column>
            <el-table-column label="机床类型">
              <template slot-scope="{ row }">
                {{ row.machineType == 1 ? "加工中心" : "数控车床" }}
              </template>
            </el-table-column>
            <el-table-column label="项目部位" prop="position">
            </el-table-column>
            <el-table-column label="项目描述" prop="simpleDesc">
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

    <!-- 协商费用 -->
    <el-dialog
      title="协商费用(该功能仅支持异常订单使用)"
      width="40%"
      center
      :visible="consultPriceVisible"
      :close-on-click-modal="false"
      :before-close="closeConsultPriceDialog"
    >
      <div class="consultPriceDialog">
        <el-form
          :model="consultCostParams"
          :rules="consultCostRules"
          ref="consultCostForm"
          label-position="left"
          label-width="120px"
        >
          <!-- <el-form-item label="类型" prop="type">
            <el-radio-group v-model="consultCostParams.type">
              <el-radio :label="1">企业支付费用</el-radio>
              <el-radio :label="2">师傅支付费用</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="是否纳入折扣" prop="flag">
            <el-radio-group v-model="consultCostParams.flag">
              <el-radio :label="0">不纳入</el-radio>
              <el-radio :label="1">纳入</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="协商金额" prop="amount">
            <el-input
              type="number"
              v-model.number="consultCostParams.amount"
              placeholder="请输入协商金额"
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

    <!-- 订单折扣 -->
    <el-dialog
      title="订单折扣"
      width="40%"
      center
      :visible="orderDiscountVisible"
      :close-on-click-modal="false"
      :before-close="closeOrderDiscountDialog"
    >
      <div class="orderDiscount">
        <el-form label-position="right" label-width="250px">
          <el-form-item label="是否使用:">
            <el-radio-group v-model="handleOrderDiscountFlagParams.flag">
              <el-radio :label="0">不计算折扣</el-radio>
              <el-radio :label="1">计算折扣</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrderDiscountDialog"> 取 消</el-button>
        <el-button type="primary" @click="confirmOrderDiscount"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 代师傅操作 -->
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
        <el-button @click="closeHandlePhotographPunchDialog"> 取 消</el-button>
        <el-button type="primary" @click="handlePhotographPunch"
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
          <el-form-item label="工单照片" prop="offlineImages">
            <el-upload
              :file-list="offlineImagesList"
              ref="uploadOfflineImagesRef"
              :http-request="uploadOfflineImages"
              :on-remove="delOfflineImages"
              :limit="1"
              action="#"
              list-type="picture-card"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
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
  </div>
</template>

<style lang="less" scoped>
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

.hiddenUploadBox {
  width: 460px;
  overflow: hidden;
  white-space: nowrap;
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

.oneClickSendrepair {
  .oneClickSendrepairList {
    padding-top: 20px;
    .oneClickSendrepairItem {
      padding: 10px;
      border-bottom: 1px solid #efefef;
      .oneClickSendrepairItem_top {
        display: flex;
        align-items: center;
        .oneClickSendrepairItem_image {
          width: 90px;
          height: 90px;
          margin-right: 20px;
        }
        .oneClickSendrepairItem_top_line {
          height: 90px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }
      }

      .oneClickSendrepairItem_line {
        margin-top: 10px;
      }
    }
  }
}

.inquireBrandNone {
  background-color: red;
  color: #fff;
}

.addPartcs {
  padding: 30px 0;
  .item {
    height: 50px;
    line-height: 50px;
    display: flex;
    width: 250px;
    justify-content: space-between;
    font-size: 18px;
    position: relative;

    .procurementLogo {
      position: absolute;
      left: -48px;
      top: 8px;
    }
  }
}
.peijian {
  display: flex;
  align-items: center;
  .peijianTitle {
    font-size: 20px;
    margin-right: 20px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #707070;
  }
}
.customerEvaluate {
  margin: 20px 0;
  .title {
    width: 150px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .descPic {
    .item {
      display: flex;
      color: #0b2059;
      font-size: 18px;
      margin-bottom: 15px;
      .label {
        color: #707070;
        width: 220px;
      }
      .label1 {
        width: 220px;
        color: #707070;
      }
    }
  }
}
// 服务进度
.servicePlan {
  .topLine {
    display: flex;
    align-items: center;
    .title {
      width: 150px;
      color: #707070;
      font-size: 20px;
      font-weight: 600;
    }
    .annotation {
      color: #999999;
      font-size: 18px;
    }
  }
  .releaseDesc {
    margin: 20px 0;
    display: flex;
    .title {
      width: 150px;
      color: #999999;
      font-size: 18px;
      font-weight: 700;
    }
    .inp {
      width: 70%;
      position: relative;

      .confirmBtn {
        position: absolute;
        right: 15px;
        bottom: 10px;
        .btn {
          width: 85px;
          background-color: #2e4c9e;
          height: 35px;
          color: #fff;
        }
      }
    }
  }
  .content {
    .item {
      display: flex;
      margin-top: 20px;
      .title {
        width: 150px;
        color: #999999;
        font-size: 18px;
        font-weight: 700;
      }
      .time {
        color: #999999;
        margin-bottom: 10px;
      }
      .decs {
        color: #0b2059;
      }
    }
  }
}

// 创建人  操作人
.people {
  display: flex;
  margin-bottom: 20px;
  font-size: 20px;
  .createPeople,
  .handlePeople {
    display: flex;
    width: 350px;
    align-items: center;
    .title {
      color: #707070;
      font-weight: 700;
      margin-right: 30px;
    }

    .content {
      color: #0b2059;
    }
  }
}
//取消订单原因
.cancelOrder {
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .title {
    width: 200px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
  }

  .content {
    color: red;
    font-size: 20px;
  }
}
// 故障部位
.faultParts {
  display: flex;
  margin-bottom: 20px;
  align-items: center;

  .title {
    width: 150px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
  }

  .content {
    color: #0b2059;
    font-size: 20px;
  }
}
// 故障解决方案
.solvePlan {
  .title {
    width: 260px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .planItem {
    display: flex;
    margin-bottom: 20px;

    .label {
      color: #707070;
      font-size: 20px;
      margin-right: 50px;
    }

    .programmeItem {
      color: #707070;
      font-size: 18px;
      .item {
        margin-bottom: 10px;
        span {
          margin-left: 10px;
          color: #0b2059;
          font-size: 16px;
        }
      }
    }
  }
}

// 检测结果
.meg {
  padding: 20px;
  // 质保周期
  .qualityProtectTime {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .title {
      color: #707070;
      font-size: 20px;
      font-weight: 600;
    }
    .time {
      margin-left: 20px;
      color: #0b2059;
    }
  }

  // 配件明细
  .accessoriesDetail {
    margin-bottom: 20px;
    display: flex;
    .title {
      width: 150px;
      color: #707070;
      font-size: 20px;
      font-weight: 600;
    }
    .item {
      display: flex;
      width: 350px;
      margin-bottom: 20px;
      .name {
        padding-right: 30px;
        margin-left: 20px;
        color: #707070;
      }
      .price {
        flex: 2;
        color: red;
      }
      .num {
        flex: 2;
        color: #0b2059;
      }
    }
  }
}
// 师傅联系方式
.masterContact {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .title {
    width: 200px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
  }
  .item {
    width: 300px;
    color: #707070;
    font-size: 18px;
    display: flex;
    align-items: center;
    .content {
      margin-left: 20px;
      color: #0b2059;
    }
  }
}

// 完工信息
.finishWork {
  margin: 20px 0;
  .title {
    margin-bottom: 20px;
    width: 220px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.information {
  .oneline {
    display: flex;
    margin-bottom: 30px;
    .item1,
    .item3 {
      width: 140px;
      color: #707070;
      font-size: 20px;
      font-weight: 600;
    }

    .item2 {
      width: 60%;
      margin-right: 20vw;
      div {
        color: #707070;
        font-size: 18px;
        margin-bottom: 15px;
        span {
          margin-left: 10px;
          color: #0b2059;
        }
      }
    }

    .item4 {
      div {
        color: #707070;
        font-size: 18px;
        margin-bottom: 20px;
        span {
          margin-left: 10px;
          color: #0b2059;
        }
      }
    }
  }

  .twoline {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    font-size: 20px;

    .title {
      width: 150px;
      color: #707070;
      font-weight: 600;
    }

    .content {
      color: #0b2059;
    }
  }

  .threeline {
    display: flex;
    margin-bottom: 30px;
    .title {
      margin-right: 30px;
      color: #707070;
      font-size: 20px;
      font-weight: 600;
    }
  }
}

// 11.22版需求信息结束
.box {
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: #fff;
}
.el-tabs__content {
  overflow: auto;
  height: 88vh;
}
.big_title {
  display: flex;
  justify-content: space-between;
  color: #707070;
  font-size: 16px;
  font-weight: 600;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #666;
  margin-bottom: 10px;
  .bigTitleLeft {
    display: flex;
    .item {
      display: flex;
    }
  }
  span {
    margin-right: 20px;
  }
}
/deep/.el-row {
  font-size: 16px !important;
}
/deep/.el-col {
  margin: 5px 0;
  > span {
    flex: 0 0 120px;
    text-align: start;
  }
}
.inhoudskop {
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: 600;
  margin: 10px 0;
}
.flex {
  width: 200px;
  display: flex;
  justify-content: space-between;
}
/deep/.el-tabs__content {
  overflow: auto;
  height: 88vh;
}
</style>

<script>
import { getRepairOrderDetail } from "@/api/user.js";
import {
  handleSubmitAcceptance,
  handleEnterpriseCheck,
  handleStartService,
  handlePhotographPunch,
  handleRemindStarted,
  handleProxyConfirmQuotation,
  handleProxyPayment,
  handleMasterQuotation,
} from "@/api/proxy";
import {
  handleOrderDiscountFlag,
  markOrderCompletion,
  deleteOrderFaultItem,
  editOrderServiceProgress,
  examineMasterQuotation,
  handleMasterPayment,
  cancelRepairOrder,
  handleRepairMessage,
  examinePartProduct,
  editRepairOrder,
  examineFaultItem,
  sendRepair,
  queryJdProductList,
  editPartProduct,
  deletePartProduct,
  queryMaintenanceSupplierInfo,
  fillLogisticsInformation,
  handleMasterAmount,
  queryFaultItems,
  addOrderFaultItem,
  consultCost,
  handleSystemCreateOrder,
  handleFaultCost,
  handleOfflineImages,
  synchronizationJdOrder,
} from "@/api/order.js";
import { UploadImg } from "@/api/system.js";
export default {
  title: "maintenance_order_desc",
  data() {
    return {
      // 代师傅操作
      handlePhotographPunchParams: {
        orderSn: null,
        punchImages: null,
        punchTime: null,
      },
      photographPunchDialogVisible: false,
      punchImagesList: [],
      handleRemindStartedParams: {
        orderSn: null,
        punchTime: null,
      },
      remindStartedDialogVisible: false,
      handleSubmitAcceptanceParams: {
        completeImages: "",
        offlineImages: "",
        orderSn: "",
        time: "",
      },
      submitAcceptanceDialogVisible: false,
      offlineImagesList: [],
      completeImagesList: [],

      handleRemindStartedParamsRules: {
        punchTime: [
          { required: true, message: "请选择上门时间", trigger: "change" },
        ],
      },
      handlePhotographPunchParamsRules: {
        punchImages: [
          { required: true, message: "请上传打卡照片", trigger: "change" },
        ],
        punchTime: [
          { required: true, message: "请选择打卡时间", trigger: "change" },
        ],
      },
      handleSubmitAcceptanceParamsRules: {
        time: [
          { required: true, message: "请选择验收时间", trigger: "change" },
        ],
        offlineImages: [
          { required: true, message: "请上传线下工单", trigger: "change" },
        ],
        completeImages: [
          { required: true, message: "请上传线下工单", trigger: "change" },
        ],
      },
      // 代师傅操作

      supplierInfoListTotal: null,
      supplierInfoListParams: {
        pageNo: 1,
        pageSize: 10,
        query: "",
      },
      orderDiscountVisible: false,
      handleOrderDiscountFlagParams: {
        orderSn: null,
        flag: null,
      },
      faultDeratePriceVisible: false,
      faultDeratePriceParams: {
        amount: null,
        orderSn: null,
        remark: null,
      },
      faultDeratePriceParamsRules: {
        amount: [
          { required: true, message: "请输入故障减免费用", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入减免费用备注", trigger: "blur" },
        ],
      },
      consultCostRules: {
        amount: [
          { required: true, message: "请填写协商金额", trigger: "blur" },
        ],
        remarks: [{ required: true, message: "请填写备注", trigger: "blur" }],
        flag: [
          { required: true, message: "请选择是否纳入折扣", trigger: "change" },
        ],
      },
      consultCostParams: {
        orderSn: null,
        amount: null,
        remarks: null,
        flag: 1,
      },
      consultPriceVisible: false,

      examineFaultsFormVideoList: [],
      examineFaultsFormPicList: [],

      chooseFaultItemVal: {},
      queryFaultItemsParams: {
        pageNo: 1,
        pageSize: 10,
        query: null,
      },
      faultItemPages: null,
      faultItemTotal: null,
      faultItemList: [],
      addFaultVisible: false,

      editBadPirceData: {
        operateType: "",
        amount: "",
        orderSn: "",
      },
      editBadPirceShow: false, //修改差评弹框

      partItemSend: false,
      addEditPartTitle: "新增配件",
      setLogisticsData: {
        supplierId: null,
        supplierName: null,
      },

      supplierList: [],
      setLogisticsDialogShow: false,

      uploadPartImgList: [],
      searchPartQuery: null,
      choosePartIndex: null, //选中配件的下标
      jdProductList: [],
      warehouseSearchDialogShow: false,
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
      },
      addEditPartDialogShow: false,

      oneClickSendrepair: false,

      markTrunText: ["非常不满意", "不满意", "一般", "满意", "非常满意"],
      examineFaultsForm: {},
      examineFaults: false,
      examinePartsForm: {},
      examineParts: false,

      platformVisitMessage: "",
      repairCommentImage: null,
      content: "",
      // 取消订单
      delOrderinpValue: "",
      cancelOrderDialog: false,

      orderSn: "",
      data: {},
      activeName: "desc",
      status: "",
      url: {
        handleMasterQuotation: "/admin/maintenance/handleMasterQuotation", // 企业确认报价
        handleConfirmDeposit: "/admin/maintenance/handleConfirmDeposit", // 企业确认支付定金/尾款
        handleEnterpriseCheck: "/admin/maintenance/handleEnterpriseCheck", // 企业验收
        handleConfirmDepositToMaster:
          "/admin/maintenance/handleConfirmDepositToMaster", // 平台确认企业定金并打款给师傅/平台确认企业支付尾款
        handleConfirmBalanceToMaster:
          "/admin/maintenance/handleConfirmBalanceToMaster", // 平台打款至师傅(质保期已到)
      },
      quotationForm: {
        rejectReason: "",
      },
      checkForm: {
        rejectReason: "",
      },
      parts: {
        orderSn: "",
        doorAmount: "",
        otherAmount: "",
        partsAmount: "",
        technologyAmount: "",
      },

      queryJdProductListParams: {
        pageNo: 1,
        pageSize: 100,
        query: "",
      },

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
    };
  },
  mounted() {
    console.log(2714);
    this._getRepairOrderDetail();
  },
  created() {
    this.orderSn = this.$route.query.orderSn;
    this._getRepairOrderDetail();
  },
  watch: {
    //拿到消息跳转的时候 有id就刷新
    $route(to, from) {
      if (to.query.id) {
        this.orderSn = to.query.orderSn;
        this._getRepairOrderDetail();
      }
    },
  },
  methods: {
    // 代企业操作 写这个需求 我得笑两年半
    // 1.代企业确认签收
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
          this._getRepairOrderDetail();
        }
      });
    },
    // 2.代企业确认师傅报价
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
          this._getRepairOrderDetail();
        }
      });
    },
    // 3.代企业付款(手动后标记企业已付款)
    handleProxyPayment(orderSn) {
      this.$confirm("您确定要操作代企业付款(手动后标记企业已付款)?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleProxyPayment(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this._getRepairOrderDetail();
        }
      });
    },
    // 代师傅操作
    // 2、代师傅开始出发
    async handleRemindStarted() {
      await this.$refs["handleRemindStartedParamsRef"].validate();
      const res = await handleRemindStarted(this.handleRemindStartedParams);
      if (res.message == "操作成功") {
        this._getRepairOrderDetail();
        this.closeRemindStartedDialog();
      }
    },
    // 打开代师傅开始出发弹框
    openRemindStartedDialog(orderSn) {
      this.handleRemindStartedParams.orderSn = orderSn;
      this.remindStartedDialogVisible = true;
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
    // 3.代师傅拍照打卡
    async handlePhotographPunch() {
      await this.$refs["handlePhotographPunchParamsRef"].validate();
      const res = await handlePhotographPunch(this.handlePhotographPunchParams);
      if (res.message == "操作成功") {
        this._getRepairOrderDetail();
        this.closeHandlePhotographPunchDialog();
      }
    },
    // 打开代师傅拍照弹框
    openHandlePhotographPunchDialog(orderSn) {
      this.handlePhotographPunchParams.orderSn = orderSn;
      this.photographPunchDialogVisible = true;
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
    // 删除师傅打卡照片
    delPunchImages() {
      this.handlePhotographPunchParams.punchImages = "";
      this.$refs.uploadPunchImagesRef.$children[1].$el.style.display = "";
      this.$refs.handlePhotographPunchParamsRef.validateField("punchImages");
    },
    // 4.代师傅提交检测报价
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
          this._getRepairOrderDetail();
        }
      });
    },
    // 5.代师傅开始服务
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
          this._getRepairOrderDetail();
        }
      });
    },
    // 6、代师傅提交验收
    async handleSubmitAcceptance() {
      await this.$refs["handleSubmitAcceptanceParamsRef"].validate();
      const res = await handleSubmitAcceptance(
        this.handleSubmitAcceptanceParams
      );
      if (res.message == "操作成功") {
        this._getRepairOrderDetail();
        this.closeSubmitAcceptanceDialog();
      }
    },
    // 打开代师傅提交验收弹框
    openSubmitAcceptanceDialog(orderSn) {
      this.handleSubmitAcceptanceParams.orderSn = orderSn;
      this.submitAcceptanceDialogVisible = true;
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
      this.$refs.uploadOfflineImagesRef.$children[1].$el.style.display = "";
      this.$refs.uploadCompleteImagesRef.$children[1].$el.style.display = "";
      this.submitAcceptanceDialogVisible = false;
    },
    // 上传线下工单
    async uploadOfflineImages(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message == "操作成功") {
        this.handleSubmitAcceptanceParams.offlineImages = res.data;
        this.offlineImagesList = [{ url: res.data }];
        this.$refs.uploadOfflineImagesRef.$children[1].$el.style.display =
          "none";
        this.$refs.handleSubmitAcceptanceParamsRef.validateField(
          "offlineImages"
        );
      }
    },
    // 删除线下工单
    delOfflineImages() {
      this.handleSubmitAcceptanceParams.offlineImages = "";
      this.$refs.uploadOfflineImagesRef.$children[1].$el.style.display = "";
      this.$refs.handleSubmitAcceptanceParamsRef.validateField("offlineImages");
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
    // 代师傅操作

    // 修改上传工单照片
    async handleOfflineImages(fileData) {
      let formData = new FormData();
      formData.append("file", fileData.file);
      const res = await UploadImg(formData);
      if (res.message == "操作成功") {
        const result = await handleOfflineImages({
          offlineImages: res.data,
          orderSn: fileData.data.orderSn,
        });
        if (result.message == "操作成功") {
          this._getRepairOrderDetail();
        }
      }
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
    // 确定订单折扣
    async confirmOrderDiscount() {
      const { orderSn, flag } = this.handleOrderDiscountFlagParams;
      const res = await handleOrderDiscountFlag(orderSn, flag);
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        await this._getRepairOrderDetail();
        await this.closeOrderDiscountDialog();
      }
    },
    // 关闭订单折扣弹框
    closeOrderDiscountDialog() {
      this.handleOrderDiscountFlagParams = {
        orderSn: null,
        flag: null,
      };
      this.orderDiscountVisible = false;
    },
    // 打开订单折扣弹框
    openOrderDiscountDialog(orderSn, flag) {
      this.handleOrderDiscountFlagParams.orderSn = orderSn;
      this.handleOrderDiscountFlagParams.flag = flag;
      this.orderDiscountVisible = true;
    },
    changeType() {
      this.$refs.partInfoRuleForm.validateField("type");
    },
    changeModel() {
      this.$refs.partInfoRuleForm.validateField("model");
    },
    // 确定故障减免费用
    async confirmSetFaultDeratePrice() {
      await this.$refs["faultDeratePriceParamsRef"].validate();
      const res = await handleFaultCost(this.faultDeratePriceParams);
      if (res.message == "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this._getRepairOrderDetail();
        this.closeFaultDeratePriceDialog();
      }
    },
    // 关闭设置故障减免费用
    closeFaultDeratePriceDialog() {
      this.faultDeratePriceParams = {
        amount: null,
        orderSn: null,
        remark: null,
      };
      this.$refs["faultDeratePriceParamsRef"].resetFields();
      this.faultDeratePriceVisible = false;
    },
    // 打开设置故障减免费用
    openFaultDeratePriceDialog(orderSn, amount, remark) {
      this.faultDeratePriceParams.orderSn = orderSn;
      this.faultDeratePriceParams.amount = amount;
      this.faultDeratePriceParams.remark = remark;
      this.faultDeratePriceVisible = true;
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

    // 同步金蝶单据
    synchronizationJdOrder(orderSn) {
      this.$confirm("您确定同步金蝶单据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await synchronizationJdOrder({ orderSn });
        if (res.message === "操作成功") {
          this._getRepairOrderDetail();
        }
      });
    },
    // 标记散单完成
    markOrderCompletion(orderSn) {
      this.$confirm(
        "确认操作吗？(散单需企业实际支付才可以点击此操作)",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        const res = await markOrderCompletion(orderSn);
        if (res.message === "操作成功") {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this._getRepairOrderDetail();
        }
      });
    },
    // 机将大师傅接单
    handleSystemCreateOrder(orderSn) {
      this.$confirm("您确实要操作机将大师傅接单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await handleSystemCreateOrder(orderSn);
        if (res.message == "操作成功") {
          this.$message({
            type: "success",
            message: res.message,
          });
          this._getRepairOrderDetail();
        }
      });
    },
    // 删除故障项目图片
    delExamineFaultsFormPicList() {
      this.examineFaultsForm.image[0] = null;
      this.examineFaultsFormPicList = [];
    },
    // 确定协商费用
    async confirmConsultPrice() {
      await this.$refs["consultCostForm"].validate();
      const res = await consultCost(this.consultCostParams);
      if (res.message === "操作成功") {
        this.closeConsultPriceDialog();
        this._getRepairOrderDetail();
      }
    },
    // 打开协商价格框
    openConsultPriceDialog(orderSn, doorAmount, partsAmount) {
      this.consultCostParams.orderSn = orderSn;
      this.consultCostParams.amount =
        (doorAmount ? +doorAmount : 0) + (partsAmount ? +partsAmount : 0);
      this.consultPriceVisible = true;
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
    // 删除视频
    delExamineFaultsFormVideo() {
      this.examineFaultsFormVideoList = [];
      this.examineFaultsForm.image[1] = null;
    },
    // 查看视频
    viewVideo(url) {
      window.open(url);
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
        await this._getRepairOrderDetail();
        this.closeAddFaultDialog();
      }
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
    // 打开新增项目框
    async openAddFaultDialog(orderSn) {
      await this.queryFaultItems();
      this.chooseFaultItemVal.orderSn = orderSn;
      this.addFaultVisible = true;
    },
    // 关闭修改差评金额框
    closeEditBadPirce() {
      this.editBadPirceShow = false;
      this.editBadPirceData = {
        operateType: "",
        amount: "",
        orderSn: "",
      };
    },
    // 确认修改差评金额
    async confirmEditBadPirce() {
      const res = await handleMasterAmount(this.editBadPirceData);
      if (res.message == "操作成功") {
        this._getRepairOrderDetail();
        this.closeEditBadPirce();
      }
    },
    // 打开修改差评金额框
    openEditBadPirce() {
      this.editBadPirceShow = true;
      this.editBadPirceData.orderSn = this.orderSn;
    },
    // 一键寄修
    oneClickSendrepairFn() {
      this.$confirm("确认配件信息无误，一键寄修", "一键寄修", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        //  一键寄修
        const res = await sendRepair(this.orderSn);
        if (res.message == "操作成功") {
          this.$message({
            type: "success",
            message: res.message,
          });
          this._getRepairOrderDetail();
        }
      });
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
    // 确定供应商
    async confirmSetLogistics() {
      const res = await fillLogisticsInformation(this.setLogisticsData);
      if (res.message == "操作成功") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this._getRepairOrderDetail();
        this.closeSetLogistics();
      }
    },
    // 关闭设置物流框
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
    // 供应商改变时
    changeSupplier(e) {
      const index = this.supplierList.findIndex(
        (item) => item.supplierName == e
      );
      this.setLogisticsData.supplierId = this.supplierList[index].id;
    },
    // 打开设置物流框
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
    // 确定新增修改配件
    async confirmAddEditPart() {
      await this.$refs["partInfoRuleForm"].validate();
      // 新增需要随机生成一个id
      if (!this.partInfo.id) {
        let id = Date.now();
        id = id.toString().slice(-4);
        this.partInfo.id = "undefined-" + Number(id);
      }
      const data = { ...this.partInfo };
      // if (data.stashPartsWay == 1) {
      //   data.id = Math.floor(Math.random() * 10000);
      // }
      const res = await editPartProduct(data);
      if (res.message == "操作成功") {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this._getRepairOrderDetail();
        this.closeAddEditPart();
      }
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
      };
      this.uploadPartImgList = [];
      this.addEditPartDialogShow = false;
      this.$refs["partInfoRuleForm"].resetFields();
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
    // 查询金蝶仓库配件
    async queryJdProductList() {
      this.choosePartIndex = null;
      const res = await queryJdProductList(this.queryJdProductListParams);
      this.jdProductList = res.data.records;
    },
    // 打开仓库搜索框
    openWarehouseSearch() {
      this.warehouseSearchDialogShow = true;
      this.queryJdProductList();
    },
    // 打开新增修改配件
    openAddEditPart(row, index, orderSn) {
      if (index || index == 0) {
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
      } else {
        this.addEditPartTitle = "新增配件";
      }
      this.partInfo.orderSn = orderSn;
      this.addEditPartDialogShow = true;
    },

    // 确定寄修
    async confirmSendrepair() {
      await sendRepair(this.orderSn);
      this.closeOneClickSendrepair();
    },
    // 关闭一键寄修
    closeOneClickSendrepair() {
      this.oneClickSendrepair = false;
    },
    // 打开一键寄修
    openOneClickSendrepair() {
      this.oneClickSendrepair = true;
    },
    // 确定审核故障项目
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
        await this._getRepairOrderDetail();
      }
    },
    // 关闭故障项目审核框
    async closeExamineFaultsDialog() {
      this.examineFaultsFormVideoList = [];
      this.examineFaultsFormPicList = [];
      this.examineFaultsForm = {};
      this.examineFaults = false;
    },
    // 打开故障项目审核框
    openExamineFaultsDialog(row, orderSn, orderType) {
      this.examineFaultsForm = { ...row };
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
    // 删除故障项目
    async delSolvePlan(row, orderSn) {
      this.$confirm("您确定删除该故障项目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        console.log(row.id);
        const res = await deleteOrderFaultItem({
          id: row.id,
          orderSn,
        });
        if (res.message == "操作成功") {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this._getRepairOrderDetail();
        }
      });
    },
    // 修改报价
    async editOfferPrice() {
      // 计算价格
      let partsPrice = 0;
      this.data.partsList.forEach((item) => {
        partsPrice += item.num * item.price;
      });
      this.data.partsAmount = partsPrice;
      let faultsPrice = 0;
      this.data.faults.forEach((item) => {
        faultsPrice += Number(item.masterAmount);
      });
      this.data.doorAmount = faultsPrice;
      const faultsStr = JSON.stringify(this.data.faults);
      const partsListStr = JSON.stringify(this.data.partsList);
      this.data.faults = faultsStr;
      this.data.parts = partsListStr;
      const res = await editRepairOrder(this.data);
      if (res.message === "操作成功") {
        this._getRepairOrderDetail();
      }
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
          this._getRepairOrderDetail();
        }
      });
    },
    // 确定审核
    async comfirmExamineParts() {
      const res = await examinePartProduct(this.examinePartsForm);
      if (res.message === "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this.closeExaminePartsDialog();
        this._getRepairOrderDetail();
      }
    },
    // 关闭配件审核框
    closeExaminePartsDialog() {
      this.examinePartsForm = [];
      this.examineParts = false;
    },
    // 打开配件审核框
    openExaminePartsDialog(row, orderSn) {
      // const obj = row;
      // this.examinePartsForm = { ...obj };
      // // this.examinePartsForm.number = null;
      // this.examinePartsForm.orderSn = this.orderSn;
      // this.examineParts = true;
      this.$confirm("确认配件信息无误，通过审核", "审核配件", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await examinePartProduct({
          id: row.id,
          orderSn,
        });
        if (res.message == "操作成功") {
          this._getRepairOrderDetail();
        }
      });
    },
    // 跳转物流详情
    goToLogisticsDetails(partId, model, orderSn) {
      this.$router.push({
        name: "logisticsDetails",
        query: { partId, model, orderSn },
      });
    },
    // 确定添加回访信息
    async addReturnVistInfo() {
      if (!this.platformVisitMessage) {
        this.$message({
          message: "回访信息不能为空",
          type: "warning",
        });
      } else {
        const res = await handleRepairMessage({
          orderSn: this.orderSn,
          platformVisitMessage: this.platformVisitMessage,
        });
        if (res.message == "操作成功") {
          this.$message({
            message: res.message,
            type: "success",
          });
          this._getRepairOrderDetail();
        } else {
          this.$message({
            message: "网络不佳，稍后重试",
            type: "warning",
          });
        }
      }
    },
    // 跳转指派师傅页面
    goAssignedMasterPage() {
      const { orderSn, masterUidList, masterNameList } = this.data;
      this.$router.push({
        path: "/maintenance/assignedWorker",
        query: {
          orderSn,
          masterUidList,
          masterNameList,
        },
      });
    },
    // 判断指派按钮是否显示
    judgeAssignedBtnShow() {
      if (this.data.enterpriseMainStatus === 1) {
        return true;
      }
      if (this.data.enterpriseMainStatus === 0) {
        if (this.data.platformStatus !== 0) {
          return true;
        } else {
          return false;
        }
      }
      if (this.data.enterpriseMainStatus === -1) {
        if (this.data.platformStatus === -1) {
          return true;
        }
      }
    },
    // 点击确定添加描述
    async descConfirm() {
      const data = {
        content: this.content,
        orderSn: this.data.orderSn,
      };
      const res = await editOrderServiceProgress(data);
      if (res.message === "操作成功") {
        location.reload();
      }
    },
    // 点击取消订单触发的时间
    clickCancelOrderDialog() {
      this.cancelOrderDialog = true;
    },
    // 关闭取消订单弹窗的时间
    closecancelOrderDialog() {
      this.cancelOrderDialog = false;
      this.delOrderinpValue = "";
    },

    // 判断配件明细
    judgeParts() {
      if (!this.data.partsList) {
        return false;
      } else if (this.data.partsList && this.data.partsList.length === 0) {
        return false;
      } else {
        return true;
      }
    },
    // 判断故障解决方案
    judgeFault() {
      if (!this.data.programmeList) {
        return false;
      } else if (
        this.data.programmeList.analysis === undefined &&
        this.data.programmeList.desc === undefined &&
        this.data.programmeList.programme === undefined
      ) {
        return false;
      } else {
        return true;
      }
    },
    // 判断订单费用
    judgeOrderCost() {
      const { doorAmount, technologyAmount, partsAmount, otherAmount } =
        this.data;
      if (
        doorAmount === 0 &&
        technologyAmount === 0 &&
        (otherAmount === 0) & (partsAmount === 0)
      ) {
        return false;
      } else {
        return true;
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

    // 暂时不知道干嘛!!!!!
    changeStuta(e) {
      if (e.value == 1) {
        this.status = 2;
      } else {
        this.status = 3;
      }
    },
    // 没用到
    srueAccomont() {
      this.$refs.quotationForm.open();
    },
    // 点击打款至师傅触发的事件
    _handleMasterPayment() {
      let params = {
        orderSn: this.orderSn,
      };
      handleMasterPayment(params).then((res) => {
        if (res) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
      });
    },
    // 点击确定报价触发的事件
    sumbitQuotation(orderSn) {
      this.$confirm("确认定价无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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
        examineMasterQuotation(data)
          .then((res) => {
            loading.close();
            if (res.success) {
              this.$message({
                showClose: true,
                message: res.message,
                type: "success",
              });
              this.$router.push("/maintenance/maintenance_order");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    // init() {
    //   this.$axios
    //     .get(
    //       "/admin/maintenance/getRepairOrderDetail?enterpriseOrderSn=" +
    //         location.hash.split("?enterpriseOrderSn=")[1]
    //     )
    //     .then(({ data }) => {
    //       this.data = data;
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // },
    // 显示企业报价弹框
    // 没用到
    quotationInit() {
      this.quotationForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0",
      };
      this.$refs.quotationForm.open();
    },
    // sumbitQuotation(fn) {
    //   if (
    //     this.quotationForm.status == "0" &&
    //     !this.quotationForm.rejectReason
    //   ) {
    //     this.$message.error("请输入驳回原因");
    //     return;
    //   }
    //   this.$axios
    //     .post(this.url.handleMasterQuotation, this.quotationForm)
    //     .then(data => {
    //       if (data.code == "000") {
    //         this.$message({
    //           showClose: true,
    //           message: data.message,
    //           type: "success"
    //         });
    //         this.resetQuotationForm(fn);
    //       }
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });

    // },
    // 关闭确认报价的模态框的事件
    resetQuotationForm(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    // 点击检测定价触发的事件
    jump2check() {
      this.$router.push({
        name: "checkPricing",
        query: { orderSn: this.data.orderSn, edit: true },
      });
    },
    // 没用过
    pay() {
      this.$axios
        .post(this.url.handleConfirmDeposit, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          // type (integer, optional): 类型: 1 定金 2 尾款
          type: this.data.enterpriseSubStatus == 2305 ? 1 : 2,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this._getRepairOrderDetail();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 显示企业报价弹框
    checkInit() {
      this.checkForm = {
        enterpriseOrderSn: this.data.orderSn,
        status: "0",
      };
      this.$refs.checkForm.open();
    },
    // 确认验收的模态框确定的事件
    // sumbitCheck(fn) {
    //   if (this.checkForm.status == "0" && !this.checkForm.rejectReason) {
    //     this.$message.error("请输入驳回原因");
    //     return;
    //   }
    //   this.$axios
    //     .post(this.url.handleEnterpriseCheck, this.checkForm)
    //     .then((data) => {
    //       if (data.code == "000") {
    //         this.$message({
    //           showClose: true,
    //           message: data.message,
    //           type: "success",
    //         });
    //         this.resetCheckForm(fn);
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     });
    // },
    // 确认验收的模态框关闭的事件
    resetCheckForm(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    handleConfirmDepositToMaster(fn) {
      this.$axios
        .post(this.url.handleConfirmDepositToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
          type: this.data.enterpriseSubStatus == "2306" ? 1 : 2,
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 没用到
    platformPayInit() {
      if (this.data.enterpriseSubStatus != "2502") {
        this.$refs.platform.open();
      } else {
        this.handleConfirmDepositToMaster();
      }
    },
    // 打款信息的模态框确定的事件
    sumbitPlatformPay(fn) {
      if (this.data.enterpriseSubStatus == "2601") {
        this.remit(fn);
      } else {
        this.handleConfirmDepositToMaster(fn);
      }
    },
    // 打款信息的模态框确定的事件
    remit(fn) {
      this.$axios
        .post(this.url.handleConfirmBalanceToMaster, {
          enterpriseOrderSn: location.hash.split("?enterpriseOrderSn=")[1],
        })
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
          }
          this.resetPlatformPay(fn);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    resetPlatformPay(fn) {
      this._getRepairOrderDetail();
      fn(false);
    },
    _getRepairOrderDetail() {
      let params = {
        enterpriseOrderSn: this.orderSn,
      };
      getRepairOrderDetail(params).then((res) => {
        if (res.success) {
          // 为了实现多个师傅明细
          if (res.data.enrollRepairOrderOutList) {
            res.data.enrollRepairOrderOutList.forEach((item) => {
              // 回显故障项
              if (item.faults) {
                item.faults = JSON.parse(item.faults);
                if (item.faults?.length > 0) {
                  item.faults.forEach((item1) => {
                    if (typeof item1.image == "string") {
                      item1.image = JSON.parse(item1.image);
                    }
                  });
                }
              }
              // 回显配件
              if (item.parts) {
                console.log(4050, item.parts);
                item.parts = JSON.parse(item.parts);
              }
              // 回显完工照片
              if (item.completeImages) {
                item.completeImages = item.completeImages.split(",");
              }
            });
          }

          res.data.faults = JSON.parse(res.data.faults);
          if (res.data.faults?.length > 0) {
            res.data.faults.forEach((item) => {
              if (typeof item.image == "string") {
                item.image = JSON.parse(item.image);
              }
            });
          }

          // 判断一键寄修
          if (res.data.partsList) {
            res.data.partsList.forEach((item) => {
              // 同时有外发和平台
              if (item.model == 1 && item.type == 2) {
                this.partItemSend = true;
              }
            });
          }
          this.data = res.data;
          if (res.data && res.data.repairComment?.images) {
            this.repairCommentImage = this.data.repairComment.images.split(",");
          }
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
        }
      });
    },
  },
};
</script>
