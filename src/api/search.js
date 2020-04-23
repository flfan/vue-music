import axios from 'axios'

export function getSearchHotKey() {
  const url = '/api/getSearchHotKey'
  const data = {
    g_tk_new_20200303: 1896362599,
    g_tk: 1896362599,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSearchResult(keyWord, page, zhida) {
  const url = '/api/getSearchMusic'
  const data = {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: 'txt.yqq.center',
    searchid: 46199326876153346,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: zhida ? 1 : 0,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 30,
    w: keyWord,
    g_tk_new_20200303: 1896362599,
    g_tk: 1896362599,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
