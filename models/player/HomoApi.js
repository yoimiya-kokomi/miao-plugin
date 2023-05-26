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
    if (!data.PlayerDetailInfo) {
      return req.err('error', 60)
    }
    let ds = data.PlayerDetailInfo
    let ac = ds.AssistAvatar
    let avatars = {}
    if (ac && !lodash.isEmpty(ac)) {
      avatars[ac.AvatarID] = ac
    }
    lodash.forEach(ds.DisplayAvatarList, (ds) => {
      avatars[ds.AvatarID] = ds
    })

    if (lodash.isEmpty(avatars)) {
      return req.err('empty', 5 * 60)
    }
    data.avatars = avatars
    return data
  },

  updatePlayer (player, data) {
    try {
      player.setBasicData(Data.getData(data, 'name:NickName,face:HeadIconID,level:Level,word:WorldLevel,sign:Signature'))
      lodash.forEach(data.avatars, (ds, id) => {
        let ret = HomoData.setAvatar(player, ds)
        if (ret) {
          player._update.push(ds.AvatarID)
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
    let char = Character.get(data.AvatarID)
    if (!char) {
      return false
    }
    let avatar = player.getAvatar(char.id, true)
    let setData = {
      level: data.Level,
      promote: data.Promotion,
      cons: data.Rank || 0,
      weapon: Data.getData(data.EquipmentID, 'id:ID,promote:Promotion,level:Level,affix:Rank'),
      ...HomoData.getTalent(data.BehaviorList, char),
      artis: HomoData.getArtis(data.RelicList)
    }
    avatar.setAvatar(setData, 'homo')
    return avatar
  },
  getTalent (ds, char) {
    let talent = {}
    let trees = []
    lodash.forEach(ds, (d) => {
      let key = char.getTalentKey(d.BehaviorID)
      if (key || d.Level > 1) {
        talent[key || d.BehaviorID] = d.Level
      } else {
        trees.push(d.BehaviorID)
      }
    })
    return { talent, trees }
  },
  getArtis (artis) {
    let ret = {}
    lodash.forEach(artis, (ds) => {
      let tmp = {
        id: ds.ID,
        level: ds.Level || 1,
        mainId: ds.MainAffixID,
        attrs: []
      }
      lodash.forEach(ds.RelicSubAffix, (s) => {
        if (!s.SubAffixID) {
          return true
        }
        tmp.attrs.push([s.SubAffixID, s.Cnt, s.Step || 0].join(','))
      })
      ret[ds.Type] = tmp
    })
    return ret
  }
}
