<template>
  <div class="group-box">
    <div class="input-group">
      <input type="text" ref="searchInput" class="input-srh w200" :value="searchText" @keyup="searchTextChange($event)" @keyup.enter="startSearch" :placeholder="placeholder">
      <div class="inner-icon"><button type="button" class="btn-non-sm i-del ico-only" @click="removeSearchText" ></button></div>
    </div>
    <button type="button" class="btn-bl i-search ico" @click="startSearch"></button>
  </div>
</template>

<script>
export default {
  name: 'search-box',
  components: {
  },
  created () {
    // 이벤트 등록
    // 초기화 코드 실행
    this.searchText = ''
  },
  props: {
    value: String,
    placeholder: String
  },
  data () {
    return {
      searchText: ''
    }
  },
  watch: {
    value (value) {
      this.searchText = value
    }
  },
  computed: {
  },
  methods: {
    searchTextChange (event) {
      this.$emit('change', event.target.value)
    },
    removeSearchText () {
      this.$refs.searchInput.value = ''
      this.$emit('change', '')
    },
    startSearch () {
      this.$emit('search')
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
