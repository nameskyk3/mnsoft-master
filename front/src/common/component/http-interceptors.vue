<script>
import axios from 'axios'
import commonSpinner from './common-spinner'
var _loader
export default {
  name: 'interceptorsHandler',
  components: {
    'common-spinner': commonSpinner
  },
  data () {
    return {
      isFault: false
    }
  },
  template: ' ',
  inherit: true,
  created: function () {
    // ajax request Handler
    axios.interceptors.request.use(this.requestSuccessHandler, this.requestErrorHandler)
    // ajax response Handler
    axios.interceptors.response.use(this.responseSuccessHandler, this.responseErrorHandler)
    // loader setting
    _loader = this.$parent.$refs.loader
  },
  methods: {
    requestSuccessHandler (config) {
      let loader = true

      if (config.spinnerStop) {
        loader = false
      }

      let isGetParam = config.method === 'get' && config.params
      let isPostData = config.method === 'post' && config.data
      if (config && (isGetParam || isPostData)) {
        let p = isGetParam ? config.params : config.data
        if (p != null && typeof p === 'object' && p.loader === false) {
          loader = false
          delete p.loader

          if (Object.keys(p).length === 0) {
            p = null
          }

          if (isGetParam) {
            config.params = p
          } else if (isPostData) {
            config.data = p
          }
        }
      }

      config.spinnerStop = !loader
      if (loader) {
        _loader.showIndicator()
      }

      return config || Promise.when(config)
    },

    requestErrorHandler (err) {
      _loader.lazyIndicator()
      return Promise.reject(err)
    },

    responseSuccessHandler (config) {
      if (!config.config.spinnerStop) {
        _loader.lazyIndicator()
      }

      if (this.isFault) {
        _loader.lazyIndicator()
        return
      }

      var contentType = config.headers['content-type']
      if (contentType && (contentType.indexOf('application/json') > -1 || contentType.indexOf('application/x-www-form-urlencoded') > -1)) {
        let data = this.isSuccess(config.data)
        if (!data) {
          return Promise.reject(config)
        }
      }

      return config || Promise.when(config)
    },

    responseErrorHandler (result) {
      _loader.lazyIndicator()

      if (this.isFault) {
        return
      }
      this.ajaxErrorHandler(result.response)
      return Promise.reject(result)
    },

    isSuccess (response) {
      if (response == null || response === '' || response === 'undefined') {
        return false
      }

      if (response.hasOwnProperty('result') === false) {
        return true
      }

      if (response.result === 0) {
        if (!response.silence) {
          if (response.message == null || response.message === '' || response.message === 'null') {
            alert(this.$t('COMMON.MSG.SYSTEM_ERROR'))
          } else {
            alert(response.message)
          }
        } else {
          console.error(response.message)
        }

        return false
      }

      return true
    },

    ajaxErrorHandler (res) {
      if (!res) {
        alert(this.$t('COMMON.MSG.SYSTEM_ERROR'))
        window.location = '/'
        this.isFault = true
      }
      let status = res.status
      switch (status) {
        case 200:
        case 201:
        case 204:
          return true
      }

      if (res.statusText === 'success') {
        return true
      }

      let errorMessages = {
        301: '301 Moved Permanently.',
        304: '304 Not Modified.',
        400: '400 Bad Request.',
        401: '401 Unauthorized.',
        // 403: '403 Forbidden.',
        403: this.$t('COMMON.MSG.LOGIN_TIMEOUT_INFO'),
        404: '404 Not Found.',
        405: '405 Method Not Allowed.',
        422: '422 Unprocessable Entity.',
        500: '500 Internal Server Error.',
        503: '503 Service Unavailable.',
        901: '901 Restart'
      }

      let message = errorMessages[status]
      if (status === 403) {
        alert(message)
      } else {
        alert(this.$t('COMMON.MSG.SYSTEM_ERROR'))
        // alert(this.$t('COMMON.MSG.UNKNOWN_ERROR'))
      }

      switch (status) {
        case 401:
        case 403:
        case 504:
        case 901:
          window.location = '/'
          this.isFault = true
      }

      return true
    }
  }
}
</script>
