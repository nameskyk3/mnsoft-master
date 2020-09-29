import Vue from 'vue'
import axios from 'axios'
import Menu from '@/site/Menu'

Vue.config.productionTip = false
Vue.prototype.$http = axios
// eslint-disable-next-line
let menu = new Vue({
  el: '#menu',
  components: { Menu },
  template: '<Menu></Menu>',
  data () {
    return {
      show: false
    }
  },
  beforeMount () {
  }
})
