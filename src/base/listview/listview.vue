<template>
  <better-scroll
    class="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    ref="scrollListview"
    @scroll="handleBscroll"
  >
    <ul>
      <li class="list-group" v-for="group in data" :key="group.title" ref="groupList">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="itemClick(item)" v-for="item in group.items" :key="item.id">
            <img class="avatar" v-lazy="item.singerPic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 索引字母表 -->
    <div
      class="list-shortcut"
      @touchstart.stop="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          :class="['item', {'current': currentIndex == index}]"
          v-for="(item, index) in shortcutlist"
          :key="item"
          :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixTitle" ref="listFixed">
      <h1 class="fixed-title">{{fixTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading/>
    </div>
  </better-scroll>
</template>

<script>
import BetterScroll from '@/base/scroll/scroll.vue'
import Loading from '@/base/loading/loading.vue'
import { getData } from '@assets/js/dom'

const ANCHOR_HEIGHT = 18

export default {
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      listenScroll: true,
      probeType: 3,
      diff: 0 // group title
    }
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    BetterScroll,
    Loading
  },
  computed: {
    shortcutlist() {
      // 热、A、B...列表
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    },
    fixTitle() {
      let title
      if (this.scrollY > 0) {
        title = ''
        return title
      }
      title = this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      return title
    }
  },
  // activated() {
  //   this._calculateGroupHeight()
  // },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateGroupHeight()
      }, 20) // DOM 加载完成后计算
    },
    scrollY(newValue) {
      const groupHeight = this.groupHeight
      let scrollY = -newValue

      if (newValue >= 0 || scrollY <= groupHeight[0]) {
        this.diff = groupHeight[0] - scrollY
        this.currentIndex = 0
        return
      }

      for (let i = 0; i < groupHeight.length; i++) {
        let height1 = groupHeight[i]
        let height2 = groupHeight[i - 1]

        if (scrollY < height1 && scrollY >= height2) {
          this.currentIndex = i
          this.diff = height1 - scrollY
          // console.log(this.diff)
          return
        }
      }
    },
    diff(newValue) {
      // let height = this.$refs.listFixed.clientHeight
      // console.log(this.height, newValue)
      // console.log(this.fixTop)
      let fixTop = (newValue > 0 && newValue < this.height) ? newValue - this.height : 0
      if (this.fixTop === fixTop) return
      this.fixTop = fixTop

      this.$refs.listFixed.style.transform = `translate3d(0,${fixTop}px,0)`
    }
  },
  created() {
    this.touch = {}
    this.groupHeight = []
  },
  mounted() {
    setTimeout(() => {
      this.height = this.$refs.listFixed.clientHeight // height 为 listFixed 的高度
    }, 20)
  },
  methods: {
    refresh() {
      this.$refs.scrollListview.refresh()
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      this.anchorIndex = anchorIndex
      // this.currentIndex = anchorIndex
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      // console.log(e.target.style.fontSize = '20px')
      let firstTouch = e.touches[0]

      this.touch.y2 = firstTouch.pageY

      let detail = this.touch.y2 - this.touch.y1
      // let index = Math.floor(detail / ANCHOR_HEIGHT)
      let anchorIndex = this.anchorIndex

      let index = parseInt(anchorIndex) + Math.floor(detail / ANCHOR_HEIGHT)
      this._scrollTo(index)
    },
    handleBscroll(pos) {
      this.scrollY = pos.y
    },
    itemClick(item) {
      this.$emit('itemClick', item)
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return
      }
      if (index > this.groupHeight.length - 1) {
        index = this.groupHeight.length - 1
      }
      this.scrollY = this.groupHeight[index]
      this.$refs.scrollListview.scrollToElement(this.$refs.groupList[index], 1000)
    },
    _calculateGroupHeight() {
      let domList = this.$refs.groupList
      let height = 0
      let heightList = []
      for (let i = 0, len = domList.length; i < len; i++) {
        height += domList[i].clientHeight
        heightList.push(height)
      }
      this.groupHeight = heightList
    }
  }

}
</script>

<style scoped lang="stylus">
@import '~@styles/variable';

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>>
