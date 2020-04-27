const express = require('express')
const axios = require('axios')
// const compression = require('compression')
// const bodyParser = require('body-parser')

const app = express()
// const apiRoutes = express.Router()

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
// app.use(compression())
const port = 8080
app.use(express.static('./dist'))
module.exports = app.listen(port, err => {
  if (err) {
    console.log(err)
  }
  console.log('listening at http://localhost:' + port)
})
