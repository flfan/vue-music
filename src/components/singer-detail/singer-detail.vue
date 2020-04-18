<template>
  <!-- <transition name="slide">
    <div class="singer-detail">singer-detail</div>
  </transition> -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from '@/api/singer.js'
import { getSongVkey } from '@/api/song.js' // 获取音乐播放地址
import { ERR_OK } from '@/api/config.js'
import { createSong } from '@assets/js/song'

import musicList from '@components/music-list/music-list'

export default {
  components: {
    musicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.singerPic
    },
    ...mapGetters({
      singer: 'singer'
    })
  },
  created() {
    this._getSingerDetail()
    // console.log(this.singer)
    // getSongVkey(songmid).then(res => {
    //   console.log(res)
    // })
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push({ path: '/singer' })
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          let songs = this._normalizeSongs(res.data.list)
          setTimeout(() => { // 当songs全部获取完之后 再把值传给 this.songs
            this.songs = songs
          }, 2000)
          // this.songs = this._normalizeSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
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
  // @import '~@styles/variable'
  // .singer-detail
  //   position fixed
  //   z-index 100
  //   top 0
  //   left 0
  //   right 0
  //   bottom 0
  //   background $color-background
  // .slide-enter-active, .slide-leave-active
  //   transition: all .5s

  // .slide-enter, .slide-leave-to
  //   transform: translate3d(100%, 0, 0)
</style>
