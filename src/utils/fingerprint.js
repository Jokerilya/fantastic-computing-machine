import fpPromise from "@fingerprintjs/fingerprintjs";

/**
 * 获取设备唯一指纹标识 (VisitorID)
 * @returns {Promise<string>} 返回一个唯一哈希字符串
 */
export const getVisitorId = async () => {
  try {
    // 1. 加载 FingerprintJS 代理
    const fp = await fpPromise.load();

    // 2. 获取当前的识别结果
    // 可以传入 { debug: true } 查看收集了哪些具体维度
    const result = await fp.get();

    // 3. visitorId 是根据浏览器特征（字体、插件、画布、音频等）生成的 32 位哈希值
    const visitorId = result.visitorId;

    // 建议：可以存入本地缓存，减少重复计算
    localStorage.setItem("visitor_id", visitorId);

    return visitorId;
  } catch (error) {
    console.error("FingerprintJS 获取失败:", error);
    // 兜底方案：如果加载失败，尝试从缓存取，或者返回一个随机生成的临时 ID
    return localStorage.getItem("visitor_id") || `err_${Date.now()}`;
  }
};
