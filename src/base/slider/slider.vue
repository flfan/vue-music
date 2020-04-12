<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
      <div class="dots">
        <span :class="['dot',{active: currentPageIndex === index}]" v-for="(item, index) in dots" :key="index"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BetterScroll from 'better-scroll'
import { addClass } from '@assets/js/dom'
export default {
  data () {
    return {
      dots: [],
      slider: {},
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children

      // eslint-disable-next-line no-unused-vars
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]

        addClass(child, 'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        width += sliderWidth * 2
        // width *= 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSliser () {
      this.slider = new BetterScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: true,
          threshold: 0.3,
          speed: 400
        }
        // snap: true, snap已经弃用
        // snapLoop: this.loop,
        // snapThreshold: 0.3,
        // snapSpeed: 400,

        // click: true 会被fastclick阻止触发

      })
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        // console.log(pageIndex)
        // betterScroll 已经修改了这个bug
        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _play () {
      // let pageIndex = this.currentPageIndex + 1

      // if (this.currentPageIndex === this.dots.length - 1) {
      //   pageIndex = 0
      // }
      this.timer = setTimeout(() => {
        // this.slider.goToPage(pageIndex, 0, 400)
        this.slider.next()
      }, this.interval)
    }
  },
  mounted () {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSliser()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed () {
    clearTimeout(this.timer) // 组件注销时要销毁循环或定时器
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~@styles/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
