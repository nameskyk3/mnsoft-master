<template>
  <div class="selectbox w200" :class="applyClassName" v-click-outside="close">
    <a class="current" href="javascript:;" @click="clickBox">{{currentLabel}}</a>
    <ul class="select-list" :style="{ 'display': isListOpen? 'block':'none' }">
      <li v-for="item in data" :key="item.value">
        <div class="checkbox">
          <input type="checkbox" :id="getCheckboxId(item)" @click="clickItem(item, 'check', $event)" :checked="isChecked(item[valueField])"/>
          <label :for="getCheckboxId(item)" :style="labelStyle(item)" @click="clickItem(item, 'label', $event)" :title="item[labelField]">{{item[labelField]}}</label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'multiple-select-box',
  components: {
  },
  mounted () {
    if (this.allFlag === true && this.data && this.data.length > 0 && this.data[0][this.labelField] !== this.SELECTED_ALL_LABEL) {
      let all = this.getSelectedAllItem()
      this.data.splice(0, 0, all)
      if (!this.selectValue || this.selectValue.length < 1) {
        this.selected = JSON.copy(this.data)
      }
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
    labelField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'value'
    },
    selectValue: Array,
    chartColorSync: { // 차트 series색과 동일하게 출력해야 할 경우
      type: Boolean,
      default: false
    },
    sortKey: {
      type: String,
      default: 'name'
    },
    allFlag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      SELECTED_ALL_LABEL: this.$t('COMMON.ALL_SELECTION'),
      SELECTED_ALL_VALUE: 'ALL',
      selected: [],
      isListOpen: false,
      labelColors: constants.CHART_COLORS
    }
  },
  watch: {
    data: function (value) {
      if (value && value.length > 0) {
        if (this.allFlag === true && value[0][this.labelField] !== this.SELECTED_ALL_LABEL) {
          let all = this.getSelectedAllItem()
          value.splice(0, 0, all)
        }
        if (this.selectValue && this.selectValue.length > 0) {
          this.setSelection()
        } else {
          this.selected = JSON.copy(value)
        }
      } else {
        this.selected = []
        this.changeData()
      }
    },
    selectValue: {
      immediate: true,
      handler (value) {
        if (!value || value.length < 1) { return }
        this.setSelection()
      }
    }
  },
  computed: {
    applyClassName: function () {
      return (this.className ? this.className : '') + (this.disabled ? ' disabled' : '') + (this.isListOpen ? ' on' : '')
    },
    currentLabel () {
      if (!this.data) {
        return this.$t('INVENTORY.SELECTION_INFO', {selectedCount: 0, totalCount: 0})
      }
      let selectedCount = !this.selected ? 0 : this.selected.length
      let selectedAll = this.getSelectedIndexByValue(this.SELECTED_ALL_VALUE)
      if (selectedAll > -1) {
        --selectedCount
      }
      let totalCount = this.data.length
      let findField = {}
      findField[this.valueField] = this.SELECTED_ALL_VALUE
      let totalAllIdx = _.findIndex(this.data, findField)
      if (totalAllIdx > -1) {
        --totalCount
      }
      return this.$t('INVENTORY.SELECTION_INFO', {selectedCount: selectedCount, totalCount: totalCount})
    }
  },
  methods: {
    labelStyle (item) {
      let allIdx = this.getSelectedIndexByValue(this.SELECTED_ALL_VALUE)
      let idx = this.getSelectedIndexByValue(item[this.valueField])
      if (allIdx > -1 && allIdx < idx) {
        idx--
      }

      let style = {}
      if (item.value !== this.SELECTED_ALL_VALUE && this.chartColorSync && idx > -1) {
        style.color = this.labelColors[idx]
        style['text-overflow'] = 'ellipsis'
        style.overflow = 'hidden'
      }
      return style
    },
    isChecked (val) {
      if (!this.selected || this.selected.length < 1) { return false }
      return this.getSelectedIndexByValue(val) > -1
    },
    getSelectedIndexByValue (val) {
      let findField = {}
      findField[this.valueField] = val
      return _.findIndex(this.selected, findField)
    },
    getSelectedAllItem () {
      let all = {}
      all[this.labelField] = this.SELECTED_ALL_LABEL
      all[this.valueField] = this.SELECTED_ALL_VALUE
      return all
    },
    getCheckboxId (item) {
      return Date.now() + item[this.valueField]
    },
    clickBox () {
      if (!this.disabled) this.isListOpen = !this.isListOpen
    },
    clickItem (item, type, event) {
      if (type === 'check') {
        event.stopPropagation()
      } else if (type === 'label') {
        event.preventDefault()
      }

      if (!this.selected) { this.selected = [] }
      let allIdx = this.getSelectedIndexByValue(this.SELECTED_ALL_VALUE)
      if (item[this.valueField] === this.SELECTED_ALL_VALUE) {
        if (allIdx < 0) {
          this.selected = JSON.copy(this.data)
        } else {
          this.selected = []
        }
        this.$forceUpdate()
        this.changeData()
        return
      }

      let preSelected = JSON.copy(this.selected)

      let idx = this.getSelectedIndexByValue(item[this.valueField])
      if (idx > -1) {
        this.selected.splice(idx, 1)
        if (allIdx > -1 && allIdx !== idx) {
          allIdx = this.getSelectedIndexByValue(this.SELECTED_ALL_VALUE)
          this.selected.splice(allIdx, 1)
        }
      } else {
        this.selected.push(item)
      }

      if (this.selected && this.selected.length < 1) {
        alert(this.$t('POPUP.RESOURCE.MSG.AT_LEAST_SELECT_ONE'))
        this.selected = preSelected
        return
      }
      this.changeData()
    },
    sortSelectedList () {
      this.selected = _.sortBy(this.selected, this.sortKey)
    },
    changeData () {
      this.sortSelectedList()
      let allIdx = this.getSelectedIndexByValue(this.SELECTED_ALL_VALUE)
      let arr = JSON.copy(this.selected)
      if (allIdx > -1) {
        arr.splice(allIdx, 1)
      }
      this.$emit('change', arr)
    },
    close () {
      this.isListOpen = false
    },
    setSelection () {
      if (!this.data || this.data.length < 1) { return }

      let tmp = []
      for (let i = 0, l = this.data.length; i < l; ++i) {
        if (this.selectValue && this.selectValue.length > 0) {
          for (let j = 0, jl = this.selectValue.length; j < jl; ++j) {
            if (this.data[i][this.valueField] === this.selectValue[j]) {
              tmp.push(this.data[i])
              break
            }
          }
        } else {
          tmp.push(this.data[i])
        }
      }
      this.selected = tmp
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
