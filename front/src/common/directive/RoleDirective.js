import Vue from 'vue';
export const Role = {
  bind(el, binding, vnode) {
    const role = binding.value.role
    if(role == 'admin'){
      el.style.display = "inline-block"
    }else {
      el.style.display = "none"
    }
  },
  inserted(el, binding, vnode) {
  }
}
Vue.directive('role', Role)
