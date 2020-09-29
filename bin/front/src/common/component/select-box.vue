<template>
  <div class="selectbox" :class="applyClassName" v-click-outside="close">
    <a class="current" href="javascript:;" @click="clickBox" v-if="selected" :title="selected[labelField]">{{selected[labelField]}}</a>
    <ul class="select-list" :style="{ 'display': isListOpen? 'block':'none' }">
      <li v-for="(item, index) in data" :key="index" :class="liClass(item)" :style="liStyle(item)" @click="clickItem(item)" :title="item[labelField]">
        <a href="javascript:;">{{item[labelField]}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'select-box',
  components: {
  },
  mounted () {
    // 이벤트 등록
    // 초기화 코드 실행
    this.emptyData = {}
    this.emptyData[this.labelField] = `--${this.$t('COMMON.MSG.CHOOSE')}--`
    this.emptyData[this.valueField] = ''

    if (this.isImmediate === true) {
      this.setSelection()
    }
  },
  props: {
    className: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      require: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    anotherBackgroundValue: {
      type: String,
      default: null
    },
    labelField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'value'
    },
    selectValue: String,
    immediate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selected: this.data && this.data.length > 0 ? this.data[0] : this.emptyData,
      isListOpen: false,
      emptyData: {name: `--${this.$t('COMMON.MSG.CHOOSE')}--`, value: ''},
      isImmediate: this.immediate
    }
  },
  watch: {
    data: function (value) {
      if (value && value.length > 0) {
        if (this.selectValue && this.selectValue !== '') {
          this.setSelection()
        } else {
          this.selected = value[0]
          if (this.isImmediate === true) {
            this.$emit('change', this.selected)
          }
        }
      } else {
        this.selected = this.emptyData
        this.$emit('change', this.selected)
      }
    },
    selectValue: {
      immediate: true,
      handler (value) {
        if (!this.selected || this.selected[this.valueField] === value) { return }
        this.setSelection()
      }
    }
  },
  computed: {
    applyClassName: function () {
      return (this.className ? this.className : '') + (this.disabled ? ' disabled' : '') + (this.isListOpen ? ' on' : '')
    }
  },
  methods: {
    liClass (item) {
      let returnClassStr = ''
      if (this.selected[this.valueField] === item[this.valueField]) {
        returnClassStr = returnClassStr + ' on'
      }

      return returnClassStr
    },
    liStyle (item) {
      if (!this.anotherBackgroundValue) {
        return null
      }

      if (this.selected[this.valueField] === item[this.valueField]) {
        return null
      }

      let ar = this.anotherBackgroundValue.split(',')
      for (let i = 0; i < ar.length; i++) {
        if (ar[i] === item[this.valueField]) {
          return {backgroundColor: '#00FF88'}
        }
      }
      return null
    },
    clickBox () {
      if (!this.disabled) this.isListOpen = !this.isListOpen
    },
    clickItem (item) {
      this.selected = item
      this.isListOpen = false
      this.$emit('change', this.selected)
      this.$emit('update:selectValue', item[this.valueField])
    },
    close () {
      this.isListOpen = false
    },
    setSelection () {
      if (!this.data || this.data.length < 1) { return }

      for (let i = 0, l = this.data.length; i < l; ++i) {
        if (this.data[i][this.valueField] === this.selectValue) {
          this.clickItem(this.data[i])
          return
        }
      }
      this.clickItem(this.data[0])
    },
    forceSelect (value) {
      for (let i = 0, l = this.data.length; i < l; ++i) {
        if (this.data[i][this.valueField] === value) {
          this.selected = this.data[i]
          this.isListOpen = false
          return
        }
      }
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
