<template>
  <div class="loading-container" v-show="isShow" style="z-index:20000" >
    <div class="loading-backdrop"></div>
    <!--<transition name="fade" mode="out-in">-->
      <div class="loading-icon" style="z-index:21000"></div>
    <!--</transition>-->
  </div>
</template>

<script>

var _indicatorCount = []
var _indicatorTime = null

export default {
  name: 'common-spinner',
  computed: {
    isShow () {
      return this.show
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    getIndicatorCount: () => (typeof _indicatorCount === 'undefined' || _indicatorCount == null) ? 0 : _indicatorCount.length,
    showIndicator: function () {
      if (_indicatorCount.length === 0) {
        this.show = true
        if (_indicatorTime == null) {
          _indicatorTime = setInterval(function () {
            _indicatorCount = []
            this.hideIndicator()
          }, 60000)
        }
      }

      _indicatorCount.push(new Date())
    },
    hideIndicator: function () {
      clearInterval(_indicatorTime)
      _indicatorCount.pop()

      if (_indicatorCount.length !== 0) {
        return
      }
      this.show = false
    },
    lazyIndicator: function (lazySeconds) {
      if (lazySeconds == null || !_.isNumber(lazySeconds) || lazySeconds < 0) {
        lazySeconds = 200
      }

      setTimeout(this.hideIndicator, lazySeconds)
    }
  }
}
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 2s
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0
  }
</style>
