import fetch from 'node-fetch'
import EnkaData from './enka-data.js'
import Data from '../Data.js'

let Enka = {
  key: 'enka',
  cd: 5,
  async request ({ e, uid, avatar, diyCfg, sysCfg }) {
    let url = diyCfg?.enkaApi?.url || sysCfg.enkaApi.url
    let profileApi = diyCfg?.enkaApi?.listApi || sysCfg.enkaApi.listApi
    let api = profileApi({ url, uid, avatar })
    if (diyCfg?.enkaApi?.apiKey) {
      api += '?key=' + diyCfg.enkaApi.apiKey
    }
    let headers = { headers: { 'User-Agent': diyCfg?.enkaApi?.userAgent || sysCfg.enkaApi.userAgent } }
    let req = await fetch(api, headers)
    let data = await req.json()
    if (!data.playerInfo) {
      e.reply(`请求失败:${data.msg || '可能是面板服务并发过高，请稍后重试'}`)
      return false
    }
    let details = data.avatarInfoList
    if (!details || details.length === 0 || !details[0].propMap) {
      e.reply('请打开游戏内角色展柜的“显示详情”后，等待5分钟重新获取面板')
      return false
    }
    return EnkaData.getData(uid, data)
  }
}

export default Enka
