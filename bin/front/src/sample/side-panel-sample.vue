<template>
  <overlay-popup @close="closePopup()">
    <div class="dialog-wrap w1000" style="">
      <div class="dialog-header">
        <h3 class="title">팝업타이틀</h3>
        <div class="inner-right">
          <button type="button" class="btn-non i-closed ico-only" :title="$t('COMMON.CLOSE')" @click="closePopup">X</button>
        </div>
      </div>
      <div class="dialog-body">
        내용
      </div>
    </div>
  </overlay-popup>
</template>

<script>
import OverlayPopup from '../common/component/overlay/overlay-popup'
export default {
  name: 'side-panel-sample',
  components: {
    OverlayPopup
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
  },
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    closePopup () {
      this.$emit('close')
    }
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
