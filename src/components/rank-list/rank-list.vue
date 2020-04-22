<template>
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :showRank="showRank"></music-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMusicList } from '@/api/rank.js'
import { getSongVkey } from '@/api/song.js' // 获取音乐播放地址
import { ERR_OK } from '@/api/config.js'
import { createSong } from '@assets/js/song'

import musicList from '@components/music-list/music-list'
export default {
  data() {
    return {
      songs: [],
      showRank: true
    }
  },
  components: {
    musicList
  },
  created() {
    this._getMusicList()
  },
  computed: {
    title() {
      return this.rankList.title
    },
    bgImage() {
      return this.rankList.mbFrontPicUrl
    },
    ...mapGetters({
      rankList: 'rankList'
    })
  },
  methods: {
    _getMusicList() {
      if (!this.rankList.topId) {
        this.$router.push({ path: '/rank' })
        return
      }
      getMusicList(this.rankList.topId).then(res => {
        if (res.code === ERR_OK) {
          let songs = this._normalizeSongs(res.songlist)
          // console.log(res.songlist)
          setTimeout(() => { // 当songs全部获取完之后 再把值传给 this.songs
            this.songs = songs
            // console.log(this.songs)
          }, 2000)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        item = item.data
        let musicData = {
          songid: item.songid,
          songmid: item.songmid,
          songname: item.songname,
          albummid: item.albummid,
          singer: item.singer,
          interval: item.interval,
          albumname: item.albumname
        }
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            // console.log(res)
            let purl = res.req_0.data.midurlinfo[0].purl
            if (purl) {
              // console.log(res.req_0.data.midurlinfo[0])
              let url = 'http://isure.stream.qqmusic.qq.com/' + purl // 音乐播放地址
              ret.push(createSong(musicData, url))
            }
          })
        }
      })
      return ret
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@styles/variable'
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
</style>
