<template>
  <div class="music-list">
    <div class="back" @click="handleBack">
      <i class="icon-back"></i>
    </div>
    <!-- <h1 class="title">{{title}}</h1> -->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <bscroll
      :data="songs"
      :probeType="probeType"
      :listenScroll="listenScroll"
      class="list"
      ref="bscroll"
      @scroll="handleScroll"
    >
      <div class="song-list-wrapper">
        <song-list @songClick="handleSongClick" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="songs.length == 0">
        <loading></loading>
      </div>
    </bscroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscroll from '@/base/scroll/scroll'
import songList from '@/base/song-list/song-list'
import Loading from '@/base/loading/loading.vue'

import { prefixStyle } from '@assets/js/dom.js'
import { mapActions } from 'vuex'

const TITLE_HRIGHT = 40
const transform = prefixStyle('transform')
const backdropFilter = prefixStyle('backdropFilter')

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollY: 0

    }
  },
  components: {
    Bscroll,
    songList,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    handleScroll(pos) {
      this.scrollY = pos.y
    },
    handleBack() {
      this.$router.back()
    },
    handleSongClick(song, index) {
      // console.log(song, index)
      this.selectPlayer({
        list: this.songs,
        index: index
      })
    },
    _setBscrollTop() {
      let bscroll = this.$refs.bscroll
      let top = this.$refs.bgImage.clientHeight
      this.bgImageHeight = top

      bscroll.$el.style.top = top + 'px'
      // console.log(top, bscroll)
    },
    ...mapActions({
      selectPlayer: 'selectPlayer'
    })
  },
  watch: {
    scrollY(newY) {
      // console.log(newY)
      let maxOffsetY = this.bgImageHeight - TITLE_HRIGHT
      let offsetY = -newY > maxOffsetY ? -maxOffsetY : newY
      this.$refs.layer.style[transform] = `translate3d(0,${offsetY}px,0)`

      let zIndex = 0
      let bgImage = this.$refs.bgImage
      let filter = this.$refs.filter
      let scale = 1
      let blur = 0
      let percent = Math.abs(newY / this.bgImageHeight)

      if (newY >= 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 10)
      }
      bgImage.style[transform] = `scale(${scale})`
      bgImage.style.zIndex = zIndex
      // bgImage.style[backdropFilter] = `blur(${blur}px)`
      filter.style[backdropFilter] = `blur(${blur}px)`

      if (-newY > maxOffsetY) {
        zIndex = 10
        bgImage.style.paddingTop = TITLE_HRIGHT + 'px'
        bgImage.style.zIndex = zIndex
        this.$refs.playBtn.style.display = 'none'
      } else {
        bgImage.style.paddingTop = this.bgImageHeight + 'px'
        bgImage.style.zIndex = zIndex
        this.$refs.playBtn.style.display = ''
      }
    }
  },
  created() {
    // this.probeType = 3
    // this.listenScroll = true
  },
  mounted() {
    this._setBscrollTop()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      // z-index 10
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // overflow hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
