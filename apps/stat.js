/*
* 胡桃数据库的统计
*
* */
import { HutaoApi, Character } from "../components/models.js";
import lodash from "lodash";
import { segment } from "oicq";

export async function consStat(e, { render }) {

  let consData = await HutaoApi.getCons();
  if (!consData) {
    e.reply("暂时无法查询");
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
    }
  }, "png");
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;
}

export async function abyssPct(e, { render }) {
  let abyssData = await HutaoApi.getAbyssPct();
  if (!abyssData) {
    e.reply("暂时无法查询");
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

  console.log('floor', chooseFloor);


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
          star: char.star,
          value: ds.value
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
    }
  }, "png");
  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true;

}