<template>
  <div class="content_box1">
    <div class="bg-mask"></div>

    <div class="text-container">
      <h1 class="text">欢迎使用机将后台管理系统</h1>
      <p class="en-text">JIJIANG MANAGEMENT SYSTEM</p>
      <div class="sub-line"></div>
    </div>
  </div>
</template>

<style lang="scss">
// 引入 Google Fonts 使得英文更好看（可选，如果内网环境可去掉，直接用 sans-serif）
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap");

.content_box1 {
  display: flex;
  justify-content: center;
  align-items: center; // 垂直居中
  padding-bottom: 100px;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: url("https://snk2025-1305456087.cos.ap-guangzhou.myqcloud.com/user/20260107/MM73951865.jpg")
    no-repeat center center;
  background-size: 100vw 100vh;
  animation: bgFocus 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.bg-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // 稍微加深一点遮罩，让白色文字对比度更强，显得更“实”
  background: radial-gradient(
    circle,
    rgba(0, 20, 40, 0.2) 0%,
    rgba(0, 20, 40, 0.5) 100%
  );
  z-index: 1;
}

.text-container {
  z-index: 2;
  text-align: center;
  color: #fff;
  // 【关键修改】整体向上偏移
  // 使用 padding-bottom 把内容顶上去，或者直接 transform
  transform: translateY(-80px);
}

// 中文主标题
.text {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 56px; // 稍微调小一点点，给英文留空间
  font-weight: 400;
  letter-spacing: 8px; // 字间距加大，显得大气
  margin: 0;
  padding-bottom: 10px; // 稍微拉开和英文的距离
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  opacity: 0;
  animation: textSlideUp 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: 0.3s;
}

// 【新增】英文副标题
.en-text {
  font-family: "Montserrat", Helvetica, Arial, sans-serif; // 用无衬线字体
  font-size: 18px;
  font-weight: 300;
  text-transform: uppercase; // 强制大写
  letter-spacing: 12px; // 极宽的字间距，这是高级感的关键
  color: rgba(255, 255, 255, 0.85); // 稍微透明一点，形成层级
  margin: 0;
  margin-bottom: 25px; // 装饰线和文字的距离

  opacity: 0;
  transform: translateY(20px);
  // 英文比中文晚出来 0.3s
  animation: fadeInUp 1s ease-out forwards;
  animation-delay: 0.6s;
}

// 装饰线
.sub-line {
  width: 40px; // 初始短一点
  height: 3px;
  background: #fff; // 纯白线条
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);

  opacity: 0;
  animation: lineExpand 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  animation-delay: 1s; // 最后出来
}

// --- Keyframes 动画库 ---

@keyframes bgFocus {
  0% {
    filter: blur(10px);
    transform: scale(1.08);
  }
  100% {
    filter: blur(0px);
    transform: scale(1);
  }
}

@keyframes textSlideUp {
  0% {
    opacity: 0;
    letter-spacing: 25px;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    letter-spacing: 8px;
    transform: translateY(0);
  }
}

// 英文专用的淡入动画
@keyframes fadeInUp {
  0% {
    opacity: 0;
    letter-spacing: 2px;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    letter-spacing: 12px;
    transform: translateY(0);
  }
}

@keyframes lineExpand {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 80px;
    opacity: 0.8;
  } // 线条不宜过长，精致为主
}
</style>