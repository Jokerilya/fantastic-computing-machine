<template>
  <div class="service-timeline-wrapper">
    <div class="global-action-bar">
      <div class="bar-title">服务流程控制</div>
      <div class="bar-btns">
        <!-- <el-button
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
        > -->
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
      <div v-for="(item, index) in dataList" :key="index" class="timeline-item">
        <div class="item-time">
          {{ item.createTime }}
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
            <div>
              <div v-if="item.durationFromLast" class="duration-tag">
                <i class="el-icon-time"></i> 耗时：{{ item.durationFromLast }}
              </div>
            </div>
          </div>

          <div class="content-details">
            <!-- :class="detail.type" -->
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
      noteTimeShow: false,
      defaultProcess: [
        { processKey: "enterprise_create_order", processName: "企业发布订单" },
        { processKey: "platform_assign_master", processName: "平台指派师傅" },
        { processKey: "master_accept_order", processName: "师傅接单" },
        { processKey: "master_remote_quote", processName: "致电&远程报价" },
        { processKey: "master_start_journey", processName: "师傅开始出发" },
        { processKey: "master_arrival_punch", processName: "师傅到点打卡" },
        { processKey: "master_diagnosis", processName: "师傅诊断" },
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
        // 处理备注JSON
        let remark = item.remark ? JSON.parse(item.remark) : "无";
        if (Array.isArray(remark)) {
          remark.forEach((i) => {
            i.createTime = i.createTime.replace("T", " ").substring(0, 19);
          });
        }

        // 处理快照JSON
        let resultSnapshot = item.resultSnapshot
          ? JSON.parse(item.remark)
          : "无";
        if (Array.isArray(resultSnapshot)) {
          resultSnapshot.forEach((i) => {});
        }

        let bizButtons;
        // 对每个状态展示不同按钮
        if (item.processKey == "enterprise_create_order") {
          bizButtons = ["添加备注", "时效要求"];
        }
        return {
          ...item,
          resultSnapshot,
          remark,
          bizButtons,
        };
      });

      // 计算出相邻项的时间
      return this.calculateTimeDiffs(newList);
    },
  },
  methods: {
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
          line-height: 1.8;
          color: #303133;

          .detail-line {
            margin-bottom: 4px;
            display: flex;
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
      }
    }
  }
}
</style>