import { Data } from '../index.js'
import lodash from 'lodash'

const _path = process.cwd()

export const artiIdx = {
  生之花: 1,
  死之羽: 2,
  时之沙: 3,
  空之杯: 4,
  理之冠: 5
}

let relis = Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/reliquaries/`, 'data.json') || {}
let setMap = {}

lodash.forEach(relis, (ds) => {
  if (ds.sets) {
    lodash.forEach(ds.sets, (tmp) => {
      if (tmp.name) {
        setMap[tmp.name] = ds.name
      }
    })
  }
})
export const artiSetMap = setMap

export const attrMap = {
  HP: '小生命',
  HP_PERCENT: '大生命',
  ATTACK: '小攻击',
  ATTACK_PERCENT: '大攻击',
  DEFENSE: '小防御',
  DEFENSE_PERCENT: '大防御',
  FIRE_ADD_HURT: '火元素伤害加成',
  ICE_ADD_HURT: '冰元素伤害加成',
  ROCK_ADD_HURT: '岩元素伤害加成',
  ELEC_ADD_HURT: '雷元素伤害加成',
  WIND_ADD_HURT: '风元素伤害加成',
  WATER_ADD_HURT: '水元素伤害加成',
  PHYSICAL_ADD_HURT: '物理伤害加成',
  GRASS_ADD_HURT: '草元素伤害加成',
  HEAL_ADD: '治疗加成',
  ELEMENT_MASTERY: '元素精通',
  CRITICAL: '暴击率',
  CRITICAL_HURT: '暴击伤害',
  CHARGE_EFFICIENCY: '充能效率'
}
