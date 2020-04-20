<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @itemClick="handleItemClick" ref="listView"></list-view>
    <transition name="slide">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer.js'
import { Singer } from '@assets/js/singer'
import { mapMutations } from 'vuex'
import { ERR_OK } from '@/api/config.js'
import { playlistMixin } from '@assets/js/mixin.js'

import ListView from '@/base/listview/listview.vue'
// import SingerDetail from '../singer-detail/singer-detail'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listView.refresh()
    },
    handleItemClick(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          let singerList = res.data.list
          this.singerList = this._normalizeSinger(singerList)
        }
        // console.log(res)
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer(item.Fsinger_mid, item.Fsinger_name)
          )
        }

        const key = item.Findex

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer(item.Fsinger_mid, item.Fsinger_name)
        )
      })

      let hot = []
      let ret = []

      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style coped lang="stylus">
.singer
    position fixed
    top 88px
    bottom 0
    width 100%
.slide-enter-active, .slide-leave-active
    transition: all .5s

.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
