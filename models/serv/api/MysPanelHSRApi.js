import lodash from 'lodash'
import MysPanelHSRData from './MysPanelHSRData.js'
import { Character } from '#miao.models'

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
      let dsToProcess = ds
      let isEnhanced = false
      if (Character.enhancedCharIds.includes(ds.id) && ds.skills) {
          const originalIdStr = String(ds.id)
          const enhancedPrefix = '1' + originalIdStr
          isEnhanced = ds.skills.some(skill => String(skill.point_id).startsWith(enhancedPrefix))
      }

      if (isEnhanced) {
        dsToProcess = lodash.cloneDeep(ds)
        const originalIdStr = String(dsToProcess.id)
        const newId = parseInt('2' + originalIdStr.substring(1))
        dsToProcess.id = newId

        if (dsToProcess.skills) {
          dsToProcess.skills.forEach(skill => {
            const originalSkillIdStr = String(skill.point_id)
            const oldPrefix = '1' + originalIdStr
            const newPrefix = String(newId)

            if (originalSkillIdStr.startsWith(oldPrefix)) {
              skill.point_id = parseInt(originalSkillIdStr.replace(oldPrefix, newPrefix))
            }
          })
        }
      }

      let ret = MysPanelHSRData.setAvatar(player, dsToProcess)
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
