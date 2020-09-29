<template>
    <div style="width:100$; height:100%">
      <div>
        <div>Select Box</div>
        <select-box-sample></select-box-sample>
      </div>
      <div>
        <div>Tree</div>
        <tree-sample></tree-sample>
      </div>
      <div>
        <div>grid</div>
        <grid-sample></grid-sample>
      </div>
      <div>
        <div>sidePanel</div>
        <button @click="sidePaneShowClick">보기</button>
        <side-panel-sample v-if="isSidePanel" @close="sidePanelClose()"></side-panel-sample>
      </div>

    </div>
</template>

<script>
import axios from 'axios'
import SelectBoxSample from '../../sample/select-box-sample'
import TreeSample from '../../sample/tree-sample'
import GridSample from '../../sample/grid-sample'
import SidePanelSample from '../../sample/side-panel-sample'
export default {
  name: 'default-login',
  components: {SidePanelSample, GridSample, SelectBoxSample, TreeSample},
  data () {
    return {
      sidePanelShow: false
    }
  },
  computed: {
    isSidePanel () {
      return this.sidePanelShow
    }
  },
  methods: {
    sidePaneShowClick () {
      this.sidePanelShow = true
    },
    sidePanelClose () {
      this.sidePanelShow = false
    },
    test () {
      axios.get('test')
    }
  }
}
</script>

<style scoped>

</style>
