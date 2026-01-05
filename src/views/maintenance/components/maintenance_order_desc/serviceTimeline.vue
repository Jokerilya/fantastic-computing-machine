<template>
  <div class="service-timeline-wrapper">
    <!-- <div class="global-action-bar">
      <div class="bar-title">服务流程控制</div>
      <div class="bar-btns">
        <el-button
          size="small"
          class="btn-jump"
          icon="el-icon-position"
          @click="$emit('global-jump')"
          >跳转</el-button
        >
        <el-button
          size="small"
          type="warning"
          plain
          icon="el-icon-video-pause"
          @click="$emit('global-pause')"
          >挂起</el-button
        >
        <el-button
          size="small"
          type="danger"
          plain
          icon="el-icon-circle-close"
          @click="$emit('global-stop')"
          >中止</el-button
        >
      </div>
    </div> -->
    <div class="timeline-content">
      <div v-for="(item, index) in dataList" :key="index" class="timeline-item">
        <div class="item-time">
          {{ item.createTime }}
        </div>

        <div class="item-content">
          <div class="content-header">
            <span
              class="step-title"
              :style="{ color: item.titleColor || '#00a884' }"
            >
              {{ item.processName }}
            </span>

            <div class="business-btns" v-if="item.bizButtons">
              <el-button
                v-for="(btn, bIdx) in item.bizButtons"
                :key="bIdx"
                size="mini"
                round
                type="primary"
                plain
                @click="$emit('biz-click', btn, item)"
              >
                {{ btn }}
              </el-button>
            </div>
          </div>

          <div class="content-details">
            <!-- :class="detail.type" -->
            <div
              v-for="(detail, dIdx) in item.remark"
              :key="dIdx"
              class="detail-line"
            >
              {{ detail }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      test: [
        {
          time: "2025/12/08 9:27",
          stepName: "A. 询盘",
          bizButtons: [],
          details: [
            {
              text: "已经询盘了",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 9:30",
          stepName: "B. 响应",
          bizButtons: [],
          details: [
            {
              text: "已经响应了",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 9:35",
          stepName: "C. 回盘",
          bizButtons: [],
          details: [
            {
              text: "已经回盘了",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 9:50",
          stepName: "1. 下单",
          bizButtons: ["添加备注", "客服领单", "时效要求"],
          details: [
            {
              text: "某某某客户 (UID) 某某人 (手机号码) 在小程序下单(订单号)，原始订单信息 (链接)",
              type: "",
            },
            { text: "某某客服跟单 (系统自动选择跟单人员)", type: "" },
            { text: "时效要求：A", type: "" },
            { text: "A. 急修，3小时到厂，当日修好", type: "" },
            { text: "B. 快修，当日到厂，24小时修好", type: "" },
            { text: "C. 普修，预约上门，到厂后72小时内修好", type: "" },
          ],
        },
        {
          time: "2025/12/08 10:00",
          stepName: "2. 指派",
          bizButtons: ["添加备注", "指派系统推荐师傅", "指派师傅"],
          details: [
            { text: "系统自动匹配推荐师傅：", type: "" },
            { text: "1、自有师傅 赵师傅 (电话)  勾选确认", type: "" },
            { text: "2、自有师傅 钱师傅 (电话)", type: "" },
            { text: "3、合作师傅 孙师傅 (电话)", type: "" },
            { text: "某某客服指派 合作师傅 孙师傅 (电话)", type: "" },
          ],
        },
        {
          time: "2025/12/08 10:10",
          stepName: "3. 接单",
          bizButtons: ["添加备注", "师傅确认接单"],
          details: [{ text: "某某师傅 (电话) 通过APP确认接单", type: "" }],
        },
        {
          time: "2025/12/08 10:15",
          stepName: "4. 致电",
          bizButtons: ["添加备注", "师傅已致电"],
          details: [
            {
              text: "某某师傅 (电话) 12月8日10:15 致电客户，了解故障详情，完成远程预诊断，预约上门时间",
              type: "",
            },
            {
              text: "某某师傅预约到客户工厂时间：2025年12月8日 12:00",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 10:30",
          stepName: "5. 预报价",
          bizButtons: [
            "添加备注",
            "师傅预报价",
            "客户确认预报价",
            "客户要求到现场报价",
          ],
          details: [
            {
              text: "某某师傅 (电话) 12月8日10:30 提交了预报价/情况不明，需要到现场诊断后再报价",
              type: "",
            },
            {
              text: "某某客户 (电话) (时间) 在客户对接群中确认了预报价/在小程序上确认了预报价",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 10:40",
          stepName: "6. 出发",
          bizButtons: ["添加备注", "师傅已出发"],
          details: [
            {
              text: "某某师傅 (电话) 12月8日10:40 已出发，预计11:45到达",
              type: "",
            },
            {
              text: "系统向客户发送通知短信：某某师傅 (电话) 已出发，预计11:45左右到达",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 12:00",
          stepName: "7. 到厂",
          bizButtons: ["添加备注", "师傅已到达"],
          details: [
            {
              text: "某某师傅 (电话) 12月8日12:00 已到达，超过预约时间0分钟",
              type: "",
            },
            { text: "师傅从接单到到厂耗时：1小时50分钟", type: "error" }, // 红色加粗
            {
              text: "系统向客户发送通知短信：某某师傅 (电话) 已到达",
              type: "",
            },
          ],
        },
        {
          time: "2025/12/08 12:15",
          stepName: "8. 诊断",
          bizButtons: ["添加备注", "师傅已诊断"],
          details: [
            { text: "某某师傅 (电话) 12月8日12:15 提交检测照片", type: "info" },
            {
              text: "某某师傅 (电话) 12月8日12:30 提交故障诊断报告",
              type: "info",
            },
            { text: "故障诊断报告内容：", type: "info" },
            {
              text: "故障1：系统开机开到一半开不起来，无法正常开机 (电路正常)",
              type: "info",
            },
            { text: "原因1：系统模块损坏", type: "info" },
            { text: "故障2：...", type: "info" },
            { text: "解决方案：维修系统模块", type: "info" },
          ],
        },
        {
          time: "2025/12/08 12:30",
          stepName: "9. 报价",
          bizButtons: ["添加备注", "报价器", "客服审核", "经理审核"],
          details: [
            { text: "某某师傅 (电话) 12月8日12:30 提交报价单草表", type: "" },
            { text: "某某客服 (电话) 12月8日12:35 审核报价单", type: "" },
            { text: "某某经理 (电话) 12月8日12:40 审核报价单", type: "" },
          ],
        },
      ],
      defaultProcess: [
        { processKey: "enterprise_create_order", processName: "企业发布订单" },
        { processKey: "platform_assign_master", processName: "平台指派师傅" },
        { processKey: "master_accept_order", processName: "师傅接单" },
        { processKey: "master_remote_quote", processName: "师傅远程报价" },
        { processKey: "master_start_journey", processName: "师傅开始出发" },
        { processKey: "master_arrival_punch", processName: "师傅到点打卡" },
        { processKey: "master_submit_quote", processName: "师傅提交报价" },
        { processKey: "platform_examine_quote", processName: "平台审核定价" },
        { processKey: "enterprise_confirm_quote", processName: "客户确认报价" },
        { processKey: "master_start_service", processName: "师傅开始服务" },
        { processKey: "master_submit_check", processName: "师傅提交验收" },
        { processKey: "enterprise_check", processName: "企业验收" },
        { processKey: "enterprise_payment", processName: "企业支付" },
        { processKey: "enterprise_comment", processName: "企业评论" },
        { processKey: "warranty_period", processName: "质保期" },
        { processKey: "order_completed", processName: "订单完结" },
      ],
    };
  },
  computed: {
    dataList() {
      const newList = this.params.map((item) => {
        return {
          ...item,
          remark: item.remark ? item.remark.split("\n") : "无",
          bizButtons: ["添加备注"],
        };
      });
      return newList;
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
          align-items: center;
          margin-bottom: 12px;

          .step-title {
            font-size: 16px;
            font-weight: bold;
            width: 100px;
            margin-right: 15px;
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
          line-height: 1.8;
          color: #303133;

          .detail-line {
            margin-bottom: 4px;
            &.info {
              color: $blue-color;
            }
            &.error {
              color: #f56c6c;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>