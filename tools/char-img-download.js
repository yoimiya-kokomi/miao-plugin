import { Data } from "../components/index.js";
import lodash from "lodash";
import fs from "fs";
import request from "request";

const _root = process.cwd() + "/plugins/miao-plugin/";
const _cRoot = _root + "resources/meta/character/";

let chars = Data.readJSON(_cRoot, "index.json");
let imgs = [];

function img(char, url, target) {
  imgs.push({
    url,
    file: `${char.name}/${target}`
  })
}

lodash.forEach(chars, (c) => {
  let char = Data.readJSON(`${_cRoot}${c.name}/`, "data.json");

  if (char.name) {
    // 正面
    let party = /i_(\d*)_party/.exec(char.img.profile);
    if (party && party[1]) {
      let pid = party[1];
      // 角色条
      img(char, `https://genshin.honeyhunterworld.com/img/cardicon/i_${pid}_profile.png`, "profile.png");
      // 名片
      img(char, `https://genshin.honeyhunterworld.com/img/cardicon/i_${pid}_party.png`, "party.png");
    } else {
      console.log('party fail', char.name)
    }
    // 立绘-竖版
    img(char, char.img.gachaCard, "gacha_card.png");
    // 立绘
    img(char, char.img.gachaSplash, "gacha_splash.png");
    // 正面像
    img(char, char.img.source, "face.png");
    let sideImg = char.img.source.replace("_face", "_side");
    // 侧面像
    img(char, sideImg, "side.png");

    // 天赋
    img(char, char.talent.a.icon, "talent_a.png");
    img(char, char.talent.e.icon, "talent_e.png");
    img(char, char.talent.q.icon, "talent_q.png");

    // 被动天赋
    lodash.forEach(char.passive, (p, idx) => {
      img(char, p.icon, `passive_${p.name}.png`);
    });

    // 命座
    lodash.forEach(char.cons, (con, idx) => {
      img(char, con.icon, `cons_${idx}.png`)
    });

  }
})

let cacheFile = async function () {

  let cacheFn = async function (file) {
    if (fs.existsSync(`${_cRoot}/${file.file}`)) {
      console.log(`已存在，跳过 ${file.file}`);
     return true;
    }

    try {
      await request(file.url).pipe(fs.createWriteStream(`${_cRoot}/${file.file}`));

      return new Promise((resolve) => setTimeout(resolve, parseInt(Math.random() * 2000)));
    }catch(e){
      return false;
    }
    console.log(`下载成功: ${file.file}`);
    return true;
  };

  console.log('开始下载');
  await Data.asyncPool(5, imgs, cacheFn);

}

await cacheFile();
console.log('下载成功');
