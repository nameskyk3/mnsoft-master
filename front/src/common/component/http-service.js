import axios from 'axios'

const CancelToken = axios.CancelToken
let source = CancelToken.source()

/**
 * http 통신한 후 response값이 성공인지 확인하는 함수
 * @param response
 * @returns {boolean}
 */
const isSuccess = response => {
  if (response == null || response.data == null || response.data.data == null) {
    return false
  }
  return true
}

/**
 * http 통신이 성공인지 판단 후 callback 처리
 * @param response
 * @param callbackObj
 * @param commit
 */
const responseHandler = (response, callbackObj, commit) => {
  if (!isSuccess(response)) {
    return
  }

  if (commit && callbackObj && _.isString(callbackObj)) {
    commit(callbackObj, response.data.data)
  } else if (callbackObj && _.isFunction(callbackObj)) {
    callbackObj(response.data.data)
  }
}

/**
 * 요청을 강제로 중지시킬 경우 사용. (20181108: 라우터가 변경되었을 떄)
 */
export const requestCancel = () => {
  source.cancel('Request has stopped.')
  source = CancelToken.source()
}

/**
 * http 통신 (GET)
 * @param commit
 * @param url
 * @param param
 * @param callbackObj
 * @returns {Promise<AxiosResponse<any>>}
 */
export const httpGet = (commit, url, param, callbackObj) => {
  return axios.get(url, {
    params: param,
    cancelToken: source.token
  }).then(response => {
    responseHandler(response, callbackObj, commit)
  }).catch(function (err) {
    console.log('HTTP ERROR', err)
    if (err.data && err.data.result) {
      return err.data.result
    }
  })
}

/**
 * http 통신(POST)
 * @param commit
* @param url
* @param param
* @param callbackObj
* @returns {Promise<AxiosResponse<any>>}
*/
export const httpPost = (commit, url, param, callbackObj) => {
  return axios.post(url, param, {
    cancelToken: source.token
  }).then(response => {
    responseHandler(response, callbackObj, commit)
  }).catch(function (err) {
    console.log('result : ', err)
    if (err.data && err.data.result) {
      return err.data.result
    }
  })
}

/**
 * http 통신(PUT)
 * @param commit
 * @param url
 * @param param
 * @param callbackObj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const httpPut = (commit, url, param, callbackObj) => {
  return axios.put(url, param, {
    cancelToken: source.token
  }).then(response => {
    responseHandler(response, callbackObj, commit)
  }).catch(function (err) {
    console.log('result : ', err)
    if (err.data && err.data.result) {
      return err.data.result
    }
  })
}

/**
 * http 통신(DELETE)
 * @param commit
 * @param url
 * @param param
 * @param callbackObj
 * @returns {Promise<AxiosResponse<any> | never>}
 */
export const httpDelete = (commit, url, param, callbackObj) => {
  return axios.delete(url, param, {
    cancelToken: source.token
  }).then(response => {
    responseHandler(response, callbackObj, commit)
  }).catch(function (err) {
    console.log('result : ', err)
    if (err.data && err.data.result) {
      return err.data.result
    }
  })
}
