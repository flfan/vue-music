<template>
<div class="search">
  <div class="search-box-wrapper">
    <search-box ref="searchBox" @queryChange="handleQueryChange"></search-box>
  </div>
  <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
    <bscroll class="shortcut" :data="scrollData" ref="scroll">
      <div>
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" @click="addQuery(item.k)" v-for="item in hotKey" :key="item.n">{{item.k}}</li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="handleDeleteClick"></search-list>
        </div>
      </div>
    </bscroll>
  </div>
  <div class="search-result" v-show="query" ref="searchResult">
    <suggest @listScroll="blurInput"
             :query="query"
             @itemClick="saveSearch"
             ref="suggest"></suggest>
  </div>
  <confirm ref="confirm" @confirm="handleConfirm" @cancel="handleCancel" text="真的要清除我的记忆吗？QAQ" confirmBtnText="是的" cancelBtnText="不了"></confirm>
  <transition name="slide">
    <router-view></router-view>
  </transition>
</div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import SearchList from '@/base/search-list/search-list'
import Suggest from '../suggest/suggest'
import Confirm from '@/base/confirm/confirm'
import Bscroll from '@/base/scroll/scroll'

import { getSearchHotKey } from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { playlistMixin } from '@assets/js/mixin.js'
import { mapActions, mapGetters } from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Bscroll
  },
  created() {
    this._getSearchHotKey()
  },
  computed: {
    scrollData() {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters({
      searchHistory: 'searchHistory'
    })
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },
  methods: {
    handleConfirm() {
      this.clearSearchHistory()
    },
    handleCancel() {
      return
    },
    showConfirm() {
      this.$refs.confirm.show()
    },
    handleDeleteClick(item) {
      this.deleteSearchHistory(item)
    },
    addQuery(key) {
      this.$refs.searchBox.setQuery(key)
    },
    handleQueryChange(query) {
      this.query = query
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    handlePlaylist(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.scroll.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    _getSearchHotKey() {
      getSearchHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey
        }
      })
    },
    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      deleteSearchHistory: 'deleteSearchHistory',
      clearSearchHistory: 'clearSearchHistory'
    })
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@styles/variable"
  @import "~@styles/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
  .slide-enter-active, .slide-leave-active
    transition: all .5s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
