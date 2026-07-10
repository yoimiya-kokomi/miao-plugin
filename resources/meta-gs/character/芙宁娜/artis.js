import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({ attr, cons, weapon, rule, def }) {
  let title = []
  let particularAttr = {...usefulAttr['芙宁娜']}
  if (cons >= 4) {
    title.push('高命')
    particularAttr.recharge = 60
    if (cons == 6) {
      particularAttr.mastery = 45
    }
  }
  if (weapon.name === '西风剑' && attr.recharge >= 250) {
    title = [] 
    title.push('西风纯辅')
    particularAttr.hp = 0
    particularAttr.mastery = 0
    particularAttr.cpct = 100
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (weapon.name === '苍古自由之誓' && attr.recharge >= 220) {
    title = [] 
    title.push('苍古纯辅')
    particularAttr.hp = 0
    particularAttr.mastery = 0
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (weapon.name === '圣显之钥' && attr.recharge >= 220) {
    title = [] 
    title.push('板砖纯辅')
    particularAttr.hp = 100
    particularAttr.mastery = 0
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (weapon.name === '岩峰巡歌' && attr.recharge >= 220) {
    title = [] 
    title.push('岩峰纯辅')
    particularAttr.hp = 0
    particularAttr.def = 100
    particularAttr.mastery = 0
    particularAttr.cpct = 0
    particularAttr.cdmg = 0
    particularAttr.recharge = 100
    particularAttr.dmg = 0
  }
  if (title.length > 0) {
    return rule(`芙宁娜-${title.join('')}`, particularAttr)
  }
  return def(usefulAttr['芙宁娜'])
}
