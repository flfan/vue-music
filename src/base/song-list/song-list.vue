<template>
  <div class="song-list">
    <ul>
      <li class="item" @click="songClick(song, index)" v-for="(song, index) in songs" :key="song.id">
        <div class="rank" v-show="showRank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <div class="desc" v-html="getDesc(song)"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    showRank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}。${song.album}`
    },
    songClick(song, index) {
      this.$emit('songClick', song, index)
    },
    getRankCls(index) {
      if (index > 2) {
        return 'text'
      }
      let cls = index === 0 ? 'icon icon0' : index === 1 ? 'icon icon1' : 'icon icon2'
      return cls
    },
    getRankText(index) {
      if (index <= 2) {
        return
      }
      return index + 1
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
