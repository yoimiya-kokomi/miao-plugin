import lodash from "lodash";
import Character from "../models/Character.js";
import meta from "./enka_meta.js";
import cmeta from "./enka_char.js";
import _Data from "../Data.js";

let _path = process.cwd();
let relis = _Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/reliquaries/`, "data.json") || {};

let relisMap = {}

lodash.forEach(relis, (ds) => {
  relisMap[ds.name] = ds;
})


const artiIdx = {
  EQUIP_BRACER: 1,
  EQUIP_NECKLACE: 2,
  EQUIP_SHOES: 3,
  EQUIP_RING: 4,
  EQUIP_DRESS: 5
};

const attrMap = {
  HP: "小生命",
  HP_PERCENT: "大生命",
  ATTACK: "小攻击",
  ATTACK_PERCENT: "大攻击",
  DEFENSE: "小防御",
  DEFENSE_PERCENT: "大防御",
  FIRE_ADD_HURT: "火元素伤害加成",
  ICE_ADD_HURT: "冰元素伤害加成",
  ROCK_ADD_HURT: "岩元素伤害加成",
  ELEC_ADD_HURT: "雷元素伤害加成",
  WIND_ADD_HURT: "风元素伤害加成",
  WATER_ADD_HURT: "水元素伤害加成",
  PHYSICAL_ADD_HURT: "物理伤害加成",
  HEAL_ADD: "治疗加成",
  ELEMENT_MASTERY: "元素精通",
  CRITICAL: "暴击率",
  CRITICAL_HURT: "暴击伤害",
  CHARGE_EFFICIENCY: "充能效率",
};

let Data = {
  getData(uid, data) {
    let ret = {
      uid,
      chars: {}
    }

    lodash.forEach({
      name: "nickname",
      avatar: "profilePicture.avatarId",
      lv: "level"
    }, (src, key) => {
      ret[key] = lodash.get(data.playerInfo, src, "");
    })

    lodash.forEach(data.avatarInfoList, (ds) => {
      let char = Data.getAvatar(ds);
      ret.chars[char.id] = char;
    })

    return ret;

  },
  getAvatar(data) {
    let char = Character.get(data.avatarId);
    let ret = {
      id: data["avatarId"],
      name: char ? char.name : "",
      dataSource: "enka",
      lv: data.propMap['4001'].val * 1,
      fetter: data.fetterInfo.expLevel,
      attr: Data.getAttr(data.fightPropMap),
      weapon: Data.getWeapon(data.equipList),
      artis: Data.getArtifact(data.equipList),
      cons: data.talentIdList ? data.talentIdList.length : 0,
      talent: Data.getTalent(char.id, data.skillLevelMap, data.proudSkillExtraLevelMap || {})
    };
    return Data.dataFix(ret);
  },
  getAttr(data) {
    let ret = {};
    let attrKey = {
      // atk: 2001,
      atkBase: 4,
      def: 2002,
      defBase: 7,
      hp: 2000,
      hpBase: 1,
      mastery: 28,
      cRate: {
        src: 20,
        pct: true
      },
      cDmg: {
        src: 22,
        pct: true
      },
      hInc: {
        src: 26,
        pct: true
      },
      recharge: {
        src: 23,
        pct: true
      }
    };
    lodash.forEach(attrKey, (cfg, key) => {
      if (!lodash.isObject(cfg)) {
        cfg = {src: cfg};
      }
      let val = data[cfg.src] || 0;
      if (cfg.pct) {
        val = val * 100
      }
      ret[key] = val;
    });
    ret.atk = data['4'] * (1 + data['6']) + data['5'];
    let maxDmg = 0;
    // 火40  水42 风44 岩45 冰46 雷46
    // 41 雷
    lodash.forEach("40,41,42,43,44,45,45,46".split(","), (key) => {
      maxDmg = Math.max(data[key] * 1, maxDmg);
    });
    // phy 30
    ret.dmgBonus = maxDmg * 100;
    ret.phyBonus = data['30'] * 100;

    return ret;
  },

  getArtifact(data) {
    let ret = {};

    let get = function (d) {
      if (!d) {
        return [];
      }
      let id = d.appendPropId || d.mainPropId || "";
      id = id.replace("FIGHT_PROP_", "");
      if (!attrMap[id]) {
        return [];
      }
      return [attrMap[id], d.statValue];

    }
    lodash.forEach(data, (ds) => {
      let flat = ds.flat || {}, sub = flat.reliquarySubstats || [];
      let idx = artiIdx[flat.equipType];
      if (!idx) {
        return;
      }

      let setName = meta[flat.setNameTextMapHash] || "";
      let setCfg = relisMap[setName] || {name: "", sets: {}},
        artiCfg = setCfg.sets[`arti${idx}`] || {name: ""};

      ret[`arti${idx}`] = {
        name: artiCfg.name,
        set: setCfg.name,
        level: Math.min(20, ((ds.reliquary && ds.reliquary.level) || 1) - 1),
        main: get(flat.reliquaryMainstat),
        attrs: [
          get(sub[0]),
          get(sub[1]),
          get(sub[2]),
          get(sub[3])
        ]
      }
    })
    return ret;
  },
  getWeapon(data) {
    let ds = {}
    lodash.forEach(data, (temp) => {
      if (temp.flat && temp.flat.itemType === "ITEM_WEAPON") {
        ds = temp;
        return false;
      }
    })
    let {weapon, flat} = ds;
    return {
      name: meta[flat.nameTextMapHash],
      star: flat.rankLevel,
      leve: weapon.level,
      promote: weapon.promoteLevel,
      affix: lodash.values(weapon.affixMap)[0]
    }
  },
  getTalent(charid, ds = {}, ext = {}) {
    let cm = cmeta[charid] || {};
    let cn = cm.Skills || {}, ce = cm.ProudMap;
    let idx = 1;
    let idxMap = {1: 'a', 2: 'e', 3: 'q', 'a': 'a', 's': 'e', 'e': 'q'};
    lodash.forEach(cn, (n, id) => {
      let nRet = /skill_(\w)/.exec(n.toLowerCase());
      idxMap[id] = nRet && nRet[1] ? idxMap[nRet[1]] : idxMap[idx];
      idx++;
    });
    lodash.forEach(ce, (n, id) => {
      idxMap[n] = idxMap[id];
    })
    let ret = {};
    lodash.forEach(ds, (lv, id) => {
      let key = idxMap[id];
      ret[key] = {
        level_original: lv,
        level_current: lv
      }
    })
    lodash.forEach(ext, (lv, id) => {
      let key = idxMap[id];
      if (ret[key]) {
        ret[key].level_current = ret[key].level_current + lv;
      }
    })

    return ret;
  },
  dataFix(ret) {

    let {attr, id} = ret;
    id = id * 1;
    switch (id) {
      case 10000052:
        // 雷神被动加成fix
        attr.dmgBonus = Math.min(0, attr.dmgBonus - (attr.recharge - 100) * 0.4)
        break;
      case 10000041:
        // 莫娜被动fix
        attr.dmgBonus = Math.min(0, attr.dmgBonus - attr.recharge * 0.2)
        break;
    }
    return ret;
  }
};

export default Data;