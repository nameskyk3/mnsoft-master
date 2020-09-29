import Vue from 'vue'
import axios from 'axios'
import Test from '@/site/Test'

Vue.config.productionTip = false
Vue.prototype.$http = axios
// eslint-disable-next-line
let test = new Vue({
  el: '#test',
  components: { Test },
  template: '<Test></Test>',
  data () {
    return {
      show: false
    }
  },
  beforeMount () {
  }
})
