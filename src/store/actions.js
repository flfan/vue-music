import * as types from './mutations-types.js'
import { shuffle } from '@assets/js/util.js'
import { Config } from '@assets/js/config.js'

export const selectPlayer = ({ commit, state }, { list, index }) => {
  if (state.mode === Config.playMode.random) {
    let randomList = shuffle(list)
    index = getIndex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  // commit(types.SET_PLAYLIST, list)
  // commit(types.SET_SEQUENCE_LIST, list)
  // commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
}

export const randomPlay = ({ commit }, list) => {
  commit(types.SET_PLAY_MODE, Config.playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, false)
}

function getIndex(list, currentSong) {
  let index = list.findIndex(item => {
    return item.id === currentSong.id
  })
  return index
}
