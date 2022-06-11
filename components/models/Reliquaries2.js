import { attrValue, attrNameMap, attrMap, mainAttr, subAttr, usefulAttr }
  from "../../resources/meta/reliquaries/reliquaries-mark-new.js";
import { Character } from "../models.js";
import lodash from "lodash";

let charCfg = {};
let Reliquaries = {
  getCharCfg(name) {
    if (charCfg[name]) {
      return charCfg[name]
    }
    let attrWeight = usefulAttr[name] || { atk: 75, cp: 100, cd: 100 };
    let attrMark = {};

    let char = Character.get(name);
    let baseAttr = char.lvStat.detail['90'];
    lodash.forEach(attrWeight, (weight, attr) => {
      attrMark[attr] = weight / attrValue[attr];
    });

    // let baseAttr = [400, 500, 300];
    if (attrMark.hp) {
      attrMark.hpPlus = attrMark.hp / baseAttr[0] * 100;
    }
    if (attrMark.atk) {
      attrMark.atkPlus = attrMark.atk / (baseAttr[1] + 400) * 100;
    }
    if (attrMark.def) {
      attrMark.defPlus = attrMark.def / baseAttr[2] * 100;
    }
    let maxMark = Reliquaries.getMaxMark(attrWeight);
    let titleMark = {}, titleWeight = {};
    lodash.forEach(attrMark, (mark, attr) => {
      let aTitle = attrMap[attr];
      if (/小/.test(aTitle)) {
        return;
      }
      titleMark[aTitle] = mark;
      titleWeight[aTitle] = attrWeight[attr] || 0;
      if (/大/.test(aTitle)) {
        let sTitle = aTitle.replace("大", "小");
        console.log(sTitle, aTitle, attrWeight[attr])
        titleWeight[sTitle] = titleWeight[aTitle];
      }
    })
    console.log(titleWeight);
    charCfg[name] = {
      weight: attrWeight,
      mark: attrMark,
      titleMap: titleMark,
      titleWeight,
      maxMark
    };
    return charCfg[name];
  },
  getMaxAttr(charAttr = {}, list2 = [], maxLen = 1, banAttr = "") {
    let tmp = [];
    lodash.forEach(list2, (attr) => {
      if (attr === banAttr) return;
      if (!charAttr[attr]) return;
      tmp.push({ attr, mark: charAttr[attr] });
    });
    tmp = lodash.sortBy(tmp, "mark");
    tmp = tmp.reverse();
    let ret = [];
    lodash.forEach(tmp, (ds) => ret.push(ds.attr));
    return ret.slice(0, maxLen);
  },
  getMaxMark(attrWeight) {
    let ret = {};
    for (let idx = 1; idx <= 5; idx++) {
      let totalMark = 0, mMark = 0;
      let mAttr = "";
      if (idx === 1) {
        mAttr = "hpPlus";
      } else if (idx === 2) {
        mAttr = "atkPlus";
      } else if (idx >= 3) {
        mAttr = Reliquaries.getMaxAttr(attrWeight, mainAttr[idx])[0];
        mMark = attrWeight[mAttr];
        totalMark += attrWeight[mAttr] * 2;
      }

      let sAttr = Reliquaries.getMaxAttr(attrWeight, subAttr, 4, mAttr);
      lodash.forEach(sAttr, (attr, aIdx) => {
        totalMark += attrWeight[attr] * (aIdx === 0 ? 6 : 1)
      });
      ret[idx] = totalMark;
      ret['m' + idx] = mMark;
    }
    return ret;
  },
  getAttr(ds) {
    let title = ds[0]
    let attr = attrNameMap[title];
    if (/元素伤害/.test(title)) {
      attr = "dmg";
    } else if (/物理|物伤/.test(title)) {
      attr = "phy"
    }
    return attr;
  },
  getAttrMark(attrMark, ds) {
    if (!ds || !ds[1]) {
      return 0;
    }
    let attr = Reliquaries.getAttr(ds);
    let val = ds[1];
    return (attrMark[attr] || 0) * val;
  },
  getMark(charCfg, posIdx, mainAttr, subAttr) {
    let ret = 0;
    let { mark, maxMark, weight } = charCfg;
    let mAttr = Reliquaries.getAttr(mainAttr);

    let fixPct = 1;
    if (posIdx >= 3) {
      fixPct = Math.max(0, Math.min(1, (weight[mAttr] || 0) / (maxMark['m' + posIdx])));
      ret += Reliquaries.getAttrMark(mark, mainAttr) / 4
    }

    lodash.forEach(subAttr, (ds) => {
      ret += Reliquaries.getAttrMark(mark, ds)
    });

    return ret * (1 + fixPct) / 2 / maxMark[posIdx] * 66;
  },

  getArtisMark(charName = "", artis = {}) {
    let total = 0;
    let charCfg = Reliquaries.getCharCfg(charName);
    let ret = {}
    lodash.forEach(artis, (ds, idx) => {
      idx = idx.replace("arti", "");
      ret[idx] = Reliquaries.getMark(charCfg, idx, ds.main, ds.attrs)
    });
    return ret;
  },
  getMarkScore(mark) {
    let pct = mark;
    let scoreMap = [["D", 10], ["C", 16.5], ["B", 23.1], ["A", 29.7], ["S", 36.3], ["SS", 42.9], ["SSS", 50], ["ACE", 56.1], ["ACE²", 66]];
    for (let idx = 0; idx < scoreMap.length; idx++) {
      if (pct < scoreMap[idx][1]) {
        return scoreMap[idx][0];
      }
    }
  },
  getSet(name) {
    for (let idx in meta) {
      if (meta[idx].name === name) {
        return meta[idx];
      }
    }
  }
}
export default Reliquaries;
