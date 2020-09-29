<template>
  <div class="tree-wrap">
     <VirtualList ref="virtualList" :size="size" :remain="remain" class="tree-list">
      <msf-tree-item v-on:expand="expand" v-on:checkClick="checkclick" v-on:itemClick="itemClick" v-on:itemDblClick="itemDblClick" v-for="item of list" :key="item.key" :data="item" :checked="item.checked"
            :expanded="item.expanded" :depth="item.depth" :label="item.labelValue" :half-checked="item.halfChecked" :active="item.active"/>
     </VirtualList>
  </div>
</template>

<script>
import MsfTreeItem from './msf-tree-item.vue'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'msf-tree',
  components: {MsfTreeItem, VirtualList},
  props: {
    source: Array,
    filterFunction: Function,
    labelField: String,
    idField: String,
    selectedList: Array,
    activeItem: Object,
    expandDepth: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      items: [], // 전체 데이터
      filteredItems: [],
      list: [], // 닫쳐있는것 제외 하고 필터링 된것 제외한 데이터
      size: 10,
      remain: 84,
      keyField: 'id',
      activeList: []
    }
  },
  watch: {
    source: function (value) {
      this.setSource(value)
    },
    selectedList: function (value) {
      if (!value || value.length < 1) {
        this.clearCheck('checked')
        this.refresh()
        return
      }

      for (let i = 0; i < this.items.length; i++) {
        let obj = this.items[i]
        for (let j = 0; j < value.length; j++) {
          this.setCheckedData(obj, 'checked')
        }
      }
      this.refresh()
    },
    activeItem: function (value) {
      this.activeList = [value]
      if (!this.activeList || this.activeList.length < 1) {
        this.clearCheck('active')
        this.refresh()
        return
      }

      for (let i = 0; i < this.items.length; i++) {
        let obj = this.items[i]
        for (let j = 0; j < this.activeList.length; j++) {
          this.setCheckedData(obj, 'active')
        }
      }
      this.refresh()
    }
  },
  methods: {
    addItem: function (items, obj, depth, parent) {
      obj.depth = depth
      obj.expanded = false
      let expandAll = this.expandDepth === 0 && obj.hasOwnProperty('children') && obj.children && obj.children.length > 0
      if (expandAll || depth < this.expandDepth) {
        obj.expanded = true
      }
      if (this.idField) { obj.id = obj[this.idField] }
      obj.key = Math.random()
      obj.visible = true
      // obj.checked = false
      this.setCheckedData(obj, 'checked')
      this.setCheckedData(obj, 'active')

      obj.parent = parent
      obj.labelValue = obj[this.labelField]
      obj.childAllCheck = false
      items.push(obj)
      if (obj.hasOwnProperty('children') && obj.children && obj.children.length > 0) {
        for (var i = 0; i < obj.children.length; i++) {
          this.addItem(items, obj.children[i], depth + 1, obj)
        }
      }
    },
    setCheckedData: function (item, field) {
      let value = field === 'checked' ? this.selectedList : this.activeList
      item[field] = false

      if (!value || value.length < 1) { return }

      for (let j = 0; j < value.length; j++) {
        if (value[j] && value[j].id === item.id) {
          item[field] = true
          if (field === 'active') {
            item.expanded = true
          }
          this.parentExpand(item)
        }
      }
    },
    parentExpand (item) {
      item.expanded = true
      this.expand(item)
      if (item.parent) {
        this.parentExpand(item.parent)
      }
    },
    getItem: function (value) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i][this.keyField] + '' === value + '') {
          return this.items[i]
        }
      }
      return null
    },
    hasChild: function (data) {
      return data && data.hasOwnProperty('children') && data.children && data.children.length > 0
    },
    treeFilter: function (item) {
      var returnValue = false
      if (item.parent) {
        returnValue = item.visible && this.isExpanded(item.parent)
      } else {
        returnValue = item.visible
      }
      if (this.filterFunction) {
        returnValue = returnValue && this.isFilteredData(item)
      }
      return returnValue
    },
    childVisibleChange (item, visible) {
      if (this.hasChild(item)) {
        let child = item.children
        for (var i = 0; i < child.length; i++) {
          child[i].visible = visible
          this.childVisibleChange(child[i], visible)
        }
      }
    },
    isFilteredData: function (item) {
      if (!item) { return false }
      if (this.hasChild(item)) {
        let children = item.children
        let returnVal = item.isFiltered
        for (var i = 0; i < children.length; i++) {
          let child = children[i]
          returnVal = returnVal || this.isFilteredData(child)
        }
        return returnVal
      }
      return item.isFiltered
    },
    expand: function (item) {
      this.childVisibleChange(item, item.expanded)
      this.refresh()
    },
    isExpanded: function (item) {
      if (item.parent) {
        return this.isExpanded(item.parent) && item.expanded
      } else {
        return true
      }
    },
    checkclick: function (item) {
      let idx = this.filteredItems.indexOf(item)
      let bool = item.checked
      for (let i = idx + 1; i < this.filteredItems.length; i++) {
        let obj = this.filteredItems[i]
        if (obj.depth <= item.depth) { break }
        obj.checked = bool
      }
      // 절반체크 확인
      for (let i = this.items.length - 1; i >= 0; i--) {
        let obj = this.items[i]
        if (!this.hasChild(obj)) {
          obj.halfChecked = false
          continue
        } else { // 자식이 있다
          this.setCheckType(obj)
        }
      }
      this.refresh()
    },
    clearCheck: function () {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i]
        item.checked = false
      }
    },
    itemClick: function (item) { // 아이템 클릭 이벤트 버블링
      item.expanded = true
      if (item.children && item.children.length > 0) { this.expand(item) }
      this.$emit('itemClick', item)
    },
    itemDblClick: function (item) { // 아이템 클릭 이벤트 버블링
      this.$emit('itemDblClick', item)
    },
    setCheckType: function (item) {
      let idx = this.items.indexOf(item)
      let isAllChecked = true
      let isAllUnChecked = true

      for (let i = idx + 1; i < this.items.length; i++) {
        let obj = this.items[i]
        if (obj.depth <= item.depth) { break }

        if (this.hasChild(obj)) { // 자식이 있는건 그룹이라 패스~
          continue
        }

        isAllChecked = isAllChecked && obj.checked
        isAllUnChecked = isAllUnChecked && !obj.checked
      }

      if (isAllChecked) {
        item.halfChecked = false
        item.checked = true
      } else if (isAllUnChecked) {
        item.halfChecked = false
        item.checked = false
      } else {
        item.halfChecked = true
        item.checked = false
      }
    },
    refresh: function () {
      if (this.filterFunction) { // 필터 내용이 있으면 확인
        var ar = []
        for (let i = 0; i < this.items.length; i++) {
          let item = this.items[i]
          item.isFiltered = false // 필터 되지 않은 내용
          if (this.hasChild(item)) { // 그룹은 신경쓰지 않는다.
            if (this.filterFunction(item)) {
              item.isFiltered = true
            }
            ar.push(item)
          } else {
            if (this.filterFunction(item)) {
              item.isFiltered = true // 필터링된 내용   필터링된 내용을가지고 있으면 해당 부모는 다 보여야 한다.
              ar.push(item)
            }
          }
        }
        this.filteredItems = ar
      } else {
        this.filteredItems = this.items
      }
      this.list = this.filteredItems.filter(this.treeFilter)
      if (this.list && this.list.length > 0) {
        this.list[0].key = Math.random()
      }

      let self = this
      if (this.$refs.virtualList) {
        setTimeout(function () {
          if (self.$refs.virtualList) {
            self.$refs.virtualList.forceRender()
          }
        }, 50)
      }
    },
    getCheckedData: function () {
      var ar = []
      for (let i = 0; i < this.items.length; i++) {
        let obj = this.items[i]
        if (this.hasChild(obj)) { // 자식이 있는건 그룹이라 패스~
          continue
        }
        if (obj.checked) { ar.push(obj) }
      }
      return ar
    },
    setCheck: function (ar, key) {
      for (let i = 0; i < this.items.length; i++) {
        let obj = this.items[i]

        if (this.hasChild(obj)) { // 자식이 있는건 그룹이라 패스~
          continue
        }
        for (let j = 0; j < ar.length; j++) {
          if (obj[key] === ar[j]) {
            obj.checked = true
            this.checkclick(obj)
            break
          }
        }
      }
      this.refresh()
    },
    setSource: function (sampleData) {
      // 계층 구조로 들어온 목록을 2차원으로 변형 하면서 필요한 프로퍼티를 입력  datas 는 하이라키 구조의 데이터
      let ar = []
      if (!sampleData) { sampleData = [] }
      for (let i = 0; i < sampleData.length; i++) {
        var obj = sampleData[i]
        this.addItem(ar, obj, 0, null)
      }
      this.items = ar
      this.refresh()
    },
    calculateHeight () {
      let parentHeight = this.$el.parentElement.offsetHeight
      if (parentHeight == null || parentHeight === 0) {
        parentHeight = 300
      }
      this.remain = parentHeight / this.size + 20
    }
  },
  created () {
    this.setSource(this.source)
  },
  mounted () {
    this.calculateHeight()
  },
  updated () {
    this.calculateHeight()
  }
}
</script>
