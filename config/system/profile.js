/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
* 如需自定义配置请复制修改上一级profile_default.js
* */

export const profileApi = ({ uid, Miao, Enka }) => {
  if ((uid + '')[0] === '5') {
    return Miao
  }
  return Enka
}

export const miaoApi = {
  url: 'http://49.232.91.210/profile',
  token: 'miao-token',
  listApi: ({ url, uid, token }) => {
    return `${url}/list?uid=${uid}&token=${token}`
  },
  detailApi: ({ url, uid, avatar, token }) => {
    return `${url}/detail?uid=${uid}&avatar=${avatar}&token=${token}`
  }
}

export const enkaApi = {
  url: 'https://enka.shinshin.moe/',
  userAgent: 'Miao-Plugin/3.0',
  listApi: ({ url, uid }) => {
    return `${url}u/${uid}/__data.json`
  }
}
