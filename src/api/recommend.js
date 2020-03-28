// import jsonp from '@assets/js/jsonp'
// import { commonParams, options } from './config'
import axiosHttp from '@assets/js/http.js'

export function getRecommend () {
  // QQ音乐轮播图api地址
  // const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // const url = 'https://v1.itooi.cn/tencent/banner'

  // const data = Object.assign({}, commonParams, {
  //   platform: 'h5',
  //   uin: 0,
  //   needNewCode: 1
  // })
  // const data = {
  //   platform: 'h5',
  //   uin: 0,
  //   needNewCode: 1,
  //   ...commonParams
  // }

  // 这里返回一个promise对象
  // return jsonp(url, data, options)
  const url = 'banner'
  return axiosHttp.get(url)
}
