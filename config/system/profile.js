/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
* 如需自定义配置请复制修改上一级profile_default.js
* */

export const getProfileServ = ({ uid, serv, diyCfg }) => {
  let { Miao, Enka } = serv
  let token = diyCfg?.miaoApi?.token
  if (token && token.length === 32) {
    return Miao
  }
  return Enka
}

export const miaoApi = {
  url: 'http://49.232.91.210/profile',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}/data?uid=${uid}&token=${diyCfg.token}`
  }
}

export const enkaApi = {
  url: 'https://enka.network/',
  userAgent: 'Miao-Plugin/3.0',
  listApi: ({ url, uid, diyCfg }) => {
    let api = `${url}u/${uid}/__data.json`
    if (diyCfg?.apiKey) {
      api += '?key=' + diyCfg.apiKey
    }
    return api
  }
}

/* 请求面板的冷却时间，单位分钟 */
export const requestInterval = 5

export const isSys = true
