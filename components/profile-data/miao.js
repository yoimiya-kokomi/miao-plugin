import lodash from 'lodash'
import { Data } from '../index.js'
import { ProfileServ } from '../../models/index.js'
import MiaoData from './miao-data.js'

export default new ProfileServ({
  key: 'miao',
  name: 'MiaoApi',
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

  userData (data) {
    return Data.getData(data, 'name:nickname,avatar:profilePicture.avatarID,level,signature')
  },

  profileData (data) {
    let ret = {}
    lodash.forEach(data.showAvatarInfoList, (ds) => {
      let profile = MiaoData.getProfile(ds)
      if (profile && profile.id) {
        ret[profile.id] = profile
      }
    })
    return ret
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
