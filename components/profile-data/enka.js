import lodash from 'lodash'
import { Data } from '../index.js'
import { ProfileServ } from '../../models/index.js'
import EnkaData from './enka-data.js'

export default new ProfileServ({
  id: 'enka',
  cfgKey: 'enkaApi',

  // 处理请求参数
  async request (api) {
    let params = { headers: { 'User-Agent': this.getCfg('userAgent') } }
    let proxy = this.getCfg('proxyAgent')
    if (proxy) {
      let { HttpsProxyAgent } = await Data.import('https-proxy-agent')
      params.agent = new HttpsProxyAgent(proxy)
    }
    return { api, params }
  },

  // 处理服务返回
  async response (data, req) {
    if (!data.playerInfo) {
      return req.err('error', 60)
    }
    let details = data.avatarInfoList
    if (!details || details.length === 0 || !details[0].propMap) {
      return req.err('empty', 5 * 60)
    }
    return data
  },

  userData (data) {
    return Data.getData(data, 'name:nickname,avatar:profilePicture.avatarId,level,signature')
  },

  profileData (data) {
    let ret = {}
    lodash.forEach(data.avatarInfoList, (ds) => {
      let profile = EnkaData.getProfile(ds)
      if (profile && profile.id) {
        ret[profile.id] = profile
      }
    })
    return ret
  },

  // 获取冷却时间
  cdTime (data) {
    return data.ttl || 60
  }
})
