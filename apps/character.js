import fetch from "node-fetch";
import { segment } from "oicq";
import lodash from "lodash";
import fs from "fs";

let getUrl, getServer;

import { Character } from "../components/models.js";


//角色昵称
let nameID = "";
let genshin = {};
await init();


export async function init(isUpdate = false) {
  let _path = "file://" + process.cwd();
  console.log(_path + "config/gen");
  let version = isUpdate ? new Date().getTime() : 0;

  genshin = await import(_path + `/config/genshin/roleId.js?version=${version}`);
  nameID = "";
}


//#神里
export async function character(e, { render, MysApi }) {
  let roleId = roleIdToName(e.msg.replace(/#|老婆|老公|[1|2|5][0-9]{8}/g, "").trim());


  let hutao = Character.get("胡桃");

  console.log(hutao.a)

  return true;

  if (!roleId) return false;

  getUrl = MysApi.getUrl;
  getServer = MysApi.getServer;

  let uidRes = await getUid(e);


  if (!uidRes.uid && uidRes.isSelf) {
    e.reply("请先发送#+你游戏的uid");
    return true;
  }

  if (!(await limitGet(e))) return true;

  let uid = uidRes.uid;

  let res = await mysApi(e, uid, "character", {
    role_id: uid,
    server: getServer(uid),
  });

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

  let skill = await getSkill(e, uid, avatars);

  let type = "character";

  let base64 = await render("miao-plugin", type, {
    _plugin: true,
    save_id: uid,
    uid: uid,
    skill,
    ...get_character(avatars),
  }, "png");

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }

  return true; //事件结束不再往下
}


//获取角色技能数据
async function getSkill(e, uid, avatars) {

  let skill = {};
  if (NoteCookie && NoteCookie[e.user_id] && NoteCookie[e.user_id].uid == uid && NoteCookie[e.user_id].cookie.includes("cookie_token")) {
    let skillres = await mysApi(e, uid, "detail", {
      role_id: uid,
      server: getServer(uid),
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
  }

  return skill;
}


function get_character(avatars) {
  let list = [];
  let set = {};
  let setArr = [];
  let text1 = "";
  let text2 = "";
  let bg = 2;

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
    bg,
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

