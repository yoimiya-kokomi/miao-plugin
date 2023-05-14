import lodash from 'lodash'
import EnkaData from './EnkaData.js'
import { Data } from '#miao'
import { Character } from '#miao.models'

export default {
  id: 'lulu',
  name: '路路Api',
  cfgKey: 'luluApi',
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
    player.setBasicData(Data.getData(data, 'name:NickName,face:HeadIconID,level:Level,word:WorldLevel,sign:Signature'))
    console.log('avatars', data.avatars)
    lodash.forEach(data.avatars, (ds, id) => {
      console.log('ret1', ds)
      let ret = LuluData.setAvatar(player, ds)
      console.log('ret2', ret, ds)
      if (ret) {
        console.log('done', id)
        player._update.push(id)
      }
    })
  },

  // 获取冷却时间
  cdTime (data) {
    return data.ttl || 60
  }
}

const LuluData = {
  setAvatar (player, data) {
    console.log('data', data.AvatarID, data)
    console.log('data.ID', data.AvatarID)
    let char = Character.get(data.AvatarID)
    console.log('char.id', char.id, char.name)
    if (!char) {
      return false
    }
    let avatar = player.getAvatar(char.id, true)
    console.log('setAvatar', avatar)

    let setData = {
      level: data.Level,
      promote: data.Promotion,
      cons: data.Rank || 0,
      weapon: Data.getData(data.EquipmentID, 'id:ID,promote:Promotion,level:Level'),
      ...LuluData.getTalent(data.BehaviorList, char.talentId),
      artis: LuluData.getArtis(data.RelicList)
    }
    console.log('char.setData', setData)
    avatar.setAvatar(setData, 'lulu')
    return avatar
  },
  getTalent (ds, talentId = {}) {
    let talent = {}
    let behaviors = []
    lodash.forEach(ds, (d) => {
      let key = talentId[d.BehaviorID]
      if (key || d.Level > 1) {
        talent[key || d.BehaviorID] = d.Level
      } else {
        behaviors.push(d.BehaviorID)
      }
    })
    return { talent, behaviors }
  },
  getArtis (artis) {
    let ret = {}
    lodash.forEach(artis, (ds) => {
      let tmp = Data.getData('id:ID,main:MainAffixID,level:Level')
      tmp.attrs = []
      lodash.forEach(ds.RelicSubAffix, (s) => {
        tmp.attrs.push(Data.getData(s, 'id:SubAffixID,count:Cnt,step:Step'))
      })
      ret[ds.Type] = tmp
    })
    return ret
  }
}
