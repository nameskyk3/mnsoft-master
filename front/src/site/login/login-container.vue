<template>
    <div class="login-page">
      <div class="form">
        <router-view/>
      </div>
  </div>
</template>

<script>
export default {
  name: 'login-container',
  components: {
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
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
