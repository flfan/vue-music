<template>
   <div class="player" v-show="playList.length>0" ref="player">
    <transition name="normal"
                @enter="handleAnimationEnter"
                @after-enter="handleAnimationAfterEnter"
                @leave="handleAnimationLeave"
                @after-leave="handleAnimationAfterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
            <img height="100%" :src="currentSong.image">
        </div>
        <!-- 上 -->
        <div class="top">
          <div class="back" @click="handleBackClick">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中 -->
        <!-- 能够左右滑动的页面布局：首先middle采用fixed，宽100%，然后左page先设置inline-block，相对定位，宽也是100%，右page一样，这样右page就在屏幕的右侧了 -->
        <!-- 滑动的三个事件 -->
        <div class="middle"
             @touchstart.prevent="middleTouchstart"
             @touchmove.prevent="middleTouchmove"
             @touchend="middleTouchend">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="[cdRotate]">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>
          <bscroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p class="text"
                     :class="{'current': currentLine === index}"
                     ref="lyricLine"
                     v-for="(line, index) in currentLyric.lines"
                     :key="line.time"
                  >{{line.txt}}</p>
                </div>
              </div>
            </bscroll>
        </div>
        <!-- 下 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="progressPercent" @changeAudioTime="handleAudioTimeChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="modeIconClick" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prevIconClick" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="normalPlayingIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="nextIconClick" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 收起的player -->
    <transition name="mini">
      <div class="mini-player" @click="handleMiniPlayer" v-show="!fullScreen">
        <div class="icon">
          <div class="imgWrapper">
          <img width="40" height="40" :src="currentSong.image" :class="cdRotate">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="progressPercent">
            <i class="icon-mini" :class="miniPlayingIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- <audio :src="currentSong.url" ref="audio" autoplay="autoplay"></audio> -->
    <audio :src="currentSong.url" ref="audio"
           @canplay="playReady"
           @error="playError"
           @timeupdate="audioTimeUpdate"
           @ended="audioEnd"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { prefixStyle } from '@assets/js/dom.js'
import { Config } from '@assets/js/config.js'
import { shuffle } from '@assets/js/util.js'
import animations from 'create-keyframe-animation'
import LyricParser from 'lyric-parser'

import ProgressBar from '@/base/progress-bar/progress-bar.vue'
import ProgressCircle from '@/base/progress-circle/progress-circle.vue'
import Bscroll from '@/base/scroll/scroll.vue'

const TRANSFORM = prefixStyle('transform')

export default {
  data() {
    return {
      canPlaySong: false, // audio是否已经可以播放
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLine: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Bscroll
  },
  computed: {
    normalPlayingIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayingIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    modeIcon() {
      return this.mode === Config.playMode.sequence ? 'icon-sequence' : this.mode === Config.playMode.loop ? 'icon-loop' : 'icon-random'
    },
    cdRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.canPlaySong ? '' : 'disable'
    },
    // porgress-bar 的进度
    progressPercent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters({
      playList: 'playList',
      fullScreen: 'fullScreen',
      currentSong: 'currentSong',
      playing: 'playing',
      currentIndex: 'currentIndex',
      mode: 'mode',
      sequenceList: 'sequenceList'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) return

      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      // this.$nextTick(() => { // vue DOM更新与数据更新后调用
      //   this.$refs.audio.play()
      //   this.parserLyric()
      // })
      setTimeout(() => { // 解决微信前台切后台问题
        this.$refs.audio.play()
        this.parserLyric()
      }, 1000)
    },
    playing(newPlaying) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    // middle touch
    middleTouchstart(e) {
      this.touch.initiated = true
      let touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchmove(e) {
      if (!this.touch.initiated) {
        return
      }
      this.$refs.lyricList.$el.style.transitionDuration = ''
      this.$refs.middleL.style.transitionDuration = ''
      let touch = e.touches[0]
      const detailX = touch.pageX - this.touch.startX
      const detailY = touch.pageY - this.touch.startY
      if (Math.abs(detailY) > Math.abs(detailX)) {
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max((detailX + left), -window.innerWidth))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    middleTouchend() {
      let offsetWidth
      let opacity = 0
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          this.touch.percent = 1
        } else {
          opacity = 1
          offsetWidth = 0
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.currentShow = 'cd'
          this.touch.percent = 0
        } else {
          offsetWidth = -window.innerWidth
        }
      }
      this.touch.initiated = false
      const time = 500
      this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
      this.$refs.middleL.style.transitionDuration = `${time}ms`
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style.opacity = opacity
    },
    // lyric 控制
    parserLyric() {
      this.currentSong.songGetLyric().then(res => {
        this.currentLyric = new LyricParser(res, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        // console.log(this.currentLyric)
      }).catch(() => {
        this.currentLyric = null
        this.currentLine = 0
        this.playingLyric = ''
      })
    },
    handleLyric({ lineNum, txt }) {
      this.currentLine = lineNum
      this.playingLyric = txt
      if (lineNum > 5) {
        let numEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(numEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 0)
      }
    },
    // icon click
    handleBackClick() {
      this.setFullScreen(false)
    },
    handleMiniPlayer() {
      this.setFullScreen(true)
    },
    modeIconClick() {
      let mode = this.mode
      mode++
      if (mode === 3) {
        mode = 0
      }
      this.setPlayMode(mode)
      let list = null
      if (mode === Config.playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // player 控制
    togglePlaying() {
      // if (!this.canPlaySong) { // 影响pre 与 next button 触发的 togglePlaying() 调用
      //   return
      // }
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
      console.log('playingdsf;laskfj;jk')
      this.setPlayingState(!this.playing)
    },
    prevIconClick() {
      if (!this.canPlaySong) {
        return
      }
      this.canPlaySong = false
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      index = index - 1
      if (index === -1) {
        index = this.playList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    nextIconClick() {
      if (!this.canPlaySong) {
        return
      }
      this.canPlaySong = false
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      index = index + 1
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // audio playReady
    playReady() {
      this.canPlaySong = true
    },
    // audio playError
    playError() {
      this.canPlaySong = true
    },
    audioEnd() {
      if (this.mode === Config.playMode.loop) {
        this.loop()
      } else {
        this.nextIconClick()
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
      // setTimeout(() => {
      //   this.$refs.audio.play()
      // }, 200)
    },
    // audio TimeUpdate
    audioTimeUpdate(e) {
      // console.log(e.target.currentTime)
      this.currentTime = e.target.currentTime
    },
    handleAudioTimeChange(timePercent) {
      let currentTime = timePercent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    formatTime(interval) {
      let minute = interval / 60 | 0 // | 0 相当与Math.floor()
      let second = this._pad(interval % 60 | 0)
      let time = `${minute}:${second}`
      // console.log(time)
      return time
    },
    // vue transition 动画回调函数
    handleAnimationEnter(el, done) {
      // console.log('AnimationEnter')
      const { scale, x, y } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0,0,0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0,0,0) scale(1)'
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation: animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    handleAnimationAfterEnter() {
      // console.log('AnimationAfterEnter')
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    handleAnimationLeave(el, done) {
      // console.log('AnimationLeave')
      this.$refs.cdWrapper.style.transition = 'all .4s'
      const { scale, x, y } = this._getPosAndScale()
      this.$refs.cdWrapper.style[TRANSFORM] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    handleAnimationAfterLeave() {
      // console.log('AnimationAfterLeave')
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[TRANSFORM] = ''
    },
    // 获取要做动画的el的位置与缩放比例
    _getPosAndScale() {
      const targetElWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetElWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return { scale, x, y }
    },
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }

}
</script>

<style scoped lang="stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
          transition: all .4s
        .top, .bottom
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        // opacity: 0
        transform: translate3d(0, 100px, 0)
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused  // 动画暂停
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-playlist
          color: $color-theme
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
