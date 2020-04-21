<template>
  <!-- <transition name="slide">
    <div class="singer-detail">singer-detail</div>
  </transition> -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDiscSongList } from '@/api/disc.js'
import { getSongVkey } from '@/api/song.js' // 获取音乐播放地址
import { ERR_OK } from '@/api/config.js'
import { createSong } from '@assets/js/song'

import musicList from '@components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  components: {
    musicList
  },
  created() {
    this._getDiscSongList()
  },
  computed: {
    title() {
      return this.disc.creator.name
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters({
      disc: 'disc'
    })
  },
  methods: {
    _getDiscSongList() {
      if (!this.disc.dissid) {
        this.$router.push({ path: '/recommend' })
        return
      }
      getDiscSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          let songs = this._normalizeSongs(res.cdlist[0].songlist)
          // console.log(res.cdlist[0].songlist)
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
