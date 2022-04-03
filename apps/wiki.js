import { segment } from "oicq";
import fs from "fs";
import { Character } from "../components/models.js";

//import {wikiCharacter} from "../modules/wiki.js";

export async function wiki(e, { render }) {

  const ret = /^#*(.*)(素材|技能|材料|信息|天赋|wiki|资料|命座)$/.exec(e.msg);

  if (!ret || !ret[1]) {
    return;
  }
  if (ret[1] == "全部" && e.isMaster) {
    return await wikiCache(e);
  }

  let char = Character.get(ret[1].trim());

  await char.cacheImg();


  console.log(char);

  return true;
  let base64 = await render("wiki", "character", {
    save_id: 'wiki-character',
    cache_id: data.Name,
    cache_time: 0,
    char
  });

  if (base64) {
    e.reply(segment.image(`base64://${base64}`));
  }
  return true; //事件结束不再往下
}

// 生成Wiki图像
async function genWikiImg(name) {


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