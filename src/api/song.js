import axios from 'axios'

export function getLyric(songmid) {
  const url = '/api/getLyric'
  const data = {
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: songmid,
    g_tk_new_20200303: 5381,
    g_tk: 5381,
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

export function getSongVkey(songmid) {
  const url = '/api/getSongVkey'
  const data = {
    format: 'json',
    data: `{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"358840384","songmid":["${songmid}"],"songtype":[0],"uin":"1443481947","loginflag":1,"platform":"20"}},"comm":{"uin":"18585073516","format":"json","ct":24,"cv":0}}`
  }
  /*
  http://isure.stream.qqmusic.qq.com/C400000S7TGL43hhBO.m4a?guid=1968628192&vkey=C3C968220285C9FF4A01FEFABE4D06B9CE1F5F9D4E84513B06E3D929BAD96B3F6D0C5E9471568A91F4E58B3725382B8628DEF822CB36898A&uin=0&fromtag=66

  https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22001X0PDf0W4lBq%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D

  format: json
  data: {"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"358840384","songmid":["001X0PDf0W4lBq"],"songtype":[0],"uin":"1443481947","loginflag":1,"platform":"20"}},"comm":{"uin":"18585073516","format":"json","ct":24,"cv":0}}
  ————————————————
  版权声明：本文为CSDN博主「jsyjst」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
  原文链接：https://blog.csdn.net/qq_41979349/java/article/details/102458551
  */

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
