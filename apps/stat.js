/*
* 胡桃数据库的统计
*
* */
import { HutaoApi, Character } from "../components/models.js";
import { Cfg } from "../components/index.js";
import lodash from "lodash";
import { segment } from "oicq";
import fs from "fs";

export async function consStat(e, { render }) {
  if (Cfg.isDisable(e, "wiki.abyss")) {
    return;
  }

  let consData = await HutaoApi.getCons();
  if (!consData) {
    e.reply("角色持有数据获取失败，请稍后重试~");
    return true;
  }


  let msg = e.msg;

  let mode = /持有/.test(msg) ? "char" : "cons";

  let conNum = -1;
  if (mode === "cons") {
    lodash.forEach([/0|零/, /1|一/, /2|二/, /3|三/, /4|四/, /5|五/, /6|六|满/], (reg, idx) => {
      if (reg.test(msg)) {
        conNum = idx;
        return false;
      }
    })
  }

  if (!consData && !consData.data) {
    return true;
  }

  let ret = [];

  lodash.forEach(consData.data, (ds) => {
    let char = Character.get(ds.avatar);

    let data = {
      name: char.name || ds.avatar,
      star: char.star || 3,
      hold: ds.holdingRate
    };

    if (mode === "char") {
      data.cons = lodash.map(ds.rate, (c) => {
        c.value = c.value * ds.holdingRate;
        return c;
      });
    } else {
      data.cons = ds.rate
    }


    ret.push(data);
  });

  if (conNum > -1) {
    ret = lodash.sortBy(ret, [`cons[${conNum}].value`]);
    ret.reverse();
  } else {
    ret = lodash.sortBy(ret, ['hold']);
  }

  let base64 = await render("stat", "character", {
    chars: ret,
    abbr: Character.getAbbr(),
    mode: mode,
    conNum,
    lastUpdate: consData.lastUpdate,
    pct: function (num) {
      return (num * 100).toFixed(2);
    },
    cfgScale: Cfg.scale(1.5)
  });
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;
}

export async function abyssPct(e, { render }) {

  if (Cfg.isDisable(e, "wiki.abyss")) {
    return;
  }

  let abyssData = await HutaoApi.getAbyssPct();
  if (!abyssData) {
    e.reply("深渊出场数据获取失败，请稍后重试~");
    return true;
  }

  let ret = [], chooseFloor = -1, msg = e.msg;

  const floorName = {
    "12": "十二层",
    "11": "十一层",
    "10": "十层",
    "9": "九层"
  };

  // 匹配深渊楼层信息
  lodash.forEach(floorName, (cn, num) => {
    let reg = new RegExp(`${cn}|${num}`);
    if (reg.test(msg)) {
      chooseFloor = num;
      return false;
    }
  });

  lodash.forEach(abyssData.data, (floorData) => {
    let floor = {
      floor: floorData.floor,

    };
    let avatars = [];
    lodash.forEach(floorData.avatarUsage, (ds) => {
      let char = Character.get(ds.id);
      if (char) {
        avatars.push({
          name: char.name,
          star: char.rarity,
          value: ds.value * 8
        })
      }
    })
    avatars = lodash.sortBy(avatars, "value", ["asc"]);
    avatars.reverse();
    if (chooseFloor === -1) {
      avatars = avatars.slice(0, 14);
    }

    ret.push({
      floor: floorData.floor,
      avatars
    });
  })


  let base64 = await render("stat", "abyss-pct", {
    abyss: ret,
    floorName,
    chooseFloor,
    lastUpdate: abyssData.lastUpdate,
    pct: function (num) {
      return (num * 100).toFixed(2);
    },
    cfgScale: Cfg.scale(1.5)
  });
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;

}

async function getTalentData(e, isUpdate = false) {

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
  let uid = e.selfUser.uid;

  let hasCache = await redis.get(`cache:uid-talent-new:${uid}`);
  if (hasCache) {
    // 有缓存优先使用缓存
    let jsonRet = fs.readFileSync(cachePath + `${uid}.json`, "utf8");
    avatarRet = JSON.parse(jsonRet);
    return avatarRet;
  } else if (!isUpdate) {
    e.noReplyTalentList = true;
    await YunzaiApps.mysInfo.talentList(e);
    return await getTalentData(e, true);
  }
  return false;
}

export async function abyssTeam(e, { render }) {


  let MysApi = await e.getMysApi({
    auth: "cookie", // 所有用户均可查询
    targetType: "self", // 被查询用户可以是任意用户
    cookieType: "self" // cookie可以是任意可用cookie
  });

  if (!MysApi || !MysApi.selfUser || !MysApi.selfUser.uid) {
    return true;
  }

  let abyssData = await HutaoApi.getAbyssTeam();
  if (!abyssData || !abyssData.data) {
    e.reply("深渊组队数据获取失败，请稍后重试~");
    return true;
  }
  abyssData = abyssData.data;
  let talentData = await getTalentData(e);
  if (!talentData || talentData.length === 0) {
    e.reply("暂时未能获得角色的练度信息，请使用【#练度统计】命令尝试手工获取...");
    return true;
  }

  let avatarRet = {};
  let data = {};

  let noAvatar = {};

  lodash.forEach(talentData, (avatar) => {
    avatarRet[avatar.id] = Math.min(avatar.level, avatar.weapon_level) * 100 + Math.max(avatar.a_original, avatar.e_original, avatar.q_original) * 1000
  });


  let getTeamCfg = (str) => {
    let teams = str.split(",");
    teams.sort();
    let teamMark = 0;
    lodash.forEach(teams, (a) => {
      if (!avatarRet[a]) {
        teamMark = -1;
        noAvatar[a] = true;
      }
      if (teamMark !== -1) {
        teamMark += avatarRet[a] * 1;
      }
    })
    if (teamMark === -1) {
      teamMark = 1;
    }

    return {
      key: teams.join(","),
      mark: teamMark
    };
  }

  let hasSame = function (team1, team2) {
    for (let idx = 0; idx < team1.length; idx++) {
      if (team2.includes(team1[idx])) {
        return true;
      }
    }
    return false;
  }

  lodash.forEach(abyssData, (ds) => {
    let floor = ds.level.floor;
    if (!data[floor]) {
      data[floor] = {
        up: {},
        down: {},
        teams: []
      };
    }
    lodash.forEach(ds.teams, (ds) => {
      lodash.forEach(['up', 'down'], (halfKey) => {
        let teamCfg = getTeamCfg(ds.id[`${halfKey}Half`]);
        if (teamCfg) {
          if (!data[floor][halfKey][teamCfg.key]) {
            data[floor][halfKey][teamCfg.key] = {
              count: 0,
              mark: 0,
              hasTeam: teamCfg.mark > 1
            };
          }
          data[floor][halfKey][teamCfg.key].count += ds.value;
          data[floor][halfKey][teamCfg.key].mark += ds.value * teamCfg.mark;
        }

      })
    });

    let temp = [];
    lodash.forEach(['up', 'down'], (halfKey) => {
      lodash.forEach(data[floor][halfKey], (ds, team) => {
        temp.push({
          team,
          teamArr: team.split(","),
          half: halfKey,
          count: ds.count,
          mark: ds.mark,
          mark2: 1,
          hasTeam: ds.hasTeam
        })
      })
      temp = lodash.sortBy(temp, "mark")
      data[floor].teams = temp.reverse();
    });
  });


  let ret = {};

  lodash.forEach(data, (floorData, floor) => {
    ret[floor] = {}
    let ds = ret[floor];
    lodash.forEach(floorData.teams, (t1) => {
      if (t1.mark2 <= 0) {
        return;
      }
      lodash.forEach(floorData.teams, (t2) => {
        if (t1.mark2 <= 0) {
          return false;
        }
        if (t1.half === t2.half || t2.mark2 <= 0) {
          return;
        }

        let teamKey = t1.half === "up" ? (t1.team + "+" + t2.team) : (t2.team + "+" + t1.team);
        if (ds[teamKey]) {
          return;
        }
        if (hasSame(t1.teamArr, t2.teamArr)) {
          return;
        }

        ds[teamKey] = {
          up: t1.half === "up" ? t1 : t2,
          down: t1.half === "up" ? t2 : t1,
          count: Math.min(t1.count, t2.count),
          mark: t1.hasTeam && t2.hasTeam ? t1.mark + t2.mark : t1.count + t2.count // 如果不存在组队则进行评分惩罚
        }
        t1.mark2--;
        t2.mark2--;
        return false;
      });
      if (lodash.keys(ds).length >= 20) {
        return false;
      }
    })
  });

  lodash.forEach(ret, (ds, floor) => {
    ds = lodash.sortBy(lodash.values(ds), 'mark');
    ds = ds.reverse();
    ds = ds.slice(0, 4);

    lodash.forEach(ds, (team) => {
      team.up.teamArr = Character.sortIds(team.up.teamArr);
      team.down.teamArr = Character.sortIds(team.down.teamArr);
    })

    ret[floor] = ds;
  })

  let avatarMap = {};

  lodash.forEach(talentData, (ds) => {
    avatarMap[ds.id] = {
      id: ds.id,
      name: ds.name,
      star: ds.rarity,
      level: ds.level,
      cons: ds.cons
    }
  })

  lodash.forEach(noAvatar, (d, id) => {
    let char = Character.get(id);
    avatarMap[id] = {
      id,
      name: char.name,
      star: char.star,
      level: 0,
      cons: 0,
    }
  })


  let base64 = await render("stat", "abyss-team", {
    teams: ret,
    avatars: avatarMap,
    cfgScale: Cfg.scale(1.5)
  });
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }

  return true;
}