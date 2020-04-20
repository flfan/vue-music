import { mapGetters } from 'vuex'
// import { Config } from '@assets/js/config'
// import Util from '@assets/js/util'

// mini播放器显示时，调整列表底部高度
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
    console.log('mounted')
  },
  // keep-alive 组件激活时调用。
  activated() {
    this.handlePlaylist(this.playList)
    console.log('activated')
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
      console.log('watch')
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
