<template>
  <div class="web_logo">
    <div class="logo">
      <img
        :style="{width:logo.width,height:logo.height}"
        :src="$webData.webLogo"
        alt=""
      >
    </div>
    <p
      v-if="title.text"
      :style="{fontSize:title.size,color:title.color}"
      class="title"
    >{{ title.text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Object,
      default: () => {
        return {
          text: '',
          size: '14px',
          color: '#333'
        }
      }
    },
    logo: {
      type: Object,
      default: () => {
        return {
          width: '150px',
          height: '150px'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.web_logo{
  text-align: center;
  .logo{
    display: inline-block;
    line-height: 0;
  }
  .title{
    margin: 20px auto;
  }
}
</style>
