const maxByte = {
  bind (el, binding, vnode) {
    let maxByte = binding.expression
    let handler = function (e) {
      let value = e.target.value
      let b = 0
      let i = 0
      let c = 0
      // eslint-disable-next-line
      for (b = i = 0; c = value.charCodeAt(i++); ){
        b += c >> 11 ? 2 : c >> 7 ? 2 : 1
        // console.log(b)
        if (b > maxByte) {
          e.target.value = e.target.value.substr(0, i - 1)
          break
        }
      }
    }
    el.addEventListener('input', handler)
  },
  unbind (el, binding, vnode) {
  }
}
export default maxByte
