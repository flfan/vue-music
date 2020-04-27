import * as types from './mutations-types.js'
import { shuffle } from '@assets/js/util.js'
import { Config } from '@assets/js/config.js'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from '@assets/js/cache.js'

export const selectPlayer = ({ commit, state }, { list, index }) => {
  if (state.mode === Config.playMode.random) {
    let randomList = shuffle(list)
    index = getIndex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
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

export const insertSong = ({ commit, state }, song) => {
  let playList = state.playList.slice()
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice()
  let currentSong = state.playList[currentIndex]
  let findIndex = getIndex(playList, song)

  currentIndex++
  playList.splice(currentIndex, 0, song)
  if (findIndex > -1) {
    if (currentIndex > findIndex) {
      playList.splice(findIndex, 1)
      currentIndex--
    } else {
      playList.splice(findIndex + 1, 1)
    }
  }
  let currentSequenceIndex = getIndex(sequenceList, currentSong) + 1
  let findSequenceIndex = getIndex(sequenceList, song)

  sequenceList.splice(currentSequenceIndex, 0, song)
  if (findSequenceIndex > -1) {
    if (currentSequenceIndex > findSequenceIndex) {
      sequenceList.splice(findSequenceIndex, 1)
    } else {
      sequenceList.splice(findSequenceIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, false)
}

export const saveSearchHistory = function ({ commit, state }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({ commit, state }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({ commit, state }, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let playIndex = getIndex(playlist, song)
  playlist.splice(playIndex, 1)

  let sequenceIndex = getIndex(sequenceList, song)
  sequenceList.splice(sequenceIndex, 1)

  // 如果删除的是当前播放之前的歌曲，或者最后一个
  if (currentIndex > playIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 清空播放器
export const deleteSongList = function ({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 保存最近播放
export const savePlayHistory = function ({ commit }, history) {
  commit(types.SET_PLAY_HISTORY, savePlay(history))
}

// 保存收藏歌曲
export const saveFavoriteHistory = function ({ commit }, song) {
  commit(types.SET_FAVORITE_HISTORY, saveFavorite(song))
}

export const deleteFavoriteSong = function ({ commit }, song) {
  commit(types.SET_FAVORITE_HISTORY, deleteFavorite(song))
}

function getIndex(list, currentSong) {
  let index = list.findIndex(item => {
    return item.id === currentSong.id
  })
  return index
}
