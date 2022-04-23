import fs from "fs";
import lodash from "lodash";
import Format from "./Format.js";
import { buffs } from "../resources/meta/reliquaries/calc.js";

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
        def: 0, // 防御降低
        ignore: 0, // 无视防御
        plus: 0, // 伤害值提高
        dmg: 0, // 伤害提高
        cpct: 0,// 暴击提高
        cdmg: 0 //爆伤提高
      }
    })

    ret.enemy = {
      def: 0, // 降低防御
      ignore: 0, // 无视防御
      phy: 0  // 物理防御
    }

    ret.weaponType = avatar.weapon.type_name;
    ret.element = avatar.element;
    ret.refine = (profile.weapon.refine * 1 - 1) || 0;

    return ret;

  },

  // 获取天赋数据
  talent(profile, char) {
    let ret = {};

    lodash.forEach(['a', 'e', 'q'], (key) => {
      let lv = profile.talent[key] * 1 || 1,
        lvKey = `Lv${lv}`;

      let map = {};

      lodash.forEach(char.talent[key].tables, (tr) => {
        let val = tr.values[lv - 1];
        val = val.replace(/[^\x00-\xff]/g, "").trim();

        let valArr = [];
        lodash.forEach(val.split("/"), (v, idx) => {
          let valNum = 0;
          lodash.forEach(v.split("+"), (v) => {
            valNum += v.replace("%", "").trim() * 1;
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

  calcAttr(originalAttr, buffs, meta, params = {}) {
    let attr = lodash.merge({}, originalAttr);

    let msg = [];


    lodash.forEach(buffs, (buff) => {
      let ds = {
        ...meta,
        attr,
        params,
        refine: attr.refine
      };

      // 如果存在rule，则进行计算
      if (buff.rule && !buff.rule(ds)) {
        return;
      }

      let title = buff.title;
      lodash.forEach(buff.data, (val, key) => {

        if (lodash.isFunction(val)) {
          val = val(ds);
        }

        title = title.replace(`[${key}]`, Format.comma(val, 1));
        // 技能提高
        let tRet = /^(a|a2|a3|e|q)(Def|Ignore|Dmg|Plus|Pct|Cpct|Cdmg)$/.exec(key);
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
  async calcData(profile, char, avatar) {
    let charCalcData = await Calc.getCharCalcRule(char.name);

    //avatar.element;

    if (!charCalcData) {
      return false;
    }
    let talent = Calc.talent(profile, char);

    let meta = {
      cons: profile.cons * 1,
      ...profile.talent,
      talent,
    }

    let { buffs, details, defParams } = charCalcData;

    defParams = defParams || {};

    let originalAttr = Calc.attr(profile, avatar);

    let weaponBuffs = await Calc.weapon(profile.weapon.name);
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

      let dmg = function (pctNum = 0, talent = false) {
        let { atk, dmg, cdmg, cpct } = attr;
        // 攻击区
        let atkNum = (atk.base + atk.plus + atk.base * atk.pct / 100);

        // 增伤区
        let dmgNum = (1 + dmg.base + dmg.plus / 100);

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
        }

        // 防御区
        let enemyLv = 86, lv = 90;
        let defNum = (lv + 100) / ((lv + 100) + (enemyLv + 100) * (1 - enemyDef) * (1 - enemyIgnore));

        // 抗性区
        let kNum = 0.9;

        // 计算最终伤害
        return {
          dmg: atkNum * pctNum * dmgNum * (1 + cdmgNum) * defNum * kNum,
          avg: atkNum * pctNum * dmgNum * (1 + cpctNum * cdmgNum) * defNum * kNum
        }
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