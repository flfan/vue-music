<template>
  <div class="progress-bar" ref="progressBar" @click="handleBarClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"
      ></div>
      <!-- 进度条拖动回调 -->
      <div class="progress-btn-wrapper">
        <div class="progress-btn"
             ref="progressBtn"
             @touchstart.prevent="progressTouchstart"
             @touchmove.prevent="progressTouchmove"
             @touchend="progressTouchend"
        ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

const BTNWIDTH = 16

export default {
  props: {
    percent: {
      type: Number,
      // required: true
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    progressTouchstart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchmove(e) {
      if (!this.touch.initiated) {
        return
      }
      let currentX = e.touches[0].pageX
      let moveX = currentX - this.touch.startX
      const progressWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
      // let offsetWidth = this.touch.left + moveX
      // if (offsetWidth < progressWidth && offsetWidth > 0) {
      //   this._setProgressWidth(offsetWidth)
      // }
      let offsetWidth = Math.min(Math.max(0, this.touch.left + moveX), progressWidth)
      this._setProgressWidth(offsetWidth)
    },
    progressTouchend() {
      this._triggerPercent()
      this.touch.initiated = false
    },
    handleBarClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      // console.log(rect)
      this._setProgressWidth(e.pageX - rect.left)
      this._triggerPercent()
    },
    _triggerPercent() {
      const progressWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
      let percent = this.$refs.progress.clientWidth / progressWidth
      this.$emit('changeAudioTime', percent)
    },
    _setProgressWidth(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px'
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      if (this.touch.initiated) {
        return
      }
      // const BTNWIDTH = this.$refs.progressBtn.clientWidth
      const progressWidth = this.$refs.progressBar.clientWidth - BTNWIDTH
      let offsetWidth = newPercent * progressWidth
      this._setProgressWidth(offsetWidth)
      // this.$refs.progress.style.width = offsetWidth + 'px'
      // this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
      // console.log(this.$refs.progressBtn)
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~@styles/variable"

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
