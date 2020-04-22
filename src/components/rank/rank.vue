<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="rankList">
      <ul>
        <li class="item" @click="rankitemClick(item)" v-for="item in rankList" :key="item.titleDetail">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.frontPicUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(item, index) in item.song" :key="item.dongId">
              <span>{{index + 1}}&nbsp;</span>
              <span>{{item.title}}&nbsp;--&nbsp;{{item.singerName}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { getRankList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
import { playlistMixin } from '@assets/js/mixin'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      rankList: []
    }
  },
  mixins: [playlistMixin],
  components: {
    Scroll,
    Loading
  },
  created() {
    this._getRankList()
  },
  methods: {
    rankitemClick(item) {
      this.setRankList(item)
      this.$router.push({
        path: `/rank/${item.topId}`
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          const listGroup = res.topList.data.group
          this.rankList = this._normalizeRankList(listGroup)
          // console.log(this.rankList)
        }
      })
    },
    _normalizeRankList(list) {
      let ranklist = []
      list.forEach(item => {
        item.toplist.forEach(el => {
          ranklist.push(el)
        })
      })
      return ranklist
    },
    ...mapMutations({
      setRankList: 'SET_RANK_LIST'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
