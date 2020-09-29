import Vue from 'vue'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import messages from '@/common/component/messages-handler'

// 다국어 설정
Vue.use(VueI18n)
let locale = !constants.LOCALE ? 'ko' : constants.LOCALE
const i18n = new VueI18n({
  locale: locale,
  messages
})
moment.locale(locale)

export default i18n
