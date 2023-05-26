/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
* 如需自定义配置请复制修改上一级profile_default.js
* */

export const miaoApi = {
  listApi: ({ url, uid, diyCfg, game = 'gs' }) => {
    let qq = /\d{5,12}/.test(diyCfg.qq) ? diyCfg.qq : 'none'
    let token = diyCfg.token
    url = url || 'http://49.232.91.210/'
    return `${url}profile/data?uid=${uid}&qq=${qq}&token=${token}&version=2&game=${game}`
  }
}

export const enkaApi = {
  url: 'https://enka.network/',
  userAgent: 'Miao-Plugin/3.1',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}api/uid/${uid}/`
  }
}

export const mggApi = {
  url: 'http://profile.microgg.cn/',
  userAgent: 'Miao-Plugin/3.1',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}api/uid/${uid}/`
  }
}

export const hutaoApi = {
  url: 'http://enka-api.hut.ao/',
  userAgent: 'Snap Hutao/miao',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}/${uid}/`
  }
}

export const homoApi = {
  url: 'https://api.mihomo.me/sr_info',
  listApi: ({ url, uid, diyCfg }) => {
    return `${url}/${uid}`
  }
}

export const requestInterval = 3

export const isSys = true
