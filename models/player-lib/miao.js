import lodash from 'lodash'
import { Data } from '../../components/index.js'
import { ProfileServ } from '../index.js'
import MiaoData from './miao-data.js'

export default new ProfileServ({
  key: 'miao',
  name: '喵喵Api',
  cfgKey: 'miaoApi',
  async response (data, req) {
    if (data.status !== 0) {
      return req.err(data.msg || 'error', 60)
    }
    data = data.data || {}
    if (!data.showAvatarInfoList || data.showAvatarInfoList.length === 0) {
      return req.err('empty', 5 * 60)
    }
    return data
  },

  updatePlayer (player, data) {
    player.setBasicData(Data.getData(data, 'name:nickname,face:profilePicture.avatarID,card:nameCardID,level,word:worldLevel,sign:signature'))
    lodash.forEach(data.showAvatarInfoList, (ds) => {
      let ret = MiaoData.setAvatar(player, ds)
      if (ret) {
        player._update.push(ret.id)
      }
    })
  },

  // 获取冷却时间
  cdTime (data = {}) {
    if (data.cacheExpireAt) {
      let exp = Math.max(0, Math.round(data.cacheExpireAt - (new Date() / 1000)))
      return Math.max(60, exp)
    }
    return 60
  }
})
