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
export async function character(e, { render, User }) {
  if (!e.msg) {
    return;
  }
  let name = e.msg.replace(/#|老婆|老公|[1|2|5][0-9]{8}/g, "").trim();

  let char = Character.get(name);
  if (!char) {
    return false;
  }

  let MysApi = await e.getMysApi({
    auth: "all",
    target: "uid",
    cookieType: "all",
    actionName: "查询角色详情"
  });

  if (!MysApi) {
    return true;
  }

  let roleId = char.id, uid = e.targetUser.uid;

  let charData = await MysApi.getCharacter();
  if (!charData) return true;


  let avatars = charData.avatars;
  let length = avatars.length;

  avatars = lodash.keyBy(avatars, "id");

  if (roleId == 20000000) {

    if (avatars["10000005"]) {
      roleId = 10000005;
    }
    if (avatars["10000007"]) {
      roleId = 10000007;
    }
  }
  char.roleId = roleId;

  if (!avatars[roleId]) {
    let name = lodash.truncate(e.sender.card, { length: 8 });
    if (length > 8) {
      e.reply([segment.at(e.user_id, name), `\n没有${e.msg}`]);
    } else {
      e.reply([segment.at(e.user_id, name), "\n请先在米游社展示该角色"]);
    }
    return true;
  }
  let avatar = avatars[roleId];

  renderAvatar(e, avatar, MysApi, render);

  return true; //事件结束不再往下
}

//#老婆
export async function wife(e, { render, User }) {
  let msg = e.msg;
  if (!msg) {
    return;
  }

  let MysApi = await e.getMysApi({
    auth: "all",
    target: "uid",
    cookieType: "all",
    actionName: "查询信息"
  });
  if (!MysApi) return true;

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

  let data = await MysApi.getCharacter();
  if (!data) return true;

  let avatars = data.avatars;

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

    list.push(val);
  }

  if (list.length <= 0) {
    return true;
  }

  let sortKey = "level,fetter,weapon_level,rarity,weapon_rarity,cons,weapon_affix_level";

  list = lodash.orderBy(list, sortKey, lodash.repeat("desc,", sortKey.length).split(","));
  let avatar = lodash.sample(list.slice(0, 5));
  renderAvatar(e, avatar, MysApi, render);
  return true;
}

// 渲染角色卡片
async function renderAvatar(e, avatar, MysApi, render) {
  let talent = await getTalent(e, avatar, MysApi);
  // 计算皇冠个数
  let crownNum = lodash.filter(lodash.map(talent, (d) => d.level_original), (d) => d >= 10).length;

  let uid = e.targetUser.uid;

  let char = Character.get(avatar.name);

  //渲染图像
  let base64 = await render("miao-plugin", "character", {
    _plugin: true,
    save_id: uid,
    uid: uid,
    talent,
    crownNum,
    talentMap: { a: "普攻", e: "战技", q: "爆发" },
    bg: getCharacterImg(avatar.name),
    ...getCharacterData(avatar),
    ds: char.getData("name,id,title,desc"),
  }, "png");

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
}

//获取角色技能数据
async function getTalent(e, avatars, MysApi) {

  let skill = {};

  let skillRes = await MysApi.getAvatar(avatars.id);

  if (skillRes&& skillRes.skill_list) {
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

// 获取角色数据
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
