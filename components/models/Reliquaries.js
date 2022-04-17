import { attrMark, maxMark, attrMap, usefulAttr } from "../../resources/meta/reliquaries/reliquaries-mark.js";
import lodash from "lodash";

let Reliquaries = {
  getUseful(char) {
    let attrKey = usefulAttr[char] || "";
    attrKey = attrKey.split(",");
    let attrTitles = [], retMap = {};
    lodash.forEach(attrKey, (key) => {
      let attr = attrMap[key];
      if (attr) {
        attrTitles.push(attr.title);
        lodash.forEach(attr.attr.split(","), (k) => {
          retMap[k] = attrMark[k];
        })
      }
    })
    return {
      titles: attrTitles,
      mark: retMap
    }
  },

  getMaxMark(char, banTitle = "") {
    let markMap = Reliquaries.getUseful(char).mark;

    let markList = [];

    lodash.forEach(markMap, (m, title) => {
      if (title !== banTitle) {
        markList.push(maxMark[title]);
      }
    });

    markList = markList.sort((a, b) => b - a);
    let retMaxMark = markList[0];
    lodash.forEach(markList, (mark, idx) => {
      if (idx > 0 && idx < 4) {
        retMaxMark += mark / 6;
      }
    });

    return retMaxMark;

  },

  getMark(char = "", data = []) {
    let total = 0;
    let markMap = Reliquaries.getUseful(char).mark;
    lodash.forEach(data, (ret) => {
      let title = ret[0], val = ret[1];
      if (title && val) {
        if (markMap[title]) {
          total += markMap[title] * val;
        }
      }
    })
    return total;
  },

  getMarkScore(mark, maxMark) {
    let pct = mark / maxMark;
    let scoreMap = [
      ["D", 0.15],
      ["C", 0.25],
      ["B", 0.35],
      ["A", 0.45],
      ["S", 0.55],
      ["SS", 0.65],
      ["SSS", 0.75],
      ["ACE", 0.85],
      ["ACE²", 1]
    ];

    for (let idx = 0; idx < scoreMap.length; idx++) {
      if (pct < scoreMap[idx][1]) {
        return scoreMap[idx][0];
      }
    }
  }
}

export default Reliquaries;