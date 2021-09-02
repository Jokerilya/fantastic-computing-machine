<template>
  <p class="first_title">
    <span class="title" :style="resStyle">{{ title }}</span>
  </p>
</template>

<script>
export default {
  name: 'FirstTitle',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    resStyle() {
      if (this.size == 'big') {
        return {
          fontSize: '24px',
          borderLeftWidth: '6px'
        }
      }
      if (this.size == 'normal') {
        return {
          fontSize: '20px',
          borderLeftWidth: '4px'
        }
      }
      if (this.size == 'small') {
        return {
          fontSize: '14px',
          borderLeftWidth: '2px'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.first_title{
   padding: 10px 0;
   margin: 0 auto;
   line-height: 1.4em;
   .title{
     font-weight: bold;
     color: #333;
     border-left-color:#409EFF;
     border-left-style: solid;
     padding-left: 10px;
   }
}
</style>
