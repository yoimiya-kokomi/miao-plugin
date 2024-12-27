import lodash from 'lodash'
import MysPanelHSRData from './MysPanelHSRData.js'

export default {
  id: 'mysPanelHSR',
  name: '米游社星铁',
  cfgKey: 'mysPanelHSRApi',
  // 处理请求参数
  async request (api) {
    let params = {
      headers: { 'User-Agent': this.getCfg('userAgent') }
    }
    return { api, params }
  },

  // 处理服务返回
  async response (data, req) {
    if (!data.avatar_list || data.avatar_list.length === 0) {
      return req.err('empty', 5 * 60)
    }
    return data
  },

  updatePlayer (player, data) {
    lodash.forEach(data.avatar_list, (ds) => {
      let ret = MysPanelHSRData.setAvatar(player, ds)
      if (ret) {
        player._update.push(ret.id)
      }
    })
  },

  // 获取冷却时间
  cdTime (data) {
    return data.ttl || 60
  }
}
