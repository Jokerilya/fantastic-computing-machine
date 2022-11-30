<!-- 暂时不用了 后续看情况 -->
<template>
  <div class="addEquipment">
    <!-- 设备基本信息内容 -->
    <div class="addEquipment_basicInfo">
      <h2 class="basicInfo_title">设备基本信息</h2>
      <el-card>
        <div class="basicInfo_content">
          <div class="itemLine">
            <div>1111111111111111111111111</div>
            <div>22222222222222222222222222</div>
            <div>33333333333333333333333333</div>
          </div>
          <div class="itemLine">
            <div>44444444444444444444444444</div>
            <div>55555555555555555555555555</div>
            <div>66666666666666666666666666</div>
          </div>
          <div class="itemLine">
            <div>77777777777777777777777777</div>
            <div>88888888888888888888888888</div>
            <div>99999999999999999999999999</div>
          </div>
          <div class="itemLine">
            <div>10101010101010101010101010</div>
            <div>11111111111111111111111111</div>
          </div>
          <div class="itemLine">
            <div>12121212121212121212121212</div>
            <div>13131313131313131313131313</div>
          </div>
          <div class="itemLine">
            <div>14141414141414141414141414</div>
            <div>按钮按钮按钮按钮按钮按钮按钮</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="addEquipment_configInfo">设备配置信息内容</div>
  </div>
</template>

<script></script>

<style lang="less" scoped>
// 设备基本信息内容
.addEquipment {
  padding: 20px;
  .addEquipment_basicInfo {
    .basicInfo_title {
      color: #0b2059;
      margin: 0 0 20px 20px;
    }
    .basicInfo_content {
      .itemLine {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

// 设备配置信息内容
</style>
