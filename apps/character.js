import fetch from "node-fetch";
import { segment } from "oicq";
import lodash from "lodash";
import { Character } from "../components/models.js"
import fs from "fs";
import sizeOf from "image-size";

let getUrl, getServer;

//角色昵称
let nameID = "";
let genshin = {};
await init();

export async function init(isUpdate = false) {
  let _path = "file://" + process.cwd();
  let version = isUpdate ? new Date().getTime() : 0;

  genshin = await import(_path + `/config/genshin/roleId.js?version=${version}`);
  nameID = "";
}

// 查看当前角色
export async function character(e, { render, MysApi, User }) {
  if (!e.msg) {
    return;
  }
  let name = e.msg.replace(/#?|老婆|老公|[1|2|5][0-9]{8}/g, "").trim();
  let char = Character.get(name);
  if (!char) {
    return false;
  }
  let check = await User.checkAuth(e, "bind", {
    action: "查询角色详情"
  });
  if (!check) {
    return true;
  }

  let roleId = char.id;

  getUrl = MysApi.getUrl;
  getServer = MysApi.getServer;

  let { selfUser, targetUser } = e;
  if (!targetUser.uid) {
    e.reply("未能找到查询角色");
    return true;
  }

  let uid = targetUser.uid;

  let res = await MysApi.requestData(e, uid, "character");


  if (res.retcode == "-1") {
    return true;
  }

  if (checkRetcode(res, uid, e)) {
    return true;
  }

  let avatars = res.data.avatars;
  let length = avatars.length;

  avatars = lodash.keyBy(avatars, "id");

  if (roleId == 20000000) {
    if (avatars["10000005"]) {
      roleId = "10000005";
    }
    if (avatars["10000007"]) {
      roleId = "10000007";
    }
  }

  if (!avatars[roleId]) {
    let name = lodash.truncate(e.sender.card, { length: 8 });
    if (length > 8) {
      e.reply([segment.at(e.user_id, name), `\n没有${e.msg}`]);
    } else {
      e.reply([segment.at(e.user_id, name), "\n请先在米游社展示该角色"]);
    }
    return true;
  }

  limitSet(e);

  avatars = avatars[roleId];


  let talent = await getTalent(e, uid, avatars, MysApi);
  let crownNum = lodash.filter(lodash.map(talent, (d) => d.level_original), (d) => d >= 10).length
  let base64 = await render("miao-plugin", "character", {
    _plugin: true,
    save_id: uid,
    uid: uid,
    talent,
    crownNum,
    talentMap: { a: "普攻", e: "战技", q: "爆发" },
    bg: getCharacterImg(char.name),
    ...getCharacterData(avatars),
    ds: char.getData("name,id,title,desc"),
  }, "png");

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }

  return true; //事件结束不再往下
}


//#老婆
export async function wife(e, { render, MysApi, User }) {
  let msg = e.msg;
  if (!msg) {
    return;
  }
  let check = await User.checkAuth(e, "bind", {
    action: "查询角色详情"
  });
  if (!check) {
    return true;
  }

  msg = msg.replace(/#|\w/g, "");

  let i = 0;
  if (["老婆", "媳妇", "妻子", "娘子", "女朋友", "女友", "女神"].includes(msg)) {
    i = 0;
  } else if (["老公", "丈夫", "夫君", "郎君", "男朋友", "男友", "男神"].includes(msg)) {
    i = 1;
  } else if (["女儿"].includes(msg)) {
    i = 2;
  } else if (["儿子"].includes(msg)) {
    e.reply("暂无正太角色");
    return true;
  } else {
    return true;
  }

  let { selfUser, targetUser } = e;
  if (!targetUser.uid) {
    e.reply("暂未查询到角色信息");
    return true;
  }

  let uid = targetUser.uid;

  let res = await MysApi.requestData(e, uid, "character");

  if (res.retcode == "-1") {
    return true;
  }

  if (checkRetcode(res, uid, e)) {
    return true;
  }

  let avatars = res.data.avatars;

  if (avatars.length <= 0) {
    return true;
  }

  let list = [];

  for (let val of avatars) {
    if (!genshin.wifeData[i].includes(Number(val.id))) {
      continue;
    }
    if (val.rarity > 5) {
      val.rarity = 5;
    }

    //等级+好感*10+命座*5+五星*20
    val.sort = val.level + val.fetter * 10 + val.actived_constellation_num * 5 * (val.rarity - 3) + (val.rarity - 4) * 20;

    //超过80级的每级*5
    if (val.level > 80) {
      val.sort += (val.level - 80) * 5;
    }

    //武器 等级+五星*25+精炼*5
    val.sort += val.weapon.level + (val.weapon.rarity - 4) * 25 + val.weapon.affix_level * 5;

    //武器超过80级的每级*5
    if (val.weapon.level > 80) {
      val.sort += (val.weapon.level - 80) * 5;
    }

    //圣遗物等级
    for (let rel of val.reliquaries) {
      val.sort += rel.level * 1.2;
    }

    list.push(val);
  }

  if (list.length <= 0) {
    return true;
  }

  //limitSet(e);

  list = lodash.orderBy(list, ["sort"], ["desc"]);

  avatars = lodash.sample(list.slice(0, 5));

  let talent = await getTalent(e, uid, avatars, MysApi);

  let char = Character.get(avatars.name);

  let crownNum = lodash.filter(lodash.map(talent, (d) => d.level_original), (d) => d >= 10).length

  let base64 = await render("miao-plugin", "character", {
    _plugin: true,
    save_id: uid,
    uid: uid,
    talent,
    crownNum,
    talentMap: { a: "普攻", e: "战技", q: "爆发" },
    bg: getCharacterImg(char.name),
    ...getCharacterData(avatars),
    ds: char.getData("name,id,title,desc"),
  }, "png");

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }

  return true;
}


// 设置角色图像
export async function setCharacterImg(e, render) {

}

//获取角色技能数据
async function getTalent(e, uid, avatars, MysApi) {

  let skill = {};

  let skillres = await MysApi.requestData(e, uid, "detail", {
    avatar_id: avatars.id,
  });
  if (skillres.retcode == 0 && skillres.data && skillres.data.skill_list) {
    skill.id = avatars.id;
    let skill_list = lodash.orderBy(skillres.data.skill_list, ["id"], ["asc"]);
    for (let val of skill_list) {
      val.level_original = val.level_current;
      if (val.name.includes("普通攻击")) {
        skill.a = val;
        continue;
      }
      if (val.max_level >= 10 && !skill.e) {
        skill.e = val;
        continue;
      }
      if (val.max_level >= 10 && !skill.q) {
        skill.q = val;
        continue;
      }
    }
    if (avatars.actived_constellation_num >= 3) {
      if (avatars.constellations[2].effect.includes(skill.e.name)) {
        skill.e.level_current += 3;
      } else if (avatars.constellations[2].effect.includes(skill.q.name)) {
        skill.q.level_current += 3;
      }
    }
    if (avatars.actived_constellation_num >= 5) {
      if (avatars.constellations[4].effect.includes(skill.e.name)) {
        skill.e.level_current += 3;
      } else if (avatars.constellations[4].effect.includes(skill.q.name)) {
        skill.q.level_current += 3;
      }
    }

  }

  return skill;
}

function getCharacterData(avatars) {
  let list = [];
  let set = {};
  let setArr = [];
  let text1 = "";
  let text2 = "";

  let weapon = {
    type: "weapon",
    name: avatars.weapon.name,
    showName: genshin.abbr[avatars.weapon.name] ? genshin.abbr[avatars.weapon.name] : avatars.weapon.name,
    level: avatars.weapon.level,
    affix_level: avatars.weapon.affix_level,
  };

  for (let val of avatars.reliquaries) {
    if (set[val.set.name]) {
      set[val.set.name]++;

      if (set[val.set.name] == 2) {
        if (text1) {
          text2 = "2件套：" + val.set.affixes[0].effect;
        } else {
          text1 = "2件套：" + val.set.affixes[0].effect;
        }
      }

      if (set[val.set.name] == 4) {
        text2 = "4件套：" + val.set.name;
      }
    } else {
      set[val.set.name] = 1;
    }

    list.push({
      type: "reliquaries",
      name: val.name,
      level: val.level,
    });
  }

  for (let val of Object.keys(set)) {
    setArr.push({
      name: val,
      num: set[val],
      showName: genshin.abbr[val] ? genshin.abbr[val] : val,
    });
  }

  if (avatars.reliquaries.length >= 2 && !text1) {
    text1 = "无套装效果";
  }

  if (avatars.id == "10000005") {
    avatars.name = "空";
  } else if (avatars.id == "10000007") {
    avatars.name = "荧";
  }

  let reliquaries = list[0];
  return {
    name: avatars.name,
    showName: genshin.abbr[avatars.name] ? genshin.abbr[avatars.name] : avatars.name,
    level: avatars.level,
    fetter: avatars.fetter,
    actived_constellation_num: avatars.actived_constellation_num,
    weapon,
    text1,
    text2,
    reliquaries,
    set: setArr,
  };
}

//获取uid
async function getUid(e) {
  let res;
  let reg = /[1|2|5][0-9]{8}/g;

  //从消息中获取
  if (e.msg) {
    res = e.msg.match(reg);
    if (res) {
      //redis保存uid
      redis.set(`genshin:uid:${e.user_id}`, res[0], { EX: 2592000 });
      return { isSelf: false, uid: res[0] };
    }
  }

  //从群昵称获取
  res = e.sender.card.toString().match(reg);

  if (res) {
    //redis保存uid
    redis.set(`genshin:uid:${e.user_id}`, res[0], { EX: 2592000 });

    return { isSelf: true, uid: res[0] };
  }

  //从redis获取
  res = await redis.get(`genshin:uid:${e.user_id}`);
  if (res) {
    redis.expire(`genshin:uid:${e.user_id}`, 2592000);
    return { isSelf: true, uid: res };
  }

  return { isSelf: true, uid: false };
}

async function mysApi(e, uid, type, data = {}) {
  if (BotConfig.mysCookies.length <= 0) {
    Bot.logger.error("请打开config.js,配置米游社cookie");
    return { retcode: -300 };
  }

  let dayEnd = getDayEnd();

  let cookie, index, isNew;
  let selfCookie = NoteCookie[e.user_id];

  //私聊发送的cookie
  if (selfCookie && selfCookie.uid == uid) {
    cookie = selfCookie.cookie;
  }
  //配置里面的cookie
  else if (BotConfig.dailyNote && BotConfig.dailyNote[e.user_id] && BotConfig.dailyNote[e.user_id].uid == uid) {
    cookie = BotConfig.dailyNote[e.user_id].cookie;
  } else {
    //获取uid集合
    let uid_arr = await redis.get(`genshin:ds:qq:${e.user_id}`);

    if (uid_arr) {
      uid_arr = JSON.parse(uid_arr);
      if (!uid_arr.includes(uid)) {
        uid_arr.push(uid);

        await redis.set(`genshin:ds:qq:${e.user_id}`, JSON.stringify(uid_arr), {
          EX: dayEnd,
        });
      }
    } else {
      uid_arr = [uid];

      await redis.set(`genshin:ds:qq:${e.user_id}`, JSON.stringify(uid_arr), {
        EX: dayEnd,
      });
    }

    if (uid_arr.length > e.groupConfig.mysUidLimit && !e.isMaster) {
      return { retcode: -200 };
    }

    //限制无用uid查询
    if (uid < 100000050) {
      return { retcode: 10102, message: "Data is not public for the user" };
    }

    isNew = false;
    index = await redis.get(`genshin:ds:uid:${uid}`);
    if (!index) {
      //获取没有到30次的index
      for (let i in BotConfig.mysCookies) {
        //跳过达到上限的cookie
        if (await redis.get(`genshin:ds:max:${i}}`)) {
          continue;
        }
        let count = await redis.sendCommand(["scard", `genshin:ds:index:${i}`]);
        if (count < 27) {
          index = i;
          break;
        }
      }
      //查询已达上限
      if (!index) {
        return { retcode: -100 };
      }
      isNew = true;
    }
    if (!BotConfig.mysCookies[index]) {
      return { retcode: -300 };
    }

    if (!BotConfig.mysCookies[index].includes("ltoken")) {
      Bot.logger.error("米游社cookie错误，请重新配置");
      return { retcode: -400 };
    }
  }

  let { url, headers, query, body } = getUrl(type, uid, data);
  headers.Cookie = cookie || BotConfig.mysCookies[index];

  let param = {
    headers,
    timeout: 10000,
  };
  if (body) {
    param.method = "post";
    param.body = body;
  } else {
    param.method = "get";
  }

  let response = {};
  try {
    response = await fetch(url, param);
  } catch (error) {
    Bot.logger.error(error);
    return false;
  }
  if (!response.ok) {
    Bot.logger.error(response);
    return false;
  }
  const res = await response.json();

  if (!res) {
    Bot.logger.mark(`mys接口没有返回`);
    return false;
  }

  if (isNew) {
    await redis.sendCommand(["sadd", `genshin:ds:index:${index}`, uid]);
    redis.expire(`genshin:ds:index:${index}`, dayEnd);
    redis.set(`genshin:ds:uid:${uid}`, index, { EX: dayEnd });
  }

  if (res.retcode != 0 && ![10102, 1008, -1].includes(res.retcode)) {
    let ltuid = headers.Cookie.match(/ltuid=(\w{0,9})/g)[0].replace(/ltuid=|;/g, "");

    if (selfCookie && selfCookie.uid == uid) {
      Bot.logger.mark(`mys接口报错:${JSON.stringify(res)}，体力配置cookie，ltuid:${ltuid}`);
      //体力cookie失效
      if (res.message == "Please login") {
        delete NoteCookie[e.user_id];
      }
    } else {
      Bot.logger.mark(`mys接口报错:${JSON.stringify(res)}，第${Number(index) + 1}个cookie，ltuid:${ltuid}`);

      //标记达到上限的cookie，自动切换下一个
      if ([10101].includes(res.retcode)) {
        redis.set(`genshin:ds:max:${index}`, "1", { EX: dayEnd });
      }
    }
  }

  return res;
}

function checkRetcode(res, uid, e) {
  let qqName = "";
  switch (res.retcode) {
    case 0:
      Bot.logger.debug(`mys查询成功:${uid}`);
      return false;
    case -1:
      break;
    case -100:
      e.reply("无法查询，已达上限\n请配置更多cookie");
      break;
    case -200:
      qqName = lodash.truncate(e.sender.card, { length: 8 });
      e.reply([segment.at(e.user_id, qqName), "\n今日查询已达上限"]);
      break;
    case -300:
      e.reply("尚未配置公共查询cookie，无法查询原神角色信息\n私聊发送【配置cookie】进行设置");
      break;
    case -400:
      e.reply("米游社cookie错误，请重新配置");
      break;
    case 1001:
    case 10001:
    case 10103:
      e.reply("米游社接口报错，暂时无法查询");
      break;
    case 1008:
      qqName = lodash.truncate(e.sender.card, { length: 8 });
      e.reply([segment.at(e.user_id, qqName), "\n请先去米游社绑定角色"]);
      break;
    case 10101:
      e.reply("查询已达今日上限");
      break;
    case 10102:
      if (res.message == "Data is not public for the user") {
        qqName = lodash.truncate(e.sender.card, { length: 8 });
        e.reply([segment.at(e.user_id, qqName), "\n米游社数据未公开"]);
      } else {
        e.reply(`id:${uid}请先去米游社绑定角色`);
      }
      break;
  }

  return true;
}

/**
 * @param {角色昵称} keyword
 * @param {是否搜索角色默认名} search_val
 * @returns
 */
export function roleIdToName(keyword, search_val = false) {
  if (!keyword) {
    return false;
  }
  if (search_val) {
    return genshin.roleId[keyword][0] ? genshin.roleId[keyword][0] : "";
  }

  if (!nameID) {
    nameID = new Map();
    for (let i in genshin.roleId) {
      for (let val of genshin.roleId[i]) {
        nameID.set(val, i);
      }
    }
  }
  let name = nameID.get(keyword);
  return name ? name : "";
}

async function limitGet(e) {
  if (!e.isGroup) {
    return true;
  }

  if (e.isMaster) {
    return true;
  }

  let key = `genshin:limit:${e.user_id}`;
  let num = await redis.get(key);

  if (num && num >= e.groupConfig.mysDayLimit - 1) {
    let name = lodash.truncate(e.sender.card, { length: 8 });
    e.reply([segment.at(e.user_id, name), "\n今日查询已达上限"]);
    return false;
  }

  return true;
}

async function limitSet(e) {
  if (!e.isGroup) {
    return true;
  }

  let key = `genshin:limit:${e.user_id}`;
  let dayEnd = getDayEnd();

  await redis.incr(key);
  redis.expire(key, dayEnd);
}

function getDayEnd() {
  let now = new Date();
  let dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), "23", "59", "59").getTime() / 1000;

  return dayEnd - parseInt(now.getTime() / 1000);
}

function getCharacterImg(name) {

  if (!fs.existsSync(`./plugins/miao-plugin/resources/characterImg/${name}/`)) {
    fs.mkdirSync(`./plugins/miao-plugin/resources/characterImg/${name}/`);
  }


  let imgs = fs.readdirSync(`./plugins/miao-plugin/resources/characterImg/${name}/`);
  imgs = imgs.filter((img) => /\.(png|jpg|webp)/.test(img));
  let img = lodash.sample(imgs);

  if (!img) {
    name = "刻晴";
    img = "01.jpg";
  }
  let ret = sizeOf(`./plugins/miao-plugin/resources/characterImg/${name}/${img}`);
  ret.img = `/characterImg/${name}/${img}`;
  ret.mode = ret.width > ret.height ? "left" : "bottom";
  return ret;
}
