<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <web-logo :title="{ text: '', color: '#333', size: '24px' }" />
      </div>

      <div class="login-tab-header">
        <div
          class="main-title"
          @click="handleSecretAction"
          @touchend="handleSecretAction"
          style="user-select: none; cursor: pointer"
        >
          {{ loginType === "phone" ? "手机登录" : "账密登录" }}
        </div>

        <!-- <div class="sub-switch" style="color: #999" @click="switchLoginType">
          {{ loginType === "phone" ? "账密登录" : "手机验证码登录" }}
          <i class="el-icon-arrow-right"></i>
        </div> -->
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        label-position="left"
      >
        <template v-if="loginType === 'phone'">
          <el-form-item prop="mobile">
            <div class="input-group">
              <div class="prefix-area">+86</div>
              <el-input
                v-model="loginForm.mobile"
                placeholder="请输入手机号"
                type="tel"
                maxlength="11"
              />
            </div>
          </el-form-item>

          <el-form-item prop="code">
            <div class="input-group code-group">
              <el-input
                v-model="loginForm.code"
                placeholder="请输入验证码"
                maxlength="6"
                @keyup.enter.native="handleLogin"
              />
              <el-button
                type="text"
                :disabled="isCounting"
                class="code-btn"
                @click="sendCode"
              >
                {{ isCounting ? `${countDown}s后重试` : "获取验证码" }}
              </el-button>
            </div>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginForm.username"
              placeholder="请输入登录用户名/邮箱"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入登录密码"
              @keyup.enter.native="handleLogin"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-view cursor-pointer"
                @click="showPwd"
              ></i>
            </el-input>
          </el-form-item>
        </template>

        <!-- <div class="agreement-text">
          登录视为您已同意
          <a href="#">用户协议</a>、<a href="#">隐私政策</a>
        </div> -->

        <el-button
          :loading="loading"
          type="primary"
          class="submit-btn"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>

      <!-- <div class="footer-info">
        <a target="_blank" href="https://beian.miit.gov.cn">{{ webICP }}</a>
        <span v-if="version">&nbsp;v{{ version }}</span>
      </div> -->

      <!-- <div class="other-login-methods">
        <div class="divider">
          <span>其他方式</span>
        </div>
        <div class="icons">
          <div class="icon-circle icon-wechat">
            <i class="el-icon-chat-dot-round"></i>
          </div>
          <div class="icon-circle icon-alipay">
            <i class="el-icon-shopping-cart-2"></i>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { getVisitorId } from "@/utils/fingerprint";
import webLogo from "@/components/webLogo/web-logo.vue";
import { webName, webICP, version } from "@/webConfig.js";

export default {
  name: "Login",
  components: {
    webLogo,
  },
  data() {
    // 校验规则
    const validateUsername = (rule, value, callback) => {
      if (!value) callback(new Error("请输入用户名"));
      else callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) callback(new Error("请输入密码"));
      else callback();
    };
    const validateMobile = (rule, value, callback) => {
      if (!/^1[3-9]\d{9}$/.test(value))
        callback(new Error("请输入正确的手机号"));
      else callback();
    };
    const validateCode = (rule, value, callback) => {
      if (!value || value.length < 4) callback(new Error("请输入验证码"));
      else callback();
    };

    return {
      webICP: webICP || "ICP备xxxx号",
      version: version ? (version + "").split("").join(".") : "1.0",

      // 状态控制
      loginType: "account", // 'phone' | 'account'
      loading: false,
      passwordType: "password",
      redirect: undefined,

      // 验证码倒计时
      countDown: 60,
      isCounting: false,
      timer: null,

      // 表单数据
      loginForm: {
        username: "",
        password: "",
        mobile: "",
        code: "",
      },

      // 动态规则：根据 loginType 切换
      rules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
        mobile: [
          { required: true, trigger: "blur", validator: validateMobile },
        ],
        code: [{ required: true, trigger: "blur", validator: validateCode }],
      },

      // 暗门功能状态
      secretClickCount: 0,
      secretTimer: null,
    };
  },
  computed: {
    // 动态返回当前生效的规则，避免校验隐藏的字段
    loginRules() {
      if (this.loginType === "phone") {
        return {
          mobile: this.rules.mobile,
          code: this.rules.code,
        };
      } else {
        return {
          username: this.rules.username,
          password: this.rules.password,
        };
      }
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    // 1. 点击计数逻辑
    handleSecretAction() {
      // 只有在当前显示为"账号密码登录"时才生效（如果不限制，去掉这个if即可）
      if (this.loginType !== "account") return;

      this.secretClickCount++;

      // 如果有定时器，先清除，重新计时（确保是连续点击）
      if (this.secretTimer) clearTimeout(this.secretTimer);

      // 1秒内如果没有继续点击，重置计数
      this.secretTimer = setTimeout(() => {
        this.secretClickCount = 0;
      }, 1000);

      // 达到5次触发
      if (this.secretClickCount >= 5) {
        this.fetchAndCopyIp();
        this.secretClickCount = 0; // 重置
        clearTimeout(this.secretTimer);
      }
    },

    // 2. 获取IP并复制
    async fetchAndCopyIp() {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://sapi.k780.com/?app=ip.local&appkey=78281&sign=4197a54055c05319a24e35e0a3c23b8d&format=json",
        true
      );
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            let ip = data.result.ip;
            this.copyToClipboard(ip);
            this.$message({
              message: `IP: ${ip} 已复制成功！`,
              type: "success",
              duration: 3000,
            });
          } else {
            console.error("请求出错:", xhr.statusText);
          }
        }
      };
      xhr.onerror = function (e) {
        console.error("网络错误", e);
      };
      xhr.send();
    },

    // 3. 剪贴板辅助方法
    async copyToClipboard(text) {
      // 优先使用现代 API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      } else {
        // 兼容旧版浏览器方案
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // 防止在移动端拉起键盘
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("复制失败", err);
        }
        document.body.removeChild(textArea);
      }
    },

    // 切换登录方式
    switchLoginType() {
      this.loginType = this.loginType === "phone" ? "account" : "phone";
      // 切换时清除之前的验证状态
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      });
    },

    // 密码显示切换
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    // 发送验证码模拟
    sendCode() {
      // 先校验手机号
      this.$refs.loginForm.validateField("mobile", (errorMessage) => {
        if (!errorMessage) {
          // 模拟发送请求
          this.$message.success("验证码已发送 (模拟: 123456)");
          this.isCounting = true;
          this.countDown = 60;
          this.timer = setInterval(() => {
            if (this.countDown > 0) {
              this.countDown--;
            } else {
              this.isCounting = false;
              clearInterval(this.timer);
            }
          }, 1000);
        }
      });
    },

    // 登录处理
    async handleLogin() {
      const valid = await this.$refs.loginForm.validate().catch(() => false);
      if (!valid) return;

      this.loading = true;
      try {
        const deviceId = await getVisitorId();
        console.log(349, deviceId);
        this.copyToClipboard(deviceId);

        let loginData = {};
        if (this.loginType === "account") {
          // 账号密码登录
          loginData = {
            userAccount: this.loginForm.username,
            passWord: md5(this.loginForm.password),
          };
        } else {
          // 手机验证码登录
          loginData = {
            mobile: this.loginForm.mobile,
            code: this.loginForm.code,
            deviceId,
            type: "mobile_login", // 区分后端接口逻辑
          };
        }

        // 调用原有 Vuex Action
        await this.$store.dispatch("user/login", loginData);

        this.$message.success("登录成功");
        this.$router.push({ path: this.redirect || "/" });
      } catch (error) {
        console.error("登录异常:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
/* 变量定义 */
$bg-color: #fff;
$primary-color: #1366ec;
$text-main: #333;
$text-light: #999;
$border-color: #eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5;

  /* === 背景图核心优化 === */
  /* 使用 ~@ 引用别名路径 */
  background-image: url("~@/assets/loginBgi.png");
  /* cover: 保持比例铺满，不会变形 */
  background-size: cover;
  /* center: 图片居中显示 */
  background-position: center center;
  /* no-repeat: 防止图片平铺 */
  background-repeat: no-repeat;
  /* fixed: 视差效果，背景固定不动（可选，看你喜好） */
  background-attachment: fixed;
  /* ==================== */

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .login-content {
    background: $bg-color;
    width: 450px;
    padding: 40px;
    border-radius: 8px;
    /* 增加阴影质感 */
    box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08),
      0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
    position: relative;
  }
}

/* 头部样式 */
.login-header {
  margin-bottom: 20px;
}

.login-tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  .main-title {
    font-size: 24px;
    font-weight: 500;
    color: $text-main;
  }

  .sub-switch {
    font-size: 14px;
    color: $primary-color;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      opacity: 0.8;
    }
  }
}

/* 表单样式重写 */
::v-deep .el-form-item {
  margin-bottom: 24px;
  border-bottom: 1px solid $border-color;

  .el-input__inner {
    border: none;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    background: transparent;
    &:focus {
      border: none;
    }
  }

  /* 修复图标重叠问题 */
  .el-input--prefix .el-input__inner {
    padding-left: 35px;
  }

  .el-form-item__content {
    line-height: normal;
  }

  .el-form-item__error {
    padding-top: 4px;
  }
}

/* 手机号输入框组合 */
.input-group {
  display: flex;
  align-items: center;

  .prefix-area {
    padding: 0 12px 0 0;
    font-size: 16px;
    color: $text-main;
    font-weight: 500;
    border-right: 1px solid #ddd;
    margin-right: 10px;
  }

  &.code-group {
    justify-content: space-between;
    .code-btn {
      color: $primary-color;
      font-size: 14px;
      padding: 0 10px;
      border: 1px solid $primary-color;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      padding-top: 0;
      padding-bottom: 0;

      &.is-disabled {
        color: #c0c4cc;
        border-color: #c0c4cc;
      }
    }
  }
}

.cursor-pointer {
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 20px;
  background-color: $primary-color;
  border: none;
  border-radius: 4px; /* PC端保持微圆角 */

  &:hover,
  &:focus {
    background-color: lighten($primary-color, 5%);
  }
}

.footer-info {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #ccc;
  a {
    color: #ccc;
    text-decoration: none;
  }
}

/* =========================================
   响应式适配区域
   ========================================= */

/* 1. 平板端适配 (iPad / 平板竖屏) 
   范围：768px < 宽度 <= 1024px 
*/
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .login-container {
    /* 平板上依然显示背景图，保持 PC 体验 */
    background-position: center;

    .login-content {
      /* 平板上卡片稍微宽一点，或者保持默认 */
      width: 500px;
      max-width: 90%; /* 防止屏幕太窄时溢出 */
      padding: 30px;
    }
  }
}

/* 2. 手机端适配 (Mobile)
   范围：宽度 <= 768px
*/
@media screen and (max-width: 768px) {
  .login-container {
    background-color: #fff;
    /* 手机端通常不显示大背景图，因为会被表单遮挡，且影响加载速度 */
    /* 如果一定要显示，可以去掉下面这行，但建议保留 */
    background-image: none;

    align-items: flex-start;

    .login-content {
      width: 100%;
      height: 100vh; /* 铺满全屏 */
      box-shadow: none;
      padding: 30px 20px;
      border-radius: 0;
    }
  }

  .login-tab-header {
    margin-top: 40px;
    margin-bottom: 50px;

    .main-title {
      font-size: 26px; /* 手机端字体微调 */
    }
  }

  .submit-btn {
    border-radius: 22px; /* 手机端按钮更圆润，符合App风格 */
  }

  .footer-info {
    position: absolute;
    bottom: 20px;
    width: calc(100% - 40px);
    left: 20px;
  }
}
</style>