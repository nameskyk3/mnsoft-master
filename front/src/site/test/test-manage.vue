<template>
  <div class="login-page">
    <div class="form">
      <test-add></test-add>
      <test-list ref="testListComponent"></test-list>
    </div>
  </div>
</template>

<script>
import TestAdd from './test-add'
import TestList from './test-list'
export default {
  name: 'test-manage',
  components: {
    TestList,
    TestAdd
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
