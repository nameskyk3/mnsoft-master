<template>
  <div class="overlay-container" v-click-outside="clockOutside">
    <div class="overlay-content" @click="clickInside($event)"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'overlay-popup',
  methods: {
    clickInside (event) {
      if (event) {
        event.stopImmediatePropagation()
        event.stopPropagation()

        if (event.target.className !== 'overlay-content') {
          return
        }
      }

      console.log('DIALOG CLOSE inside', event)
      this.$emit('close')
    },
    clockOutside (event) {
      if (event && !this.isMenu(event.target)) {
        event.stopImmediatePropagation()
        event.stopPropagation()

        let parentCount = this.getDepth(this.$el)
        let targetCount = event.path.length
        if (parentCount === targetCount || parentCount < targetCount) {
          return
        }

        if (event.target.className === 'appWrapper') {
          return
        }

        if (!this.isMenu(event.target)) {
          return
        }
      }

      console.log('DIALOG CLOSE outside', event)
      this.$emit('close')
    },
    getDepth (e) {
      let c = 1
      let t = e
      while (t) {
        t = t.parentNode
        c++
      }
      return c
    },
    isMenu (e) {
      let t = e
      while (t) {
        if (t.className === 'gnb-menu') {
          return true
        }
        t = t.parentNode
      }

      return false
    }
  }
}
</script>

<style scoped>
  .overlay-container {
    position: absolute;
    height:100%;
    width:100%;
    top: 0;
    left: 0;
    z-index:100
  }
  .overlay-content {
    height: 100%;
    opacity: 0.3;
    background:#000
  }
</style>
