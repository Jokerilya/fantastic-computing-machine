<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
    .width50{
      width: 50%;
    }
    .manage-top{background: #fff;padding: 22px 30px 0;}
    .table-block{background: #fff;padding: 30px;}
    #app{
      background: #f2f2f2;
    }
    .el-pagination{
      height: 50px;
      background: #FFF;
      padding-top: 10px;
    }
    .toolbar{
      height: 50px;
      border: 1px solid #EBEEF5;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      .row{
        display: block;
        margin: 4px !important;
        >*+*{
          margin-left: 5px!important;
        }
      }
    }
    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
    .settings{
      margin: auto 0;
      >.el-button{
        width: 30% !important;
        margin-bottom: 3px !important;
        margin-left: 4px !important;
      }
      *>.el-upload>.el-button{
        width: 100%;
      }
      .el-dialog{
        .el-button{
          width: auto;
        }
      }
    }
    .state_info{
      color: #909399;
    }
    .state_primary{
      color: #409eff;
    }
    .state_success{
      color: #67c23a;
    }
    .state_warning{
      color:#e6a23c
    }
    .state_error{
      color: #f56c6c;
    }
    .el-pagination__total {
      color: rgb(64, 158, 255) !important;
    }
    // 移动端样式
    .moblie{
      >*{
        margin: 5px 0.1rem !important;
      }
      .el-dialog__wrapper{
        margin: 0 !important;
        margin-top:-15vh;
      }
      .el-dialog{
        margin: 0 !important;
        // margin-top:-15vh;
      }
      >.el-input{
        width:48%;
      }
      >.el-select{
        width:48%;
        .el-option{
          width: 100%;
        }
      }
      .el-button{
        width: 23.1%;
        padding: 0.75rem 0rem;
        border-radius: 0 !important;
      }
      .el-date-editor{
        width: 98%;
      }
    }
    @media screen and (max-width: 901px) {
      .el-popper[x-placement^=bottom] {
          margin-top: 12px;
          width: 100vw;
          overflow-x: auto;
      }
    }
    .el-pagination{
      width: 100%;
      overflow: auto;
    }
    .el-message-box {
      width: 19.5rem;
    }
    .el-message {
      min-width: 20rem;
      width: auto;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar {
        width: 10px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgb(64, 158, 255);
        background-color:transparent;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgb(64, 158, 255);
        background-color:transparent;
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    }
</style>
