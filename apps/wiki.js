import { segment } from "oicq";
import fs from "fs";
import { Character } from "../components/models.js";
import lodash from "lodash";
import { Cfg } from "../components/index.js";
import Cal from "../components/Calcendar.js";
import Calcendar from "../components/Calcendar.js";

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


  let calData = await Calcendar.get();

  let base64 = await render("wiki", "calendar", {
    ...calData,
    cfgScale: Cfg.scale(1.1)
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true; //事件结束不再往下
}