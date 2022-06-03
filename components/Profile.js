import fs from "fs";
import fetch from "node-fetch";
import lodash from "lodash";
import Format from "./Format.js";
import Character from "./models/Character.js";
import Reliquaries from "./models/Reliquaries.js";

import Data from "./data/enka.js";

const _path = process.cwd();
const cfgPath = `${_path}/plugins/miao-plugin/config.js`;
let config = {};

if (fs.existsSync(cfgPath)) {
  let fileData = await import (`file://${cfgPath}`);
  if (fileData && fileData.config) {
    config = fileData.config;
  }
}

const userPath = `${_path}/data/UserData/`;

if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath);
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let Profile = {
  async request(uid, e) {
    let api = `https://enka.shinshin.moe/u/${uid}/__data.json`;
    let inCd = await redis.get(`miao:role-all:${uid}`);
    if (inCd === 'loading') {
      e.reply("请求过快，请稍后重试..");
      return false;
    } else if (inCd === 'pending') {
      e.reply("距上次请求刷新成功间隔小于5分钟，请稍后重试..");
      return false;
    }
    await redis.set(`miao:role-all:${uid}`, 'loading', { EX: 20 });
    e.reply("开始获取数据，可能会需要一定时间~");
    await sleep(1000);
    let data;
    try {
      let req = await fetch(api);
      data = await req.json();
      if (!data.playerInfo) {
        if ((uid + '')[0] === '2') {
          e.reply(`请求失败:暂时不支持以2开头的UID角色面板更新，请等待服务后续升级`);
        } else if ((uid + '')[0] === '5') {
          e.reply(`请求失败:暂时不支持B服角色面板更新，请等待服务后续升级`);
        } else {
          e.reply(`请求失败:${data.msg || "请求错误，请稍后重试"}`);
        }
        return false;
      }
      let details = data.avatarInfoList;
      if (!details || details.length === 0 || !details[0].propMap) {
        e.reply(`请打开角色展柜的显示详情`);
        return false;
      }

      // enka服务测冷却时间5分钟
      await redis.set(`miao:role-all:${uid}`, 'pending', { EX: 300 });
      let userData = {};
      userData = Profile.save(uid, data, 'enka')
      return userData;
    } catch (err) {
      console.log(err);
      e.reply(`请求失败`);
      return false;
    }
  },

  save(uid, ds, dataSource = 'enka') {
    let userData = {};
    const userFile = `${userPath}/${uid}.json`;
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, "utf8")) || {};
    }
    let data;

    data = Data.getData(uid, ds);

    lodash.assignIn(userData, lodash.pick(data, "uid,name,lv,avatar".split(",")));
    userData.chars = userData.chars || {};
    lodash.forEach(data.chars, (char, charId) => {
      userData.chars[charId] = char;
    });
    fs.writeFileSync(userFile, JSON.stringify(userData), "", " ");
    return data;
  },

  get(uid, charId) {
    const userFile = `${userPath}/${uid}.json`;
    let userData = {};
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, "utf8")) || {};
    }
    if (userData && userData.chars && userData.chars[charId]) {
      return userData.chars[charId];
    }
    return false;
  },

  getAll(uid) {
    const userFile = `${userPath}/${uid}.json`;
    let userData = {};
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, "utf8")) || {};
    }
    if (userData && userData.chars) {
      return userData.chars;
    }
    return false;
  },

  formatArti(ds) {
    if (lodash.isArray(ds[0])) {
      let ret = [];
      lodash.forEach(ds, (d) => {
        ret.push(Profile.formatArti(d));
      })
      return ret;
    }
    let title = ds[0], val = ds[1];
    if (!title || title === "undefined") {
      return [];
    }
    if (/伤害加成/.test(title) && val < 1) {
      val = Format.pct(val * 100);
    } else if (/伤害加成|大|暴|充能|治疗/.test(title)) {
      val = Format.pct(val);
    } else {
      val = Format.comma(val, 1);
    }


    if (/元素伤害加成/.test(title)) {
      title = title.replace("元素伤害", "伤");
    } else if (title === "物理伤害加成") {
      title = "物伤加成";
    }
    return [title, val];
  },

  getArtiMark(data, ds) {
    Reliquaries.getMark(data)
    let total = 0;
    lodash.forEach(data, (ret) => {
      if (ret[0] && ret[1]) {
        total += mark[ret[0]] * ret[1];
      }
    })
    if (ds && /暴/.test(ds[0])) {
      total += 20;
    }
    return total;
  },

  getArtiDetail(profile, avatar) {

    let reliquaries = [],
      totalMark = 0,
      totalMaxMark = 0;

    lodash.forEach(avatar.reliquaries, (ds) => {
      let pos = ds.pos_name;
      let arti = profile.artis[`arti${posIdx[pos].idx}`];
      if (arti) {
        let mark = Reliquaries.getMark(avatar.name, arti.attrs);
        let maxMark = Reliquaries.getMaxMark(avatar.name, arti.main[0] || "");
        totalMark += mark;
        totalMaxMark += maxMark;
        ds.mark = Format.comma(mark, 1);
        ds.markType = Reliquaries.getMarkScore(mark, maxMark);
        ds.main = Profile.formatArti(arti.main);
        ds.attrs = Profile.formatArti(arti.attrs);
      }
      posIdx[pos].data = ds;
    })
    lodash.forEach(posIdx, (ds) => {
      if (ds && ds.data) {
        reliquaries.push(ds.data);
      } else {
        reliquaries.push({});
      }
    });

    return {
      reliquaries,
      totalMark,
      totalMaxMark,
      markScore: Reliquaries.getMarkScore(totalMark * 1.05, totalMaxMark)
    }
  },

  inputProfile(uid, e) {
    let { avatar, inputData } = e;
    inputData = inputData.replace("#", "");
    inputData = inputData.replace(/，|；|、|\n|\t/g, ",");
    let attr = {};
    let attrMap = {
      hp: /生命/,
      def: /防御/,
      atk: /攻击/,
      mastery: /精通/,
      cRate: /(暴击率|爆率|暴击$)/,
      cDmg: /(爆伤|暴击伤害)/,
      hInc: /治疗/,
      recharge: /充能/,
      dmgBonus: /[火|水|雷|草|风|岩|冰|素|^]伤/,
      phyBonus: /(物理|物伤)/
    }
    lodash.forEach(inputData.split(","), (ds, idx) => {
      ds = ds.trim();
      if (!ds) {
        return;
      }
      let dRet = /(.*?)([0-9\.\+\s]+)/.exec(ds);
      if (!dRet || !dRet[1] || !dRet[2]) {
        return;
      }
      let name = dRet[1].trim(),
        data = dRet[2].trim();
      lodash.forEach(attrMap, (reg, key) => {
        if (reg.test(name)) {
          if (['hp', 'def', 'atk'].includes(key)) {
            let tmp = data.split("+");
            attr[key] = Math.max(0, Math.min(60000, tmp[0].trim() * 1 + tmp[1].trim() * 1 || 0));
            attr[key + "Base"] = Math.max(0, Math.min(40000, tmp[0].trim() * 1 || 0));
          } else {
            attr[key] = Math.max(0, Math.min(400, data * 1 || 0));
          }
          return false;
        }
      })
    })

    if (lodash.keys(attr) < 3) {
      return false;
    }

    let char = Character.get(avatar);
    let data = {
      id: char.id,
      name: char.name,
      dataSource: "input",
      attr
    }
    let userData = {};
    const userFile = `${userPath}/${uid}.json`;
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, "utf8")) || {};
    }
    userData.chars = userData.chars || {};
    userData.chars[avatar] = data;
    fs.writeFileSync(userFile, JSON.stringify(userData), "", " ");
    return true;
  }
};
export default Profile;
