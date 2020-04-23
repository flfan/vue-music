<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input :placeholder="placeholder" v-model="query" class="box">
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入歌手或歌曲名'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    clear() {
      this.query = ''
    },
    setQuery(query) {
      this.query = query
    }
  },
  created() {
    this.$watch('query', (newQuery) => {
      let regExp = /^\s+$/
      let re = regExp.test(newQuery)
      // console.log(re)
      if (re) {
        return
      }
      this.$emit('queryChange', newQuery)
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
