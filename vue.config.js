const path = require('path')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('@styles', resolve('./src/assets/styles'))
      .set('@assets', resolve('./src/assets'))
      .set('@components', resolve('./src/components'))
  },
  devServer: {
    disableHostCheck: true,
    before(app) {
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/playlist.html',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getSongVkey', function (req, res) {
        // const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getLyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/player.html',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getDiscSongList', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/n/yqq/playlist/${req.query.disstid}.html`,
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getRankList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://i.y.qq.com/n2/m/index.html?tab=toplist',
            origin: 'https://i.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getSearchHotKey', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/search.html',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      app.get('/api/getSearchMusic', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/?ADTAG=myqq',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 2020 QQ音乐 singer List 无法解决url 的 sign参数，无法使用
      app.get('/api/getSingerList', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/portal/singer_list.html',
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
      // 2020 QQ音乐 singer Songs List 无法解决url 的 sign参数，无法使用
      app.get('/api/getSingerDetail', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
        let TempData = JSON.parse(req.query.data)
        // console.log(TempData)
        axios.get(url, {
          headers: {
            referer: `https://y.qq.com/n/yqq/singer/${TempData.singerMid}.html`,
            origin: 'https://y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
    // proxy: {
    //   // '/api': {
    //   //   target: 'https://v1.itooi.cn/tencent', // 对应自己的接口
    //   //   changeOrigin: true,
    //   //   ws: true,
    //   //   pathRewrite: {
    //   //     '^/api': ''
    //   //   }
    //   // }
    //   // '/api/getDiscList': {
    //   //   target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    //   //   changeOrigin: true,
    //   //   ws: true,
    //   //   pathRewrite: {
    //   //     '^/api/getDiscList': ''
    //   //   }
    //   // }
    // }
  }
}
