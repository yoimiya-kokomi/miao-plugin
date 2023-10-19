import { Character } from '#miao.models'
import lodash from 'lodash'

let MiaoData = {
  setAvatar (player, ds) {
    let char = Character.get(ds.id)
    let avatar = player.getAvatar(ds.id, true)
    if (!char) {
      return false
    }
    if (player.isSr) {
      avatar.setAvatar({
        ...ds,
        ...MiaoData.getTalentSR(char, ds.talent)
      }, 'miao')
    } else {
      let talentRet = MiaoData.getTalent(char, ds.talent)
      avatar.setAvatar({
        ...ds,
        elem: talentRet.elem,
        talent: talentRet.talent
      }, 'miao')
    }
    return avatar
  },

  getTalent (char, data = {}) {
    let { talentId = {}, talentElem = {} } = char.meta
    let elem = ''
    let idx = 0
    let ret = {}
    lodash.forEach(data, (level, id) => {
      let key
      if (talentId[id]) {
        key = talentId[id]
        elem = elem || talentElem[id]
        ret[key] = level
      } else {
        key = ['a', 'e', 'q'][idx]
        ret[key] = level
      }
      idx++
    })
    return {
      talent: ret,
      elem
    }
  },

  getTalentSR (char, data) {
    let talent = {}
    let trees = []
    lodash.forEach(data, (lv, id) => {
      let key = char.getTalentKey(id)
      if (key || lv > 1) {
        talent[key || id] = lv
      } else {
        trees.push(id)
      }
    })
    return { talent, trees }
  }
}
export default MiaoData
