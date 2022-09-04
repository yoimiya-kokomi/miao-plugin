import lodash from 'lodash'
import { Data } from '../../components/index.js'

const talentMeta = {
  自由: { week: 1, city: '蒙德' },
  繁荣: { week: 1, city: '璃月' },
  浮世: { week: 1, city: '稻妻' },
  诤言: { week: 1, city: '须弥' },

  抗争: { week: 2, city: '蒙德' },
  勤劳: { week: 2, city: '璃月' },
  风雅: { week: 2, city: '稻妻' },
  巧思: { week: 2, city: '须弥' },

  诗文: { week: 3, city: '蒙德' },
  黄金: { week: 3, city: '璃月' },
  天光: { week: 3, city: '稻妻' },
  笃行: { week: 3, city: '须弥' },
}

const talentReg = new RegExp(`(${lodash.keys(talentMeta).join('|')})`)

let MaterialMeta = {
  getTalentData (talent) {
    talent = MaterialMeta.getTalentKey(talent)
    return talentMeta[talent]
  },
  getTalentKey (name) {
    return Data.regRet(talentReg, name, 1) || name
  },
  getTalentLabel (t) {
    let key = MaterialMeta.getTalentKey(t)
    let tm = MaterialMeta.getTalentData(key)
    if (!tm) {
      return t
    }
    return `${tm.city}·${key}`
  },
  getTalentWeek (t) {
    let tm = MaterialMeta.getTalentData(t)
    switch (tm.week) {
      case 1:
        return '周一/周四'
      case 2:
        return '周二/周五'
      case 3:
        return '周三/周六'
    }
    return ''
  }
}
export default MaterialMeta
