import fs from "fs";
import fetch from "node-fetch";
import lodash from "lodash";
import Format from "./Format.js";
import Character from "./models/Character.js";
import Reliquaries from "./models/Reliquaries.js";

const _path = process.cwd();
const cfgPath = `${_path}/plugins/miao-plugin/config.js`;
let config = {};
//try {
if (fs.existsSync(cfgPath)) {
  let fileData = await import (`file://${cfgPath}`);
  if (fileData && fileData.config) {
    config = fileData.config;
  }
}
//} catch (e) {
// do nth
//}

const userPath = `${_path}/data/UserData/`;

if (!fs.existsSync(userPath)) {
  fs.mkdirSync(userPath);
}

const artifactMap = {
  '生命值': {
    title: "小生命"
  },
  '生命值_百分比': {
    title: "大生命",
    pct: true
  },
  '暴击率': {
    title: "暴击率",
    pct: true
  },
  '暴击伤害': {
    title: "暴击伤害",
    pct: true
  },
  '防御力': {
    title: "小防御"
  },
  '防御力_百分比': {
    title: "大防御",
    pct: true
  },
  '攻击力': {
    title: "小攻击"
  },
  '攻击力_百分比': {
    title: "大攻击",
    pct: true
  },
  '元素精通': {
    title: "元素精通"
  },
  '元素充能效率': {
    title: "充能效率",
    pct: true
  },
  '治疗加成': {
    title: "治疗加成",
    pct: true
  }
}


let posIdx = {
  "生之花": {
    idx: 1
  },
  "死之羽": {
    idx: 2
  },
  "时之沙": {
    idx: 3
  },
  "空之杯": {
    idx: 4
  },
  "理之冠": {
    idx: 5
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let Data = {
  getData(uid, data) {
    let ret = {
      uid,
      chars: {}
    };

    lodash.forEach({
      name: "角色名称",
      avatar: "头像ID",
      lv: "冒险等阶"
    }, (title, key) => {
      ret[key] = data[title] || "";
    })

    lodash.forEach(data.items, (ds) => {
      let char = Data.getAvatar(ds);
      ret.chars[char.id] = char;
    });

    return ret;

  },
  getAvatar(data) {
    let char = Character.get(data["英雄Id"]);
    return {
      id: data["英雄Id"],
      name: char ? char.name : "",
      lv: data['等级'],
      attr: Data.getAttr(data),
      // weapon: Data.getWeapon(data),
      artis: Data.getArtifact(data),
      //cons: data["命之座数量"] * 1 || 0,
      //talent: Data.getTalent(data)
    };
  },
  getAttr(data) {
    let ret = {};
    let attrKey = {
      atk: "攻击力_总",
      atkBase: "属性攻击力",
      def: "防御力_总",
      defBase: "属性防御力",
      hp: "生命值上限_总",
      hpBase: "属性生命值上限",
      mastery: "属性元素精通",
      cRate: {
        title: "属性暴击率",
        pct: true
      },
      cDmg: {
        title: "属性暴击伤害",
        pct: true
      },
      hInc: {
        title: "属性治疗加成",
        pct: true
      },
      recharge: {
        title: "属性元素充能效率",
        pct: true
      }
    };
    lodash.forEach(attrKey, (cfg, key) => {
      if (typeof (cfg) === "string") {
        cfg = {title: cfg};
      }
      let val = data[cfg.title] || "";
      if (cfg.pct) {
        val = (val * 100).toFixed(2)
      }
      ret[key] = val;
    });
    let maxDmg = 0;
    lodash.forEach("火水草雷风冰岩".split(""), (key) => {
      maxDmg = Math.max(data[`属性${key}元素伤害加成`] * 1, maxDmg);
    });
    ret.dmgBonus = (maxDmg * 100).toFixed(2);
    ret.phyBonus = (data[`属性物理伤害加成`] * 100).toFixed(2);

    return ret;
  },
  getWeapon(data) {
    return {
      name: data['武器名称'],
      lv: data['武器等级'],
      refine: data["武器精炼"]
    }
  },
  getArtifact(data) {
    let ret = {};
    let get = function (idx, key) {
      let v = data[`圣遗物${idx}${key}`];
      let ret = /^([^\d]*)([\d\.\-]*)$/.exec(v);
      if (ret && ret[1]) {
        let title = ret[1], val = ret[2];
        if (artifactMap[title]) {
          if (artifactMap[title].pct) {
            val = (val * 100).toFixed(2);
          }
          title = artifactMap[title].title;
        }
        return [title, val];
      }
      return [];
    }

    for (let idx = 1; idx <= 5; idx++) {
      ret[`arti${idx}`] = {
        name: data[`圣遗物${idx}名称`],
        type: data[`圣遗物${idx}类型`],
        main: get(idx, "主词条"),
        attrs: [
          get(idx, "副词条1"),
          get(idx, "副词条2"),
          get(idx, "副词条3"),
          get(idx, "副词条4"),
        ]
      };
    }
    return ret;
  },
  getTalent(data) {
    let ret = {};
    lodash.forEach({
      a: 1,
      e: 2,
      q: 3
    }, (idx, key) => {
      let val = data[`天赋主动名称${idx}`]
      let regRet = /等级(\d*)$/.exec(val);
      if (regRet && regRet[1]) {
        ret[key] = regRet[1] * 1 || 1
      } else {
        ret[key] = 1;
      }
    })
    return ret;
  }
}

let Data2 = {
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
      let char = Data2.getAvatar(ds);
      ret.chars[char.id] = char;
    })

    return ret;

  },
  getAvatar(data) {
    let char = Character.get(data.avatarId);
    return {
      id: data["avatarId"],
      name: char ? char.name : "",
      dataSource: "shin",
      lv: data.propMap['4001'].val * 1,
      attr: Data2.getAttr(data.fightPropMap),
      // weapon: Data.getWeapon(data),
      artis: Data2.getArtifact(data.equipList),
      //cons: data["命之座数量"] * 1 || 0,
      //talent: Data.getTalent(data)
    };
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

    let artiIdx = {
      EQUIP_BRACER: 1,
      EQUIP_NECKLACE: 2,
      EQUIP_SHOES: 3,
      EQUIP_RING: 4,
      EQUIP_DRESS: 5
    }
    let attrMap = {
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
    }

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

      ret[`arti${idx}`] = {
        name: "",
        id: ds.itemId,
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
};

let Profile = {
  async request(uid, e) {
    let api = `https://enka.shinshin.moe/u/${uid}/__data.json`;
    let inCd = await redis.get(`miao:role-all:${uid}`);
    if (inCd === 'loading') {
      e.reply("请求过快，请稍后重试..");
      return false;
    } else if (inCd === 'pending') {
      e.reply("距上次请求刷新成功间隔小于2分钟，请稍后重试..");
      return false;
    }
    await redis.set(`miao:role-all:${uid}`, 'loading', {EX: 20});
    e.reply("开始获取数据，可能会需要一定时间~");
    await sleep(1000);
    let data;
    try {
      let req = await fetch(api);
      data = await req.json();
      if (!data.playerInfo) {
        e.reply(`请求失败:${data.msg || "请求错误，请稍后重试"}`);
        return false;
      }
      let details = data.avatarInfoList;
      if (!details || details.length === 0 || !details[0].propMap) {
        e.reply(`请打开角色展柜的显示详情`);
        return false;
      }
    } catch (err) {
      e.reply(`请求失败`);
    }
    // 请求成功Bot侧对该uid冷却10分钟
    // 请勿将时间改短，10分钟之内若发起请求会命中服务侧的uid缓存，返回之前的数据，并导致服务侧重新计时
    await redis.set(`miao:role-all:${uid}`, 'pending', {EX: 120});

    let userData = {};
    userData = Profile.save(uid, data, true)

    userData.leftCount = 99;
    return userData;

  },
  async request_bak(uid, e) {
    let cfg = config.miaoApi || {};
    if (!cfg.api) {
      e.reply("该功能为小范围非公开功能，需具备Token才可使用~");
      return false;
    }
    if (!cfg.qq || !cfg.token || cfg.token.length !== 32) {
      e.reply("Token错误，无法请求数据~");
      return false;
    }
    let inCd = await redis.get(`miao:role-all:${uid}`);
    if (inCd === 'loading') {
      e.reply("请求过快，请稍后重试..");
      return false;
    } else if (inCd === 'pending') {
      e.reply("距上次请求刷新成功间隔小于10分钟，请稍后重试..");
      return false;
    }
    await redis.set(`miao:role-all:${uid}`, 'loading', {EX: 20});
    e.reply("开始获取数据，可能会需要一定时间~");

    await sleep(1000);

    let api = `${cfg.api}?uid=${uid}&qq=${cfg.qq}&token=${cfg.token}`;
    if (e.avatar) {
      api += `&avatar=${e.avatar}`;
    }
    let req = await fetch(api);
    let data = await req.json();
    if (data.status !== 0 || !data.data) {
      e.reply(`请求失败:${data.msg || "未知错误"}`);
      return false;
    }
    // 请求成功Bot侧对该uid冷却10分钟
    // 请勿将时间改短，10分钟之内若发起请求会命中服务侧的uid缓存，返回之前的数据，并导致服务侧重新计时
    await redis.set(`miao:role-all:${uid}`, 'pending', {EX: 600});
    let leftCount = data.leftCount;
    data = data.data;
    let userData = {};
    if (data && data["角色名称"]) {
      userData = Profile.save(uid, data)
    }
    userData.leftCount = leftCount;
    return userData;
  },

  save(uid, ds, isNewFormat = false) {
    let userData = {};
    const userFile = `${userPath}/${uid}.json`;
    if (fs.existsSync(userFile)) {
      userData = JSON.parse(fs.readFileSync(userFile, "utf8")) || {};
    }
    let data;
    if (isNewFormat) {
      data = Data2.getData(uid, ds);
    } else {
      data = Data.getData(uid, ds);
    }

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
    let {avatar, inputData} = e;
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
