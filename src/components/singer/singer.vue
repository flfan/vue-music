<template>
  <div class="singer">
    <list-view :data="singerList"></list-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer.js'
import { Singer } from '@assets/js/singer'
import ListView from '@/base/listview/listview.vue'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singerList: []
    }
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === 0) {
          let singerList = res.data.list
          // console.log(this.singerList)
          this.singerList = this._normalizeSinger(singerList)
        }
      })
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer(item.Fsinger_mid, item.Fsinger_name)
          )
        }

        const key = item.Findex

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer(item.Fsinger_mid, item.Fsinger_name)
        )
      })

      let hot = []
      let ret = []

      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret)
    }
  }
}
</script>

<style coped lang="stylus">
.singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
