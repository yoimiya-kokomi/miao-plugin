import lodash from 'lodash'
import { Data } from '#miao'
import { Character } from '#miao.models'

export default {
  id: 'homo',
  name: 'Mihomo',
  cfgKey: 'homoApi',
  // 处理请求参数
  async request (api) {
    let params = {
      headers: { 'User-Agent': this.getCfg('userAgent') }
    }
    return { api, params }
  },

  // 处理服务返回
  async response (data, req) {
    if (!data.detailInfo) {
      return req.err('error', 60)
    }
    let ds = data.detailInfo
    let avatars = {}
    lodash.forEach(ds.assistAvatarList, (ds) => {
      avatars[ds.avatarId] = ds
    })
    lodash.forEach(ds.avatarDetailList, (ds) => {
      avatars[ds.avatarId] = ds
    })

    if (lodash.isEmpty(avatars)) {
      return req.err('empty', 5 * 60)
    }
    ds.avatars = avatars
    return ds
  },

  updatePlayer(player, data) {
    try {
      player.setBasicData(Data.getData(data, "name:nickname,face:headIcon,level:level,word:level,sign:signature"))
      lodash.forEach(data.avatars, (ds, id) => {

        let dsToProcess = ds

        if (ds.enhancedId === 1 && Character.enhancedCharIds.includes(ds.avatarId)) {
          dsToProcess = lodash.cloneDeep(ds)
          const originalIdStr = String(dsToProcess.avatarId)
          const newId = parseInt('2' + originalIdStr.substring(1))
          dsToProcess.avatarId = newId

          if (dsToProcess.skillTreeList) {
            dsToProcess.skillTreeList.forEach(skill => {
              const originalSkillIdStr = String(skill.pointId)
              const oldPrefix = '1' + originalIdStr
              const newPrefix = String(newId)

              if (originalSkillIdStr.startsWith(oldPrefix)) {
                skill.pointId = parseInt(originalSkillIdStr.replace(oldPrefix, newPrefix))
              }
            })
          }
        }

        let ret = HomoData.setAvatar(player, dsToProcess)
        if (ret) player._update.push(dsToProcess.avatarId)
      })
    } catch (e) {
      logger.error(e)
    }
  },

  // 获取冷却时间
  cdTime (data) {
    return data.ttl || 60
  }
}

const HomoData = {
  setAvatar (player, data) {
    let char = Character.get(data.avatarId)
    if (!char) {
      return false
    }
    let avatar = player.getAvatar(char.id, true)
    let setData = {
      level: data.level,
      promote: data.promotion,
      cons: data.rank || 0,
      weapon: Data.getData(data.equipment, 'id:tid,promote:promotion,level,affix:rank'),
      ...HomoData.getTalent(data.skillTreeList, char),
      artis: HomoData.getArtis(data.relicList)
    }
    avatar.setAvatar(setData, 'homo')
    return avatar
  },
  getTalent (ds, char) {
    let talent = {}
    let trees = []
    lodash.forEach(ds, (d) => {
      let key = char.getTalentKey(d.pointId)
      if (key || d.Level > 1) {
        talent[key || d.pointId] = d.level
      } else {
        trees.push(d.pointId)
      }
    })
    return { talent, trees }
  },
  getArtis (artis) {
    let ret = {}
    lodash.forEach(artis, (ds) => {
      let tmp = {
        id: ds.tid,
        level: ds.level ?? 0,
        mainId: ds.mainAffixId,
        attrIds: []
      }
      lodash.forEach(ds.subAffixList, (s) => {
        if (!s.affixId) {
          return true
        }
        tmp.attrIds.push([s.affixId, s.cnt, s.step || 0].join(','))
      })
      ret[ds.type] = tmp
    })
    return ret
  }
}
