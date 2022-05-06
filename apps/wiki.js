import { segment } from "oicq";
import fs from "fs";
import { Character } from "../components/models.js";
import lodash from "lodash";
import { Cfg } from "../components/index.js";
import fetch from "node-fetch";
import moment from "moment";

//import {wikiCharacter} from "../modules/wiki.js";

let action = {
  wiki: {
    keyword: "命座|天赋|技能|资料|照片|写真|图片|插画"
  }
}


export async function wiki(e, { render }) {

  if (!e.msg) {
    return false;
  }

  let reg = /#?(.+)(命座|命之座|天赋|技能|资料|照片|写真|图片|插画)$/, msg = e.msg;
  let ret = reg.exec(msg);

  if (!ret || !ret[1] || !ret[2]) {
    return false;
  }

  let mode = "talent";
  if (/命/.test(ret[2])) {
    mode = "cons";
  } else if (/图|画|写真|照片/.test(ret[2])) {
    mode = "pic";
  }

  if (Cfg.isDisable(e, `wiki.${mode}`)) {
    return;
  }


  let char = Character.get(ret[1]);
  if (!char) {
    return false;
  }

  if (mode === "pic") {
    let img = char.getCardImg(false);
    if (img && img.img) {
      e.reply(segment.image(process.cwd() + "/plugins/miao-plugin/resources/" + img.img));
    } else {
      e.reply("暂无图片");
    }
    return true;
  }

  let base64 = await render("wiki", "character", {
    save_id: "天赋" + char.name,
    ...char,
    mode,
    line: getLineData(char),
    _char: `/meta/character/${char.name}/`,
    cfgScale: Cfg.scale(1)
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true; //事件结束不再往下
}

const getLineData = function (data) {
  let ret = [];
  lodash.forEach(data.lvStat.detail["90"], (num, idx) => {
    ret.push({
      num,
      label: data.lvStat.stat[idx]
    })
  })

  return ret;
}

// 更新图像缓存
async function wikiCache(e) {
  const meta = JSON.parse(fs.readFileSync("./data/meta/characters.json", "utf8"));
  let count = 0;
  let data;
  console.log("开始生成角色资料缓存...")
  for (let idx in meta) {
    let base64 = await genWikiImg(meta[idx].Name);
    if (base64) {
      count++;
      console.log(`角色资料缓存: ${meta[idx].Name}，count：${count}`)
    }
  }
  e.reply(`生成Wiki缓存${count}个`)
}

export async function calendar(e, { render }) {
  let listApi = "https://hk4e-api.mihoyo.com/common/hk4e_cn/announcement/api/getAnnList?game=hk4e&game_biz=hk4e_cn&lang=zh-cn&bundle_id=hk4e_cn&platform=pc&region=cn_gf01&level=55&uid=100000000";

  let request = await fetch(listApi);
  let calendarData = await request.json();

  moment.locale("zh-cn");

  let today = moment(), now = moment();
  let temp = today.add(-7, 'days');
  let dateList = [], month = 0, date = [];

  let startDate, endDate;

  const ignoreIds = [495,// 有奖问卷调查开启！
    1263,  // 米游社《原神》专属工具一览
    423,  // 《原神》玩家社区一览
    422,  // 《原神》防沉迷系统说明
    762,  // 《原神》公平运营声明
    762,  // 《原神》公平运营声明
  ]
  const ignoreReg = /(内容专题页|版本更新说明|调研|防沉迷|米游社|专项意见|更新修复与优化)/;


  for (let idx = 0; idx < 13; idx++) {
    let temp = today.add(1, 'days'),
      m = temp.month() + 1, d = temp.date();
    if (month === 0) {
      startDate = temp.format("YYYY-MM-DD");
      month = m;
    }
    if (month !== m && date.length > 0) {
      dateList.push({
        month,
        date
      })
      date = [];
      month = m;
    }
    date.push(d);
    if (idx === 12) {
      dateList.push({
        month,
        date
      })

      endDate = temp.format("YYYY-MM-DD");
    }
  }


  let startTime = moment(startDate + " 00:00:00"),
    endTime = moment(endDate + " 23:59:59");

  let totalRange = endTime - startTime;

  let list = [];
  let getList = (ds, isAct = false) => {
    let type = isAct ? "activity" : "normal",
      id = ds.ann_id,
      title = ds.title,
      banner = isAct ? ds.banner : '',
      extra = { sort: isAct ? 5 : 10 };

    if (ignoreIds.includes(id) || ignoreReg.test(title)) {
      return;
    }


    if (/神铸赋形/.test(title)) {
      type = "weapon";
      title = title.replace(/(单手剑|双手剑|长柄武器|弓|法器|·)/g, "");
      extra.sort = 2;
    } else if (/祈愿/.test(title)) {
      type = "character";
      let regRet = /·(.*)\(/.exec(title);
      if (regRet[1]) {
        let char = Character.get(regRet[1]);
        extra.banner2 = `/meta/character/${regRet[1]}/party.png`;
        extra.character = regRet[1];
        extra.elem = char.elem;
        extra.sort = 1;
      } else if (/纪行/.test(title)) {
        type = "pass"
      }

    }

    let sDate = moment(ds.start_time),
      eDate = moment(ds.end_time);
    let sTime = moment.max(sDate, startTime),
      eTime = moment.min(eDate, endTime);

    let sRange = sTime - startTime,
      eRange = eTime - startTime;

    let left = sRange / totalRange * 100,
      width = eRange / totalRange * 100 - left;

    let label = "";
    if (now > sDate && eDate > now) {
      label = eDate.format("MM-DD HH:mm") + " (" + moment.duration(eDate - now).humanize() + "后结束)"
      if (width > (isAct ? 38 : 55)) {
        label = sDate.format("MM-DD HH:mm") + " ~ " + label;
      }
    } else if (sDate > now) {
      label = sDate.format("MM-DD HH:mm") + " (" + moment.duration(sDate - now).humanize() + "后开始)"
    }

    list.push({
      ...extra,
      id,
      title,
      type,
      banner,
      icon: ds.tag_icon,
      left,
      width,
      label,

      duration: eTime - sTime,
      start: sDate.format("MM-DD HH:mm"),
      end: eDate.format("MM-DD HH:mm")
    })
  };
  lodash.forEach(calendarData.data.list[1].list, (ds) => getList(ds, true))
  lodash.forEach(calendarData.data.list[0].list, (ds) => getList(ds, false));

  list = lodash.sortBy(list, ["sort", 'duration', 'start']);

  let base64 = await render("wiki", "calendar", {
    list,
    dateList,
    now: (now - startTime) / totalRange * 100,
    nowTime: now.format("YYYY-MM-DD HH:mm"),
    cfgScale: Cfg.scale(1.1)
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true; //事件结束不再往下
}