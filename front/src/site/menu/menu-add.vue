<template>
  <div style="width:650px; height:300px">
    <input type="text" v-model="data1">
    <input type="text" v-model="data2">
    <button @click="addMenu"></button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'menu-add',
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
      data1: '11',
      data2: ''
    }
  },
  computed: {
  },
  methods: {
    addMenu () {
      let param = {}
      param.field1 = this.data1
      param.field2 = this.data2
      let url = '/menu/add'
      return axios.post(url, param)
        .then(response => {
          console.log(response)
          alert('추가하시겠습니까?')
        })
    }
  },
  destroyed () {
    // 메모리 해지
  }
}
</script>
