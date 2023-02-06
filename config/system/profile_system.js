/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
* 如需自定义配置请复制修改上一级profile_default.js
* */

export const getProfileServ = ({ uid, serv, diyCfg }) => {
  let { Miao, Enka } = serv
  let token = diyCfg?.miaoApi?.token
  let qq = diyCfg?.miaoApi?.qq
  if (qq && token && token.length === 32 && !/^test/.test(token)) {
    return Miao
  }
  return Enka
}

export const miaoApi = {
  listApi: ({ uid, diyCfg }) => {
    let qq = /\d{5,12}/.test(diyCfg.qq) ? diyCfg.qq : 'none'
    let token = diyCfg.token
    return `http://miaoapi.cn/profile/data?uid=${uid}&qq=${qq}&token=${token}`
  }
}

export const enkaApi = {
  url: 'https://enka.network/',
  userAgent: 'Miao-Plugin/3.0',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}api/uid/${uid}/`
  }
}

export const requestInterval = 5

export const isSys = true
