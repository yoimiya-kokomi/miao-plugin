import { segment } from "oicq";
import lodash from "lodash";
import { Character } from "../components/models.js"
import { Cfg } from "../components/index.js";
import fs from "fs";
import sizeOf from "image-size";


//角色昵称
let nameID = "";
let genshin = {};
await init();

const relationMap = {
  wife: {
    keyword: "老婆,媳妇,妻子,娘子".split(","),
    type: 0
  },
  husband: {
    keyword: "老公,丈夫,夫君,郎君".split(","),
    type: 1
  },
  gf: {
    keyword: "女朋友,女友,女神".split(","),
    type: 0
  },
  bf: {
    keyword: "男朋友,男友,男神".split(","),
    type: 1
  },
  daughter: {
    keyword: "女儿".split(","),
    type: 2
  },
  son: {
    keyword: "儿子".split(","),
    type: 3
  }
}

const relation = lodash.flatMap(relationMap, (d) => d.keyword);
export const wifeReg = `^#*\\s*(${relation.join("|")})\\s*(设置|选择|指定|列表|查询|列表|是|是谁|照片|相片|写真|图像)?\\s*([^\\d]*)\\s*(\\d*)$`;

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
  if (Cfg.isDisable(e, "char.char")) {
    return;
  }

  let name = e.msg.replace(/#|老婆|老公|[1|2|5][0-9]{8}/g, "").trim();

  let char = Character.get(name);
  if (!char) {
    return false;
  }

  return renderAvatar(e, char.name, render);
}


//#老婆
export async function wife(e, { render, User }) {
  let msg = e.msg || "";
  msg = msg.replace(/#|\w/g, "");
  if (!msg) return false;

  if (Cfg.isDisable(e, "char.wife")) {
    return;
  }

  let msgRet = (new RegExp(wifeReg)).exec(msg);
  if (!msgRet) return false;

  let target = msgRet[1],
    action = msgRet[2] || "卡片",
    actionParam = msgRet[3] || "";

  let targetCfg = lodash.find(relationMap, (cfg, key) => {
    cfg.key = key;
    return cfg.keyword.includes(target);
  });
  if (!targetCfg) return true;

  let avatarList = [], avatar = {}, wifeList = [];

  let MysApi = await e.getMysApi({
    auth: "all",
    targetType: Cfg.get("char.queryOther", true) ? "all" : "self",
    cookieType: "all",
    actionName: "查询信息"
  });
  let selfUser = MysApi.selfUser;

  let selfMysUser = await MysApi.selfUser.getMysUser();
  let isSelf = true;
  if (!selfMysUser || selfMysUser.uid !== MysApi.targetUser.uid) {
    isSelf = false;
  }

  switch (action) {
    case "卡片":
    case "照片":
    case "相片":
    case "图片":
    case "写真":
      // 展示老婆卡片

      // 如果选择过，则进行展示
      wifeList = await selfUser.getCfg(`wife.${targetCfg.key}`, []);
      let renderType = action === "卡片" ? "card" : "photo";
      // 存在设置
      if (wifeList && wifeList.length > 0 && isSelf) {
        if (wifeList[0] === "随机") {
          // 如果选择为全部，则从列表中随机选择一个
          avatarList = await getAvatarList(e, targetCfg.type, MysApi);
          let avatar = lodash.sample(avatarList);
          return renderAvatar(e, avatar, render, renderType);
        } else {
          // 如果指定过，则展示指定角色
          return renderAvatar(e, lodash.sample(wifeList), render, renderType);
        }
      } else {
        // 如果未指定过，则从列表中排序并随机选择前5个
        avatarList = await getAvatarList(e, targetCfg.type, MysApi);
        if (avatarList && avatarList.length > 0) {
          avatar = lodash.sample(avatarList.slice(0, 5));
          return renderAvatar(e, avatar, render, renderType);
        } else {
          e.reply(`在当前米游社公开展示的角色中未能找到适合展示的角色..`);
          return true;
        }
      }
      break;
    case "设置":
    case "选择":
    case "挑选":
    case "指定":
      if (!isSelf) {
        e.reply("只能指定自己的哦~");
        return true;
      }
      // 选择老婆
      actionParam = actionParam.replace(/，/g, ",");
      wifeList = actionParam.split(",");
      let addRet = [];
      if (lodash.intersection(["全部", "任意", "随机", "全都要"], wifeList).length > 0) {
        addRet = ['随机'];
      } else {
        wifeList = lodash.map(wifeList, (name) => {
          let char = Character.get(name);
          if (char) {
            return char.name;
          }
        });
        wifeList = lodash.filter(lodash.uniq(wifeList), (d) => !!d);
        avatarList = await getAvatarList(e, targetCfg.type, MysApi);
        avatarList = lodash.map(avatarList, (avatar) => avatar.name);
        avatarList = lodash.filter(avatarList, (d) => !!d);
        addRet = lodash.intersection(avatarList, wifeList);
        if (addRet.length === 0) {
          e.reply(`在可选的${targetCfg.keyword[0]}列表中未能找到 ${actionParam} ~`);
          if (!MysApi.isSelfCookie) {
            e.reply("请确认已在米游社展示对应角色，也可以绑定Cookie以查询所有角色..");
          }
          return true;
        }
      }
      await selfUser.setCfg(`wife.${targetCfg.key}`, addRet);
      e.reply(`${targetCfg.keyword[0]}已经设置：${addRet.join("，")}`);
      return true;
      break;
    case "列表":
    case "是":
    case "是谁":
      // 查看当前选择老婆

      if (!isSelf) {
        e.reply("只能查看自己的哦~");
        return true;
      }

      wifeList = await selfUser.getCfg(`wife.${targetCfg.key}`, []);
      if (wifeList && wifeList.length > 0) {
        e.reply(`你的${targetCfg.keyword[0]}是：${wifeList.join("，")}`);
      } else {
        e.reply(`尚未设置，回复#${targetCfg.keyword[0]}设置+角色名 来设置，如果设置多位请用逗号间隔`)
      }
      break;
  }
  return true;
}

async function getAvatarList(e, type, MysApi) {
  let data = await MysApi.getCharacter();
  if (!data) return false;

  let avatars = data.avatars;

  if (avatars.length <= 0) {
    return false;
  }
  let list = [];
  for (let val of avatars) {
    if (!genshin.wifeData[type].includes(Number(val.id))) {
      continue;
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

async function renderAvatar(e, avatar, render, renderType = "card") {

  // 如果传递的是名字，则获取
  if (typeof (avatar) === "string") {
    let char = Character.get(avatar);
    if (!char) {
      return false;
    }
    let roleId = char.id;
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
    avatar = avatars[roleId];
  }


  return await renderCard(e, avatar, render, renderType);

}

// 渲染角色卡片
async function renderCard(e, avatar, render, renderType = "card") {
  let talent = await getTalent(e, avatar);
  // 计算皇冠个数
  let crownNum = lodash.filter(lodash.map(talent, (d) => d.level_original), (d) => d >= 10).length;

  let uid = e.targetUser.uid;

  let char = Character.get(avatar.name);

  let bg = getCharacterImg(avatar.name);

  if (renderType === "photo") {
    e.reply(segment.image(process.cwd() + "/plugins/miao-plugin/resources/" + bg.img));
  } else {
    //渲染图像
    let base64 = await render("character", "card", {
      save_id: uid,
      uid: uid,
      talent,
      crownNum,
      talentMap: { a: "普攻", e: "战技", q: "爆发" },
      bg: getCharacterImg(avatar.name),
      ...getCharacterData(avatar),
      ds: char.getData("name,id,title,desc"),
      cfgScale: Cfg.scale(1.25)
    }, "png");
    if (base64) {
      e.reply(segment.image(`base64://${base64}`));
    }
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

  if (!fs.existsSync(`./plugins/miao-plugin/resources/character-img/${name}/`)) {
    fs.mkdirSync(`./plugins/miao-plugin/resources/character-img/${name}/`);
  }

  let list = {};
  let imgs = fs.readdirSync(`./plugins/miao-plugin/resources/character-img/${name}/`);
  imgs = imgs.filter((img) => /\.(png|jpg|webp)/.test(img));

  lodash.forEach(imgs, (img) => {
    list[img] = `character-img/${name}/${img}`
  });

  const plusPath = `./plugins/miao-plugin/resources/miao-res-plus/`;
  if (fs.existsSync(plusPath)) {
    if (!fs.existsSync(`${plusPath}/character-img/${name}/`)) {
      fs.mkdirSync(`${plusPath}/character-img/${name}/`);
    }

    let imgs = fs.readdirSync(`${plusPath}/character-img/${name}/`);
    imgs = imgs.filter((img) => /\.(png|jpg|webp)/.test(img));
    lodash.forEach(imgs, (img) => {
      list[img] = `miao-res-plus/character-img/${name}/${img}`
    });
  }


  let img = lodash.sample(lodash.values(list));

  if (!img) {

    img = "/character-img/default/01.jpg";
  }

  let ret = sizeOf(`./plugins/miao-plugin/resources/${img}`);
  ret.img = img;
  ret.mode = ret.width > ret.height ? "left" : "bottom";
  return ret;
}
