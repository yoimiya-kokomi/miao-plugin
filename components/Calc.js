import fs from "fs";
import lodash from "lodash";
import Format from "./Format.js";

const eleMap = {
  Anemo: "风",
  Cryo: "冰",
  Electro: "雷",
  Geo: "岩",
  Hydro: "水",
  Pyro: "火"
}

let Calc = {

  async getCharCalcRule(name) {

    const _path = process.cwd();
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/character/${name}/calc.js`;


    let details, buffs = [], defParams = {};
    if (fs.existsSync(cfgPath)) {
      let fileData = await import (`file://${cfgPath}`);
      details = fileData.details || false;
      buffs = fileData.buffs || [];
      defParams = fileData.defParams || {};
    }

    if (details) {
      return { details, buffs, defParams }
    }
    return false;
  },

  // 获取基础属性
  attr(profile, avatar) {
    let ret = {},
      { attr } = profile;

    // 基础属性
    lodash.forEach("atk,def,hp".split(","), (key) => {
      ret[key] = {
        base: attr[`${key}Base`] * 1 || 0,
        plus: attr[key] * 1 - attr[`${key}Base`] * 1 || 0,
        pct: 0
      }
    })

    lodash.forEach("mastery,recharge".split(","), (key) => {
      ret[key] = {
        base: attr[key] * 1 || 0,
        plus: 0,
        pct: 0
      }
    })

    lodash.forEach({ cRate: "cpct", cDmg: "cdmg", hInc: "heal" }, (val, key) => {
      ret[val] = {
        base: attr[key] * 1 || 0,
        plus: 0,
        pct: 0
      }
    })

    lodash.forEach("dmg,phy".split(","), (key) => {
      ret[key] = {
        base: attr[key + "Bonus"] * 1 || 0,
        plus: 0,
        pct: 0
      }
    })

    // a
    lodash.forEach("a,a2,a3,e,q".split(","), (key) => {
      ret[key] = {
        pct: 0, // 倍率加成
        multi: 0, // 独立倍率乘区加成

        plus: 0, // 伤害值提高
        dmg: 0, // 伤害提高
        cpct: 0,// 暴击提高
        cdmg: 0, //爆伤提高

        def: 0, // 防御降低
        ignore: 0, // 无视防御
      }
    })

    ret.enemy = {
      def: 0, // 降低防御
      ignore: 0, // 无视防御
      phy: 0  // 物理防御
    }

    ret.weaponType = avatar.weapon.type_name;
    ret.element = eleMap[avatar.element];
    ret.refine = (avatar.weapon.affix_level * 1 - 1) || 0;

    ret.multi = 0;

    ret.zf = 0;
    ret.rh = 0;

    ret.kx = 0;

    return ret;

  },

  // 获取天赋数据
  talent(talentData, char) {
    let ret = {};

    lodash.forEach(['a', 'e', 'q'], (key) => {
      let lv = talentData[key].level_current * 1 || 1,
        lvKey = `Lv${lv}`;

      let map = {};

      lodash.forEach(char.talent[key].tables, (tr) => {
        let val = tr.values[lv - 1];
        val = val.replace(/[^\x00-\xff]/g, "").trim();

        let valArr = [];
        lodash.forEach(val.split("/"), (v, idx) => {
          let valNum = 0;
          lodash.forEach(v.split("+"), (v) => {
            v = v.split("*")
            valNum += v[0].replace("%", "").trim() * (v[1] || 1);
          })
          valArr.push(valNum);
        });

        if (isNaN(valArr[0])) {
          map[tr.name] = false;
        } else if (valArr.length === 1) {
          map[tr.name] = valArr[0];
        } else {
          map[tr.name] = valArr;
        }
      })
      ret[key] = map;
    })
    return ret;
  },

  getDs(attr, meta, params) {
    return {
      ...meta,
      attr,
      params,
      refine: attr.refine,
      weaponType: attr.weaponType,
      element: eleMap[attr.element] || attr.element,
      calc(ds) {
        return (ds.base || 0) + (ds.plus || 0) + ((ds.base || 0) * (ds.pct || 0) / 100)
      }
    }
  },

  calcAttr(originalAttr, buffs, meta, params = {}) {
    let attr = lodash.merge({}, originalAttr);

    let msg = [];


    lodash.forEach(buffs, (buff) => {
      let ds = Calc.getDs(attr, meta, params);

      // 如果存在rule，则进行计算
      if (buff.check && !buff.check(ds)) {
        return;
      }
      if (buff.cons) {
        if (ds.cons * 1 < buff.cons * 1) {
          return;
        }
      }

      let title = buff.title;

      if (buff.mastery) {
        let mastery = attr.mastery.base + attr.mastery.plus;
        let masteryNum = 2.78 * mastery / (mastery + 1400) * 100;
        buff.data = buff.data || {};
        lodash.forEach(buff.mastery.split(","), (key) => {
          buff.data[key] = masteryNum;
        })
      }

      lodash.forEach(buff.data, (val, key) => {

        if (lodash.isFunction(val)) {
          val = val(ds);
        }

        title = title.replace(`[${key}]`, Format.comma(val, 1));
        // 技能提高
        let tRet = /^(a|a2|a3|e|q)(Def|Ignore|Dmg|Plus|Pct|Cpct|Cdmg|Multi)$/.exec(key);
        if (tRet) {
          attr[tRet[1]][tRet[2].toLowerCase()] += val * 1 || 0;
          return;
        }
        let aRet = /^(hp|def|atk|mastery|cpct|cdmg|heal|recharge|dmg|phy)(Plus|Pct)?$/.exec(key);
        if (aRet) {
          attr[aRet[1]][aRet[2] ? aRet[2].toLowerCase() : "plus"] += val * 1 || 0;
          return;
        }
        if (key === "enemyDef") {
          attr.enemy.def += val * 1 || 0;
          return;
        }

        if (["zf", "rh", "kx"].includes(key)) {
          attr[key] += val * 1 || 0;
        }
      });
      msg.push(title);
    })

    return {
      attr, msg
    }
  },

  async weapon(weaponName) {
    const _path = process.cwd();
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/weapons/calc.js`;


    let weapons = {};
    if (fs.existsSync(cfgPath)) {
      let fileData = await import (`file://${cfgPath}`);
      weapons = fileData.weapons || {};
    }

    let weaponCfg = weapons[weaponName] || [];
    if (lodash.isPlainObject(weaponCfg)) {
      weaponCfg = [weaponCfg];
    }

    lodash.forEach(weaponCfg, (ds) => {
      ds.title = `${weaponName}：${ds.title}`;
      if (ds.refine) {
        ds.data = ds.data || {};
        lodash.forEach(ds.refine, (r, key) => {
          ds.data[key] = ({ refine }) => r[refine] * (ds.buffCount || 1);
        })
      }
    })

    return weaponCfg;
  },

  async reliquaries(sets) {
    const _path = process.cwd();
    const cfgPath = `${_path}/plugins/miao-plugin/resources/meta/reliquaries/calc.js`;

    let buffs = {};
    if (fs.existsSync(cfgPath)) {
      let fileData = await import (`file://${cfgPath}`);
      buffs = fileData.buffs || {};
    }

    let setMap = {};

    lodash.forEach(sets, (set) => {
      if (set && set.set) {
        let name = set.set.name
        setMap[name] = (setMap[name] || 0) + 1
      }
    });

    let retBuffs = [];

    lodash.forEach(setMap, (count, setName) => {
      if (count >= 2 && buffs[setName + 2]) {
        retBuffs.push(buffs[setName + 2])
      }
      if (count >= 4 && buffs[setName + 4]) {
        retBuffs.push(buffs[setName + 4])
      }
    })
    return retBuffs;
  },
  async calcData({ profile, char, avatar, talentData, enemyLv = 91 }) {
    let charCalcData = await Calc.getCharCalcRule(char.name);

    //avatar.element;

    if (!charCalcData) {
      return false;
    }
    let talent = Calc.talent(talentData, char);

    let meta = {
      cons: avatar.actived_constellation_num * 1,
      talent
    }

    let { buffs, details, defParams } = charCalcData;

    defParams = defParams || {};

    let originalAttr = Calc.attr(profile, avatar);

    let weaponBuffs = await Calc.weapon(avatar.weapon.name);
    let reliBuffs = await Calc.reliquaries(avatar.reliquaries);
    buffs = lodash.concat(buffs, weaponBuffs, reliBuffs);

    lodash.forEach(buffs, (buff) => {
      buff.sort = lodash.isUndefined(buff.sort) ? 1 : buff.sort
    });

    buffs = lodash.sortBy(buffs, ["sort"]);

    let { msg } = Calc.calcAttr(originalAttr, buffs, meta, defParams || {});

    let ret = [];

    lodash.forEach(details, (detail) => {

      let params = lodash.merge({}, defParams, detail.params || {});

      let { attr } = Calc.calcAttr(originalAttr, buffs, meta, params);

      if (detail.check && !detail.check(Calc.getDs(attr, meta, params))) {
        return;
      }

      let dmg = function (pctNum = 0, talent = false, ele = false) {
        let { atk, dmg, cdmg, cpct } = attr;
        // 攻击区
        let atkNum = (atk.base + atk.plus + atk.base * atk.pct / 100);


        // 倍率独立乘区
        let multiNum = attr.multi / 100;

        // 增伤区
        let dmgNum = (1 + dmg.base / 100 + dmg.plus / 100);

        //console.log({ base: Format.comma(dmg.base, 2), plus: Format.comma(dmg.plus, 2) })

        let cpctNum = cpct.base / 100 + cpct.plus / 100;

        // 爆伤区
        let cdmgNum = cdmg.base / 100 + cdmg.plus / 100;


        let enemyDef = attr.enemy.def / 100;
        let enemyIgnore = attr.enemy.ignore / 100;

        pctNum = pctNum / 100;

        if (talent && attr[talent]) {
          let ds = attr[talent];
          pctNum += ds.pct / 100;
          dmgNum += ds.dmg / 100;
          cpctNum += ds.cpct / 100;
          cdmgNum += ds.cdmg / 100;
          enemyDef += ds.def / 100;
          enemyIgnore += ds.ignore / 100;
          multiNum += ds.multi / 100;
        }

        // 防御区
        let lv = avatar.level;
        let defNum = (lv + 100) / ((lv + 100) + (enemyLv + 100) * (1 - enemyDef) * (1 - enemyIgnore));

        // 抗性区
        let kx = 10 - (attr.kx || 0);
        let kNum = 0.9;
        if (kx >= 0) {
          kNum = (100 - kx) / 100;
        } else {
          kNum = 1 - kx / 200
        }

        // 反应区
        let eleNum = 1;
        if (ele) {
          eleNum = { zf: 1.5, rh: 2 }[ele] || 1;
          if (attr[ele]) {
            eleNum = eleNum * (1 + attr[ele] / 100);
          }
        }

        // 计算最终伤害
        let ret = {
          dmg: atkNum * pctNum * (1 + multiNum) * dmgNum * (1 + cdmgNum) * defNum * kNum * eleNum,
          avg: atkNum * pctNum * (1 + multiNum) * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum * eleNum
        }

        console.log(attr, { atkNum, pctNum, multiNum, dmgNum, cpctNum, cdmgNum, defNum, eleNum, kNum }, ret)

        return ret;
      };

      if (detail.dmg) {
        let dmgRet = detail.dmg({ attr, talent }, dmg);
        ret.push({
          title: detail.title,
          ...dmgRet
        })
      }
    })
    return {
      ret,
      msg
    }
  }


}

export default Calc;