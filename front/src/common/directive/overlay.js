let handler = (el, binding) => {
  if (!el) { return }

  let val = binding.value
  if (val == null || val === false) {
    el.style.opacity = 1
    el.style.pointerEvents = 'auto'
  } else {
    el.style.opacity = 0.4
    el.style.pointerEvents = 'none'
  }
}

export const overlay = {
  bind (el, binding) {
    handler(el, binding)
  },
  update (el, binding) {
    handler(el, binding)
  }
}
