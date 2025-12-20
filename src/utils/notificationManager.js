/**
 * 通知管理器 - 优化增强版
 * 修复多标签页卡顿问题，提升高并发下的稳定性与性能
 * - 广播去环（isBroadcast 标志）
 * - 内存缓存减少 localStorage 读写
 * - 异步 + 快照清理，避免主线程阻塞
 * - 重入保护 & 错误兜底
 */

export class NotificationManager {
  /**
   * @param {Object} options
   * @param {number} [options.maxAge=604800000] - 通知记录保留时长（毫秒），默认 7 天
   * @param {string} [options.storageKeyPrefix='notif_shown_'] - localStorage key 前缀
   * @param {number} [options.cleanupProbability=0.001] - 自动清理触发概率（0~1），降低至 0.1%
   * @param {number} [options.cacheMaxSize=100] - 内存缓存最大条数
   */
  constructor(options = {}) {
    this.maxAge = options.maxAge ?? 7 * 24 * 60 * 60 * 1000; // 7 days
    this.storageKeyPrefix = options.storageKeyPrefix ?? "notif_shown_";
    this.cleanupProbability = options.cleanupProbability ?? 0.001; // ← 降低频率
    this.cacheMaxSize = options.cacheMaxSize ?? 100;

    // 🔹 内存缓存：messageId → timestamp（0 表示已存在但无效/过期）
    this._memoryCache = new Map();
    // 🔹 防重入锁（清理 & 初始化）
    this._cleaning = false;
    this._initDone = false;

    // 🔹 初始化 BroadcastChannel（降级兼容）
    this.channel = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        this.channel = new BroadcastChannel("push-notification-channel");
        this.channel.onmessage = (event) => {
          const { type, messageId } = event.data || {};
          if (type === "NOTIFICATION_SHOWN" && messageId) {
            this._markAsShownInternal(messageId, true); // ← 广播来源
          }
        };
      } catch (err) {
        console.warn("[NotificationManager] BroadcastChannel 初始化失败:", err);
      }
    }
  }

  // ────────────────────────────────────────
  // ▶ 核心 API（推荐使用）
  // ────────────────────────────────────────

  /**
   * 推送唯一通知（核心方法）
   * @param {string} messageId - 唯一 ID（建议：业务类型 + 时间戳/UUID）
   * @param {string} title - 标题
   * @param {Object} options - 同原生 Notification 构造选项
   * @returns {Promise<boolean>} true = 实际推送了；false = 已推送过 / 失败
   */
  async pushOnce(messageId, title, options = {}) {
    if (!messageId) {
      console.error("[NotificationManager] messageId 不能为空");
      return false;
    }

    if (this.hasShown(messageId)) {
      // console.debug(`[NotificationManager] 消息 ${messageId} 已推送过，跳过`);
      return false;
    }

    const success = await this.showNotification(title, options);
    if (success) {
      this._markAsShownInternal(messageId, false); // ← 本地触发
      return true;
    }
    return false;
  }

  /**
   * 显示系统通知（独立可用）
   * @param {string} title
   * @param {Object} options
   * @returns {Promise<boolean>}
   */
  async showNotification(title, options = {}) {
    if (!("Notification" in window)) {
      console.warn("[NotificationManager] 浏览器不支持 Notification API");
      return false;
    }

    if (Notification.permission === "denied") {
      console.warn("[NotificationManager] 用户已拒绝通知权限");
      return false;
    }

    if (Notification.permission !== "granted") {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return false;
      } catch (err) {
        console.error("[NotificationManager] 请求通知权限失败:", err);
        return false;
      }
    }

    try {
      const notification = new Notification(title, {
        body: options.body || "",
        icon: options.icon || "",
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        if (typeof options.onclick === "function") {
          options.onclick.call(notification);
        } else if (options.url && typeof options.url === "string") {
          const url = options.url.trim();
          if (url.startsWith("http") || url.startsWith("/")) {
            window.open(url, "_blank");
          }
        }
        notification.close?.();
      };

      return true;
    } catch (err) {
      console.error("[NotificationManager] 显示通知失败:", err);
      return false;
    }
  }

  /**
   * 检查消息是否已推送（未过期）
   * @param {string} messageId
   * @returns {boolean}
   */
  hasShown(messageId) {
    // 1️⃣ 优先查内存缓存
    if (this._memoryCache.has(messageId)) {
      const ts = this._memoryCache.get(messageId);
      return ts > 0 && Date.now() - ts < this.maxAge;
    }

    // 2️⃣ 再查 localStorage
    const key = this.storageKeyPrefix + messageId;
    let val;
    try {
      val = localStorage.getItem(key);
    } catch (e) {
      console.warn(
        "[NotificationManager] localStorage 读取失败（可能满/禁用）:",
        e
      );
      return false;
    }

    const timestamp = val ? Number(val) : NaN;
    const isFresh = !isNaN(timestamp) && Date.now() - timestamp < this.maxAge;

    // 缓存结果（即使 false 也缓存，防击穿）
    this._cache(messageId, timestamp || 0);
    return isFresh;
  }

  // ────────────────────────────────────────
  // ▶ 内部实现
  // ────────────────────────────────────────

  /**
   * 实际标记逻辑（支持广播/本地来源区分）
   * @private
   */
  _markAsShownInternal(messageId, isBroadcast) {
    const now = Date.now();
    const key = this.storageKeyPrefix + messageId;

    try {
      // ✅ 关键优化：广播来源不广播，本地来源才广播
      const shouldBroadcast = !isBroadcast && this.channel;

      // 先查缓存/存储：若已存在，直接返回（避免无谓写入）
      if (this._memoryCache.has(messageId)) {
        // 但仍可触发概率清理（轻量）
        if (Math.random() < this.cleanupProbability)
          this._cleanupExpiredAsync();
        return;
      }

      // 写 localStorage（兜底）
      localStorage.setItem(key, String(now));
      // 更新内存缓存
      this._cache(messageId, now);

      // 广播给其他标签页
      if (shouldBroadcast) {
        this.channel.postMessage({ type: "NOTIFICATION_SHOWN", messageId });
      }

      // 概率异步清理
      if (Math.random() < this.cleanupProbability) {
        this._cleanupExpiredAsync();
      }
    } catch (err) {
      console.error("[NotificationManager] 写入失败:", err);
      // 可选 fallback：用 sessionStorage 或仅内存（短期有效）
      this._cache(messageId, now);
    }
  }

  /**
   * 内存缓存辅助
   * @private
   */
  _cache(messageId, timestamp) {
    if (this._memoryCache.size >= this.cacheMaxSize) {
      // FIFO 淘汰最旧项
      const firstKey = this._memoryCache.keys().next().value;
      this._memoryCache.delete(firstKey);
    }
    this._memoryCache.set(messageId, timestamp);
  }

  /**
   * 异步清理（防阻塞）
   * @private
   */
  _cleanupExpiredAsync() {
    if (this._cleaning) return; // 防重入
    this._cleaning = true;
    setTimeout(() => {
      this._doCleanup();
      this._cleaning = false;
    }, 0);
  }

  /**
   * 实际清理逻辑（快照遍历，安全高效）
   * @private
   */
  _doCleanup() {
    const now = Date.now();
    const prefix = this.storageKeyPrefix;
    let cleaned = 0;

    try {
      // 🚀 快照：避免 length 动态变化 + 减少 get 次数
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }

      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val) {
          const ts = Number(val);
          if (isNaN(ts) || now - ts >= this.maxAge) {
            localStorage.removeItem(key);
            cleaned++;
            // 同步清理内存缓存
            const msgId = key.slice(prefix.length);
            this._memoryCache.delete(msgId);
          }
        }
      }

      if (cleaned > 0) {
        console.log(`[NotificationManager] 清理 ${cleaned} 条过期记录`);
      }
    } catch (err) {
      console.error("[NotificationManager] 清理失败:", err);
    }
  }

  // ────────────────────────────────────────
  // ▶ 工具方法（调试/手动触发）
  // ────────────────────────────────────────

  /**
   * 主动清理所有过期记录
   */
  cleanupExpired() {
    this._cleanupExpiredAsync();
  }

  /**
   * 清空本模块所有记录（调试用）
   */
  clearAll() {
    const prefix = this.storageKeyPrefix;
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    this._memoryCache.clear();
    console.log(`[NotificationManager] 已清除 ${keys.length} 条记录`);
  }

  /**
   * 获取当前缓存统计信息
   */
  getStats() {
    return {
      memoryCacheSize: this._memoryCache.size,
      storageKeyPrefix: this.storageKeyPrefix,
      maxAgeDays: this.maxAge / (24 * 60 * 60 * 1000),
    };
  }
}

// 📦 可选：导出单例（适合全局使用）
// const defaultManager = new NotificationManager();
// export default defaultManager;

// 或按需创建多个实例：
export default NotificationManager;
