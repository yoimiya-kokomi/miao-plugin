import lodash from 'lodash'
import Character from '../models/Character.js'

const artifactMap = {
  生命值: {
    title: '小生命'
  },
  生命值_百分比: {
    title: '大生命',
    pct: true
  },
  暴击率: {
    title: '暴击率',
    pct: true
  },
  暴击伤害: {
    title: '暴击伤害',
    pct: true
  },
  防御力: {
    title: '小防御'
  },
  防御力_百分比: {
    title: '大防御',
    pct: true
  },
  攻击力: {
    title: '小攻击'
  },
  攻击力_百分比: {
    title: '大攻击',
    pct: true
  },
  元素精通: {
    title: '元素精通'
  },
  元素充能效率: {
    title: '充能效率',
    pct: true
  },
  治疗加成: {
    title: '治疗加成',
    pct: true
  }
}

let posIdx = {
  生之花: {
    idx: 1
  },
  死之羽: {
    idx: 2
  },
  时之沙: {
    idx: 3
  },
  空之杯: {
    idx: 4
  },
  理之冠: {
    idx: 5
  }
}

let Data = {
  getData (uid, data) {
    let ret = {
      uid,
      chars: {}
    }

    lodash.forEach({
      name: '角色名称',
      avatar: '头像ID',
      level: '冒险等阶'
    }, (title, key) => {
      ret[key] = data[title] || ''
    })

    lodash.forEach(data.items, (ds) => {
      let char = Data.getAvatar(ds)
      ret.chars[char.id] = char
    })

    return ret
  },
  getAvatar (data) {
    let char = Character.get(data['英雄Id'])
    return {
      id: data['英雄Id'],
      name: char ? char.name : '',
      level: data['等级'],
      attr: Data.getAttr(data),
      // weapon: Data.getWeapon(data),
      artis: Data.getArtifact(data)
      // cons: data["命之座数量"] * 1 || 0,
      // talent: Data.getTalent(data)
    }
  },
  getAttr (data) {
    let ret = {}
    let attrKey = {
      atk: '攻击力_总',
      atkBase: '属性攻击力',
      def: '防御力_总',
      defBase: '属性防御力',
      hp: '生命值上限_总',
      hpBase: '属性生命值上限',
      mastery: '属性元素精通',
      cRate: {
        title: '属性暴击率',
        pct: true
      },
      cDmg: {
        title: '属性暴击伤害',
        pct: true
      },
      hInc: {
        title: '属性治疗加成',
        pct: true
      },
      recharge: {
        title: '属性元素充能效率',
        pct: true
      }
    }
    lodash.forEach(attrKey, (cfg, key) => {
      if (typeof (cfg) === 'string') {
        cfg = { title: cfg }
      }
      let val = data[cfg.title] || ''
      if (cfg.pct) {
        val = (val * 100).toFixed(2)
      }
      ret[key] = val
    })
    let maxDmg = 0
    lodash.forEach('火水草雷风冰岩'.split(''), (key) => {
      maxDmg = Math.max(data[`属性${key}元素伤害加成`] * 1, maxDmg)
    })
    ret.dmgBonus = (maxDmg * 100).toFixed(2)
    ret.phyBonus = (data['属性物理伤害加成'] * 100).toFixed(2)

    return ret
  },
  getWeapon (data) {
    return {
      name: data['武器名称'],
      level: data['武器等级'],
      refine: data['武器精炼']
    }
  },
  getArtifact (data) {
    let ret = {}
    let get = function (idx, key) {
      let v = data[`圣遗物${idx}${key}`]
      let ret = /^([^\d]*)([\d\.\-]*)$/.exec(v)
      if (ret && ret[1]) {
        let title = ret[1]; let val = ret[2]
        if (artifactMap[title]) {
          if (artifactMap[title].pct) {
            val = (val * 100).toFixed(2)
          }
          title = artifactMap[title].title
        }
        return [title, val]
      }
      return []
    }

    for (let idx = 1; idx <= 5; idx++) {
      ret[`arti${idx}`] = {
        name: data[`圣遗物${idx}名称`],
        type: data[`圣遗物${idx}类型`],
        main: get(idx, '主词条'),
        attrs: [
          get(idx, '副词条1'),
          get(idx, '副词条2'),
          get(idx, '副词条3'),
          get(idx, '副词条4')
        ]
      }
    }
    return ret
  },
  getTalent (data) {
    let ret = {}
    lodash.forEach({
      a: 1,
      e: 2,
      q: 3
    }, (idx, key) => {
      let val = data[`天赋主动名称${idx}`]
      let regRet = /等级(\d*)$/.exec(val)
      if (regRet && regRet[1]) {
        ret[key] = regRet[1] * 1 || 1
      } else {
        ret[key] = 1
      }
    })
    return ret
  }
}
