<template>
  <div class="login-page">
    <div class="form">
      <menu-add></menu-add>why?
      <menu-list ref="menuListComponent"></menu-list>
    </div>
  </div>
</template>

<script>
import MenuAdd from './menu-add'
import MenuList from './menu-list'
export default {
  name: 'menu-manage',
  components: {
    MenuList,
    MenuAdd
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
