<template>
  <div class="tabs-area">
    <div class="inner-tabs">
      <button type="button" class="btn-prev i-angle-left ico" :disabled="leftTabMoveButtonDisable" @click="moveTabMenu(selectedTabIndex - 1)"></button>
      <ul class="tabs-menu">
        <li v-for="(item, index) in tabMenuList" :key="item.name" @click="onChangeTab(index)"
            :class="item.visible ? 'on':''">
          <a href="javascript:">{{ item.resourceTypeName }} ({{ item.count }})</a>
        </li>
      </ul>
      <button type="button" class="btn-next i-angle-right ico" :disabled="rightTabMoveButtonDisable"  @click="moveTabMenu(selectedTabIndex + 1)"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab-component',
  props: {
    data: Array,
    selectedIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      selectedTabIndex: 0,
      tabMenuList: []
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this.tabMenuList = val
      }
    },
    selectedIndex (val) {
      this.selectedTabIndex = val
      // this.onChangeTab(val)
    }
  },
  computed: {
    leftTabMoveButtonDisable () {
      return this.selectedTabIndex <= 0
    },
    rightTabMoveButtonDisable () {
      return this.selectedTabIndex >= this.tabMenuList.length - 1
    }
  },
  methods: {
    moveTabMenu (idx) {
      if (idx < 1) {
        idx = 0
      } else if (idx >= this.tabMenuList.length) {
        idx = this.tabMenuList.length - 1
      }
      this.onChangeTab(idx)
    },
    onChangeTab (index) {
      this.selectedTabIndex = index
      this.$emit('change', {
        index: this.selectedTabIndex,
        item: this.tabMenuList[this.selectedTabIndex]
      })
    }
  },
  beforeRouteLeave () {
    // 등록된 이벤트 해지
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
