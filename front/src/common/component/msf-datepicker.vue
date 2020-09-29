<template>
  <div class="date-picker">
    <input ref="dateInput" type="text" class="date" v-model="date">
    <button type="button" class="btn-gy i-calendar ico"></button>
  </div>
</template>

<script>
export default {
  name: 'msfDatepicker',
  components: {
  },
  props: {
    value: String
  },
  data () {
    return {
      date: this.value
    }
  },
  watch: {
    value: function (val) {
      this.date = val
    }
  },
  methods: {
  },
  created () {
  },
  mounted () {
    let self = this
    $.datetimepicker.setLocale('ko')
    $(this.$refs.dateInput).datetimepicker({
      format: 'Y-m-d',
      closeOnDateSelect: true,
      timepicker: false,
      onChangeDateTime: function (dp, $input) {
        self.$emit('change', $input.val())
      }
    })
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>
