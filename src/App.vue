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

// 配置rem
/* document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
}) */

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
