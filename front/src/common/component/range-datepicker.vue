<template>
  <div class="picker-box">
    <div class="date-picker">
      <input type="text" ref="dateStartInput" class="date" v-model="internalStartDate" >
      <button type="button" class="btn-gy i-calendar ico"></button>
    </div>
    <span class="and">~</span>
    <div class="date-picker">
      <input type="text" ref="dateEndInput"  class="date" v-model="internalEndDate">
      <button type="button" class="btn-gy i-calendar ico"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rangeDatepicker',
  components: {
  },
  created () {
  },
  mounted () {
    let self = this

    $.datetimepicker.setLocale('ko')
    $(this.$refs.dateStartInput).datetimepicker({
      format: 'Y-m-d',
      timepicker: false,
      maxDate: this.internalEndDate,
      onChangeDateTime: function (dp, $input) {
        if ($input.val() > self.internalEndDate) {
          $input.val(self.prevStartDate)
        }
        $(self.$refs.dateEndInput).datetimepicker({
          'minDate': $input.val()
        })
        self.$emit('changeStartDate', $input.val())
        self.prevStartDate = $input.val()
      }
    })

    if (this.isMaxDateLimit === true) {
      $(this.$refs.dateEndInput).datetimepicker({
        format: 'Y-m-d',
        timepicker: false,
        minDate: this.internalStartDate,
        maxDate: moment().format('YYYY-MM-DD'),
        onChangeDateTime: function (dp, $input) {
          if ($input.val() < self.internalStartDate) {
            $input.val(self.prevEndDate)
          }
          $(self.$refs.dateStartInput).datetimepicker({
            'maxDate': $input.val()
          })
          self.$emit('changeEndDate', $input.val())
          self.prevEndDate = $input.val()
        }
      })
    } else {
      $(this.$refs.dateEndInput).datetimepicker({
        format: 'Y-m-d',
        timepicker: false,
        minDate: this.internalStartDate,
        onChangeDateTime: function (dp, $input) {
          if ($input.val() < self.internalStartDate) {
            $input.val(self.prevEndDate)
          }
          $(self.$refs.dateStartInput).datetimepicker({
            'maxDate': $input.val()
          })
          self.$emit('changeEndDate', $input.val())
          self.prevEndDate = $input.val()
        }
      })
    }
  },
  props: {
    startDate: String,
    endDate: String,
    isMaxDateLimit: {default: true, type: Boolean}
  },
  watch: {
    startDate () {
      this.internalStartDate = this.startDate
      $(this.$refs.dateEndInput).datetimepicker({
        'minDate': this.startDate
      })
    },
    endDate () {
      this.internalEndDate = this.endDate
      $(this.$refs.dateStartInput).datetimepicker({
        'maxDate': this.endDate
      })
    },
    internalStartDate: function (data) {
      this.$emit('changeStartDate', data)
      $(this.$refs.dateEndInput).datetimepicker({
        'minDate': data
      })
    },
    internalEndDate: function (data) {
      this.$emit('changeEndDate', data)
      $(this.$refs.dateStartInput).datetimepicker({
        'maxDate': data
      })
    }
  },
  data () {
    return {
      internalStartDate: this.startDate,
      internalEndDate: this.endDate,
      prevStartDate: this.startDate,
      prevEndDate: this.endDate
    }
  },
  computed: {
  },
  methods: {
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>

<style scoped>

</style>
