<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <!-- 把dom缓存到内存中，不会每次都请求 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- <player></player> -->
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from '@components/m-header/m-header'
import Tab from '@components/tab/tab'
// import Player from '@components/player/player'

export default {
  components: {
    MHeader,
    Tab
    // Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
