import { Common, Format } from '../../components/index.js'
import lodash from 'lodash'

const CharTalent = {
  async render (e, mode, char) {
    let lvs = []
    for (let i = 1; i <= 15; i++) {
      lvs.push('Lv' + i)
    }
    return await Common.render('wiki/character-talent', {
      saveId: `${mode}-${char.id}`,
      ...char.getData(),
      detail: char.getDetail(),
      imgs: char.getImgs(),
      mode,
      lvs,
      line: CharTalent.getLineData(char)
    }, { e, scale: 1.1 })
  },
  getLineData (char) {
    let ret = []
    const attrMap = {
      atkPct: '大攻击',
      hpPct: '大生命',
      defPct: '大防御',
      cpct: '暴击',
      cdmg: '爆伤',
      recharge: '充能',
      mastery: '精通',
      heal: '治疗',
      dmg: char.elemName + '伤',
      phy: '物伤'
    }
    lodash.forEach({ hp: '基础生命', atk: '基础攻击', def: '基础防御' }, (label, key) => {
      ret.push({
        num: Format.comma(char.baseAttr[key], 1),
        label
      })
    })
    let ga = char.growAttr
    ret.push({
      num: ga.key === 'mastery' ? Format.comma(ga.value, 1) : ga.value,
      label: `成长·${attrMap[ga.key]}`
    })
    return ret
  }
}

export default CharTalent
