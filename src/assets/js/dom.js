export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }

  let elClassName = el.className.split(' ')
  elClassName.push(className)
  el.className = elClassName.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  reg.test(el.className)
}
