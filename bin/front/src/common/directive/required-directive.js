const directive = {
  instances: []
}

directive.bind = function (el, binding) {
  const required = binding.value
  if (required) {
    el.required = false
  }
}

export default typeof window !== 'undefined' ? directive : {}
