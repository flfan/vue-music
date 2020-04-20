import { getLyric } from '@/api/song.js'
import { ERR_OK } from '@/api/config.js'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    this.singer = singer
  }

  songGetLyric() {
    if (this.Lyric) {
      return Promise.resolve(this.Lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.code === ERR_OK) {
          this.Lyric = Base64.decode(res.lyric)
          // console.log(this.Lyric)
          resolve(this.Lyric)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('no Lyric')
        }
      })
    })
  }
}

export function createSong(musicData, url) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    album: musicData.albumname,
    singer: filterSinger(musicData.singer),
    duration: musicData.interval, // 歌曲时长
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: url
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

/*
http://isure.stream.qqmusic.qq.com/C400004XxXiX4Syq67.m4a?guid=1968628192&vkey=5521B9310D56CF3C745FDFCA508FB1A27A1BB45687CD30BF44337ACCE4EEABC17C3C47AC3642A176B75255B0E1F73B82F3FE7298DF3FA4DE&uin=0&fromtag=66

http://isure.stream.qqmusic.qq.com/C400004XxXiX4Syq67.m4a?guid=1968628192&vkey=706529F024E765D4FA89280A2DBA2C7DBAAA6ED39F6CA31E0280BCB623C7CAF837667590258595E7401C249CCC964CE28E2487B9892B9937&uin=0&fromtag=66

http://isure.stream.qqmusic.qq.com/C400001PLl3C4gPSCI.m4a?guid=1968628192&vkey=CDEBA6E9A4EB7A82FC4C0F3FF32A3D8AF09E7CE8DC2B8ECC2F3199570E4154306FFF9C2D0252B4CC5109DD901AB6AC004285F8A7260E53E9&uin=0&fromtag=66

http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400001PLl3C4gPSCI.m4a?guid=9904235264&vkey=6799D061297AA3CEA8FF83DDB5DAFFDF066D524A5C86EC576A3666F95A265101D9C780F5A6D40D0AE71B6D9C41250DC1FB8ABE9CC0B60E1E&uin=0&fromtag=38

data: {"req":{"module":"CDN.SrfCdnDispatchServer","method":"GetCdnDispatch","param":{"guid":"1968628192","calltype":0,"userip":""}},"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1968628192","songmid":["004XxXiX4Syq67"],"songtype":[0],"uin":"1490459938","loginflag":1,"platform":"20"}},"comm":{"uin":1490459938,"format":"json","ct":24,"cv":0}}

https://ws.stream.qqmusic.qq.com/97773.m4a?fromtag=46

https://v1.itooi.cn/tencent/url?id=0039MnYb0qxYhV,001fXNWa3t8EQQ&quality=flac
*/
// https://thirdparty.gtimg.com/97773.m4a?fromtag=38
