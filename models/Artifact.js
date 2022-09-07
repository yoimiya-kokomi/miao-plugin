import { attrMap } from '../resources/meta/reliquaries/artis-mark.js'
import lodash from 'lodash'
import { Data } from '../components/index.js'

let artisMap = {}

async function init () {
  let artis = Data.readJSON('resources/meta/reliquaries/data.json')

  lodash.forEach(artis, (ds) => {
    artisMap[ds.name] = ds
  })
}

await init()

const abbr = {
  炽烈的炎之魔女: '魔女',
  昔日宗室之仪: '宗室',
  翠绿之影: '风套',
  千岩牢固: '千岩',
  流浪大地的乐团: '乐团',
  绝缘之旗印: '绝缘',
  被怜爱的少女: '少女',
  沉沦之心: '水套',
  角斗士的终幕礼: '角斗',
  冰风迷途的勇士: '冰套',
  逆飞的流星: '逆飞',
  苍白之火: '苍白',
  华馆梦醒形骸记: '华馆',
  战狂: '战狂',
  悠古的磐岩: '岩套',
  渡过烈火的贤人: '渡火',
  游医: '游医',
  教官: '教官',
  冒险家: '冒险',
  追忆之注连: '追忆',
  海染砗磲: '海染',
  如雷的盛怒: '如雷',
  染血的骑士道: '染血',
  平息鸣雷的尊者: '平雷',
  流放者: '流放',
  学士: '学士',
  行者之心: '行者',
  幸运儿: '幸运',
  勇士之心: '勇士',
  守护之心: '守护',
  武人: '武人',
  赌徒: '赌徒',
  奇迹: '奇迹',
  辰砂往生录: '辰砂',
  来歆余响: '余响',
  深林的记忆: '草套',
  饰金之梦: '饰金'
}

let Artifact = {

  // 根据圣遗物名称获取套装
  getSetByArti (name) {
    for (let idx in artisMap) {
      for (let idx2 in artisMap[idx].sets) {
        if (artisMap[idx].sets[idx2].name === name) {
          return artisMap[idx]
        }
      }
    }
    return false
  },

  // 获取指定圣遗物套装指定位置的名字
  getArtiBySet (name, idx = 1) {
    let set = artisMap[name]
    if (!set) {
      return ''
    }
    return set.sets[`arti${idx}`].name
  },

  getAbbrBySet (name) {
    return abbr[name] || name.split(0, 2)
  },

  getMeta () {
    return {
      attrMap
    }
  }
}
export default Artifact
