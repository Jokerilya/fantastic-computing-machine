import axios from "axios";
import { MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import CryptoJS from "crypto-js";

// AES 加密密钥
const AES_KEY_STR = "d86d7bab3d6ac01ad9dc6a897652f2d2";
const AES_KEY = CryptoJS.enc.Hex.parse(AES_KEY_STR);

// 不需要加密/解密的接口白名单
const NO_ENCRYPT_URLS = [
  "/admin/base/uploadImg",
  "/admin/financial/handlePaymentListImport",
  "/admin/maintenance/uploadBatchRepairOrder",
  "/admin/maintenance/handleMasterInfoExport",
  "/admin/maintenance/handleEnterpriseInfoExport",
  "/admin/maintenance/handleRepairEnterpriseOrderExport",
  "/admin/maintenance/handleButlerOrderExport",
  "/admin/maintenance/handleRepairOrderExport",
  "/admin/maintenance/uploadDeviceKeepOrder",
  "/admin/financial/handlePaymentListExport",
  "/admin/maintenance/handleRepairOrderExportV2",
  "/admin/maintenance/handleRepairOrderExportByFaults",
  "/admin/maintenance/editMasterAssessmentItem",
  "/admin/maintenance/handleOnlineRepairEnterpriseOrderExport",
  "/admin/maintenance/importButlerOrder",
  "/admin/maintenance/handleDeviceInfoExport",
];

// 不需要全局 Loading 的接口
const NO_LOADING_URLS = ["/admin/maintenance/queryRepairMessgae"];

/**
 * AES 加密处理
 * @param {string} word 待加密字符串
 */
function encryptData(word) {
  if (!word) return word;
  try {
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, AES_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  } catch (e) {
    console.error("AES加密失败:", e);
    return word; // 降级处理：返回原数据
  }
}

/**
 * AES 解密处理
 * @param {string} word 待解密字符串
 */
function decryptData(word) {
  if (!word) return word;
  try {
    const decrypt = CryptoJS.AES.decrypt(word, AES_KEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  } catch (e) {
    console.error("AES解密失败:", e);
    return word; // 降级处理：返回原数据，防止 JSON.parse 崩坏
  }
}

let loadingCount = 0;
let loadingInstance = null;
const showLoading = () => {
  if (loadingCount === 0) {
    loadingInstance = Loading.service({
      lock: true,
      text: "加载中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
  }
  loadingCount++;
};
const hideLoading = () => {
  if (loadingCount <= 0) return;
  loadingCount--;
  if (loadingCount === 0 && loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
};

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000, // 优化：设置合理的超时时间 (30s)
});

service.interceptors.request.use(
  (config) => {
    // 注入 Token
    if (store.getters.token) {
      config.headers["admin-token"] = getToken();
    }

    // 仅针对 POST 请求处理 Loading 和 加密
    if (config.method.toUpperCase() === "POST") {
      // A. 处理 Loading
      // 如果 url 不在忽略列表中，则显示 Loading
      const isNoLoading = NO_LOADING_URLS.some((url) =>
        config.url.includes(url),
      );
      if (!isNoLoading) {
        showLoading();
      }

      // B. 处理加密
      // 条件：生产环境 + 不在白名单 + 有数据
      const isProd = process.env.NODE_ENV !== "development";
      const isForbidden = NO_ENCRYPT_URLS.some((url) =>
        config.url.includes(url),
      );

      if (isProd && !isForbidden && config.data) {
        // 将 data 转为 JSON 字符串后加密
        // config.data = encryptData(JSON.stringify(config.data));
        config.headers["Content-Type"] = "application/json";
        // config.dataType = "text"; // 通常不需要显式设置这个，axios 会自动处理
      }
    }

    // 对所有图片后面有 签名标识剔除
    // if (config.data) {
    //   const dataObj = JSON.parse(config.data);
    //   // 定义需要处理的后缀
    //   const mediaExtensions = [".png", ".jpg", ".jpeg", ".gif", ".mp4", ".pdf"];
    //   for (let key in dataObj) {
    //     let value = dataObj[key];
    //     if (typeof value === "string") {
    //       // 检查是否包含指定的后缀
    //       const hasMediaExtension = mediaExtensions.some((ext) =>
    //         value.toLowerCase().includes(ext),
    //       );
    //       // 如果是媒体文件且包含问号，则截断
    //       if (hasMediaExtension && value.includes("?")) {
    //         dataObj[key] = value.split("?")[0];
    //       }
    //     }
    //   }
    // }
    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const config = response.config;

    // A. 关闭 Loading (仅针对 POST 且原本开启了 Loading 的请求)
    if (config.method.toUpperCase() === "POST") {
      const isNoLoading = NO_LOADING_URLS.some((url) =>
        config.url.includes(url),
      );
      if (!isNoLoading) {
        hideLoading();
      }
    }

    // B. 文件流直接返回
    if (config.responseType === "blob") {
      return response;
    }

    // C. 处理解密
    let res = response.data;
    const isProd = process.env.NODE_ENV !== "development";
    const isForbidden = NO_ENCRYPT_URLS.some((url) => config.url.includes(url));

    if (isProd && !isForbidden && typeof res === "string") {
      try {
        const decryptedStr = decryptData(res);
        // 尝试解析 JSON，如果解析失败则保留原字符串
        res = decryptedStr ? JSON.parse(decryptedStr) : res;
      } catch (e) {
        console.error("响应数据解析 JSON 失败", e);
      }
    }

    // D. 业务状态码处理
    // 成功
    if (res.code === "000") {
      return res;
    }

    // 登录失效/异地登录/被挤下线
    else if (["002", "004", "007"].includes(res.code)) {
      // 使用 MessageBox 阻断，防止静默刷新丢失数据
      MessageBox.confirm("登录状态已失效，请重新登录", "系统提示", {
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          store.dispatch("user/logout").then(() => {
            location.reload();
          });
        })
        .catch(() => {
          // 用户点击取消，不做操作
        });

      // 抛出错误中断 Promise 链
      return Promise.reject(new Error(res.message || "Token Expired"));
    }

    // 无权限
    else if (res.code === "009") {
      Message({
        message: "您暂无操作权限！",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error("No Permission"));
    }

    // 其他业务错误
    else {
      Message({
        message: res.errorMessage || res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(
        new Error(res.errorMessage || res.message || "Error"),
      );
    }
  },
  (error) => {
    // 接口层面的错误 (404, 500, Network Error)
    hideLoading(); // 确保 Loading 关闭

    console.error("Response Error:", error);
    Message({
      message: error.message || "请求失败，请稍后重试",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
);

export default service;
