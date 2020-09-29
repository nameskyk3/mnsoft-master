import i18n from '@/resource/config/i18n'

export const removeArrayData = (array, field, value) => {
  let idx = findIndex(array, field, value)
  if (idx > -1) {
    array.splice(idx, 1)
  }
  return array
}
export const uniqueCheck = (array, field) => {
  let ar = []
  for (let i = 0; i < array.length; i++) {
    let idx = findIndex(ar, field, array[i][field])
    if (idx < 0) {
      ar.push(array[i])
    }
  }
  return ar
}
export const findIndex = (array, field, value) => {
  let idx = -1
  for (let i = 0; i < array.length; i++) {
    if (array[i][field] + '' === value + '') {
      idx = i
      break
    }
  }
  return idx
}

export const equalArray = (list1, list2, field) => {
  if (list1.length !== list2.length) { return false }
  let l1 = JSON.copy(list1)
  let l2 = JSON.copy(list2)

  l1 = _.sortBy(l1, field)
  l2 = _.sortBy(l2, field)
  for (let i = 0; i < l1.length; i++) {
    if (l1[i].resourceId + '' !== l2[i].resourceId + '') {
      return false
    }
  }
  return true
}

/* 중복 데이터 확인후 추가 */
export const addDuplicateData = (array, field, value) => {
  if (!array) array = []
  let isData = false
  for (let i = 0; i < array.length; i++) {
    if (array[i][field] + '' === value[field] + '') {
      isData = true
      break
    }
  }
  if (!isData) { array.push(value) }
}

/**
 * 문자열이 trim 후 빈값인지 확인
 * @param value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) {
    return true
  }

  if (_.isArray(value)) {
    return value == null || value.length > 0
  } else if (_.isString(value)) {
    let trimValue = value.replace(/(\s)+|(\t)+/gi, '')
    if (trimValue == null || trimValue === '') {
      return true
    }
  }
  return false
}

/**
 * 그룹 판별하는 함수
 * @param checkObj
 * @param physicalFlag
 * @returns {string}
 */
export const isGroup = (type) => {
  if (type == null) {
    return null
  }

  switch (type + '') {
    // case 'enclosure':
    // case 'unspecified':
    case 'inventory':case '0':
    case 'datacenter':case '1':
    case 'floor':case '2':
    case 'room':case '3':
    case 'rack':case '4':
    case 'encloser':case '10': // 인클로져
    case 'group':
    case 'layer':
      return 'group'
  }
  return 'device'
}

export const isSearchTypeDevice = (searchType, type) => {
  if (type == null) {
    return false
  }
  // [5, 6, 7, 8, 11, 16]
  if (searchType === 'collector-snmp') {
    switch (type + '') {
      case '7':case '8':
        return true
    }
  } else if (searchType === 'collector') {
    switch (type + '') {
      case '5':case '6': case '11':case '16':
        return true
    }
  } else {
    switch (type + '') {
      case '5':case '6': case '7':case '8':case '11':case '16':
        return true
    }
  }

  return false
}

/**
 * 그룹 판별하는 함수(Inventory)
 * @param checkObj
 * @param physicalFlag
 * @returns {string}
 */
export const isInfraType = (type) => {
  if (type == null) {
    return null
  }

  switch (type + '') {
    // case 'enclosure':
    // case 'unspecified':
    case 'inventory':case '0':
    case 'datacenter':case '1':
    case 'floor':case '2':
    case 'group':
    case 'layer':
      return 'group'
    case 'room':case '3':
    case 'rack' :case '4':
    case 'enclosure' :case '14':
      return 'facility'
  }
  return 'device'
}

/**
 *
 * 하드웨어 인지 판별하는 함수(Inventory)
 * @param type
 * @param roomFlag
 * @returns {*}
 */
export const isHardware = (type, roomFlag) => {
  switch (type) {
    case 0:
    case constants.RESOURCE_TYPE_DATACENTER:
    case constants.RESOURCE_TYPE_FLOOR:
    case constants.RESOURCE_TYPE_RACK:
    case constants.RESOURCE_TYPE_VM:
    case constants.RESOURCE_TYPE_UPS:
    case constants.RESOURCE_TYPE_PDU:
    case constants.RESOURCE_TYPE_CA:
    case constants.RESOURCE_TYPE_ETC:
      return false
  }

  if (roomFlag != null && type === constants.RESOURCE_TYPE_ROOM) {
    return roomFlag
  }

  return true
}

export const isFacility = (type) => {
  switch (type) {
    case constants.RESOURCE_TYPE_RACK:
    case constants.RESOURCE_TYPE_UPS:
    case constants.RESOURCE_TYPE_PDU:
    case constants.RESOURCE_TYPE_CA:
    case constants.RESOURCE_TYPE_ETC:
      return true
  }

  return false
}

/**
 * Tree 데이터 Flattening
 * @param tree
 * @param key
 * @param collection
 */
export const flattingTreeSource = (tree, key, collection, idKey) => {
  if (idKey == null) {
    idKey = 'resourceId'
  }
  if (!tree || !tree[key] || tree[key].length === 0) { return }
  for (let i = 0; i < tree[key].length; i++) {
    let child = tree[key][i]
    collection[child[idKey]] = child
    flattingTreeSource(child, key, collection, idKey)
  }
}

/**
 * 객체 복사 (참조값 제거)
 * @param obj
 * @returns {*}
 */
export const cloneObject = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch (e) {
    return null
  }
}

export const todayDate = () => {
  let now = new Date()
  let strDate = [[AddZero(now.getFullYear()),
    AddZero(now.getMonth() + 1),
    AddZero(now.getDate())].join('-')].join(' ')
  return strDate
}

function AddZero (num) {
  return (num >= 0 && num < 10) ? '0' + num : num + ''
}

export const getChildGroupList = (childGroupList, treeSource, groupId) => {
  if (groupId == null) {
    return
  }

  if (treeSource && treeSource[0]) {
    let children = treeSource[0].children

    if (children && children.length > 0) {
      if (!children.lastGroup) {
        let idx = _.findIndex(children, {id: groupId + ''})
        if (idx > -1) {
          // 1depth 에 있는 경우
          if (children[idx].children && children[idx].children.length > 0) {
            childGroupList = addChildGroupList(children[idx].children, childGroupList)
          }
        } else {
          for (let i = 0; i < children.length; i++) {
            if (children[i].children && children[i].children.length > 0) {
              for (let j = 0; j < children[i].children.length; j++) {
                if (children[i].children[j].groupId && children[i].children[j].id === groupId + '') {
                  if (children[i].children[j].children && children[i].children[j].children.length > 0) {
                    childGroupList = addChildGroupList(children[i].children[j].children, childGroupList)
                  }
                } else {
                  if (children[i].children[j].children && children[i].children[j].children.length > 0) {
                    for (let k = 0; k < children[i].children[j].children.length; k++) {
                      if (children[i].children[j].children[k].groupId && children[i].children[j].children[k].id === groupId + '') {
                        if (children[i].children[j].children[k].children && children[i].children[j].children[k].children.length > 0) {
                          childGroupList = addChildGroupList(children[i].children[j].children[k].children, childGroupList)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return childGroupList
}

export const addChildGroupList = (children, childGroupList) => {
  for (let i = 0; i < children.length; i++) {
    if (children[i] && children[i].resourceTypeId === 0) {
      childGroupList = childGroupList.concat(children[i])

      if (children[i].children && children[i].children.length > 0) {
        for (let j = 0; j < children[i].children.length; j++) {
          if (children[i].children[j] && children[i].children[j].groupId) {
            childGroupList = childGroupList.concat(children[i].children[j])
          }
          if (children[i].children[j].children && children[i].children[j].children.length > 0) {
            addChildGroupList(children[i].children[j].children, childGroupList)
          }
        }
      }
    }
  }
  return childGroupList
}

export const resize = () => {
  let $win = $(window)
  let $body = $('body')
  let $wrapper = $('.wrapper')
  if ($win.width() < 1600) {
    $body.addClass('slim-view')
    $wrapper.addClass('slim-type')
  } else {
    $body.removeClass('slim-view')
    $wrapper.removeClass('slim-type')
  }
}

export const getCycleValue = (type) => {
  switch (type) {
    case 's': return 1
    case 'm': return 2
    case 'h': return 3
    case 'd': return 4
    case 'w': return 5
    case 'M': return 6
    case 'y': return 7
    default: return 0
  }
}

export const getCycleFullName = (type) => {
  switch (type) {
    case 's': return 'second'
    case 'm': return 'minute'
    case 'h': return 'hour'
    case 'd': return 'day'
    case 'w': return 'week'
    case 'M': return 'month'
    case 'y': return 'year'
    default: return ''
  }
}

export const getAggregationKr = (type) => {
  switch (type) {
    case 'mean': return i18n.t('COMMON.AGGR.AVG')
    case 'min': return i18n.t('COMMON.AGGR.MIN')
    case 'max': return i18n.t('COMMON.AGGR.MAX')
    case 'sum': return i18n.t('COMMON.AGGR.SUM')
    default: return ''
  }
}

export const formatUnits = (value, unit, unitList) => {
  let isNullValue = value === null

  if (value === null) {
    value = 0
  }
  //   return {
  //     value: value,
  //     unit: unit
  //   }
  // }

  if (unit === 'bytes' || unit === 'Kbytes' || unit === 'Mbytes' || unit === 'Gbytes') {
    let K = 1024
    if (unit === 'Kbytes') {
      value = value * K
      unit = 'bytes'
    } else if (unit === 'Mbytes') {
      value = value * K * K
      unit = 'bytes'
    } else if (unit === 'Gbytes') {
      value = value * K * K * K
      unit = 'bytes'
    }

    let unitData = hasCompareUnit(unit, unitList, value)
    if (unitData) {
      unit = unitData.unit
      value = unitData.value
    } else {
      if (value >= (K * K * K * K)) {
        value = value / (K * K * K * K)
        unit = 'TB'
      } else if (value >= (K * K * K)) {
        value = value / (K * K * K)
        unit = 'GB'
      } else if (value >= (K * K)) {
        value = value / (K * K)
        unit = 'MB'
      } else if (value >= K) {
        value = value / K
        unit = 'KB'
      }
    }
  } else if (unit === 'count') {
    let K = 1000
    let M = K * K
    let G = K * K * K
    let unitData = hasCompareUnit(unit, unitList, value)
    if (unitData) {
      unit = unitData.unit
      value = unitData.value
    } else {
      if (value >= G) {
        value = value / G
        unit = 'G count'
      } else if (value >= M) {
        value = value / M
        unit = 'M count'
      } else if (value >= K) {
        value = value / K
        unit = 'K count'
      }
    }
  } else if (unit === 'bytes/sec' || unit === 'Kbytes/sec' || unit === 'Mbytes/sec' || unit === 'Gbytes/sec') {
    let unitData = hasCompareUnit(unit, unitList, value)
    if (unitData) {
      unit = unitData.unit
      value = unitData.value
    } else {
      let K = 1024
      let M = K * K
      let G = K * K * K
      if (value >= G) {
        value = value / G
        unit = 'Gbytes/sec'
      } else if (value >= M) {
        value = value / M
        unit = 'Mbytes/sec'
      } else if (value >= K) {
        value = value / K
        unit = 'Kbytes/sec'
      }
    }
  }

  value = Math.round(value * 1e2) / 1e2

  return {
    value: isNullValue ? null : value,
    unit: unit
  }
}

export const getExcelFileName = (state, prefix) => {
  let userId = state.app.userInfo.loginId
  let curTime = moment().format('YYYYMMDDHHmmss')
  let fileName = prefix + '-' + userId + '-' + curTime + '.xls'
  return fileName
}

export const hasCompareUnit = (unit, unitList, value) => {
  if (!unitList || unitList.length < 1) { return null }

  let K = 1024
  let M = K * K
  let G = K * K * K
  let T = K * K * K * K
  if (unit === 'bytes/sec') {
    for (let i = 0; i < unitList.length; i++) {
      if (unitList[i] === 'bytes/sec') return { unit: unitList[i], value: value }
      if (unitList[i] === 'Kbytes/sec') return { unit: unitList[i], value: value / K }
      if (unitList[i] === 'Mbytes/sec') return { unit: unitList[i], value: value / M }
      if (unitList[i] === 'Gbytes/sec') return { unit: unitList[i], value: value / G }
    }
  }

  if (unit === 'count') {
    let K = 1000
    let M = K * K
    let G = K * K * K
    for (let i = 0; i < unitList.length; i++) {
      if (unitList[i] === 'count') return {unit: unitList[i], value: value}
      if (unitList[i] === 'K count') return {unit: unitList[i], value: value / K}
      if (unitList[i] === 'M count') return {unit: unitList[i], value: value / M}
      if (unitList[i] === 'G count') return {unit: unitList[i], value: value / G}
    }
  }

  if (unit === 'bytes') {
    for (let i = 0; i < unitList.length; i++) {
      if (unitList[i] === 'bytes') return {unit: unitList[i], value: value}
      if (unitList[i] === 'KB') return {unit: unitList[i], value: value / K}
      if (unitList[i] === 'MB') return {unit: unitList[i], value: value / M}
      if (unitList[i] === 'GB') return {unit: unitList[i], value: value / G}
      if (unitList[i] === 'TB') return {unit: unitList[i], value: value / T}
    }
  }

  return null
}

export const getChartWH = (panels, panel, label = false) => {
  let w = $('#panelBox').width() - 75
  let h = $('#panelBox').height() - 30 // 30 은 위아래 패딩값
  let panelLength = panels.length
  let panelIndex = _.indexOf(panels, panel)

  let c = {width: w, height: h}
  // 넓이 조절
  if (panelLength % 2 === 0) { // 짝수일때 넓이는 죄다 50%
    c.width = panelLength === 2 ? w : w / 2
  } else { // 홀수일때는 마지막껏만 100%
    if (panelIndex === panelLength - 1) {
      c.width = w
    } else {
      c.width = w / 2
    }
  }

  if (panelLength > 4) {
    c.height = (h - 90) / 3
  } else if (panelLength > 1) {
    c.height = (h - 60) / 2
  } else if (panelLength === 1) {
    c.height = c.height - 30 // 하나일때는 헤더만큼 더 더함
  }

  if (c.height < 200) { // 기본 최소 차트 패널 높이가 260임 패딩 border 제거하면 200 픽셀나옴
    c.height = 200
  }

  // 옆에놈이나 내가 로그랑 로그 클러스터일경우 내 높이가 300 보다 작다면 300 으로 고정
  let sidePanel = null
  if (panelIndex % 2 === 1) {
    sidePanel = panels[panelIndex - 1]
  } else {
    sidePanel = panelIndex !== panelLength - 1 ? panels[panelIndex + 1] : null
  }

  if (sidePanel) {
    if (panel.panelType === 'METRIC' || panel.panelType === 'DT_METRIC' || (panel.panelType === 'LOG' && panel.conditions.type === 'TEXT')) { // 내가 메트릭계열인데 옆놈이 로그 클러스터링이면
      if (sidePanel.panelType === 'LOG' || sidePanel.panelType === 'LOG_CLUSTERING') {
        // c.height = 300
        if (sidePanel && sidePanel.conditions && (sidePanel.conditions.type.indexOf('TEXT-COUNT') > -1 || sidePanel.conditions.type === 'CLUSTERING') && panelLength > 2) {
          if (c.height < 700) {
            c.panelHeight = 700
            c.height = 700
          }
        } else {
          c.panelHeight = c.height // 패널 사이즈 넣기 위해
        }
      }
    }
  }
  c.panelHeight = c.height // 패널 사이즈 넣기 위해
  if (panel.panelType === 'METRIC' && label) {
    c.height = c.height * 0.6
  } else if (panel.panelType === 'LOG' || panel.panelType === 'LOG_CLUSTERING') {
    // c.height = 300
    if (panel && panel.conditions && (panel.conditions.type.indexOf('TEXT-COUNT') > -1 || panel.conditions.type === 'CLUSTERING')) {
      if (c.height < 700) {
        c.panelHeight = 700
      }
    } else {
      c.panelHeight = c.height // 패널 사이즈 넣기 위해
    }
  }

  return c
}
export const formatValue = (value, unit) => {
  if (value === null) {
    return {
      value: value,
      unit: unit
    }
  }
  if (unit === 'TB' || unit === 'GB' || unit === 'MB' || unit === 'KB' || unit === 'B') {
    let K = 1024
    if (unit === 'TB') {
      value = value / (K * K * K * K)
    } else if (unit === 'GB') {
      value = value / (K * K * K)
    } else if (unit === 'MB') {
      value = value / (K * K)
    } else if (unit === 'KB') {
      value = value / K
    }
  } else if (unit === 'G count' || unit === 'M count' || unit === 'K count' || unit === 'count') {
    let K = 1000
    let M = K * K
    let G = K * K * K
    if (unit === 'G count') {
      value = value / G
    } else if (unit === 'M count') {
      value = value / M
    } else if (unit === 'K count') {
      value = value / K
    }
  } else if (unit === 'Gbytes/sec' || unit === 'Mbytes/sec' || unit === 'Kbytes/sec' || unit === 'bytes/sec') {
    let K = 1024
    let M = K * K
    let G = K * K * K
    if (unit === 'Gbytes/sec') {
      value = value / G
    } else if (unit === 'Mbytes/sec') {
      value = value / M
    } else if (unit === 'Kbytes/sec') {
      value = value / K
    }
  }

  value = Math.round(value * 1e2) / 1e2
  return {
    value: value,
    unit: unit
  }
}

export const getRuleCondition = (condition) => {
  switch (condition) { // 서버랑 코드체계가 달라서 고정
    case 'gt':
      return i18n.t('POPUP.RESOURCE.UP')
    case 'ge':
      return i18n.t('POPUP.RESOURCE.SAMEUP')
    case 'eq':
      return i18n.t('POPUP.RESOURCE.SAME')
    case 'le':
      return i18n.t('POPUP.RESOURCE.SAMEDOWN')
    case 'lt':
      return i18n.t('POPUP.RESOURCE.DOWN')
  }
  return ''
}

export const numberWithCommas = (x) => {
  if (!x || x === '') {
    return ''
  }
  x = x + ''

  if (!x) {
    return 0
  } else {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

// 상위 메뉴가 있으면 상위메뉴도 같이 쓰기, 보기 권한부여
export const changeParentAuth = (menuId, parentMenuIds) => {
  if (menuId >= 0) {
    let result = menuId + ''

    if (result.substr(result.length - 1, 1) === '0') {
      result = menuId / 10 + '' // 411, 410
      // 3depth
      if (result.substr(result.length - 1, 1) === '0') { // 411
        result = Number(result.substr(0, 1) + '000')
        parentMenuIds.push(Number(result))
      } else {
        // 2depth
        // 410
        result = Math.floor(Number(result) / 10) + '' // 41
        if (result.substr(result.length - 2, 1) !== '0') {
          parentMenuIds.push(Number(result + '00')) // 4100
          changeParentAuth(Number(result + '00'), parentMenuIds)
        }
      }
    } else {
      // 410
      result = Math.floor(Number(result) / 10) + '' // 422
      if (result.substr(result.length - 2, 1) !== '0') {
        parentMenuIds.push(Number(result + '0')) // 4220
        changeParentAuth(Number(result + '0'), parentMenuIds)
      }
    }
  }
  return parentMenuIds
}

// 하위 메뉴가 있으면 하위메뉴도 같이 쓰기, 보기 권한제거
export const changeChildAuth = (menuId, childMenuIds, menus) => {
  if (menuId >= 0) {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].menuId === menuId) {
        // console.log(menus[i])
        if (menus[i].children) {
          let menuIds = _.pluck(menus[i].children, 'menuId')
          childMenuIds = _.uniq(childMenuIds.concat(menuIds))
          childMenuIds = changeChildFind(childMenuIds, menus[i].children)
        }
      }
    }
  }
  return childMenuIds
}

// 모든 하위 menuId 찾기
export const changeChildFind = (childMenuIds, menus) => {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].children) {
      let menuIds = _.pluck(menus[i].children, 'menuId')
      if (menuIds) {
        childMenuIds = _.uniq(childMenuIds.concat(menuIds))
      }
      for (let j = 0; j < menus[i].children.length; j++) {
        if (menus[i].children[j]) {
          changeChildFind(childMenuIds, menus[i].children[j])
        }
      }
    }
  }
  return childMenuIds
}

// 사용자 메뉴별 권한 부여
export const setChildMenu = (menu, arr, uiAuthData) => {
  if (menu == null || menu.meta == null) {
    return
  }

  if (menu.menuTreeData == null || menu.menuTreeData.length < 1) {
    menu.menuTreeData = []
  }

  let exist = 0
  if (menu.menuTreeData != null && menu.menuTreeData.length > 0) {
    for (let i = 0; i < menu.menuTreeData.length; i++) {
      if (menu.menuTreeData[i] === menu.meta.displayName) {
        exist++
      }
    }

    if (exist === 0) {
      menu.menuTreeData.push(menu.meta.displayName)
    } else if (exist === 1) {
      // 중복에 대한 예외 처리
      menu.menuTreeData = _.uniq(menu.menuTreeData)
      if (menu.meta.displayName === i18n.t('SETTING.ALARM.TITLE') || menu.meta.displayName === i18n.t('SETTING.USER.USER.LABLE')) {
        menu.menuTreeData.push(menu.meta.displayName)
      }
    }
  } else {
    menu.menuTreeData.push(menu.meta.displayName)
  }

  if (uiAuthData && uiAuthData.length > 0) {
    for (let i = 0; i < uiAuthData.length; i++) {
      if (uiAuthData[i].menuId === menu.menuId) {
        if (uiAuthData[i].readAuth === 1) {
          menu.read = true
        } else {
          menu.read = false
        }

        if (uiAuthData[i].writeAuth === 1) {
          menu.write = true
        } else { menu.write = false }
      }
    }
  } else {
    menu.read = false
    menu.write = false
  }

  // 디폴트 메뉴 처리
  if (constants.DEFAULT_READ_MENU === menu.menuId) {
    menu.read = true
  }

  arr.push(menu)

  if (menu.children != null && menu.children.length > 0) {
    let children = menu.children
    for (let i = 0; i < children.length; i++) {
      children[i].menuTreeData = cloneObject(menu.menuTreeData)
      setChildMenu(children[i], arr, uiAuthData)
    }
  }
}

// Tree 펼치기
export const treeSourceFlattening = (tree, key, collection) => {
  if (!tree[key] || tree[key].length === 0) { return }
  for (let i = 0; i < tree[key].length; i++) {
    let child = tree[key][i]
    collection[child.id] = child
    treeSourceFlattening(child, key, collection)
  }
}

// 사용자 그룹 Path 정보에서 최상위 첫번째 그룹인 TIDC > 를 보여주지 않는다.
export const getUserGroupNamePath = (groupNamePath) => {
  if (!groupNamePath) {
    return ''
  }
  let idx = groupNamePath.indexOf('>')
  if (idx > -1) {
    groupNamePath = groupNamePath.substring(idx + 1, groupNamePath.length)
  }

  return groupNamePath
}

/**
 * Aggregation 타입 리턴
 */
// export const getAggregationTypeList = () => {
//   return [
//     // {name: i18n.t('COMMON.TIME.SEC'), value: 's'},
//     {'name': i18n.t('COMMON.TIME.MIN'), 'value': 'm'},
//     {'name': i18n.t('COMMON.TIME.HOUR'), 'value': 'h'},
//     {'name': i18n.t('COMMON.TIME.DAY'), 'value': 'd'},
//     {'name': i18n.t('COMMON.TIME.WEEK'), 'value': 'w'},
//     {'name': i18n.t('COMMON.TIME.MONTH'), 'value': 'M'}
//   ]
// }
export const getGranularityValue = (from, to, panels, resourceCount = 0, metricCount = 0) => {
  let panelCount = panels.length

  for (let i = 0; i < panelCount; i++) {
    let panel = panels[i]
    let config = panel.conditions
    let resourceIds = _.pluck(config.resources, 'resourceId')
    if (panel.panelType === 'METRIC') {
      let searchQueryObject = config.searchQueryObject
      for (let j = 0; j < searchQueryObject.length; j++) {
        let cnt = searchQueryObject[j].aggregation.length // 매트릭 어그리게이션의 갯수
        if (searchQueryObject[j].compareType) { cnt = cnt * 2 } // 전주데이터를 볼경우 2배
        metricCount += cnt
      }

      resourceCount += resourceIds.length
    } else if (panel.panelType === 'LOG_CLUSTERING') {
      let resourceIds = _.pluck(config.resources, 'resourceId')
      resourceCount += resourceIds.length
    } else if (panel.panelType === 'LOG') {
      if (config.type.indexOf('TEXT-COUNT') > -1) { // 차트가 들어감
        metricCount += config.textSearchQuery.length
        let resourceIds = _.pluck(config.resources, 'resourceId')
        resourceCount += resourceIds.length
      }
    }
  }

  if (!panelCount && resourceCount + metricCount) { // 새로 추가되는 최초의 패널은 값이 없다 리소스와 매트릭이 있으면 하나 추가
    panelCount = 1
  }

  let f = parseInt(moment(from, 'YYYY-MM-DD HH:mm').valueOf() / 1000)
  let t = parseInt(moment(to, 'YYYY-MM-DD HH:mm').valueOf() / 1000)
  let collectPeriod = getSecondCollectPeriod()
  let totalPoint = parseInt((t - f) / collectPeriod * resourceCount * metricCount * panelCount)
  let aggValue = Math.ceil(totalPoint / constants.SERVER.MAX_CHART_POINT) * collectPeriod

  let aggList = getAggregationTypeList()
  for (let i = 0; i < aggList.length; i++) {
    let agg = aggList[i]
    if (agg.second >= aggValue) { return agg }
  }
  return aggList[aggList.length - 1]

  // if (aggValue) {
  //   return aggValue
  // } else {
  //   return getSecondCollectPeriod()
  // }
}

export const getProbableList = () => {
  return [
    {name: '선택', value: ''},
    {name: 'Communications Alarm', value: 'Communications Alarm'},
    {name: 'Environmental alarm', value: 'Environmental alarm'},
    {name: 'Eequipment alarm', value: 'Eequipment alarm'},
    {name: 'Threshold Alarm', value: 'Threshold Alarm'},
    {name: 'Out Of Service Alarm', value: 'Out Of Service Alarm'}
  ]
}

export const getAggregationTypeList = () => {
  let collectPeriod = getSecondCollectPeriod()
  let returnArr = [
    {'name': '30초', 'value': '30s', 'inputValue': '30', 'second': '30'},
    {'name': '1분', 'value': '1m', 'inputValue': '1', 'second': '60'},
    {'name': '5분', 'value': '5m', 'inputValue': '5', 'second': '300'},
    {'name': '10분', 'value': '10m', 'inputValue': '5', 'second': '300'},
    {'name': '15분', 'value': '15m', 'inputValue': '15', 'second': '900'},
    {'name': '30분', 'value': '30m', 'inputValue': '30', 'second': '1800'},
    {'name': '1시간', 'value': '1h', 'inputValue': '1', 'second': '3600'},
    {'name': '6시간', 'value': '6h', 'inputValue': '6', 'second': '21600'},
    {'name': '12시간', 'value': '12h', 'inputValue': '12', 'second': '43200'},
    {'name': '1일', 'value': '1d', 'inputValue': '1', 'second': '86400'},
    {'name': '1주일', 'value': '7d', 'inputValue': '7', 'second': '604800'},
    {'name': '30일', 'value': '30d', 'inputValue': '30', 'second': '2592000'}
  ]
  if (collectPeriod < 30) {
    let obj = {}
    obj.name = collectPeriod + '초'
    obj.value = collectPeriod + 's'
    obj.inputValue = collectPeriod + '' // 전부 string형태라서 형태 맞추기 위해
    obj.second = collectPeriod + ''
    returnArr.unshift(obj)
    return returnArr
  } else {
    return returnArr
  }
}

export const analysisSearchDateType = () => {
  return [
    {'name': i18n.t('COMMON.INTERVAL.RECENT_15MIN'), 'value': '15m'},
    {'name': i18n.t('COMMON.INTERVAL.RECENT_1H'), 'value': '1h'},
    {'name': i18n.t('COMMON.INTERVAL.RECENT_1D'), 'value': '1d'},
    {'name': i18n.t('COMMON.INTERVAL.RECENT_1W'), 'value': '1w'},
    {'name': i18n.t('COMMON.INTERVAL.RECENT_1M'), 'value': '1M'},
    {'name': i18n.t('COMMON.INTERVAL.CUSTOM'), 'value': 'custom'}
  ]
}

export const getInventoryViewType = () => {
  return [
    {'name': i18n.t('INVENTORY.SHOW_LIST'), 'value': '0'},
    {'name': i18n.t('INVENTORY.SHOW_TOP_VIEW'), 'value': '1'},
    {'name': i18n.t('INVENTORY.SHOW_MOUNTING_DIAGRAM'), 'value': '2'}
  ]
}

export const getInventoryType = () => {
  let type = [
    {'name': i18n.t('COMMON.LOGICAL_LAYER'), 'value': 'logical', 'type': 'resource'}
  ]
  if (constants.SERVER.PHYSICAL_LAYER_FLAG === true) {
    type.splice(0, 0, {'name': i18n.t('COMMON.PHYSICAL_LAYER'), 'value': 'physical', 'type': 'resource'})
  }
  return type
}

export const getInventoryLogicalType = () => {
  return [
    {'name': i18n.t('COMMON.LOGICAL_LAYER'), 'value': 'logical'},
    {'name': i18n.t('COMMON.PHYSICAL_LAYER'), 'value': 'physical'}
  ]
}

export const getValueConditions = () => {
  return [
    {'name': i18n.t('POPUP.RESOURCE.UP'), 'value': 'up'},
    {'name': i18n.t('POPUP.RESOURCE.SAMEUP'), 'value': 'sameup'},
    {'name': i18n.t('POPUP.RESOURCE.SAME'), 'value': 'same'},
    {'name': i18n.t('POPUP.RESOURCE.SAMEDOWN'), 'value': 'samedown'},
    {'name': i18n.t('POPUP.RESOURCE.DOWN'), 'value': 'down'}
  ]
}

export const getResourceLocationFilter = () => {
  return [
    {'name': i18n.t('SETTING.RESOURCE.LOCATION.HW_PURPOSE'), 'type': 'name'},
    {'name': i18n.t('SETTING.RESOURCE.LOCATION.HW_HOST_NAME'), 'type': 'hostName'},
    {'name': i18n.t('SETTING.RESOURCE.LOCATION.HW_TYPE'), 'type': 'type'},
    {'name': i18n.t('SETTING.RESOURCE.LOCATION.HW_STATUS'), 'type': 'status'},
    {'name': i18n.t('SETTING.RESOURCE.LOCATION.HW_SERVICE_MANAGE_IP'), 'type': 'mainIpAddr'}
  ]
}

export const getLabelConsistents = () => {
  return [
    {'name': i18n.t('COMMON.CONSISTENT'), 'value': 'consistent'},
    {'name': i18n.t('COMMON.DISCORDANCE'), 'value': 'discordance'}
  ]
}

export const getAlarmhistoryTimeInterval = (start, end) => {
  var s = moment(start).valueOf()
  var e = moment(end).valueOf()
  var diff = (e - s) / 1000
  if (diff <= 1859) {
    return '1m'
  }
  if (diff <= 3659) {
    return '1m'
  }
  if (diff <= 86459) {
    return '15m'
  }
  if (diff <= 604859) {
    return '1h'
  }
  if (diff <= 18144059) {
    return '1d'
  } else { return '1M' }
}

export const getMetricAnalysisParam = (item, panels, requestId, isLabel = false) => {
  let param = {}
  let conditions = null

  if (item && item.panelData && item.panelData.conditions) {
    conditions = item.panelData.conditions
  }

  // TODO - from, to 가 있을경우 interval 필요? - custom 일때 from , to를 보낸다.
  if (conditions && conditions.interval && conditions.interval !== 'custom') {
    param.interval = conditions.interval
  }
  if (conditions && conditions.from) {
    param.from = moment(conditions.from, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss')
  }
  if (conditions && conditions.to) {
    param.to = moment(conditions.to, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss')
  }

  if (item.globalResources && item.globalResources.length > 0) {
    let resourceIds = _.pluck(item.globalResources, 'resourceId')
    param.resources = (resourceIds && resourceIds.length > 1) ? resourceIds.join(',') : resourceIds[0]
  } else if (conditions && conditions.resources && conditions.resources instanceof Array && conditions.resources.length > 0) {
    let resourceIds = _.pluck(conditions.resources, 'resourceId')
    if (resourceIds && resourceIds.length > 1) {
      param.resources = resourceIds.join(',')
    } else {
      if (resourceIds && resourceIds[0]) {
        param.resources = resourceIds[0]
      }
    }
  }
  let searchQueryList = []
  if (conditions && conditions.searchQuery) {
    let searchQueryObject = conditions.searchQueryObject
    if (searchQueryObject && searchQueryObject.length > 0) {
      for (let i = 0; i < searchQueryObject.length; i++) {
        let aggregations = searchQueryObject[i].aggregation
        let dimensionValues = searchQueryObject[i].dimensionValues
        let groupBy = searchQueryObject[i].groupBy
        // let sensitivity = searchQueryObject[i].sensitivity

        if (aggregations && aggregations.length > 0) {
          for (let j = 0; j < aggregations.length; j++) {
            let searchQuery = {}
            if (aggregations[j]) {
              searchQuery.aggregation = aggregations[j]
              if (item.panelData.panelType === 'DT_METRIC') {
                searchQuery.dynamicThreshold = searchQuery.aggregation === 'mean'
              }
            }
            if (searchQueryObject[i].metric.metricName) {
              let metric = searchQueryObject[i].metric
              searchQuery.metricSeq = metric.metricSeq
              if (isLabel && metric.refMetricName && metric.refMetricName !== '') {
                searchQuery.metricName = metric.refMetricName
              } else {
                searchQuery.metricName = metric.metricName
              }
            }
            if (searchQueryObject[i].metric.dimension) {
              searchQuery.dimension = searchQueryObject[i].metric.dimension
            }

            // TODO - dimensionValues,  groupBy 는 확인필요
            if (groupBy) {
              searchQuery.groupBy = groupBy
            }

            if (dimensionValues && dimensionValues.length > 0) {
              searchQuery.groupBy = false
              searchQuery.dimensionValues = dimensionValues
            } else {
              searchQuery.groupBy = true
            }

            if (searchQueryObject[i].compareType) {
              searchQuery.compareType = searchQueryObject[i].compareType
            }

            searchQueryList.push(searchQuery)
          }
          // TDOO - else 케이스에 대한 검증 확인 필요
        } else {
          let searchQuery = {}
          if (searchQueryObject[i].metric.metricName) {
            let metric = searchQueryObject[i].metric
            searchQuery.metricSeq = metric.metricSeq
            if (isLabel && metric.refMetricName && metric.refMetricName !== '') {
              searchQuery.metricName = metric.refMetricName
            } else {
              searchQuery.metricName = metric.metricName
            }
          }

          if (searchQueryObject[i].metric.dimension) {
            searchQuery.dimension = searchQueryObject[i].metric.dimension
          }

          // TODO - dimensionValues,  groupBy 는 확인필요
          if (groupBy) {
            searchQuery.groupBy = groupBy
          }

          if (dimensionValues) {
            searchQuery.dimensionValues = dimensionValues
          } else {
            searchQuery.groupBy = true
          }

          searchQueryList.push(searchQuery)
        }
      }
    }

    param.searchQuery = encodeURIComponent(JSON.stringify(searchQueryList))

    // 라벨메트릭인 경우에는 type에 LABEL이라는 값을 셋팅해줘야함. (라벨메트릭은 메트릭 별로 한개씩 개별로 요청할 것이므로 무조건 첫번째 객체를 확인함.)
    // 그래야 히트맵에 맞는 데이터가 조회됨.
    if (searchQueryObject[0] && isStatusMetricType(searchQueryObject[0].metric)) {
      param.type = 'LABEL'
    }
  }

  if (param.type === 'LABEL') {
    param.granularity = constants.SERVER.COLLECT_PERIOD
  } else if (conditions.aggregationFlag) { // 사용자 정의일경우
    param.granularity = conditions.aggregationType
  } else {
    param.granularity = getGranularityValue(conditions.from, conditions.to, panels).value
  }

  item.panelData.granularity = param.granularity

  if (param) {
    param.dateFormat = 'timestamp'
  }

  if (requestId) {
    param.panelKey = requestId
  }

  return param
}

export const getLogAnalysisParam = (state, item, panels) => {
  let param = {}
  let conditions = null

  if (item && item.panelData && item.panelData.conditions) {
    conditions = item.panelData.conditions
  } else if (item && item.conditions) {
    conditions = item.conditions
  }

  // TODO - from, to 가 있을경우 interval 필요? - custom 일때 from , to를 보낸다.
  if (conditions && conditions.interval && conditions.interval !== 'custom') {
    param.interval = conditions.interval
  }
  if (conditions && conditions.from) {
    param.from = moment(conditions.from, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss')
  }
  if (conditions && conditions.to) {
    param.to = moment(conditions.to, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DDTHH:mm:ss')
  }

  if (conditions && conditions.textSearchQuery && conditions.textSearchQuery.length > 0) {
    let textSearchQuery = JSON.copy(conditions.textSearchQuery)
    // TODO - 검색어가 없는 경우 보내지 않음
    for (let i = 0; i < textSearchQuery.length; i++) {
      if (textSearchQuery[i].searchWord === '' || textSearchQuery[i].searchWord === undefined) {
        textSearchQuery.splice(i, 1)
      }
    }

    if (textSearchQuery.length > 0) {
      param.textSearchQuery = encodeURIComponent(JSON.stringify(textSearchQuery))
      // console.log(JSON.stringify(conditions.textSearchQuery))
    }
  }

  // TODO - logResultType - ALL/MATCHED
  if (conditions && conditions.logResultType) {
    param.logResultType = conditions.logResultType
  }

  if (item.globalResources && item.globalResources.length > 0) {
    let resourceIds = _.pluck(item.globalResources, 'resourceId')
    param.resources = (resourceIds && resourceIds.length > 1) ? resourceIds.join(',') : resourceIds[0]
  } else if (conditions && conditions.resources && conditions.resources instanceof Array && conditions.resources.length > 0) {
    let resourceIds = _.pluck(conditions.resources, 'resourceId')
    if (resourceIds && resourceIds.length > 1) {
      param.resources = resourceIds.join(',')
    } else {
      if (resourceIds && resourceIds[0]) {
        param.resources = resourceIds[0]
      }
    }
  }
  if (conditions && conditions.type) {
    param.type = conditions.type
  }

  if (param) {
    param.dateFormatCount = 'timestamp'
    param.dateFormat = 'yyyy-MM-dd HH:mm:ss'
    // param.dateFormat = encodeURIComponent('yyyy-MM-dd HH:mm:ss')
  }

  if (param) {
    param.limit = state.pageLimit
    param.offset = 0
  }

  if (conditions && conditions.textSearchType && conditions.textSearchType.length > 0) {
    param.textSearchType = conditions.textSearchType.join(',')
  }

  if (conditions.aggregationFlag) { // 사용자 정의일경우
    param.granularity = conditions.aggregationType
  } else {
    param.granularity = getGranularityValue(conditions.from, conditions.to, panels).value
  }
  if (item.panelData) { // 로그 클러스터에서 전달하는모양이 약간 다름
    item.panelData.granularity = param.granularity
  } else {
    item.granularity = param.granularity
  }

  return param
}

export const getSensitivityList = () => {
  return [
    {'name': i18n.t('SETTING.ALARM.HIGH'), 'value': 'high'},
    {'name': i18n.t('SETTING.ALARM.MEDIUM'), 'value': 'medium'},
    {'name': i18n.t('SETTING.ALARM.LOW'), 'value': 'low'}
  ]
}

export const setActiveMenu = (parentId, nameId) => {
  let isSameBigActive = $('#' + parentId).hasClass('active') // 동일한 메뉴가 액티브 되있다
  if (isSameBigActive) {
    $('.gnb-menu li').removeClass('active').find('>ul').find('>li').removeClass('active')
  } else {
    $('.gnb-menu li').removeClass('active').find('>ul').slideUp().find('>li').removeClass('active')
  }

  if (parentId) { $('#' + parentId).addClass('active').find('>ul').slideDown() }
  if (nameId) { $('#' + nameId).addClass('active') }
}

export const getHeatMapColorAxis = (valueList) => {
  let axis = {
    // visible: false,
    min: 0,
    max: 10,
    // stops: [
    //   [0, '#eeeeee'],
    //   [0.1, '#114e56'],
    //   [0.2, '#f19913'],
    //   [0.3, '#0055a6'],
    //   [0.4, '#fef31d'],
    //   [0.5, '#00245c'],
    //   [0.6, '#96c619'],
    //   [0.7, '#3c0064'],
    //   [0.8, '#009119'],
    //   [1, '#620032']
    // ]
    events: {
      legendItemClick: function (e) {
        return false
      }
    }
  }

  if (valueList && valueList.length > 0) {
    let arr = []
    for (let value of valueList) {
      arr.push({
        from: Number(value.unitValue),
        to: Number(value.unitValue),
        color: value.unitValueColor,
        name: value.unitValueComments
      })
    }
    axis.dataClasses = arr
  }
  return axis
}

export const getHeatMapChartOptions = (valueList) => {
  return {
    chart: {
      type: 'heatmap',
      animation: false,
      tooltipShared: false // 히트맵은 툴팁동기화 안하도록 처리. 다른 패널과 aggregation이 다름
    },
    boost: {
      enabled: true,
      seriesThreshold: 20,
      useGPUTranslations: true,
      useAlpha: false
    },
    time: {
      useUTC: false
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    legend: {
      enabled: false,
      symbolHeight: 12,
      symbolWidth: 12,
      borderColor: '#000000',
      borderWidth: 1,
      backgroundColor: '#ffffff',
      floating: true,
      symbolRadius: 0,
      align: 'right',
      verticalAlign: 'top',
      layout: 'vertical',
      width: 230,
      useHTML: true,
      style: {
        zIndex: 11
      }
    },
    xAxis: {
      crosshair: {
        width: 1,
        zIndex: 10
      },
      events: null,
      type: 'datetime',
      padding: 0,
      overflow: 'allow',
      dateTimeLabelFormats: {
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m/%d',
        week: '%m/%d',
        month: '%Y/%m',
        year: '%Y'
      }
    },
    yAxis: {
      title: {
        text: null
      },
      startOnTick: true,
      endOnTick: true,
      gridLineWidth: 0,
      tickWidth: 1
    },
    colorAxis: getHeatMapColorAxis(valueList),
    series: []
  }
}

export const getHeatmapDefaultOption = (granularity) => {
  return {
    type: 'heatmap',
    boostThreshold: 100,
    // borderWidth: 0.3,
    // borderColor: '#aaa',
    pointWidth: '100%',
    nullColor: '#EFEFEF',
    turboThreshold: Number.MAX_VALUE, // #3404, remove after 4.0.5 release,
    // colsize: 30 * 1000 // aggregaion?
    colsize: getLongGranularity(constants.SERVER.COLLECT_PERIOD)
  }
}

export const getIsStatusMetric = (cellData) => {
  let isMetric = cellData && cellData.alarmType && (cellData.alarmType === 'metric' || cellData.alarmType === 'serverdown')
  let events = cellData.events
  if (!events || events.length < 1) {
    return false
  }

  let isStatus = false
  for (let m of events) {
    if (isStatusMetric(m)) {
      isStatus = true
      break
    }
  }
  return isMetric && isStatus
}

export const getIsStatusMetricCombined = (cellData) => {
  let isMetric = cellData && cellData.alarmType && (cellData.alarmType === 'metric' || cellData.alarmType === 'serverdown')
  if (!isMetric) {
    return false
  }

  let events = cellData.events
  let isStatusMetricFlag = false
  let labelMetricCount = 0
  for (let m of events) {
    if (isStatusMetric(m)) {
      isStatusMetricFlag = true
      labelMetricCount++
    }
  }
  return isStatusMetricFlag && labelMetricCount !== events.length
}

export const isLabelMetricCellData = (cellData) => {
  if (!cellData || !cellData.events || cellData.events.length < 1) {
    return false
  }

  let events = cellData.events
  for (let event of events) {
    if (event && event.referenceFlag !== null && event.referenceFlag) {
      return true
    }
  }
}

export const arrangePanel = (panels) => {
  let length = panels.length
  if (length > 0 && length <= 2) {
    panels[0].rowNum = 0
    panels[0].orderNum = 0
    if (length === 2) {
      panels[1].rowNum = 1
      panels[1].orderNum = 1
    }
  } else {
    let currentRow = 0
    let rowPanelCnt = 0
    for (let i = 0; i < length; i++) {
      panels[i].rowNum = currentRow
      panels[i].orderNum = i
      rowPanelCnt++
      if (rowPanelCnt === 2) {
        rowPanelCnt = 0
        currentRow++
      }
    }
  }
  return panels
}

export const getLongGranularity = (value) => {
  if (!value || value === '') {
    value = constants.SERVER.COLLECT_PERIOD
  }
  let unit = value.match(/(\w)$/g)[0]
  let num = value.match(/(\d+)/g)[0]
  switch (unit) {
    case 's': return Number(num) * 1000
    case 'm': return Number(num) * 1000 * 60
    case 'h': return Number(num) * 1000 * 60 * 60
    case 'd': return Number(num) * 1000 * 60 * 60 * 24
    case 'w': return Number(num) * 1000 * 60 * 60 * 24 * 7
    case 'M': return Number(num) * 1000 * 60 * 60 * 24 * 30
    case 'y': return Number(num) * 1000 * 60 * 60 * 24 * 365
  }
}

export const getMaxMetricPeriod = (metricList, defaultValue) => {
  let value = defaultValue
  for (let i = 0; i < metricList.length; i++) {
    if (!metricList[i] || !metricList[i].collectInterval) {
      continue
    }
    if (metricList[i].collectInterval > value) {
      value = metricList[i].collectInterval
    }
  }
  return value
  // 해당 메트릭 목록중 최대 수집 주기를 찾는다
}

export const getSecondCollectPeriod = (metricList) => {
  let value = constants.SERVER.COLLECT_PERIOD
  let unit = value.match(/(\w)$/g)[0]
  let num = value.match(/(\d+)/g)[0]
  let returnValue = 0
  switch (unit) {
    case 's':
      returnValue = Number(num)
      break
    case 'm':
      returnValue = Number(num) * 60
      break
    case 'h':
      returnValue = Number(num) * 60 * 60
      break
    case 'd':
      returnValue = Number(num) * 60 * 60 * 24
      break
    case 'w':
      returnValue = Number(num) * 60 * 60 * 24 * 7
      break
    case 'M':
      returnValue = Number(num) * 60 * 60 * 24 * 30
      break
    case 'y':
      returnValue = Number(num) * 60 * 60 * 24 * 365
      break
  }

  if (metricList) {
    return getMaxMetricPeriod(metricList, returnValue)
  } else {
    return returnValue
  }
}

// 알람일경우 최소 수집주기 는 디폴트가 아니고 1초로 변경
export const getSecondAlarmPeriod = (metricList) => {
  let value = '1s'
  let unit = value.match(/(\w)$/g)[0]
  let num = value.match(/(\d+)/g)[0]
  let returnValue = 0
  switch (unit) {
    case 's':
      returnValue = Number(num)
      break
    case 'm':
      returnValue = Number(num) * 60
      break
    case 'h':
      returnValue = Number(num) * 60 * 60
      break
    case 'd':
      returnValue = Number(num) * 60 * 60 * 24
      break
    case 'w':
      returnValue = Number(num) * 60 * 60 * 24 * 7
      break
    case 'M':
      returnValue = Number(num) * 60 * 60 * 24 * 30
      break
    case 'y':
      returnValue = Number(num) * 60 * 60 * 24 * 365
      break
  }

  if (metricList && metricList.length > 0) {
    return getMaxMetricPeriod(metricList, returnValue)
  } else {
    return getSecondCollectPeriod(metricList) // 매트릭이 없을경우는 기본 수집주기 따라서 갑시다
  }
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const heatmapTooltipFormatter = (point) => {
  let str = []

  // 포인트 시간
  let time = moment(point.x).format(constants.ANALYSIS_DATE_FORMAT + ':ss')
  str.push('<small>' + time + '</small><br/>')

  // 리소스
  let resources = point.series.yAxis.categories
  if (resources && resources[point.y]) {
    str.push(resources[point.y])
  }

  // 디멘젼상세
  let options = point.series.userOptions
  if (options.dimensionValues && options.dimensionValues !== '') {
    str.push(`, ${options.dimensionValues}`)
  }
  str.push(': ')

  // value-list값
  let valueList = options.valueList
  if (valueList && valueList.length > 0 && point.value != null) {
    let val = _.findWhere(valueList, {unitValue: point.value + ''})
    str.push(`<span style='color:${point.color};'>\u25CF</span> <b>${val.unitValueComments}</b>`)
  }
  return str.join('')
}

export const isStatusMetric = (m) => {
  return m.eventType === 'METRIC_LABEL_CHECK' || m.metricName === 'disk_mount.status'
}

export const isStatusMetricType = (metric) => {
  return metric && metric.type && metric.type === 'value-list'
}

export const getAlarmIconSeries = (data, marker) => {
  return {
    type: 'line',
    enableMouseTracking: false,
    lineWidth: 0,
    data: data,
    marker: marker
  }
}

export const dateTimeSortFunction = (a, b) => {
  return (a[0] === b[0]) ? 0 : (a[0] < b[0]) ? -1 : 1
}

export const getDetailRowHeight = (params) => {
  let isDetailRow = params.node.detail
  if (isDetailRow) {
    let height = getIsStatusMetricCombined(params.data) ? 690 : 500
    if (getIsStatusMetric(params.data) && isLabelMetricCellData(params.data)) {
      height += 85
    }
    return height
  } else {
    return 28
  }
}

// 한글 2byte
export const getByte = (s) => {
  let b = 0
  let i = 0
  let c = 0
  // eslint-disable-next-line
  for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 2 : c >> 7 ? 2 : 1);
  return b
}

export const getSelectedItemLabel = (list, labelKey) => {
  if (!list || list.length < 1 || !labelKey || labelKey === '') {
    return ''
  }

  let first = list[0][labelKey]
  return (list && list.length === 1) ? `[${first}]${i18n.t('COMMON.OBJECT')}` : `[${first}] ${i18n.t('COMMON.SELECT_OTHER_COUNT', { count: list.length })}`
}
