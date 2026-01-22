<template>
  <div
    class="scroll-container"
    :style="sidebar.opened ? '80vw' : '93vw'"
    ref="scrollContainer"
    @mousedown="handleMouseDown"
  >
    <div class="process-wrapper">
      <div
        v-for="(item, index) in steps"
        :key="index"
        class="step"
        :data-status="item.status"
      >
        <span class="label">{{ item.processName }}</span>
        <span class="num">{{ item.createTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ProcessFlow",
  props: {
    params: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      // 状态：completed (蓝), suspended (黄), aborted (红), pending (灰), interval(绿)
      isDown: false,
      startX: 0,
      scrollLeft: 0,

      defaultProcess: [
        { processKey: "enterprise_create_order", processName: "企业发布订单" },
        { processKey: "platform_assign_master", processName: "平台指派师傅" },
        { processKey: "master_accept_order", processName: "师傅接单" },
        { processKey: "master_remote_quote", processName: "致电&远程报价" },
        { processKey: "master_start_journey", processName: "师傅开始出发" },
        { processKey: "master_arrival_punch", processName: "师傅到点打卡" },
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
        { processKey: "warranty_period", processName: "质保期" },

        // { processKey: "master_cancel", processName: "师傅取消" }, 红
        // { processKey: "consult_cost", processName: "协商师傅费用" }, 绿
        // { processKey: "enterprise_cancel", processName: "企业取消" }, 红
        // { processKey: "platform_cancel", processName: "平台取消" }, 红
        // { processKey: "order_suspension", processName: "订单中止" }, 红
        // { processKey: "cancel_order_suspension", processName: "取消订单中止" },
        // { processKey: "order_stop", processName: "订单挂起" }, 绿
        //  { processKey: "enterprise_comment", processName: "企业评论" },
        // { processKey: "cancel_order_stop", processName: "取消订单挂起" },
      ],
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    // 改造后的 steps 计算属性
    steps() {
      if (!this.params || this.params.length === 0) return [];

      // 封装一个补全函数
      const fillRemainingProcess = (params, standard) => {
        // --- 1. 给原始数据统一添加 status: "completed" ---
        const completedParams = params.map((item) => ({
          ...item,
          status: "completed",
        }));
        // --- 2. 根据 consult_cost 分割数组 ---
        let groups = [];
        let currentGroup = [];
        completedParams.forEach((item) => {
          currentGroup.push(item);
          if (item.processKey === "consult_cost") {
            groups.push(currentGroup);
            currentGroup = [];
          }
        });
        if (currentGroup.length > 0) groups.push(currentGroup);
        if (groups.length === 0) groups = [completedParams];
        // --- 3. 对最后一个子数组执行“向上回溯补全”逻辑 ---
        const lastGroup = groups[groups.length - 1];
        let foundIndexInStandard = -1;
        // 从后往前查找最后一个能在标准库中对应的 key
        for (let i = lastGroup.length - 1; i >= 0; i--) {
          const keyToFind = lastGroup[i].processKey;
          const idx = standard.findIndex((s) => s.processKey === keyToFind);
          if (idx !== -1) {
            foundIndexInStandard = idx;
            break;
          }
        }
        // --- 4. 如果找到了标准位置，追加后续 pending 节点 ---
        if (
          foundIndexInStandard !== -1 &&
          foundIndexInStandard < standard.length - 1
        ) {
          const remainingNodes = standard
            .slice(foundIndexInStandard + 1)
            .map((node) => ({
              ...node,
              status: "pending", // 标记为待处理
              id: null, // 补全节点没有真实 ID
              createTime: null, // 占位符
              remark: null,
              relationOrderSn: lastGroup[0]?.relationOrderSn || "", // 保持关联单号一致
            }));
          groups[groups.length - 1] = [...lastGroup, ...remainingNodes];
        }
        return groups;
      };
      /**
       * 处理订单状态参数
       * 当最后一个节点为取消或挂起等特殊状态时，统一标记状态
       * 其中 'consult_cost' 节点标记为 interval，其余标记为 completed
       */
      const CANCEL_KEYS = [
        "master_cancel",
        "consult_cost",
        "enterprise_cancel",
        "platform_cancel",
        "order_suspension",
        "order_stop",
      ];
      const lastItem = this.params[this.params.length - 1];
      if (lastItem && CANCEL_KEYS.includes(lastItem.processKey)) {
        // 不补全
        let editParams = this.params.map((item, index) => ({
          ...item,
          status:
            item.processKey === "consult_cost"
              ? "interval"
              : index === this.params.length - 1 &&
                (item.processKey === "master_cancel" ||
                  item.processKey === "enterprise_cancel" ||
                  item.processKey === "platform_cancel")
              ? "aborted"
              : index === this.params.length - 1 &&
                (item.processKey === "order_suspension" ||
                  item.processKey === "order_stop")
              ? "suspended"
              : "completed",
        }));

        // 超时常驻红色
        editParams.forEach((item) => {
          console.log(159, item);
          if (item.timeOutDuration) {
            item.status = "aborted";
          }
        });
        return editParams;
      } else {
        // 补全逻辑
        let result = fillRemainingProcess(
          this.params,
          this.defaultProcess
        ).flat();
        result.forEach((item) => {
          if (item.processKey == "consult_cost") {
            item.status = "interval";
          }
        });
        return result;
      }
    },
  },
  mounted() {
    this.autoScrollToLatest();
  },
  watch: {
    params: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.autoScrollToLatest();
        }
      },
      deep: true, // 深度监听
      immediate: true, // 立即执行一次，确保组件刚加载如果有数据也能滚动
    },
  },
  methods: {
    // [新增] 自动滚动到最新节点
    autoScrollToLatest() {
      this.$nextTick(() => {
        const container = this.$refs.scrollContainer;
        if (!container) return;

        // 获取渲染后的所有 step 元素
        const stepNodes = container.querySelectorAll(".step");

        // 计算目标索引：
        // params 是实际发生的流程数据，steps 是包含补全的数据。
        // 我们通常希望定位到 params 的最后一个（即当前状态）。
        // 如果 params 为空，则不滚动或滚动到 0
        let targetIndex =
          this.params && this.params.length > 0 ? this.params.length - 1 : 0;

        // 安全校验，防止索引越界（比如 params 长度超过了实际渲染的节点数）
        if (targetIndex >= stepNodes.length) {
          targetIndex = stepNodes.length - 1;
        }

        const targetNode = stepNodes[targetIndex];

        if (targetNode) {
          // 使用原生 API 平滑滚动到视野中心
          targetNode.scrollIntoView({
            behavior: "smooth", // 平滑滚动
            inline: "center", // 水平居中
            block: "nearest", // 垂直方向就近
          });
        }
      });
    },

    handleMouseDown(e) {
      this.isDown = true;
      const container = this.$refs.scrollContainer;
      this.startX = e.pageX - container.offsetLeft;
      this.scrollLeft = container.scrollLeft;

      // 绑定全局事件，确保鼠标离开容器后也能正常释放
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    handleMouseMove(e) {
      if (!this.isDown) return;
      e.preventDefault();
      const container = this.$refs.scrollContainer;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 1.5; // 调节滑动速度
      container.scrollLeft = this.scrollLeft - walk;
    },
    handleMouseUp() {
      this.isDown = false;
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
  },
  beforeDestroy() {
    // 销毁前移除全局监听，防止内存泄漏
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  },
  created() {},
};
</script>

<style scoped>
/* 1. 颜色与变量定义 */
.scroll-container {
  --color-pending: #d6d6d6;
  --color-completed: #409eff;
  --color-suspended: #ffd635;
  --color-aborted: #e50014;
  --color-interval: #00c691;
  --arrow-w: 12px;
  --step-width: 110px;

  margin: 0px auto;
  overflow-x: auto;
  cursor: grab;
  user-select: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
}

/* 隐藏滚动条 */
.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-container:active {
  cursor: grabbing;
}

.process-wrapper {
  display: flex;
  flex-wrap: nowrap;
  min-width: max-content;
  gap: 0;
  padding: 10px 0;
}

.step {
  flex-shrink: 0;
  min-width: var(--step-width);
  /* height: 55px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  padding: 6px 45px 6px 40px;

  /* 极致细白线核心：负边距 + 投影 */
  margin-right: -10px;
  filter: drop-shadow(0.5px 0 0 white);

  clip-path: polygon(
    0% 0%,
    calc(100% - var(--arrow-w)) 0%,
    100% 50%,
    calc(100% - var(--arrow-w)) 100%,
    0% 100%,
    var(--arrow-w) 50%
  );
}

/* 状态样式 */
.step[data-status="pending"] {
  background-color: var(--color-pending);
  color: #666;
}
.step[data-status="completed"] {
  background-color: var(--color-completed);
  color: #fff;
}
.step[data-status="suspended"] {
  background-color: var(--color-suspended);
  color: #333;
}
.step[data-status="aborted"] {
  background-color: var(--color-aborted);
  color: #fff;
}
.step[data-status="interval"] {
  background-color: var(--color-interval);
  color: #fff;
}

.num {
  font-size: 11px;
  opacity: 1;
  margin-top: 3px;
}

/* 首尾特殊处理 */
.step:first-child {
  padding-left: 45px;
  clip-path: polygon(
    0% 0%,
    calc(100% - var(--arrow-w)) 0%,
    100% 50%,
    calc(100% - var(--arrow-w)) 100%,
    0% 100%
  );
}

.step:last-child {
  margin-right: 0;
  filter: none;
  padding-right: 40px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, var(--arrow-w) 50%);
}
</style>