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
    let ac = ds.assistAvatarDetail
    let avatars = {}
    if (ac && !lodash.isEmpty(ac)) {
      avatars[ac.AvatarID] = ac
    }
    lodash.forEach(ds.avatarDetailList, (ds) => {
      avatars[ds.avatarId] = ds
    })

    if (lodash.isEmpty(avatars)) {
      return req.err('empty', 5 * 60)
    }
    ds.avatars = avatars
    return ds
  },

  updatePlayer (player, data) {
    try {
      player.setBasicData(Data.getData(data, 'name:nickname,face:headIcon,level:level,word:level,sign:signature'))
      lodash.forEach(data.avatars, (ds, id) => {
        let ret = HomoData.setAvatar(player, ds)
        if (ret) {
          player._update.push(ds.avatarId)
        }
      })
    } catch (e) {
      console.log(e)
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
        level: ds.level || 1,
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
