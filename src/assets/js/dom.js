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

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    standard: 'transform',
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform'
  }

  for (let k in transformNames) {
    if (elementStyle[transformNames[k]] !== undefined) {
      console.log(k)
      return k
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (!vendor) {
    return
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
