import Vue from 'vue'
import axios from 'axios'
import Login from '@/site/login/default-login'
import commonSpinner from '@/common/component/common-spinner'
import httpInterceptors from '@/common/component/http-interceptors'
import VueCookie from 'vue-cookie'
import i18n from '@/resource/config/i18n'

import '@/asset/css/ui/reset.css'
import '@/asset/css/ui/layout.css'
import '@/asset/css/ui/style.css'

Vue.use(VueCookie)
Vue.component('common-spinner', commonSpinner)
Vue.component('interceptors-handler', httpInterceptors)

Vue.config.productionTip = false
Vue.prototype.$http = axios
// eslint-disable-next-line
new Vue({
  el: '#login',
  i18n,
  components: { Login },
  template: '<Login v-if="show"/>',
  data () {
    return {
      show: false
    }
  },
  beforeMount () {
    if (window.location && window.location.search && window.location.search !== '') {
      let tokenParam = new URLSearchParams(window.location.search)
      if (tokenParam.has('userId') && tokenParam.has('token')) {
        let param = {}
        param.userId = tokenParam.get('userId')
        param.token = tokenParam.get('token')
        this.$http.post('/user/validateToken', param).then(response => {
          console.log('==========토큰검증 성공;', response.data)
          if (response.data && response.data.result === 1) {
            let uri = '/main'
            if (location.port === '8000') {
              uri += '.html'
            }
            window.location.href = uri
          } else {
            alert('로그인에 실패하였습니다.')
            this.show = true
          }
        }).catch(response2 => {
          console.log('==========토큰검증 에러;', response2)
          this.show = true
        })
      }
    } else {
      this.show = true
    }
  }
})
