function getRandomInt(min, max) {
  let num = Math.random() * (max - min + 1) + min
  return Math.floor(num)
}

export function shuffle(arr) {
  let _arr = arr.slice()

  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
