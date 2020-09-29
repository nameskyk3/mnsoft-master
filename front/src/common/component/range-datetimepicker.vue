<template>
  <div class="picker-box">
    <div class="datetime-picker">
      <input type="text" ref="dateStartInput" class="datetime" v-model="internalStartDate" >
      <button type="button" class="btn-gy i-date-clock ico"></button>
    </div>
    <span class="and">~</span>
    <div class="datetime-picker">
      <input type="text" ref="dateEndInput" class="datetime" v-model="internalEndDate" >
      <button type="button" class="btn-gy i-date-clock ico"></button>
    </div>
  </div>
</template>

<script>

let allowTimes = ['00:00']
for (let i = 1; i <= 23; i++) {
  if (i < 10) {
    allowTimes = allowTimes.concat('0' + i + ':00')
  } else {
    allowTimes = allowTimes.concat(i + ':00')
  }
}
/**
 * end date 분 59로 변경 (19-12-17 나상희선임 요청)
 */
let allowTimes2 = ['00:59']
for (let i = 1; i <= 23; i++) {
  if (i < 10) {
    allowTimes2 = allowTimes2.concat('0' + i + ':59')
  } else {
    allowTimes2 = allowTimes2.concat(i + ':59')
  }
}

export default {
  name: 'rangeDatetimepicker',
  components: {
  },
  created () {
  },
  mounted () {
    let self = this
    $.datetimepicker.setLocale('ko')
    if (this.isMaxDateLimit === true) {
      $(this.$refs.dateStartInput).datetimepicker({
        format: 'Y-m-d H:i',
        allowTimes: allowTimes,
        maxDateTime: this.internalEndDate,
        onChangeDateTime: function (dp, $input) {
          if ($input.val() > self.internalEndDate) {
            $input.val(self.prevStartDate)
          }
          $(self.$refs.dateEndInput).datetimepicker({
            'minDateTime': $input.val()
          })
          self.$emit('changeStartDate', $input.val())
          self.prevStartDate = $input.val()
        },
        onShow: function (dp, $input) {
          self.addTodayEventListener(dp, $input, self, this, 'Start')
        },
        onClose: function () {
          self.removeTodayEventListener(this)
        }
      })

      $(this.$refs.dateEndInput).datetimepicker({
        format: 'Y-m-d H:i',
        allowTimes: allowTimes2,
        minDateTime: this.internalStartDate,
        maxDateTime: moment().add(59, 'minutes').format('YYYY-MM-DD HH:mm'),
        onChangeDateTime: function (dp, $input) {
          if ($input.val() < self.internalStartDate) {
            $input.val(self.prevEndDate)
          }
          $(self.$refs.dateStartInput).datetimepicker({
            'maxDateTime': $input.val()
          })
          self.$emit('changeEndDate', $input.val())
          self.prevEndDate = $input.val()
        },
        onShow: function (dp, $input) {
          self.addTodayEventListener(dp, $input, self, this, 'End')
        },
        onClose: function () {
          self.removeTodayEventListener(this)
        }
      })
    } else {
      $(this.$refs.dateStartInput).datetimepicker({
        format: 'Y-m-d H:i',
        allowTimes: allowTimes,
        onChangeDateTime: function (dp, $input) {
          self.$emit('changeStartDate', $input.val())
        }
      })

      $(this.$refs.dateEndInput).datetimepicker({
        format: 'Y-m-d H:i',
        allowTimes: allowTimes,
        onChangeDateTime: function (dp, $input) {
          self.$emit('changeEndDate', $input.val())
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
      if (this.isMaxDateLimit === true) {
        $(this.$refs.dateEndInput).datetimepicker({
          'minDateTime': this.startDate
        })
      }
    },
    endDate () {
      this.internalEndDate = this.endDate
      if (this.isMaxDateLimit === true) {
        $(this.$refs.dateStartInput).datetimepicker({
          'maxDateTime': this.endDate
        })
      }
    },
    internalStartDate: function (data) {
      if (!this.prevStartDate) {
        this.prevStartDate = data
      }
      this.$emit('changeStartDate', data)
    },
    internalEndDate: function (data) {
      if (!this.prevEndDate) {
        this.prevEndDate = data
      }
      this.$emit('changeEndDate', data)
    }
  },
  data () {
    return {
      internalStartDate: this.startDate,
      internalEndDate: this.endDate,
      allowTimes: [],
      prevStartDate: null,
      prevEndDate: null
    }
  },
  computed: {
  },
  methods: {
    getHours (now) {
      let hour = now.getHours()
      if (now.getMinutes() < 59) {
        --hour
      }
      return hour
    },
    addTodayEventListener (dp, $input, self, picker, type) {
      let now = moment()
      $(self.$refs[`date${type}Input`]).datetimepicker('setOptions', { defaultDate: now.format('YYYY-MM-DD'), defaultTime: `${self.getHours(now.toDate())}:59` })
      let todayBtn = picker.find('div.xdsoft_datepicker.active').find('div.xdsoft_monthpicker').find('button.xdsoft_today_button')
      todayBtn.on('click', function (e) {
        let n = moment()
        let h = self.getHours(n.toDate())
        self[`internal${type}Date`] = n.format(`YYYY-MM-DD ${h}:59`)
        $(self.$refs[`date${type}Input`]).datetimepicker('setOptions', { defaultTime: `${h}:59` })
        self.$emit(`change${type}Date`, $input.val())
      })
    },
    removeTodayEventListener (picker) {
      let todayBtn = picker.find('div.xdsoft_datepicker.active').find('div.xdsoft_monthpicker').find('button.xdsoft_today_button')
      todayBtn.off('click')
    }
  },
  destroyed () {
    // 등록된 이벤트 해지
    // 메모리 해지
  }
}
</script>

<style scoped>

</style>
