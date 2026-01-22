<template>
  <div class="service-timeline-wrapper">
    <div class="global-action-bar">
      <div class="bar-title">服务流程控制</div>
      <div class="bar-btns">
        <el-button
          size="small"
          type="primary"
          plain
          @click="changeNoteTimeShow"
          >{{ noteTimeShow ? "隐藏时间" : "显示时间" }}</el-button
        >
      </div>
    </div>
    <div class="timeline-content">
      <div v-for="(item, index) in viewList" :key="index" class="timeline-item">
        <div class="item-time">
          <div style="margin-bottom: 10px">
            {{ item.createTime }}
          </div>
          <div
            v-if="item.standardDuration == '0分钟' || !item.standardDuration"
          >
            未设定标准时长
          </div>
          <div v-else>标准时长: {{ item.standardDuration }}</div>
        </div>

        <div class="item-content">
          <div class="content-header">
            <div style="display: flex; align-items: center">
              <span
                class="step-title"
                :style="{ color: item.titleColor || '#00a884' }"
              >
                {{ item.processName }}
              </span>

              <div
                class="business-btns"
                v-if="item.bizButtons && item.bizButtons.length > 0"
              >
                <div v-for="(btn, bIdx) in item.bizButtons" :key="bIdx">
                  <el-upload
                    class="upload-demo"
                    style="display: none"
                    :ref="'methodOfPaymentRef-' + item.id"
                    action
                    multiple
                    :http-request="
                      (file) =>
                        uploadTheQuotation(file, item.id, currentPaymentType)
                    "
                    :show-file-list="false"
                  >
                  </el-upload>

                  <el-upload
                    v-if="btn == '上传报价单'"
                    class="upload-demo"
                    action
                    multiple
                    :http-request="
                      (file) =>
                        uploadTheQuotation(file, item.id, 'prepaidQuotation')
                    "
                    :show-file-list="false"
                  >
                    <el-button size="mini" round type="primary" plain
                      >上传报价单</el-button
                    >
                  </el-upload>
                  <el-dropdown
                    v-else-if="btn == '确认收款'"
                    @command="(type) => handleCommand(type, item.id)"
                  >
                    <el-button size="mini" round type="primary" plain>
                      确认收款<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="paymentType_corporate"
                        >对公支付</el-dropdown-item
                      >
                      <el-dropdown-item command="paymentType_wechatPayQrCode"
                        >企微商业收款</el-dropdown-item
                      >
                      <el-dropdown-item command="paymentType_other"
                        >其他方式</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button
                    v-else
                    size="mini"
                    round
                    type="primary"
                    plain
                    @click="clickBizButtons(btn, item, bIdx, index)"
                  >
                    {{ btn }}
                  </el-button>
                </div>
              </div>
            </div>
            <div>
              <div
                v-if="item.totalDuration"
                :class="[
                  item.timeOutDuration ? 'duration-tag' : 'duration-tag-succse',
                ]"
              >
                <i class="el-icon-time"></i> 距上节点耗时：{{
                  item.totalDuration
                }}
                <span v-if="item.timeOutDuration"
                  >(超时{{ item.timeOutDuration }})</span
                >
              </div>
            </div>
          </div>

          <div v-if="item.isShow">
            <div
              class="content-details content-details-remark"
              v-if="item.remark && item.remark.length > 0"
            >
              <div
                v-for="(detail, dIdx) in item.remark"
                :key="dIdx"
                class="detail-line"
              >
                <div class="detail-line-createTime" v-if="noteTimeShow">
                  [ {{ detail.createTime }} ]:
                </div>
                <div>{{ detail.content }}</div>
              </div>
            </div>

            <div
              class="content-details"
              v-if="item.resultSnapshot && item.resultSnapshot.length > 0"
            >
              <div
                v-for="(detail, dIdx) in item.resultSnapshot"
                :key="dIdx"
                class="detail-line"
              >
                <div class="detail-line-createTime" v-if="noteTimeShow">
                  [ {{ detail.createTime }} ]:
                </div>
                <div
                  v-if="
                    detail.targetType == 'parts' ||
                    detail.targetType == 'faults' ||
                    detail.targetType == 'master_settlement'
                  "
                >
                  <!-- 配件 -->
                  <div
                    v-if="
                      detail.targetType == 'parts' && detail.content.length > 0
                    "
                    class="responsive-table-wrapper"
                  >
                    <el-table :data="detail.content" border style="width: 50vw">
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
                          <div v-if="!row.index" style="color: red">(转移)</div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="图片" width="110">
                        <template slot-scope="{ row }">
                          <PrivateFilePreviewer
                            :file-paths="row.image.split(',')[0]"
                            v-if="row.image"
                          ></PrivateFilePreviewer>
                          <span v-else>无</span>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="模式" width="80">
                        <template slot-scope="{ row }">{{
                          row.model == 1 ? "外发维修" : "采买新件"
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        width="50"
                        label="采买角色"
                        align="center"
                      >
                        <template slot-scope="{ row }">
                          <span v-if="row.type !== 2">师傅自采</span
                          ><span v-else style="color: #409eff">平台采购</span>
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
                            row.num * row.price
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        align="center"
                        label="备注"
                        show-overflow-tooltip
                      >
                        <template slot-scope="{ row }">
                          {{ row.remarks ? row.remarks : "--" }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div
                    v-if="
                      detail.targetType == 'parts' && detail.content.length == 0
                    "
                  >
                    暂无配件
                  </div>
                  <!-- 故障项 -->
                  <div
                    v-if="
                      detail.targetType == 'faults' && detail.content.length > 0
                    "
                    class="responsive-table-wrapper"
                  >
                    <el-table :data="detail.content" border style="width: 50vw">
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
                          <div v-if="row.previousMasterFlag" style="color: red">
                            (前师傅转移)
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="区间浮动价"
                        align="center"
                        width="100"
                      >
                        <template slot-scope="{ row }">{{
                          row.generalAmount + "~" + row.annualAmount
                        }}</template>
                      </el-table-column>
                      <el-table-column
                        label="师傅提交价"
                        width="100"
                        align="center"
                      >
                        <template slot-scope="{ row }">{{
                          row.masterConsultAmount || 0
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
                        width="110"
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
                        width="110"
                        label="故障图片"
                        align="center"
                      >
                        <template slot-scope="{ row }">
                          <PrivateFilePreviewer
                            :file-paths="row.image[0]"
                            v-if="row.image && row.image[0]"
                          ></PrivateFilePreviewer>
                          <div v-else class="text-gray">无</div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-divider v-if="dIdx < item.resultSnapshot.length - 1"
                      >🔻 修改数据 🔻</el-divider
                    >
                  </div>
                  <div
                    v-if="
                      detail.targetType == 'faults' &&
                      detail.content.length == 0
                    "
                  >
                    暂无故障项
                  </div>
                  <!-- 师傅结算 -->
                  <div
                    v-if="
                      detail.targetType == 'master_settlement' &&
                      detail.content.length > 0
                    "
                    class="responsive-table-wrapper"
                  >
                    <el-table :data="detail.content" border style="width: 50vw">
                      <el-table-column
                        label="师傅名称"
                        prop="masterRealName"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        label="人工费"
                        prop="doorAmount"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        label="配件费用"
                        prop="partAmount"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        label="平台抽成"
                        prop="serviceAmount"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        label="质保金"
                        prop="retentionMoney"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        label="支付金额"
                        prop="payAmount"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="耗卡量"
                        prop="card_num"
                        align="center"
                      >
                      </el-table-column>
                    </el-table>
                  </div>
                  <div
                    v-if="
                      detail.targetType == 'master_settlement' &&
                      detail.content.length == 0
                    "
                    class="responsive-table-wrapper"
                  >
                    暂无师傅结算
                  </div>
                </div>
                <div v-else>
                  <div v-if="item.processKey == 'enterprise_invoice'">
                    <div
                      v-for="contentItem in detail.content"
                      :key="contentItem"
                    >
                      {{ contentItem }}
                    </div>
                  </div>
                  <div v-else class="content-line">
                    <div style="margin-right: 8px">{{ detail.content }}</div>
                    <PrivateFilePreviewer
                      :file-paths="detail.images"
                      v-if="
                        detail.images &&
                        (item.processKey == 'enterprise_check' ||
                          item.processKey == 'platform_examine_quote' ||
                          item.processKey == 'enterprise_payment')
                      "
                      :custom-text="
                        item.processKey == 'enterprise_check'
                          ? '查看验收单'
                          : item.processKey == 'platform_examine_quote'
                          ? '查看报价单'
                          : null
                      "
                    ></PrivateFilePreviewer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PrivateFilePreviewer
            v-if="item.imagesSummary && item.imagesSummary.length > 0"
            :file-paths="item.imagesSummary"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { UploadImg } from "@/api/system.js";
export default {
  name: "ServiceTimeline",
  props: {
    params: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      noteTimeShow: false,
      viewList: [],
      defaultProcess: [
        { processKey: "enterprise_create_order", processName: "企业发布订单" },
        { processKey: "platform_assign_master", processName: "平台指派师傅" },
        { processKey: "master_accept_order", processName: "师傅接单" },
        { processKey: "master_remote_quote", processName: "致电&远程报价" },
        { processKey: "master_start_journey", processName: "师傅开始出发" },
        { processKey: "master_arrival_punch", processName: "师傅到点打卡" },
        { processKey: "master_diagnosis", processName: "师傅诊断" },
        { processKey: "master_submit_quote", processName: "师傅诊断&报价" },
        {
          processKey: "platform_examine_quote",
          processName: "平台审核定价&审调",
        },
        { processKey: "enterprise_confirm_quote", processName: "客户确认报价" },
        { processKey: "master_start_service", processName: "师傅开始服务" },
        { processKey: "master_submit_check", processName: "师傅提交验收" },
        { processKey: "enterprise_check", processName: "企业验收" },
        { processKey: "enterprise_payment", processName: "企业结算&支付" },
        { processKey: "order_completed", processName: "订单完结" },
        { processKey: "enterprise_comment", processName: "企业评论" },
        { processKey: "warranty_period", processName: "质保期" },
      ],
      // 用于暂存当前点击的支付方式
      currentPaymentType: "",
    };
  },

  watch: {
    params: {
      handler(newVal) {
        this.initViewList(newVal);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 这里的 file 是 el-upload 传回的原始对象
    handleCommand(command, id) {
      this.currentPaymentType = command;
      const refKey = "methodOfPaymentRef-" + id;
      const uploadRef = this.$refs[refKey];
      const component = Array.isArray(uploadRef) ? uploadRef[0] : uploadRef;
      component.$el.querySelector("input").click();
    },
    // 导入
    async uploadTheQuotation(data, id, remarkType) {
      const formData = new FormData();
      formData.append("file", data.file);
      const res = await UploadImg(formData);
      if (res.code == "000") {
        this.$emit("upload-quotation-sheet", res.data, id, remarkType);
      }
    },
    // 打开pdf文件
    openPdf(images) {
      const pdfUrl = images[0];
      window.open(pdfUrl, "_blank");
    },
    initViewList(params) {
      if (!params) return;
      const newList = this.params.map((item) => {
        // 处理备注JSON
        let remark = item.remark ? JSON.parse(item.remark) : null;
        if (Array.isArray(remark)) {
          remark.forEach((i) => {
            i.createTime = i.createTime.replace("T", " ").substring(0, 19);
          });
        }

        // 处理快照JSON
        let resultSnapshot = item.resultSnapshot
          ? JSON.parse(item.resultSnapshot)
          : null;
        let imagesSummary = [];
        if (Array.isArray(resultSnapshot)) {
          resultSnapshot.forEach((i) => {
            i.createTime = i.createTime.replace("T", " ").substring(0, 19);
            if (i.images) {
              let imageArray = i.images.split(",");
              i.images = imageArray;
              imagesSummary = imageArray.filter(
                (item) => !item.includes(".pdf")
              );
            }

            // 对开票内容 #^# 分割数组
            if (item.processKey == "enterprise_invoice") {
              i.content = i.content.split("#^#");
            }
            console.log(599, i);

            if (
              (i.targetType == "parts" ||
                i.targetType == "faults" ||
                i.targetType == "master_settlement") &&
              i.content &&
              typeof i.content === "string"
            ) {
              try {
                i.content = JSON.parse(i.content);
              } catch (e) {
                i.content = [];
              }
            }
            if (!Array.isArray(i.content)) {
              if (!i.content) i.content = [];
            }
          });
        }
        item.resultSnapshot = resultSnapshot;

        let bizButtons = [];
        let titleColor = null;
        let isShow = true;
        // 对每个状态展示不同按钮
        if (item.processKey == "enterprise_create_order") {
          bizButtons = ["添加备注", "时效要求"];
        }
        if (item.processKey == "platform_assign_master") {
          bizButtons = ["添加备注", "重新指派师傅"];
        }
        if (item.processKey == "master_accept_order") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_remote_quote") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_start_journey") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_arrival_punch") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_submit_quote") {
          bizButtons = ["添加备注", "查看师傅报价", "确认报价", "收起"];
        }
        if (item.processKey == "platform_examine_quote") {
          bizButtons = ["添加备注", "上传报价单", "收起"];
        }
        if (item.processKey == "order_stop") {
          bizButtons = ["添加备注"];
          titleColor = "#e50014";
        }
        if (item.processKey == "cancel_order_stop") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "enterprise_confirm_quote") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_start_service") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "master_submit_check") {
          bizButtons = ["添加备注"];
        }
        if (item.processKey == "enterprise_check") {
          bizButtons = ["添加备注"];
        }
        //  "上传开票凭证"
        if (item.processKey == "enterprise_payment") {
          bizButtons = ["添加备注", "确认收款"];
        }

        if (item.processKey == "consult_cost") {
          bizButtons = ["协商师傅费用"];
        }

        return {
          ...item,
          remark,
          bizButtons,
          titleColor,
          isShow,
          imagesSummary,
        };
      });
      // 计算出相邻项的时间
      this.viewList = this.calculateTimeDiffs(newList);
    },
    // 点击了按钮
    clickBizButtons(btn, item, bIdx, index) {
      if (btn == "展开" || btn == "收起") {
        this.viewList[index].isShow = !this.viewList[index].isShow;
        const newText = this.viewList[index].isShow ? "收起" : "展开";
        this.$set(this.viewList[index].bizButtons, bIdx, newText);
        return;
      }
      this.$emit("biz-click", btn, item);
    },
    // 是否展示备注时间
    changeNoteTimeShow() {
      this.noteTimeShow = !this.noteTimeShow;
    },
    /**
     * 计算数组中相邻项 createTime 的时间差
     * @param {Array} data 原始对象数组
     * @returns {Array} 带有时间差字段的新数组
     */
    calculateTimeDiffs(data) {
      return data.map((item, index) => {
        if (index === 0) {
          return { ...item, durationFromLast: null };
        }
        const currentTime = new Date(item.createTime).getTime();
        const prevTime = new Date(data[index - 1].createTime).getTime();
        const diffMs = currentTime - prevTime;
        const duration = this.formatDuration(diffMs);
        return { ...item, durationFromLast: duration };
      });
    },
    formatDuration(ms) {
      if (ms <= 0) return null; // 如果是0秒或负数，不返回字符串以便不显示标签
      const totalSeconds = Math.floor(ms / 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    },
  },
};
</script>

<style lang="scss" scoped>
$border-color: #ebeef5;
$bg-light: #f5f7fa;
$blue-color: #409eff;
$time-color: #909399;

.service-timeline-wrapper {
  border: 1px solid $border-color;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  // 顶部操作栏样式
  .global-action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    // background-color: $bg-light;
    border-bottom: 2px solid $border-color;
    position: sticky;
    top: 0;
    z-index: 10;

    .bar-title {
      font-weight: bold;
      font-size: 15px;
      color: #303133;
      &:before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 16px;
        background: $blue-color;
        margin-right: 8px;
        vertical-align: middle;
      }
    }

    .bar-btns {
      display: flex;
      gap: 12px;

      .btn-jump {
        background-color: #eef5fe;
        color: $blue-color;
        border-color: #c6e2ff;
        &:hover {
          background-color: $blue-color;
          color: #fff;
        }
      }
    }
  }

  // 流程列表样式
  .timeline-content {
    .timeline-item {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .item-time {
        width: 140px;
        font-size: 13px;
        color: $time-color;
        padding-top: 6px;
        flex-shrink: 0;
      }

      .item-content {
        flex: 1;

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .step-title {
            font-size: 16px;
            font-weight: bold;
            // width: 100px; // 如果名称长，建议改为 min-width
            min-width: 100px;
            margin-right: 15px;
          }

          // 新增耗时字段样式
          .duration-tag-succse {
            font-size: 12px;
            color: #52c41a; // 使用红色强调耗时，或者用 #909399 灰色
            background-color: #f6ffed;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #b7eb8f;
            margin-right: 15px;
            display: flex;
            align-items: center;

            i {
              margin-right: 4px;
            }
          }

          .duration-tag {
            font-size: 12px;
            color: #f56c6c; // 使用红色强调耗时，或者用 #909399 灰色
            background-color: #fef0f0;
            padding: 2px 8px;
            border-radius: 4px;
            border: 1px solid #fde2e2;
            margin-right: 15px;
            display: flex;
            align-items: center;

            i {
              margin-right: 4px;
            }
          }

          .business-btns {
            flex: 1;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
        }

        .content-details {
          font-size: 13px;
          padding: 8px 0;
          color: #303133;
          .content-line {
            display: flex;
            align-items: center;
          }

          .detail-line {
            margin-bottom: 10px;
            display: flex;
            align-items: center;

            .detail-line-createTime {
              margin-right: 8px;
              color: #909399;
            }
            &.info {
              color: $blue-color;
            }
            &.error {
              color: #f56c6c;
              font-weight: bold;
            }
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
  }
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
</style>