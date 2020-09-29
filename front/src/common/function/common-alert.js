import i18n from '@/resource/config/i18n'

export const tAlert = (modal, property) => {
  return new Promise((resolve, reject) => {
    if (!property.width) {
      property.width = '350'
    }

    modal.show({
      template: template[property.type],
      methods: {
        save (result) {
          resolve(result)
        },
        close () {
          resolve(0)
          this.$modal.hide(property.name)
        }
      },
      data () {
        return {
          content: property.content,
          btn: !property.select ? [{title: i18n.t('COMMON.CHECK')}, {title: i18n.t('COMMON.CANCEL')}] : property.select,
          result: 0
        }
      }
    }, null, {
      name: property.name,
      adaptive: true,
      draggable: true,
      classes: 'tooltip-layer w' + property.width,
      width: property.width + 'px',
      height: 'auto',
      clickToClose: (property.type === 'notify')
    })
  })
}

const template = {
  notify:
    `<div>
      <div class='tooltip-content'>
        <div class='fx-vh-center'>
          <p class='info-txt-c fn14' v-html='content'></p>
        </div>
      </div>
      <button type='button' class='btn-non i-closed ico-only' title='close' @click='close'></button>
    </div> `,
  confirm:
    `<div>
      <div class='tooltip-content'>
        <div class='fx-vh-center'>
          <p class='info-txt-c fn14' v-html='content'></p>
        </div>
        <div class='btn-area'>
        <button type="button" class='btn-cy' v-html='btn[0].title' @click='save(1)'></button>
        <button type="button" class='btn-gy' v-html='btn[1].title' @click='close'></button>
        </div>
      </div>
      <button type='button' class='btn-non i-closed ico-only' title='close' @click='close'></button>
    </div>`,
  select:
    `<div>
      <div class='tooltip-content'>
        <div class='fx-vh-center'>
          <p class='info-txt-c fn14' v-html='content'></p>
        </div>
        <div class='btn-area'>
        <button type="button" v-for='(item, index) in btn' v-bind:class='item.className' v-html='item.title' @click='save(index+1)'></button>
        </div>
      </div>
      <button type='button' class='btn-non i-closed ico-only' title='close' @click='close'></button>
    </div>`,
  radio: `
    <div>
      <div class='tooltip-content'>
        <div class='fx-vh-center'>
          <ul class='basic-list'>
            <li>
              <div class='radio'>
                <input type='radio' id='alarm1' name='alarm-sel' v-model="result" value="1"><label for='alarm1'>{{i18n.t('SETTING.ALARM.SELECT_ALARM_RACK_APPLY')}}</label>
              </div>
            </li>
              <li>
                <div class='radio'>
                  <input type='radio' id='alarm2' name='alarm-sel' v-model="result" value="2"><label for='alarm2'>{{i18n.t('SETTING.ALARM.ALL_SELECT_ALARM_RACK_APPLY')}}</label>
                </div>
              </li>
            </ul>
          </div>
          <div class='btn-area'>
            <button type='button' class='btn-cy' @click ='save(result)'>{{i18n.t('COMMON.CHECK')}}</button>
            <button type='button' class='btn-gy'  @click='close'>{{i18n.t('COMMON.CANCEL')}}</button>
          </div>
        </div>
        <button type='button' class='btn-non i-closed ico-only' title='close'  @click='close'></button>
      </div>`
}
