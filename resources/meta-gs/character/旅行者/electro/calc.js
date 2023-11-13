import { Format } from '#miao'

export const details = [{
  title: 'E伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['技能伤害'], 'e')
}, {
  title: 'E提供元素充能加成',
  dmg: ({ attr }) => {
    return {
      avg: Format.percent(0.2 + attr.recharge * 0.1 / 100),
      type: 'text'
    }
  }
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q协同伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['威光落雷伤害'], 'q')
}]

export const defDmgIdx = 2
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '天赋-回响的轰雷：基于自身元素充能效率的10%，提升E的勾玉提供的元素充能效率[_eRecharge]%',
  data: {
    _eRecharge: ({ attr }) => attr.recharge * 0.1
  }
}, {
  title: '雷主2命：Q的协同攻击会使敌人的雷元素抗性降低[kx]%',
  cons: 2,
  data: {
    kx: 15
  }
}]

export const createdBy = 'Aluxes'
