<template>
  <better-scroll class="listview" :data="data" ref="scrollListview">
    <ul>
      <li class="list-group" v-for="group in data" :key="group.title" ref="groupList">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items" :key="item.id">
            <img class="avatar" v-lazy="item.singerPic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 索引字母表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item, index) in shortcutlist" :key="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </better-scroll>
</template>

<script>
import BetterScroll from '@/base/scroll/scroll.vue'
import { getData } from '@assets/js/dom'

const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    BetterScroll
  },
  computed: {
    shortcutlist() {
      // 热、A、B...列表
      return this.data.map((item) => {
        return item.title.substr(0, 1)
      })
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      this.anchorIndex = anchorIndex
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this._scrollTo(this.$refs.groupList[anchorIndex])
    },
    onShortcutTouchMove(e) {
      // console.log(e.target.style.fontSize = '20px')
      let firstTouch = e.touches[0]

      this.touch.y2 = firstTouch.pageY

      let detail = this.touch.y2 - this.touch.y1
      // let index = Math.floor(detail / ANCHOR_HEIGHT)
      let anchorIndex = this.anchorIndex

      let index = parseInt(anchorIndex) + Math.floor(detail / ANCHOR_HEIGHT)
      this._scrollTo(this.$refs.groupList[index])
    },
    _scrollTo(el) {
      this.$refs.scrollListview.scrollToElement(el, 1000)
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
