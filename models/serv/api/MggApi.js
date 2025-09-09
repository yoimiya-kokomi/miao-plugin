import lodash from 'lodash'
import EnkaData from './EnkaData.js'
import { Data } from '#miao'

export default {
  id: 'mgg',
  name: 'MiniGG-Api',
  cfgKey: 'mggApi',
  // 处理请求参数
  async request (api) {
    let params = {
      headers: { 'User-Agent': this.getCfg('userAgent') }
    }
    return { api, params }
  },

  // 处理服务返回
  async response (data, req) {
    if (!data.playerInfo) {
      if (data.error) {
        console.log(`Enka ReqErr: ${data.error}`)
      }
      return req.err('error', 60)
    }
    let details = data.avatarInfoList
    if (!details || details.length === 0 || !details[0].propMap) {
      return req.err('empty', 5 * 60)
    }
    return data
  },

  updatePlayer (player, data) {
    player.setBasicData(Data.getData(data.playerInfo, 'name:nickname,face:profilePicture.avatarID,card:nameCardID,level,word:worldLevel,sign:signature'))
    lodash.forEach(data.avatarInfoList, (ds) => {
      let ret = EnkaData.setAvatar(player, ds, 'mgg')
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
