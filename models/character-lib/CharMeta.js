import lodash from 'lodash'
import { Material } from '../index.js'
import { Format, Data } from '../../components/index.js'

// 角色排序
export const charPosIdx = {
  1: '宵宫,雷神,胡桃,甘雨,优菈,一斗,公子,绫人,魈,可莉,迪卢克,凝光,刻晴,辛焱,烟绯,雷泽',
  2: '夜兰,八重,九条,行秋,香菱,安柏,凯亚,丽莎,北斗,菲谢尔,重云,罗莎莉亚,埃洛伊',
  3: '申鹤,莫娜,早柚,云堇,久岐忍,五郎,砂糖,万叶,温迪',
  4: '班尼特,心海,琴,芭芭拉,七七,迪奥娜,托马,空,荧,阿贝多,钟离'
}

// 元素别名
export const elemAlias = {
  anemo: '风,蒙德',
  geo: '岩,璃月',
  electro: '雷,电,雷电,稻妻',
  dendro: '草,须弥',
  pyro: '火,纳塔',
  hydro: '水,枫丹',
  cryo: '冰,至冬'
}

export const baseAttrName = {
  hp: '基础生命',
  atk: '基础攻击',
  def: '基础防御'
}
export const growAttrName = {
  atkPct: '大攻击',
  hpPct: '大生命',
  defPct: '大防御',
  cpct: '暴击',
  cdmg: '爆伤',
  recharge: '充能',
  mastery: '精通',
  heal: '治疗',
  phy: '物伤'
}

const mKeys = [{
  key: 'gem',
  num: '1/9/6/6'
}, {
  key: 'boss',
  num: '46',
  check: (char) => !char.isTraveler
}, {
  key: 'normal',
  num: '18/30/36'
}, {
  key: 'specialty',
  num: '168'
}, {
  key: 'talent'
}, {
  key: 'weekly',
  star: 5
}]

const CharMeta = {
  getAttrList (base, grow, elem = '') {
    let ret = []
    lodash.forEach(base, (v, k) => {
      ret.push({
        title: baseAttrName[k],
        value: Format.comma(v, 1)
      })
    })
    ret.push({
      title: '成长·' + (grow.key === 'dmg' ? `${elem}伤` : growAttrName[grow.key]),
      value: grow.value
    })
    return ret
  },
  getMaterials (char) {
    let ds = char.meta.materials
    let ret = []
    lodash.forEach(mKeys, (cfg) => {
      let title = ds[cfg.key]
      let mat = Material.get(title)
      if (!mat) {
        return
      }
      if (cfg.check && !cfg.check(char)) {
        return
      }
      ret.push({
        ...mat.getData('label,star,icon,type'),
        num: cfg.num || mat.getSource() || ''
      })
    })
    return ret
  }
}
export default CharMeta
