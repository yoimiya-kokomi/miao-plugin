//技能列表，配置了cookie能查
import fs from "fs";
import lodash from "lodash";
import common from "../../../lib/common.js";

import { segment } from "oicq";

export async function talentList(e, { render }) {
  //缓存时间，单位小时
  let cacheCd = 6;

  let msg = e.msg.replace("#", "").trim();
  if (msg === "角色统计" || msg === "武器统计") {
    //暂时避让一下抽卡分析的关键词
    return false;
  }

  let MysApi = await getMysApi(e);
  if (!MysApi) return true;
  let uid = MysApi.targetUid;

  //禁止重复获取
  if (skillLoading[e.user_id]) {
    e.reply("角色数据获取中，请耐心等待...");
    setTimeout(() => {
      if (skillLoading[e.user_id]) delete skillLoading[e.user_id];
    }, 60000);
    return;
  }

  const displayMode = /(角色|武器|练度)/.test(e.msg) ? "weapon" : "talent";

  //四星五星
  let star = 0;
  if (/(四|4)/.test(msg)) star = 4;
  if (/(五|5)/.test(msg)) star = 5;

  // 技能查询缓存
  let cachePath = `./data/cache/`;
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }
  cachePath += "talentList/";
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  let avatarRet = [];

  let hasCache = await redis.get(`cache:uid-talent-new:${uid}`); // 由于数据结构改变，临时修改一下键值，防止命中历史缓存导致展示错误
  if (hasCache && !/force/.test(e.msg)) {
    // 有缓存优先使用缓存
    let jsonRet = fs.readFileSync(cachePath + `${uid}.json`, "utf8");
    avatarRet = JSON.parse(jsonRet);
  } else {

    skillLoading[e.user_id] = true;
    let resIndex = await MysApi.getCharacter();
    if (!resIndex) {
      delete skillLoading[e.user_id];
      return true;
    }

    let avatarData = resIndex && resIndex.avatars || [];

    // let skillRet = [], skill = [];
    //配置了cookie的才去获取技能
    // if (NoteCookie[e.user_id]) {

    let skillRet = [], skill = [];
    //配置了完整cookie的才去获取技能
    if (NoteCookie[e.user_id] && NoteCookie[e.user_id].cookie.includes("cookie_token")) {
      e.reply("角色数据获取中，请耐心等待...");
      //批量获取技能数据，分组10个id一次，延迟100ms
      let num = 10, ms = 100;
      let avatarArr = lodash.chunk(avatarData, num);
      for (let val of avatarArr) {
        for (let avatar of val) {
          skillRet.push(getSkill(e, uid, avatar, MysApi));
        }
        skillRet = await Promise.all(skillRet);
        //过滤没有获取成功的
        skillRet.filter(item => item.a);
        skillRet = skillRet.filter(item => item.a);

        await common.sleep(ms);
      }
      skill = lodash.keyBy(skillRet, "id");
    }

    // 天赋等级背景
    const talentLvMap = '0,1,1,1,2,2,3,3,3,4,5'.split(',')

    // 根据每日素材构建 角色->素材的映射关系
    let charTalentMap = {};
    daily.forEach((weekCfg, week) => {
      lodash.forIn(weekCfg[0], (talentCfg, talentName) => {
        talentCfg[1].forEach((charName) => {
          charTalentMap[charName] = { name: talentName, week: [3, 1, 2][week] };
        })
      })
    });

    for (let idx in avatarData) {
      let curr = avatarData[idx];
      let avatar = lodash.pick(curr, "id,name,rarity,level,rarity,fetter".split(","));
      // 埃洛伊rarity是105...
      avatar.rarity = avatar.rarity > 5 ? 5 : avatar.rarity;
      let weapon = curr.weapon || {};
      "name,level,rarity,affix_level".split(",").forEach((idx) => {
        avatar[`weapon_${idx}`] = curr.weapon[idx];
      });
      avatar.cons = curr.actived_constellation_num;
      if (avatar.id == 10000007) {
        avatar.name = "荧";
      } else if (avatar.id == 10000005) {
        avatar.name = "空";
      } else {
        let talent = charTalentMap[avatar.name] || {};
        avatar.talent = talent.name;
        avatar.talentWeek = talent.week; //`${talent.week}${talent.week + 3}`;
      }

      let skillRet = skill[avatar.id] || {};
      const talentConsCfg = { a: 0, e: 3, q: 5 };

      lodash.forIn(talentConsCfg, (consLevel, key) => {
        let talent = skillRet[key] || {};
        // 天赋等级
        avatar[key] = talent.level_current || '-';
        // 是否有命座加成
        avatar[`${key}_plus`] = talent.level_current > talent.level_original;
        // 天赋书星级
        avatar[`${key}_lvl`] = talentLvMap[talent.level_original * 1];
        avatar[`${key}_original`] = talent.level_original * 1;
      })
      avatar.aeq = avatar.a * 1 + avatar.e + avatar.q;
      avatarRet.push(avatar);
    }

    fs.writeFileSync(cachePath + `${uid}.json`, JSON.stringify(avatarRet));
    //缓存
    await redis.set(`cache:uid-talent-new:${uid}`, uid, { EX: 3600 * cacheCd });
    delete skillLoading[e.user_id];
    // }

  }
  //超过八个角色才分类四星五星
  if (star >= 4 && avatarRet.length > 8) {
    avatarRet = avatarRet.filter(item => item.rarity == star);
  }

  let sortKey = ({
    talent: "aeq,rarity,level,star,fetter,talentWeek",
    weapon: "level,rarity,aeq,cons,weapon_level,weapon_rarity,weapon_affix_level,fetter"
  })[displayMode].split(",");

  avatarRet = lodash.orderBy(avatarRet, sortKey, lodash.repeat("desc,", sortKey.length).split(","));

  let noTalent = avatarRet.length == 0 || /^\-+$/.test(avatarRet.map((d) => d.a).join(""));

  let talentNotice = `技能列表每${cacheCd}小时更新一次`;
  if (noTalent) {
    talentNotice = "未绑定体力Cookie，无法获取天赋列表。请回复 #体力 获取配置教程";
  }

  let week = new Date().getDay();
  if (new Date().getHours() < 4) {
    week--;
  }

  let base64 = await render("genshin", "talentList", {
    save_id: uid,
    uid: uid,
    avatars: avatarRet,
    bgType: Math.ceil(Math.random() * 3),
    abbr: genshin.abbr,
    displayMode,
    isSelf: e.isSelf,
    week: [3, 1, 2][week % 3],
    talentNotice

  });

  if (base64) {
    let msg = [];
    if (e.isGroup) {
      let name = lodash.truncate(e.sender.card, { length: 8 });
      msg.push(segment.at(e.user_id, name));
    }
    msg.push(segment.image(`base64://${base64}`));
    e.reply(msg);
  }
  return true; //事件结束不再往下
}