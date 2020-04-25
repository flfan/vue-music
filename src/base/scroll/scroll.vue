<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: { // 手动派发点击事件
      type: Boolean,
      default: true
    },
    data: { // 传进来的数据
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)

    // window.addEventListener('resize', () => {
    //   this.scroll.refresh()
    // })
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BetterScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', (pos) => {
          this.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            // console.log(this.scroll.y, this.scroll.maxScrollY)
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    /**
     * 代理betterScroll方法
     */
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // scrollToElement() {
    //   this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    // }
    scrollToElement(...args) {
      // console.log(arguments)
      this.scroll && this.scroll.scrollToElement(...args)
    }
  },
  watch: {
    data () {
      this.refresh()
    }
  }

}
</script>

<style>

</style>
