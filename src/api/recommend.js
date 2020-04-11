import jsonp from '@assets/js/jsonp'
import { commonParams, options } from './config'
// import axiosHttp from '@assets/js/http.js'
import axios from 'axios'

export function getRecommend () {
  // QQ音乐轮播图api地址
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // const url = 'https://v1.itooi.cn/tencent/banner'

  // const data = Object.assign({}, commonParams, {
  //   platform: 'h5',
  //   uin: 0,
  //   needNewCode: 1
  // })
  const data = {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    ...commonParams
  }

  // 这里返回一个promise对象
  return jsonp(url, data, options)
  // const url = 'banner'
  // return axiosHttp.get(url)
}

export function getDsicList () {
  const url = '/api/getDiscList'

  const data = {
    g_tk_new_20200303: 5381,
    g_tk: 5381,
    platform: 'yqq.json',
    hostUin: 0,
    loginUin: 0,
    sin: 0,
    ein: 19,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8'
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    // 这里返回一个Promise的resolve方法，把需要的参数传递出去
    return Promise.resolve(res.data)
  })

  // return axios.get(url, {
  //   headers: {
  //     referer: 'https://y.qq.com/portal/playlist.html',
  //     origin: 'https://y.qq.com'
  //   },
  //   params: data
  // })
}
