import { segment } from "oicq";
import fs from "fs";
import { Character } from "../components/models.js";
import lodash from "lodash";

//import {wikiCharacter} from "../modules/wiki.js";

let action = {
  wiki: {
    keyword: "命座|天赋|技能|资料"
  }
}


export async function wiki(e, { render }) {

  if (!e.msg) {
    return false;
  }

  let reg = /#?(.+)(命座|天赋|技能|资料)$/, msg = e.msg;
  let ret = reg.exec(msg);

  if (!ret && !ret[1]) {
    return false;
  }

  let char = Character.get(ret[1]);

  let base64 = await render("wiki", "character", {
    save_id: "天赋" + char.name,
    ...char,
    line: getLineData(char),
    _char: `/meta/character/${char.name}/`
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true; //事件结束不再往下
}

const getLineData = function (data) {
  let ret = [];
  lodash.forEach(data.lvStat, (ls) => {
    ret.push({
      num: ls.values["90"],
      label: ls.name
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