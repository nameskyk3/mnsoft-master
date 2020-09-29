<!--
   * https://github.com/rmp135/vue-splitter
   * 2018/08/08 디자인팀 요청으로 좌우 너비 및 높이 값을 %에서 px로 수정
   * 2018/09/03 디자인 코드가 겹치므로 모듈 안의 css 코드는 일부 주석처리
 -->
<template>
  <div :style="{ cursor, userSelect, flexDirection }" class="vue-splitter" @mouseup="onUp" @mousemove="onMouseMove" @touchmove="onMove" @touchend="onUp">
    <div :style="leftPaneStyle" class="left-pane splitter-pane">
      <slot name="left-pane"></slot>
    </div>
    <div class="splitter-bar" :class="{active}" @mousedown="onDown" @click="onClick" @touchstart.prevent="onDown"></div>
    <div :style="rightPaneStyle" class="right-pane splitter-pane">
      <slot name="right-pane"></slot>
    </div>
  </div>
</template>
<style lang="scss">
  .vue-splitter {
    /*height: inherit;*/
    display: flex;
    /*.splitter-pane {*/
      /*height: inherit;*/
      /*overflow-y: auto;*/
    /*}*/
  }
</style>
<script>
export default {
  props: {
    margin: {
      type: Number,
      default: 300
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false,
      // percent: 50,
      pixcel: 200,
      hasMoved: false
    }
  },
  mounted () {
    this.pixcel = (this.$el.offsetWidth == null || this.$el.offsetWidth === 0) ? this.margin : this.$el.offsetWidth * 0.25
  },
  computed: {
    flexDirection () { return this.horizontal ? 'column' : 'row' },
    // splitterStyle () { return this.horizontal ? { height: '7px', cursor: 'ns-resize' } : { width: '7px', cursor: 'ew-resize' } },
    // leftPaneStyle () { return this.horizontal ? { height: this.percent + '%' } : { width: this.percent + '%' } },
    // rightPaneStyle () { return this.horizontal ? { height: 100 - this.percent + '%' } : { width: 100 - this.percent + '%' } },
    leftPaneStyle () { return this.horizontal ? { height: this.pixcel + 'px' } : { width: this.pixcel + 'px' } },
    rightPaneStyle () { return this.horizontal ? { height: `calc(100% - ${this.pixcel}px)` } : { width: `calc(100% - ${this.pixcel}px)` } },
    userSelect () { return this.active ? 'none' : '' },
    cursor () { return this.active ? this.horizontal ? 'ns-resize' : 'ew-resize' : '' }
  },
  methods: {
    onClick () {
      // if (!this.hasMoved) {
      // this.percent = 50
      // this.pixcel = this.$el.offsetWidth * 0.25
      // this.$emit('resize')
      // }
    },
    onDown (e) {
      this.active = true
      this.hasMoved = false
    },
    onUp () {
      this.active = false
    },
    onMove (e) {
      let offset = 0
      let target = e.currentTarget
      // let percent = 0
      let pixcel = 0
      if (this.active) {
        if (this.horizontal) {
          while (target) {
            offset += target.offsetTop
            target = target.offsetParent
          }

          pixcel = e.pageY - offset
          // percent = Math.floor(((e.pageY - offset) / e.currentTarget.offsetHeight) * 10000) / 100
        } else {
          while (target) {
            offset += target.offsetLeft
            target = target.offsetParent
          }

          pixcel = e.pageX - offset
          // percent = Math.floor(((e.pageX - offset) / e.currentTarget.offsetWidth) * 10000) / 100
        }

        if (pixcel > this.margin && pixcel < this.$el.offsetWidth - this.margin) {
          this.pixcel = pixcel
        }
        // if (percent > this.margin && percent < 100 - this.margin) {
        //   this.percent = percent
        // }
        this.$emit('resize')
        this.hasMoved = true
      }
    },
    onMouseMove (e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false
      }
      this.onMove(e)
    }
  }
}
</script>
