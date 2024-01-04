import lodash from 'lodash'
import { Common, Format } from '#miao'

const CharTalent = {
  async render (e, mode, char) {
    let lvs = []
    for (let i = 1; i <= 15; i++) {
      lvs.push('Lv' + i)
    }
    let detail = JSON.parse(JSON.stringify(char.getDetail()))
    if (char.game === 'sr') {
      lodash.forEach(['cons', 'talent', 'treeData'], (key) => {
        lodash.forEach(detail[key], (ds, idx) => {
          if (ds.desc) {
            if (key === 'talent' && ds.desc.split) {
              let desc = CharTalent.getDesc(ds.desc, ds.tables, idx === 'a' || idx === 'a2' ? 5 : 8)
              ds.desc = desc.desc
              ds.tables = desc.tables
            } else if (ds.desc.split) {
              ds.desc = ds.desc.split('<br>')
            }
          }
        })
      })
    }
    return await Common.render('wiki/character-talent', {
      saveId: `${mode}-${char.id}`,
      ...char.getData(),
      game: char.game,
      detail,
      imgs: char.getImgs(),
      mode,
      lvs,
      line: CharTalent.getLineData(char)
    }, { e, scale: 1.1 })
  },
  getLineData (char) {
    let ret = []
    if (char.isSr) {
      lodash.forEach({ hp: '基础生命', atk: '基础攻击', def: '基础防御', speed: '速度' }, (label, key) => {
        ret.push({
          num: Format.comma(char.getDetail().baseAttr[key], 1),
          label
        })
      })
      return ret
    }
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
  },
  // 获取精炼描述
  getDesc (desc, tables, lv = 5) {
    let reg = /\$(\d)\[(i|f1|f2)](%?)/g

    let ret

    let idxFormat = {}
    while ((ret = reg.exec(desc)) !== null) {
      let [, idx, format, pct] = ret
      let value = tables?.[idx]?.values[lv - 1]
      if (value) {
        if (pct === '%') {
          idxFormat[idx] = 'percent'
          value = Format.percent(value, format === 'f2' ? 2 : 1)
        } else {
          idxFormat[idx] = 'comma'
          value = Format.comma(value)
        }
        value = value + ` (lv${lv})`
        desc = desc.replaceAll(ret[0], value)
      }
    }
    let tableRet = []
    lodash.forEach(tables, (ds, idx) => {
      let values = []
      lodash.forEach(ds.values, (v) => {
        values.push(Format[idxFormat[idx] || 'comma'](v))
      })
      tableRet.push({
        name: ds.name,
        isSame: ds.isSame,
        values
      })
    })
    return {
      desc: desc.split('<br>'),
      tables: tableRet
    }
  }
}

export default CharTalent
