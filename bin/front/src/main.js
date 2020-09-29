import Vue from 'vue'
import App from '@/site/App'
import router from '@/router'
import axios from 'axios'
import i18n from '@/resource/config/i18n'
import ConfigMessages from '@/resource/config/messages'
import {AgGridVue} from 'ag-grid-vue'
import commonSpinner from '@/common/component/common-spinner'
import httpInterceptors from '@/common/component/http-interceptors'
import vClickOutside from '@/common/directive/v-click-outside'
import maxByte from '@/common/directive/max-byte'
import VTooltip from 'v-tooltip'
import VueCookie from 'vue-cookie'
import VModal from 'vue-js-modal'
import VueSession from 'vue-session'
import 'babel-polyfill'
import VueHtml2Canvas from 'vue-html2canvas'

import '../node_modules/jquery-datetimepicker'
import '@/asset/css/ui/reset.css'
import '@/asset/css/ui/layout.css'
import '@/asset/css/ui/style.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

// 내부 css파일이 제일 아래쪽에 적용되야 합니다

Vue.use(VTooltip)
Vue.use(VueCookie)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })
Vue.use(VueSession)
Vue.use(VueHtml2Canvas)

// Global Components
Vue.component('ag-grid-vue', AgGridVue)
Vue.component('common-spinner', commonSpinner)
Vue.component('interceptors-handler', httpInterceptors)

// Global Directives
Vue.directive('click-outside', vClickOutside)
Vue.directive('max-byte', maxByte)

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$message = ConfigMessages

var isAuthenticated = false
window.isAuthenticated = isAuthenticated

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App ref="app"/>',
  data: {
    isAuthenticated,
    menuList: []
  },
  methods: {
    showIndicator (lazy = null) {
      if (this.$refs && this.$refs.app && this.$refs.app.$refs && this.$refs.app.$refs.loader) {
        if (lazy && _.isNumber(lazy)) {
          this.$refs.app.$refs.loader.lazyIndicator(lazy)
        } else {
          this.$refs.app.$refs.loader.showIndicator()
        }
      }
    },
    hideIndicator () {
      if (this.$refs && this.$refs.app && this.$refs.app.$refs && this.$refs.app.$refs.loader) {
        this.$refs.app.$refs.loader.hideIndicator()
      }
    }
  }
})
