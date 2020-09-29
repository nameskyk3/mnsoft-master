<template>
  <div>
    <select-box class="w220" :data="selectBoxList" :select-value="selectBoxValue" label-field="label" value-field="value" @change="selectBoxChange($event)"></select-box>
  </div>
</template>

<script>
import SelectBox from '../common/component/select-box'
export default {
  name: 'select-box-sample',
  components: {
    SelectBox
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
  },
  props: {
  },
  data () {
    return {
      selectBoxList: [{label: 'Aaaa', value: 'a'}, {label: 'Bbbb', value: 'b'}, {label: 'Cccc', value: 'c'}],
      selectBoxValue: 'b'
    }
  },
  computed: {
  },
  methods: {
    selectBoxChange ($event) {
      console.log($event)
    }
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
