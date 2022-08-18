import EnkaData from './enka-data.js'
import { Data } from '../index.js'
import { ProfileServ } from '../../models/index.js'

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
      return req.err(`请求失败:${data.msg}` || 'error', 60)
    }
    let details = data.avatarInfoList
    if (!details || details.length === 0 || !details[0].propMap) {
      return req.err('no-avatar', 5 * 60)
    }
    return EnkaData.getData(req.uid, data)
  }
})
