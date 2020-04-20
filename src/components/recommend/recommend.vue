<template>
  <div class="recommend" ref="recommend">
    <better-scroll class="recommend-content" :data="discList" ref="BScroll">
      <div>
        <div class="slider-wrapper" v-if="sliders.length">
          <slider>
            <div v-for="item in sliders" :key="item.id">
              <a :href="item.linkUrl">
                <!-- needsclick 是 fastclick 的 css类 ，不会阻止添加了needsclick的元素的click事件 ，即不会再阻止better-scrool的click-->
                <img class="needsclick" @load="loadImg" :src="item.picUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" :key="item.dissname">
              <div class="icon">
                <!-- use vue lazyLoad -->
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-if="!discList.length">
        <loading></loading>
      </div>
    </better-scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from '@/base/slider/slider.vue'
import BetterScroll from '@/base/scroll/scroll.vue'
import Loading from '@/base/loading/loading.vue'

import { getRecommend, getDsicList } from '@/api/recommend.js'
import { ERR_OK } from '@/api/config.js'
import { playlistMixin } from '@assets/js/mixin.js'

export default {
  mixins: [playlistMixin],
  components: {
    Slider,
    BetterScroll,
    Loading
  },
  data() {
    return {
      sliders: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.BScroll.refresh()
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data)
          this.sliders = res.data.slider
        }
      })
    },
    _getDiscList() {
      // getDsicList().then((response) => {
      //   console.log('response', response)
      // }).catch((e) => {
      //   console.log('error', e)
      // })

      getDsicList().then(res => {
        // console.log(res)
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.BScroll.refresh()
        this.checkLoaded = true
        // console.log('img')
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@styles/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
