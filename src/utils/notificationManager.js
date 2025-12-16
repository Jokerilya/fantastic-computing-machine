/**
 * 通知管理器：实现跨页面去重、防重复推送、自动清理
 * 适用场景：Vue 2 / 原生 JS 项目
 * 特性：
 *   - 同 messageId 多标签页仅推送一次
 *   - localStorage 自动清理过期记录（默认 7 天）
 *   - 兼容无 BroadcastChannel 的旧浏览器
 */

export class NotificationManager {
  /**
   * @param {Object} options
   * @param {number} [options.maxAge=604800000] - 通知记录保留时长（毫秒），默认 7 天
   * @param {string} [options.storageKeyPrefix='notif_shown_'] - localStorage key 前缀
   * @param {number} [options.cleanupProbability=0.01] - 自动清理触发概率（0~1）
   */
  constructor(options = {}) {
    this.maxAge = options.maxAge ?? 7 * 24 * 60 * 60 * 1000; // 7 days
    this.storageKeyPrefix = options.storageKeyPrefix ?? "notif_shown_";
    this.cleanupProbability = options.cleanupProbability ?? 0.01; // 1% 概率触发清理

    // 初始化 BroadcastChannel（用于多标签同步）
    this.channel = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel("push-notification-channel");
        this.channel.onmessage = (event) => {
          const { type, messageId } = event.data || {};
          if (type === "NOTIFICATION_SHOWN" && messageId) {
            this.markAsShown(messageId);
          }
        };
      } catch (err) {
        console.warn("[NotificationManager] BroadcastChannel 初始化失败:", err);
      }
    }
  }

  /**
   * 标记消息已显示（写入存储 + 广播）
   * @param {string} messageId - 唯一消息 ID
   */
  markAsShown(messageId) {
    const now = Date.now();
    const key = this.storageKeyPrefix + messageId;

    try {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, String(now));
      }
      // 概率触发清理（避免每次写入都遍历）
      if (Math.random() < this.cleanupProbability) {
        this._cleanupExpired();
      }

      // 广播给其他标签页
      if (this.channel) {
        this.channel.postMessage({ type: "NOTIFICATION_SHOWN", messageId });
      }
    } catch (err) {
      console.error("[NotificationManager] 写入 localStorage 失败:", err);
    }
  }

  /**
   * 检查消息是否已显示（未过期）
   * @param {string} messageId
   * @returns {boolean}
   */
  hasShown(messageId) {
    const key = this.storageKeyPrefix + messageId;
    const val = localStorage.getItem(key);
    if (!val) return false;

    const timestamp = Number(val);
    return !isNaN(timestamp) && Date.now() - timestamp < this.maxAge;
  }

  /**
   * 主动清理所有过期记录（可用于调试或手动触发）
   */
  cleanupExpired() {
    this._cleanupExpired();
  }

  /**
   * 内部清理逻辑
   * @private
   */
  _cleanupExpired() {
    const now = Date.now();
    let cleaned = 0;
    let total = 0;

    // 遍历所有 localStorage 项
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storageKeyPrefix)) {
        total++;
        const val = localStorage.getItem(key);
        if (val) {
          const timestamp = Number(val);
          if (isNaN(timestamp) || now - timestamp >= this.maxAge) {
            localStorage.removeItem(key);
            cleaned++;
          }
        }
      }
    }

    if (cleaned > 0) {
      console.log(
        `[NotificationManager] 清理 ${cleaned}/${total} 条过期通知记录`
      );
    }
  }

  /**
   * 显示系统通知（需已授权）
   * @param {string} title - 通知标题
   * @param {Object} options
   * @param {string} [options.body] - 正文
   * @param {string} [options.icon] - 图标 URL
   * @param {string} [options.url] - 点击跳转 URL（为空/不传则不跳转）
   * @param {Function} [options.onclick] - 自定义点击回调（会覆盖 url 行为）
   * @returns {Promise<boolean>} 是否成功显示
   */
  async showNotification(title, options = {}) {
    // 浏览器支持检查
    if (!("Notification" in window)) {
      console.warn("[NotificationManager] 浏览器不支持 Notification API");
      return false;
    }

    // 权限检查
    if (Notification.permission === "denied") {
      console.warn("[NotificationManager] 用户已拒绝通知权限");
      return false;
    }

    // 请求权限（注意：非用户手势触发可能失败）
    if (Notification.permission !== "granted") {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          return false;
        }
      } catch (err) {
        console.error("[NotificationManager] 请求通知权限失败:", err);
        return false;
      }
    }

    // 创建通知
    try {
      const notification = new Notification(title, {
        body: options.body || "",
        icon: options.icon || "",
        // 其他选项透传（如 badge, tag 等）
        ...options,
      });

      // 绑定点击行为
      notification.onclick = () => {
        window.focus(); // 聚焦当前窗口

        // 优先使用自定义 onclick
        if (typeof options.onclick === "function") {
          options.onclick.call(notification);
        } else if (options.url && typeof options.url === "string") {
          // 仅当明确传了有效 URL 时跳转
          if (options.url.startsWith("http") || options.url.startsWith("/")) {
            window.open(options.url, "_blank");
          }
        }

        // 通知自动关闭
      };

      return true;
    } catch (err) {
      console.error("[NotificationManager] 显示通知失败:", err);
      return false;
    }
  }

  /**
   * 推送唯一通知（核心方法）
   * @param {string} messageId - 唯一 ID（建议：业务类型 + 时间戳/UUID）
   * @param {string} title - 标题
   * @param {Object} options - 同 showNotification
   * @returns {Promise<boolean>} 是否实际推送了
   */
  async pushOnce(messageId, title, options = {}) {
    if (!messageId) {
      console.error("[NotificationManager] messageId 不能为空");
      return false;
    }

    // 防重：已显示过且未过期？
    if (this.hasShown(messageId)) {
      console.log(`[NotificationManager] 消息 ${messageId} 已推送过，跳过`);
      return false;
    }

    // 尝试显示
    const success = await this.showNotification(title, options);
    if (success) {
      this.markAsShown(messageId);
      return true;
    }

    return false;
  }
}

// 📦 可选：导出默认实例（按需使用）
// export default new NotificationManager();
