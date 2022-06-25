import { Character } from "../../components/models.js";
import { Cfg } from "../../components/index.js";
import lodash from "lodash";
import { segment } from "oicq";
import Common from "../../components/Common.js";

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


export async function renderAvatar(e, avatar, render, renderType = "card") {

  // 如果传递的是名字，则获取
  if (typeof (avatar) === "string") {
    let char = Character.get(avatar);
    if (!char) {
      return false;
    }

    let MysApi = await e.getMysApi({
      auth: "all",
      targetType: Cfg.get("char.queryOther", true) ? "all" : "self",
      cookieType: "all",
      actionName: "查询信息"
    });
    if (!MysApi) return true;

    let charData = await MysApi.getCharacter();
    if (!charData) return true;

    let avatars = charData.avatars;
    let length = avatars.length;
    char.checkAvatars(avatars);
    avatars = lodash.keyBy(avatars, "id");

    if (!avatars[char.id]) {
      let name = lodash.truncate(e.sender.card, { length: 8 });
      if (length > 8) {
        e.reply([segment.at(e.user_id, name), `\n没有${e.msg}`]);
      } else {
        e.reply([segment.at(e.user_id, name), "\n请先在米游社展示该角色"]);
      }
      return true;
    }
    avatar = avatars[char.id];
  }
  return await renderCard(e, avatar, render, renderType);

}

// 渲染角色卡片
async function renderCard(e, avatar, render, renderType = "card") {
  let talent = await getTalent(e, avatar);
  // 计算皇冠个数
  let crownNum = lodash.filter(lodash.map(talent, (d) => d.level_original), (d) => d >= 10).length;

  let uid = e.uid || (e.targetUser && e.targetUser.uid);

  let char = Character.get(avatar);

  if (!char) {
    return false;
  }
  let bg = char.getCardImg(Cfg.get("char.se", false));

  if (renderType === "photo") {
    e.reply(segment.image(process.cwd() + "/plugins/miao-plugin/resources/" + bg.img));
  } else {
    //渲染图像
    let msgRes = await Common.render("character/card", {
      save_id: uid,
      uid,
      talent,
      crownNum,
      talentMap: { a: "普攻", e: "战技", q: "爆发" },
      bg,
      ...getCharacterData(avatar),
      ds: char.getData("name,id,title,desc"),
    }, { e, render, scale: 1.6 });
    if (msgRes && msgRes.message_id) {
      // 如果消息发送成功，就将message_id和图片路径存起来，1小时过期
      await redis.set(`miao:original-picture:${msgRes.message_id}`, bg.img, { EX: 3600 });
    }
    return msgRes;
  }
  return true;
}

//获取角色技能数据
async function getTalent(e, avatars) {

  let MysApi = await e.getMysApi({
    auth: "all",
    targetType: Cfg.get("char.queryOther", true) ? "all" : "self",
    cookieType: "all",
    actionName: "查询信息"
  });
  if (!MysApi && !MysApi.isSelfCookie) return {};

  let skill = {};

  let skillRes = await MysApi.getAvatar(avatars.id);

  if (skillRes && skillRes.skill_list) {
    skill.id = avatars.id;
    let skill_list = lodash.orderBy(skillRes.skill_list, ["id"], ["asc"]);

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


let _pokeCharacter = false;

async function initPoke() {
  if (!_pokeCharacter) {
    _pokeCharacter = YunzaiApps.mysInfo.pokeCharacter;
  }
  YunzaiApps.mysInfo.pokeCharacter = async function (e, components) {
    if (Cfg.isDisable('char.poke', true)) {
      return await _pokeCharacter(e, components);
    }
    return await pokeCharacter(e, components);
  }
}

async function pokeCharacter(e, { render }) {
  let MysApi = await e.getMysApi({
    auth: "all",
    targetType: Cfg.get("char.queryOther", true) ? "all" : "self",
    cookieType: "all",
    actionName: "查询信息"
  });
  let avatarList = await getAvatarList(e, false, MysApi);
  let avatar = lodash.sample(avatarList);
  return renderAvatar(e, avatar, render, 'card');
}


/*
* 获取角色数据
* */
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

export async function getAvatarList(e, type, MysApi) {
  let data = await MysApi.getCharacter();
  if (!data) return false;

  let avatars = data.avatars;

  if (avatars.length <= 0) {
    return false;
  }
  let list = [];
  for (let val of avatars) {
    if (type !== false) {
      if (!genshin.wifeData[type].includes(Number(val.id))) {
        continue;
      }
    }
    if (val.rarity > 5) {
      val.rarity = 5;
    }
    list.push(val);
  }

  if (list.length <= 0) {
    return false;
  }
  let sortKey = "level,fetter,weapon_level,rarity,weapon_rarity,cons,weapon_affix_level";
  list = lodash.orderBy(list, sortKey, lodash.repeat("desc,", sortKey.length).split(","));
  return list;
}