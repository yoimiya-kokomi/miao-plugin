export const details = [{
  title: "半血开E重击",
  dmg: ({ talent, attr }, dmg) => dmg(talent.a["重击伤害"], "a2")
}, {
  title: "半血开E重击蒸发",
  dmg: ({ talent, attr }, dmg) => dmg(talent.a["重击伤害"], "a2", "zf")
}, {
  title: "半血开E后Q",
  dmg: ({ talent, attr }, dmg) => dmg(talent.q["低血量时技能伤害"], "q")
}];

export const buffs = [{
  title: `被动天赋：半血获得33%火伤加成`,
  data: {
    "dmg": 33
  }

}, {
  title: "元素精通：蒸发融化伤害提高[zf]%",
  mastery: "zf,rh"
}, {
  title: "胡桃E：获得[atkPlus]点攻击力加成",
  data: {
    atkPlus: ({ talent, attr, calc }) => {
      return talent.e['攻击力提高'] * calc(attr.hp) / 100;
    }
  }
}];