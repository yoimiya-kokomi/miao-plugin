import abbr from './abbr.js'
import lodash from 'lodash'
import { Data } from '#miao'

let costumes = {
  琴: [200301], // 琴
  芭芭拉: [201401], // 芭芭拉
  刻晴: [204201], // 刻晴
  凝光: [202701], // 凝光
  迪卢克: [201601], // 迪卢克
  菲谢尔: [203101], // 菲谢尔
}
const fixData = {
  4: {
    id: 20000000,
    title: '异界的旅人',
    cncv: '宴宁/鹿喑',
    jpcv: '悠木碧/堀江瞬'
  },
  5: {
    title: '异界的旅人'
  },
  7: {
    title: '异界的旅人'
  }
}

const elemMap = { Water: 'hydro', Grass: 'dendro', Ice: 'cryo', Fire: 'pyro', Stone: 'geo' }
const weaponMap = { pole: 'polearm', sword_one_hand: 'sword' }

const CharData = {
  getBasic (ds) {
    let fe = ds.fetter || {}
    let w = Data.regRet(/WEAPON_(.*)$/, ds.weaponType, 1).toLowerCase()
    let ret = {
      id: ds.id,
      name: ds.name,
      abbr: abbr[ds.name] || ds.name,
      title: fe.title || '',
      star: ds.rank,
      elem: elemMap[ds.element] || ds.element,
      allegiance: fe.native || '',
      weapon: weaponMap[w] || w,
      birth: ds.birthday.join('-'),
      astro: fe.constellation || '',
      desc: fe.detail || '',
      cncv: fe.cv?.CHS || '',
      jpcv: fe.cv?.JP || '',
      costume: costumes[ds.name] || false,
      source: 'amber',
      ver: 1
    }
    ret.title = ret.title === '？？？' ? '' : ret.title
    ret.desc = ret.desc === '？？？' ? '测试角色' : ret.title
    return ret
  },

  getDetailAttr (ds) {
    return {
      details: { 90: {} }
    }
  },

  getDetail (ds) {
    let id = ds.id
    let name = ds.name

    let talent = CharData.getTalents(ds)
    let passive = CharData.getPassive(ds)
    let cons = CharData.getCons(ds)
    let attr = CharData.getDetailAttr(ds)
    return {
      id,
      name,
      talent,
      cons,
      passive,
      attr
    }
  },

  // 获取正文
  getDesc (dt) {
    dt = dt || ''
    dt = dt.replace(/<color=[^>]*>/g, '')
    dt = dt.replace(/<\/color(=?[^>])*>/g, '')
    dt = dt.replace(/<span class=[^>]*>/g, '<strong>')
    dt = dt.replace(/<\/span>/g, '</strong>')
    dt = dt.split('\\n')
    let desc = []
    let isEmpty = true
    lodash.forEach(dt, (txt, i) => {
      txt = lodash.trim(txt)
      if (!txt) {
        isEmpty = true
        return
      } else if (txt.length < 15 && isEmpty) {
        txt = `<h3>${txt}</h3>`
      }
      desc.push(txt)
      isEmpty = false
    })
    return desc
  },

  // 获取单个天赋数据
  getTalent (ds) {

    let name = ds.name
    let icon = ds.icon

    // 说明
    let desc = CharData.getDesc(ds.description)

    let ret = {}
    let titles = []
    let details = []

    let formater = {
      F1P: (t) => (t * 100).toFixed(2) * 1 + '%',
      P: (t) => (t * 100).toFixed(2) * 1 + '%',
      F1: (t) => t.toFixed(1) * 1,
      F2: (t) => t.toFixed(2) * 1,
      I: (t) => parseInt(t)
    }

    lodash.forEach(ds.promote, function (ds) {
      lodash.forEach(ds.description, (txt, idx) => {
        if (!txt) {
          return
        }
        let [title, tpl] = txt.split('|')
        if (!ret[title]) {
          ret[title] = []
          titles.push(title)
        }

        let value = []
        if (tpl) {
          lodash.forEach(tpl.split('}'), (txt) => {
            if (txt.trim()) {
              let txtRet = /(.*){param(\d+):(F1P|F1|F2|I|P)/.exec(txt)
              if (txtRet) {
                let pIdx = txtRet[2] - 1
                let val = formater[txtRet[3]](ds.params[pIdx])
                value.push(txtRet[1] + val)
              } else {
                value.push(txt)
              }
            }
          })
        }
        ret[title].push(value.join(''))
      })
    })

    lodash.forEach(titles, (name) => {
      let values = []
      let values2 = []
      let isSame = true
      let unit = ''

      lodash.forEach(ret[name], (val, i) => {
        let v = val.replace(/(生命值上限|最大生命值)/, 'HP')
        v = v.replace('/', ' / ').replace('+', ' + ').replace('*', ' * ')
        v = v.replace(/(防御力)/, '防御')
        values.push(v)
        if (i > 0 && values[0] !== val) {
          isSame = false
        }
        let ur = /^(.*)(生命值上限|防御力|最大生命值|攻击力|生命值上限 \/ 层|当前生命值| \/ 层)(\s*\*\s*\d)?$/.exec(val)
        if (ur && ur[1] && ur[2]) {
          values2.push(ur[1] + (ur[3] || ''))
          unit = ur[2]
        } else {
          ur = /^(每点元素能量|每个猫爪|每朵|每个)(.*)$/.exec(val)
          if (ur && ur[1] && ur[2]) {
            values2.push(ur[2])
            unit = ur[1]
          } else {
            ur = /^(每层)(.*)(攻击力)$/.exec(val)
            if (ur && ur[1] && ur[2] && ur[3]) {
              values2.push(ur[2])
              unit = ur[1] + ' ' + ur[3]
            } else {
              unit = ''
            }
          }
        }
      })
      details.push({
        name,
        unit,
        isSame,
        values: unit ? values2 : values
      })
    })

    return {
      name,
      desc,
      tables: details
    }
  },

  // 获取天赋
  getTalents (ds) {
    return {
      a: CharData.getTalent(ds.talent[0]),
      e: CharData.getTalent(ds.talent[1]),
      q: CharData.getTalent(ds.talent[3])
    }
  },

  // 获取被动天赋
  getPassive (ds) {
    let ret = []

    for (let idx in ds.talent) {
      if (idx < 4) {
        continue
      }
      let tmp = ds.talent[idx]
      ret.push({
        name: tmp.name,
        desc: CharData.getDesc(tmp.description)
      })
    }
    return ret
  },

  // 获取命座数据
  getCons (ds) {
    let ret = {}
    lodash.forEach(ds.constellation, (tmp, idx) => {
      ret[idx * 1 + 1] = {
        name: tmp.name,
        desc: CharData.getDesc(tmp.description)
      }
    })
    return ret;
  },

  // 获取命座加成天赋
  getConsTalent (talent, cons) {
    if (!talent || !cons) {
      return { e: 3, q: 5 }
    }
    let e = talent.e.name
    let q = talent.q.name
    let c3 = (cons['3']?.desc || []).join('')
    let c5 = (cons['5']?.desc || []).join('')
    return {
      e: c3.includes(e) ? 3 : 5,
      q: c5.includes(q) ? 5 : 3
    }
  }
}
export default CharData
