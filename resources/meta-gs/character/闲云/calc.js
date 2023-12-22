export const details = [{
  title: '仙力助推下落攻击伤害提升值',
  dmg: ({ calc, attr, cons }) => {
    let cons2 = cons * 1 >= 2 ? ( Math.min( calc(attr.atk) * 136 / 100 , 6800 ) ) : 0
    return {
      avg: Math.min( calc(attr.atk) * 170 / 100 , 8500 ) + cons2
    }
  }
},{
  title: '步天梯伤害',
  dmg: ({ talent }, dmg) => dmg(talent.e['仙人姿态路径伤害'], 'e')
},{
  title: '一段跳冲击波伤害',
  params: { btt: 1 },
  dmg: ({ talent }, dmg) => dmg(talent.e['一段跳 · 鹤形追击伤害'], 'a3')
},{
  title: '二段跳冲击波伤害',
  params: { btt: 2 },
  dmg: ({ talent }, dmg) => dmg(talent.e['二段跳 · 鹤形追击伤害'], 'a3')
},{
  title: '三段跳冲击波伤害',
  params: { btt: 3 },
  dmg: ({ talent }, dmg) => dmg(talent.e['三段跳 · 鹤形追击伤害'], 'a3')
},{
  title: '暮集竹星释放伤害',
  dmg: ({ talent }, dmg) => dmg(talent.q['施放瞬间伤害'], 'q')
},{
  title: '暮集竹星释放治疗',
  dmg: ({ attr, calc, talent, cons }, { heal }) => {
    let xz = talent.q['施放瞬间治疗2'][0] * calc(attr.atk) / 100 + talent.q['施放瞬间治疗2'][1] * 1
    return heal(xz)
  }
}]

export const defDmgIdx = 0
export const mainAttr = 'atk,cpct,cdmg'

export const buffs = [{
  title: '闲云天赋：Q后下落攻击坠地冲击造成的伤害提升[a3Plus]',
  sort: 9,
  data: {
    a3Plus: ({ attr, calc }) => Math.min( calc(attr.atk) * 136 / 100 , 8500 )
  }
},{
  title: '闲云2命：施放朝起鹤云后，攻击力提升[atkPct]%',
  sort: 1,
  cons: 2,
  data: {
    atkPct: 20
  }
},{
  title: '闲云2命：Q后下落攻击坠地冲击造成的伤害额外提升[a3Plus]',
  sort: 9,
  cons: 2,
  data: {
    a3Plus: ({ attr, calc }) => Math.min( calc(attr.atk) * 170 / 100 , 6800 )
  }
},{
  check: ({ params }) => params.btt !== undefined ,
  title: '闲云6命：施展了[buffCount]次步天梯,闲云冲击波的暴击伤害提升[a3Cdmg]%',
  cons: 6,
  data: {
    buffCount: ({ params }) => params.btt ,
    a3Cdmg: ({ params }) => 15 + Math.floor( params.btt / 2 )  * 20 + Math.floor( params.btt / 3 ) * 35
  }
}]

export const createdBy = 'liangshi'