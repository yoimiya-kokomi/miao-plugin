import lodash from 'lodash'
import MysPanelData from './MysPanelData.js'

export default {
  id: 'mysPanel',
  name: '米游社',
  cfgKey: 'mysPanelApi',
  // 处理请求参数
  async request (api) {
    let params = {
      headers: { 'User-Agent': this.getCfg('userAgent') }
    }
    return { api, params }
  },

  // 处理服务返回
  async response (data, req) {
    if (!data.list || data.list.length === 0) {
      return req.err('empty', 5 * 60)
    }
    return data
  },

  updatePlayer (player, data) {
    lodash.forEach(data.list, (ds) => {
      let ret = MysPanelData.setAvatar(player, ds)
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
