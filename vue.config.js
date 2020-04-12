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
