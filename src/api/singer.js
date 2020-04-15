import jsonp from '@assets/js/jsonp'
// import axios from 'axios'
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

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}

// 2020 QQ音乐 singer List 无法解决url 的 sign参数，无法使用
/* export function getSingerList2 () {
  const url = '/api/getSingerList'

  const data = {
    '-': 'getSingerSong5625980982481813',
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

// 2020 QQ音乐 singer Songs List 无法解决url 的 sign参数，无法使用
export function getSingerDetail2 (singerId) {
  const url = '/api/getSingerDetail'
  // let rand = Math.floor(Math.random() * 10000)

  const data = {
    '-': 'getSingerSong5625980982481813',
    g_tk: 191085133,
    // sign: 'zzajscfpvp4gkvpf6be8abd941f9f2b62c18f39dd6266e6',
    sign: 'zzamv6cb28jzhaf7259b46505c87204be2a320c5b177452',
    loginUin: 1490459938,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"comm":{"ct":24,"cv":0},"singerSongList":{"method":"GetSingerSongList","param":{"order":1,"singerMid":"${singerId}","begin":0,"num":10},"module":"musichall.song_list_server"}}`
  }

  return axios.get(url, {
    params: data
  }).then((res) => {
    // 这里返回一个Promise的resolve方法，把需要的参数传递出去
    return Promise.resolve(res.data)
  })
}
 */
