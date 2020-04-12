import jsonp from '@assets/js/jsonp'
import { commonParams, options } from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

/* import axios from 'axios'

export function getSingerList () {
  const url = '/api/getSingerList'

  const data = {
    g_tk: 5381,
    platform: 'yqq.json',
    hostUin: 0,
    loginUin: 0,
    sin: 'zza52qiphw9kftsj2f3fef04bda3a286eeb40136f6b80f4a',
    needNewCode: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    data: '{"comm":{"ct":24,"cv":0},"singerList":{"module":"Music.SingerListServer","method":"get_singer_list","param":{"area":-100,"sex":-100,"genre":-100,"index":-100,"sin":0,"cur_page":1}}}'
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    // 这里返回一个Promise的resolve方法，把需要的参数传递出去
    return Promise.resolve(res.data)
  })
}
 */
