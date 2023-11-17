export const details = [{
  title: 'E点按拍照伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['点按拍照伤害'], 'e')
}, {
  title: 'E长按拍照伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['长按拍照伤害'], 'e')
}, {
  title: 'Q释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['技能伤害'], 'q')
}, {
  title: 'Q释放治疗量',
  dmg: ({ talent, attr }, { heal }) => heal(talent.q['施放治疗量2'][0] / 100 * attr.atk + talent.q['施放治疗量2'][1])
}, {
  title: 'Q持续治疗量',
  dmg: ({ talent, attr }, { heal }) => heal(talent.q['相机持续治疗量2'][0] / 100 * attr.atk + talent.q['相机持续治疗量2'][1])
}, {
  title: '六命额外治疗量',
  cons: 6,
  dmg: ({ attr }, { heal }) => heal(0.42 * attr.atk)
}]

export const mainAttr = 'atk,cpct,cdmg,heal'
export const defDmgIdx = 3

export const buffs = [{
  title: '天赋-多样性调查：按队伍存在2位枫丹角色，2位非枫丹角色计算，自身获得[heal]%治疗加成，[dmg]%冰元素伤害加成',
  data: {
    heal: 5,
    dmg: 10
  }
}, {
  title: '夏洛蒂2命：E攻击命中3名及以上敌人时，自身攻击力提升[atk]%',
  cons: 2,
  data: {
    atk: 30
  }
}, {
  title: '夏洛蒂4命：Q命中带有E印记的敌人时，Q造成的伤害提升[dmg]%',
  cons: 4,
  data: {
    qDmg: 10
  }
}, {
  title: '夏洛蒂6命：场上角色普攻或重击命中E标记敌人时，产生相当于夏洛蒂42%攻击的额外治疗',
  cons: 6
}]

export const createdBy = 'Aluxes'
