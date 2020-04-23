<template>
  <bscroll ref="suggest" class="suggest" @scrollToEnd="handleScrollToEnd" :data="searchResult" :pullup="pullup">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in searchResult" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
  </bscroll>
</template>

<script type="text/ecmascript-6">
import { getSearchResult } from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { getSongVkey } from '@/api/song.js' // 获取音乐播放地址
import { createSong } from '@assets/js/song'

import Bscroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'

const TYPE_SINGER = 'singer'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchResult: [],
      page: 1,
      pullup: true,
      hasMore: true
    }
  },
  components: {
    Bscroll,
    Loading
  },
  methods: {
    handleScrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page++
      getSearchResult(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          let list = this._genResult(res.data)
          setTimeout(() => {
            this.searchResult = this.searchResult.concat(list.slice(1))
            this._checkMore(res.data)
          }, 1000)
        }
      })
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      getSearchResult(this.query, this.page, this.showSinger).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.searchResult = this._genResult(res.data)
          this._checkMore(res.data)
          // console.log(this.searchResult)
        }
      })
    },
    getIconCls(item) {
      return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.zhida_singer.singerName
      } else {
        return `${item.name} -- ${item.singer}`
      }
    },
    _checkMore(data) {
      const song = data.song
      // console.log(song)
      if (!song.list.length || (song.curnum + song.curpage * 30) > song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.type === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        // let list = this._normalizeSongs(data.song.list)
        // ret = ret.concat(list)
        data.song.list.forEach(item => {
          let musicData = {
            songid: item.id,
            songmid: item.mid,
            songname: item.name,
            albummid: item.album.mid,
            singer: item.singer,
            interval: item.interval,
            albumname: item.album.name
          }
          if (musicData.songid && musicData.albummid) {
            getSongVkey(musicData.songmid).then(res => {
              let purl = res.req_0.data.midurlinfo[0].purl
              if (purl) {
                let url = 'http://isure.stream.qqmusic.qq.com/' + purl // 音乐播放地址
                ret.push(createSong(musicData, url))
              }
            })
          }
        })
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let musicData = {
          songid: item.id,
          songmid: item.mid,
          songname: item.name,
          albummid: item.album.mid,
          singer: item.singer,
          interval: item.interval,
          albumname: item.album.name
        }
        if (musicData.songid && musicData.albummid) {
          let url = 'http://isure.stream.qqmusic.qq.com/'
          ret.push(createSong(musicData, url))
          getSongVkey(musicData.songmid).then(res => {
            let purl = res.req_0.data.midurlinfo[0].purl
            if (purl) {
              let url = 'http://isure.stream.qqmusic.qq.com/' + purl // 音乐播放地址
              ret.push(createSong(musicData, url))
              this.$forceUpdate()
            }
          })
        }
      })
      return ret
    }
  },
  watch: {
    query(newquery) {
      // if (!newquery) {
      //   return
      // }
      this.search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
