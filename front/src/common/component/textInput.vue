<template>
    <input type="text" @input="inputChange" @change="event('change', $event)" @keyup="event('keyup', $event)">
</template>

<script>
import VueIpInput from 'vue-ip-input'
export default {
  components: {
    'vue-ip-input': VueIpInput
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
  },
  props: {
  },
  data () {
    return {
      ip: '127.0.0.1'
    }
  },
  computed: {
  },
  methods: {
    event (type, $event) {
      this.$emit(type, $event)
    },
    inputChange ({type, target}) {
      // 입력을 제한 할 특수문자의 정규식
      var replaceId = /[!@#$%^&*()]/gi
      var x = target.value
      if (x.length > 0) {
        if (x.match(replaceId)) {
          x = x.replace(replaceId, '')
        }
        target.value = x
      }
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
