import lodash from 'lodash'
import { Data } from '../../components/index.js'
import MiaoData from './MiaoData.js'

export default {
  key: 'miao',
  name: '喵喵Api',
  cfgKey: 'miaoApi',
  async request (api) {
    api = this.getCfg('api') || api
    return { api }
  },
  async response (data, req) {
    if (data.status !== 0) {
      return req.err(data.msg || 'error', 60)
    }
    if (data.version === 2) {
      data = data.data || {}
      if (!data.avatars || data.avatars.length === 0) {
        return req.err('empty', 5 * 60)
      }
      data.version = 2
      return data
    } else {
      data = data.data || {}
      if (!data.showAvatarInfoList || data.showAvatarInfoList.length === 0) {
        return req.err('empty', 5 * 60)
      }
      return data
    }
  },

  updatePlayer (player, data) {
    if (data.version === 2) {
      player.setBasicData(data)
      lodash.forEach(data.avatars, (avatar) => {
        let ret = MiaoData.setAvatarNew(player, avatar)
        if (ret) {
          player._update.push(ret.id)
        }
      })
    } else {
      player.setBasicData(Data.getData(data, 'name:nickname,face:profilePicture.avatarId,card:nameCardID,level,word:worldLevel,sign:signature'))
      lodash.forEach(data.showAvatarInfoList, (ds) => {
        let ret = MiaoData.setAvatar(player, ds)
        if (ret) {
          player._update.push(ret.id)
        }
      })
    }
  },

  // 获取冷却时间
  cdTime (data = {}) {
    if (data.cacheExpireAt) {
      let exp = Math.max(0, Math.round(data.cacheExpireAt - (new Date() / 1000)))
      return Math.max(60, exp)
    }
    return 60
  }
}
