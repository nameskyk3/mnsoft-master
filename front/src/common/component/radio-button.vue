<template>
  <div>
    <div class="radio" v-for="radioButton in radioButtonList" :key="radioButton.itemId">
      <input type="radio" :id="radioButton.itemId" name="radioButton.groupName" :value="radioButton.itemName" v-model="radioVmodel">
      <label for="radioButton.itemId" @click="checkRadio(radioButton)">{{radioButton.itemName}}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'radio-button',
  components: {
  },
  created () {
  },
  props: {
    radioButtonList: Array
  },
  data () {
    return {
      radioVmodel: ''
    }
  },
  computed: {
  },
  methods: {
    checkRadio (radio) {
      this.radioVmodel = radio.itemName
      this.$emit('checkRadio', radio)
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
