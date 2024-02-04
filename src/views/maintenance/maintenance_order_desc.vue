<!--维保订单详情-->
<template>
  <div class="box">
    <el-tabs v-model="activeName" type="border-card">
      <div class="big_title">
        <div class="bigTitleLeft">
          <div class="item" style="color: red; font-size: 18px">
            <i style="font-style: normal" v-if="data.platformStatus === -1">
              师傅</i
            >{{ data.orderStatusName }}
          </div>
          <div class="item">
            <div>订单号:</div>
            <div>{{ data.orderSn }}</div>
          </div>
          <div class="item">
            <div>下单时间:</div>
            <div>{{ data.createTime }}</div>
          </div>
          <div class="item">
            <div>紧急程度:</div>
            <div v-if="data.degree === 1" style="color: green">一般</div>
            <div v-if="data.degree === 2" style="color: red">紧急</div>
          </div>
        </div>
        <div>
          <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="jump2check"
            v-if="data.platformStatus == 0 && data.enterpriseMainStatus >= 0"
            >检测定价</el-button
          > -->
          <!-- <el-button
            type="primary"
            size="mini"
            plain
            @click="
              $router.push('/maintenance/amendPricing?orderSn=' + data.orderSn)
            "
            v-if="
              (data.enterpriseMainStatus >= 1 &&
                data.enterpriseMainStatus <= 4) ||
              (data.enterpriseMainStatus === 0 &&
                (data.platformStatus === -1 || data.platformStatus === 1))
            "
            >修改报价</el-button
          > -->
          <el-button
            type="primary"
            size="mini"
            plain
            @click="sumbitQuotation()"
            v-if="['2202'].includes(data.enterpriseSubStatus)"
            >确认报价</el-button
          >
          <!-- <el-button type="primary" size="mini" plain @click="platformPayInit()">打款至师傅</el-button> -->
          <el-button
            type="primary"
            size="mini"
            plain
            v-if="data.orderStatusName === '待平台指派'"
            @click="submitForAcceptance(data.orderSn)"
            >代提交验收</el-button
          >
          <!-- v-if="data.platformStatus > 0 && data.enterpriseMainStatus <= 4" -->
          <el-button
            size="mini"
            type="primary"
            plain
            @click="goAssignedMasterPage"
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

      <!-- 企业描述tab -->
      <el-tab-pane label="企业描述" name="desc">
        <div class="information" style="padding: 20px">
          <!-- 需求信息+企业信息 -->
          <div class="oneline">
            <div class="item1">需求信息:</div>
            <div class="item2">
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
      <el-tab-pane label="报价明细" name="meg">
        <div class="meg">
          <!-- 师傅联系方式 -->
          <div class="masterContact" v-if="data.enterpriseMainStatus > 1">
            <div class="title">师傅联系方式:</div>
            <div class="item">
              <span class="label">联系人:</span>
              <span class="content">{{ data.masterRealName }}</span>
            </div>
            <div class="item">
              <span class="label">联系电话:</span>
              <span class="content">{{ data.masterPhone }}</span>
            </div>
          </div>
          <!-- 故障解决方案 -->
          <div class="solvePlan">
            <div class="title">故障项目方案:</div>
            <el-table :data="data.faults">
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
                  {{ row.masterAmount }}
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
              <el-table-column label="协商价格" align="center">
                <template slot-scope="{ row }">
                  {{ row.masterConsultAmount ? row.masterConsultAmount : 0 }}
                </template>
              </el-table-column>
              <el-table-column label="故障视频" align="center">
                <template slot-scope="{ row }">
                  <video
                    v-if="row.image[1]"
                    height="100px"
                    width="100px"
                    :src="row.image[1]"
                    controls
                    preload
                  ></video>
                </template>
              </el-table-column>
              <el-table-column label="故障图片" align="center">
                <template slot-scope="{ row }">
                  <el-image
                    v-if="row.image[0]"
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
                    @click="openExamineFaultsDialog(row)"
                    v-if="row.status == 1"
                    >审核</el-button
                  >
                  <el-button
                    type="text"
                    v-if="data.enterpriseSubStatus < 2203"
                    @click="delSolvePlan(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 配件明细部分 -->
          <div class="peijian" style="margin-top: 30px">
            <div class="peijianTitle">配件明细:</div>
            <el-button
              type="primary"
              v-if="data.enterpriseSubStatus < 2203"
              @click="openAddEditPart"
              >新增配件</el-button
            >
            <el-button
              type="primary"
              v-if="
                data.sendFlag == 0 &&
                data.enterpriseSubStatus >= 2203 &&
                partItemSend
              "
              @click="oneClickSendrepairFn"
              >一键寄修</el-button
            >
          </div>
          <div class="addPartcs">
            <el-table :data="data.partsList">
              <el-table-column
                align="center"
                prop="name"
                label="配件图片"
                width="110"
              >
                <template slot-scope="{ row }">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="row.image"
                    :preview-src-list="[row.image]"
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
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="text"
                    v-if="
                      (row.type == 2 &&
                        data.enterpriseSubStatus > 2202 &&
                        data.sendFlag != 0) ||
                      (data.enterpriseSubStatus > 2202 &&
                        row.model == 2 &&
                        row.type == 2)
                    "
                    @click="goToLogisticsDetails(row.id)"
                    >物流详情</el-button
                  >
                  <el-button
                    v-if="row.status == 1 && row.type == 2 && row.model == 1"
                    type="text"
                    @click="openSetLogistics(row)"
                  >
                    物流设置
                  </el-button>
                  <el-button
                    v-if="row.status == 1"
                    type="text"
                    @click="openAddEditPart(row, $index)"
                    >修改</el-button
                  >
                  <el-button
                    v-if="row.status == 1"
                    type="text"
                    @click="openExaminePartsDialog(row)"
                    >审核</el-button
                  >
                  <el-button
                    type="text"
                    v-if="data.enterpriseSubStatus < 2203"
                    @click="delPartsList(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 服务进度 -->
          <!-- <div class="servicePlan" v-if="data.enterpriseMainStatus >= 3">
            <div class="topLine">
              <div class="title">服务进度</div>
              <div class="annotation" v-if="data.enterpriseMainStatus === 3">
                （不必填，维修时间长，需要配合客户填写进度）
              </div>
            </div>
            <div class="content">
              <div
                class="item"
                v-for="(item, index) in data.serviceProgressList"
                :key="index"
              >
                <div class="title">进度描述{{ index + 1 }}</div>
                <div>
                  <div class="time">{{ item.time }}</div>
                  <div class="decs">{{ item.content }}</div>
                </div>
              </div>
            </div>
            <div class="releaseDesc" v-if="data.enterpriseMainStatus === 3">
              <div class="title">进度描述</div>
              <div class="inp">
                <el-input
                  v-model="content"
                  type="textarea"
                  resize="none"
                  :rows="6"
                  placeholder="输入当前维修进度信息"
                >
                </el-input>
                <div class="confirmBtn">
                  <el-button class="btn" @click="descConfirm">确定</el-button>
                </div>
              </div>
            </div>
          </div> -->

          <!-- 增值服务项 -->
          <!-- <div class="information" v-if="data.orderType === 1">
            <div class="oneline">
              <div class="item1">增值服务项:</div>
              <div class="item2">
                <div>
                  预防性检测:
                  <span>{{
                    data.preventType == 1 ? "需要(5%)" : "不需要"
                  }}</span>
                </div>
                <div>
                  协助清理机台:
                  <span>{{
                    data.assistCleanType == 1 ? "需要(1%)" : "不需要"
                  }}</span>
                </div>
                <div>
                  配件类型:
                  <span>{{
                    data.accessoryType == 1 ? "自备" : "平台提供(1%)"
                  }}</span>
                </div>
                <div>
                  到达时间:
                  <span>{{
                    data.arrivalTimeType == 1
                      ? "1小时(10%)"
                      : data.arrivalTimeType == 2
                      ? "2小时(5%)"
                      : "当天"
                  }}</span>
                </div>
                <div>
                  师傅技术能力:
                  <span>{{
                    data.technicalCapabilitiesType == 1
                      ? "高级(10%)"
                      : data.technicalCapabilitiesType == 2
                      ? "中级(5%)"
                      : "初级"
                  }}</span>
                </div>
                <div>
                  配件质保时间:
                  <span>{{
                    data.warrantyPeriodType == 1
                      ? "7天"
                      : data.warrantyPeriodType == 2
                      ? "30天(1%)"
                      : data.warrantyPeriodType == 3
                      ? "90天(2%)"
                      : "180天(3%)"
                  }}</span>
                </div>
              </div>
            </div>
          </div> -->

          <!-- 完工信息 -->
          <div class="finishWork" v-if="data.completePictureList">
            <div class="title">完工信息:</div>
            <div
              class="pic"
              v-for="item in data.completePictureList"
              :key="item"
            >
              <el-image
                v-if="item"
                style="width: 150px; height: 150px; margin-right: 20px"
                lazy
                :src="item"
                :preview-src-list="data.completePictureList"
              ></el-image>
            </div>
          </div>

          <!-- 工单图片 -->
          <div class="finishWork" v-if="data.offlineImages">
            <div class="title">工单图片:</div>
            <el-image
              :src="data.offlineImages"
              style="width: 150px; height: 150px; margin-right: 20px"
              lazy
              :preview-src-list="[data.offlineImages]"
            ></el-image>
          </div>

          <!-- 客户评价 -->
          <div class="customerEvaluate" v-if="data.repairComment">
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
                  {{ markTrunText[data.repairComment.serviceScore + 2] }}
                </div>
              </div>
              <!-- <div class="item">
                <div class="label">对师傅服务是否满意:</div>
                <div>
                  {{
                    data.repairComment.serviceEvaluate === 0 ? "不满意" : "满意"
                  }}
                </div>
              </div> -->
              <div class="item">
                <div class="label">评价内容:</div>
                <div>
                  {{ data.repairComment.content }}
                </div>
              </div>
              <div class="item" v-if="repairCommentImage">
                <div class="label">评价图片:</div>
                <el-image
                  v-for="item in repairCommentImage"
                  :key="item"
                  lazy
                  :src="item"
                  style="width: 150px; height: 150px; margin-right: 20px"
                  :preview-src-list="repairCommentImage"
                ></el-image>
              </div>
              <!-- 星星评价 -->
              <!-- <div class="item"> 
                <div class="label1">客户综合评价:</div>
                <el-rate
                  disabled
                  show-text
                  :colors="['#fe5004', '#fe5004', '#fe5004']"
                  text-color="#fe5004"
                  :texts="['非常差', '差', '一般', '好', '非常好']"
                  v-model="data.repairComment.comprehensiveScore"
                ></el-rate>
              </div>
              <div class="item">
                <div class="label1">沟通能力评分:</div>
                <el-rate
                  disabled
                  show-text
                  :colors="['#fe5004', '#fe5004', '#fe5004']"
                  text-color="#fe5004"
                  :texts="['非常差', '差', '一般', '好', '非常好']"
                  v-model="data.repairComment.communicateScore"
                ></el-rate>
              </div>
              <div class="item">
                <div class="label1">规范态度评分:</div>
                <el-rate
                  disabled
                  show-text
                  :colors="['#fe5004', '#fe5004', '#fe5004']"
                  text-color="#fe5004"
                  :texts="['非常差', '差', '一般', '好', '非常好']"
                  v-model="data.repairComment.operationScore"
                ></el-rate>
              </div>
              <div class="item">
                <div class="label1">服务态度评分:</div>
                <el-rate
                  disabled
                  :colors="['#fe5004', '#fe5004', '#fe5004']"
                  show-text
                  text-color="#fe5004"
                  :texts="['非常差', '差', '一般', '好', '非常好']"
                  v-model="data.repairComment.serviceScore"
                ></el-rate>
              </div>
              <div class="item">
                <div class="label1">技术水平评分:</div>
                <el-rate
                  disabled
                  show-text
                  :colors="['#fe5004', '#fe5004', '#fe5004']"
                  text-color="#fe5004"
                  :texts="['非常差', '差', '一般', '好', '非常好']"
                  v-model="data.repairComment.technologyScore"
                ></el-rate>
              </div> -->
              <div class="item">
                <div class="label1">客服回访描述:</div>
                <div v-if="data.repairComment.platformVisitMessage">
                  {{ data.repairComment.platformVisitMessage }}
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
                <div style="font-weight: 700">企业支付</div>
                <div>
                  人工费: <span>￥{{ data.doorAmount }}元</span>
                </div>
                <div>
                  配件费: <span>￥{{ data.partsAmount }}元</span>
                </div>
                <div>
                  交通费: <span>￥{{ data.otherAmount }}元</span>
                </div>
                <div>
                  合计:
                  <span style="color: red">￥{{ data.totalAmount }}元</span>
                </div>

                <div v-if="data.enterpriseSubStatus >= 2201">
                  <div style="font-weight: 700">师傅收款</div>
                  <div>
                    人工费: <span>￥{{ data.masterDoorAmount }}元</span>
                  </div>
                  <div>
                    配件费: <span>￥{{ data.masterPartsAmount }}元</span>
                  </div>
                  <div>
                    交通费: <span>￥{{ data.otherAmount }}元</span>
                  </div>
                  <div v-if="data.repairComment">
                    评价扣款:
                    <span style="margin-right: 10px"
                      >￥{{ data.deductAmount }}元</span
                    >
                    <el-button
                      size="small"
                      style="background-color: #2e4c9e; color: #fff"
                      @click="openEditBadPirce"
                      >修改</el-button
                    >
                  </div>
                </div>
                <div v-if="data.enterpriseSubStatus >= 2202">
                  <div>
                    权益奖励:
                    <span
                      >￥{{
                        data.premiumAmount ? data.premiumAmount : 0
                      }}元</span
                    >
                  </div>
                  <div>
                    平台抽成:
                    <span
                      >￥{{
                        data.serviceAmount ? data.serviceAmount : 0
                      }}元</span
                    >
                  </div>
                  <div>
                    合计:
                    <span style="color: red"
                      >￥{{ data.masterTotalAmount }}元</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 取消订单原因 -->
          <div class="cancelOrder" v-if="data.cancelReason">
            <div class="title">取消订单原因:</div>
            <div class="content">{{ data.cancelReason }}</div>
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
    <model
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
    </model>

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
            disabled
            v-model.number="examineFaultsForm.masterAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="年保企业价格">
          <el-input
            placeholder="请输入年保企业价格"
            type="number"
            disabled
            v-model.number="examineFaultsForm.annualAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="散单企业价格">
          <el-input
            placeholder="请输入散单企业价格"
            type="number"
            disabled
            v-model.number="examineFaultsForm.generalAmount"
          ></el-input>
        </el-form-item>
        <el-form-item label="师傅协商价格">
          <el-input
            placeholder="请输入师傅协商价格"
            type="number"
            v-model.number="examineFaultsForm.masterConsultAmount"
          ></el-input>
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
      width="30%"
      top="5vh"
      :append-to-body="true"
      :visible="addEditPartDialogShow"
      :before-close="closeAddEditPart"
    >
      <el-form label-position="left" label-width="80px" :model="partInfo">
        <el-form-item label="配件模式">
          <el-radio-group v-model="partInfo.model">
            <el-radio :label="1">外发维修</el-radio>
            <el-radio :label="2">采买新件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="采买角色">
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
        <el-form-item label="物料编码" v-if="partInfo.type == 2">
          <el-input
            v-model="partInfo.number"
            :disabled="partInfo.stashPartsWay == 2"
            placeholder="请输入物料编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件名称">
          <el-input
            v-model="partInfo.name"
            :disabled="partInfo.stashPartsWay == 2"
            placeholder="请输入配件名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件品牌">
          <el-input
            v-model="partInfo.brand"
            :disabled="partInfo.stashPartsWay == 2"
            placeholder="请输入配件品牌"
          ></el-input>
        </el-form-item>
        <el-form-item label="配件参数">
          <el-input
            v-model="partInfo.parameter"
            :disabled="partInfo.stashPartsWay == 2"
            placeholder="请输入配件参数"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label">配件单价</div>
          <el-input
            type="number"
            v-model.number="partInfo.price"
            :disabled="
              partInfo.stashPartsWay == 2 &&
              partInfo.type == 2 &&
              partInfo.model == 2
            "
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
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
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
    >
      <div class="warehouseSearchDialog">
        <div class="warehouseSearchDialogTop">
          <el-input
            v-model="searchPartQuery"
            class="warehouseSearchDialogTopInput"
            placeholder="输入配件名称"
          ></el-input>
          <el-button @click="queryJdProductList(searchPartQuery)"
            >搜索</el-button
          >
        </div>
        <div class="warehouseSearchDialogList">
          <el-radio-group v-model="choosePartIndex">
            <el-radio
              v-for="(item, index) in jdProductList"
              :key="index"
              style="display: flex; align-items: center; padding: 8px"
              :label="index"
            >
              <p>商品名称:{{ item.name }}</p>
              <p style="margin: 5px 0">商品品牌:{{ item.brandName }}</p>
              <p>商品型号:{{ item.model }}</p>
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
      title="设置物流"
      width="40%"
      top="5vh"
      :visible="setLogisticsDialogShow"
      :before-close="closeSetLogistics"
    >
      <div class="setLogisticsDialog">
        <h3 v-if="setLogisticsData.model == 1">快递类型</h3>
        <div v-if="setLogisticsData.model == 1" style="margin: 10px 0">
          <el-radio-group v-model="setLogisticsData.expressType">
            <el-radio :label="1">顺丰</el-radio>
            <!-- <el-radio :label="2">货拉拉</el-radio> -->
          </el-radio-group>
        </div>
        <h3>选择供应商</h3>
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
              <p>供应商名称:{{ item.supplierName }}</p>
              <p style="margin: 5px 0">地址 :{{ item.supplierAddress }}</p>
              <p>范围:{{ item.businessScope }}</p>
            </el-radio>
          </el-radio-group>
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
  </div>
</template>

<style lang="less" scoped>
.hiddenUploadBox {
  width: 148px;
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
    width: 200px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
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
    .content {
      margin-left: 20px;
      color: #0b2059;
    }
  }
}

// 完工信息
.finishWork {
  display: flex;
  margin: 20px 0;
  .title {
    width: 130px;
    color: #707070;
    font-size: 20px;
    font-weight: 600;
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
      width: 350px;
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
    width: 750px;
    justify-content: space-between;
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
} from "@/api/order.js";
import { UploadImg } from "@/api/system.js";
export default {
  title: "maintenance_order_desc",
  data() {
    return {
      editBadPirceData: {
        operateType: "",
        amount: "",
        orderSn: "",
      },
      editBadPirceShow: false, //修改差评弹框

      partItemSend: false,
      addEditPartTitle: "新增配件",
      setLogisticsData: {
        expressType: null,
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
    };
  },
  mounted() {
    this._getRepairOrderDetail();
    console.info(this.$store);
  },
  created() {
    this.orderSn = this.$route.query.orderSn;
    this._getRepairOrderDetail();
  },
  methods: {
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
    delUploadPartImg() {
      this.partInfo.image = "";
      this.uploadPartImgList = [];
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
        expressType: null,
        supplierId: null,
        supplierName: null,
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
    async openSetLogistics(row) {
      this.setLogisticsData.orderSn = this.orderSn;
      this.setLogisticsData.id = row.id;
      this.setLogisticsData.model = row.model;
      if (row.supplierId) {
        const { expressType, supplierId, supplierName } = row;
        this.setLogisticsData.expressType = expressType;
        this.setLogisticsData.supplierId = supplierId;
        this.setLogisticsData.supplierName = supplierName;
      }
      const res = await queryMaintenanceSupplierInfo();
      this.supplierList = res.data;
      this.setLogisticsDialogShow = true;
    },
    // 确定新增修改配件
    async confirmAddEditPart() {
      const data = { ...this.partInfo };
      data.orderSn = this.orderSn;
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
      this.partInfo.id = "";
      this.partInfo.parameter = "";
      this.partInfo.name = "";
      this.partInfo.number = "";
      this.partInfo.unitId = "";
      this.partInfo.price = "";
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
      this.partInfo.image = res.data;
      this.uploadPartImgList = [{ url: res.data }];
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
      };
      this.uploadPartImgList = [];
      this.addEditPartDialogShow = false;
    },
    // 确定选中的仓库配件
    comfirmWarehousePart() {
      const { brandId, brandName, id, model, name, number, unitId, price } =
        this.jdProductList[this.choosePartIndex];
      this.partInfo.brand = brandName;
      this.partInfo.brandId = brandId;
      this.partInfo.id = id;
      this.partInfo.parameter = model;
      this.partInfo.name = name;
      this.partInfo.number = number;
      this.partInfo.unitId = unitId;
      this.partInfo.price = price;
      this.closeWarehouseSearch();
    },
    // 关闭仓库搜索框
    async closeWarehouseSearch() {
      this.searchPartQuery = "";
      this.queryJdProductList("");
      this.warehouseSearchDialogShow = false;
    },
    // 查询金蝶仓库配件
    async queryJdProductList(query) {
      this.choosePartIndex = null;
      const res = await queryJdProductList({
        query,
      });
      this.jdProductList = res.data;
    },
    // 打开仓库搜索框
    openWarehouseSearch() {
      this.warehouseSearchDialogShow = true;
      this.queryJdProductList("");
    },
    // 打开新增修改配件
    openAddEditPart(row, index) {
      if (index || index == 0) {
        this.partInfo.index = index;
        this.partInfo = { ...row };
        this.uploadPartImgList = [{ url: row.image }];
        this.addEditPartTitle = "修改配件";
      } else {
        this.partInfo.index = this.data.partsList
          ? this.data.partsList.length + 1
          : 1;
        this.addEditPartTitle = "新增配件";
      }
      this.addEditPartDialogShow = true;
    },

    // 确定寄修
    async confirmSendrepair() {
      const res = await sendRepair(this.orderSn);
      console.log(1597, res);
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
    closeExamineFaultsDialog() {
      this.examineFaultsForm = {};
      this.examineFaults = false;
    },
    // 打开故障项目审核框
    openExamineFaultsDialog(row) {
      this.examineFaultsForm = { ...row };
      this.examineFaultsForm.orderSn = this.data.orderSn;
      this.examineFaults = true;
    },
    // 删除故障项目
    async delSolvePlan(row) {
      this.$confirm("您确定删除该故障项目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        const index = this.data.faults.findIndex((item) => item.id == row.id);
        await this.data.faults.splice(index, 1);
        await this.editOfferPrice();
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
    async delPartsList(row) {
      this.$confirm("您确定删除该配件吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        console.log(row.id);
        const res = await deletePartProduct({
          id: row.id,
          orderSn: this.orderSn,
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
    openExaminePartsDialog(row) {
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
          index: row.index,
          orderSn: this.orderSn,
        });
        if (res.message == "操作成功") {
          this._getRepairOrderDetail();
        }
      });
    },
    // 跳转物流详情
    goToLogisticsDetails(partId) {
      this.$router.push({
        name: "logisticsDetails",
        query: { partId, orderSn: this.data.orderSn },
      });
    },
    // 代提交验收
    async submitForAcceptance(orderSn) {
      const res = await handleSubmitAcceptance(orderSn);
      if (res.message === "操作成功") {
        this.$message({
          message: res.message,
          type: "success",
        });
        this._getRepairOrderDetail();
      }
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
    sumbitQuotation() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let data = {
        orderSn: this.orderSn,
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
    sumbitCheck(fn) {
      if (this.checkForm.status == "0" && !this.checkForm.rejectReason) {
        this.$message.error("请输入驳回原因");
        return;
      }
      this.$axios
        .post(this.url.handleEnterpriseCheck, this.checkForm)
        .then((data) => {
          if (data.code == "000") {
            this.$message({
              showClose: true,
              message: data.message,
              type: "success",
            });
            this.resetCheckForm(fn);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
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
