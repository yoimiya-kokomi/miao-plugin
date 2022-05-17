import {Data} from "../components/index.js";
import lodash from "lodash";
import fs from "fs";
import request from "request";

const _root = process.cwd() + "/plugins/miao-plugin/";
const _cRoot = _root + "resources/meta/character/";


let readDir = fs.readdirSync(_cRoot);
console.log(readDir);

let imgs = [];

function img(char, url, target) {
  imgs.push({
    url,
    file: `${char.name}/${target}`
  })
}


lodash.forEach(readDir, (c) => {

  console.log(c);

  if (!fs.existsSync(`${_cRoot}/${c}/data.json`)) {
    return;
  }

  let char = Data.readJSON(`${_cRoot}/${c}/`, 'data.json');

  if (char.name) {
    // 正面

    // 角色条
    img(char, char.imgs.profile, "profile.png");
    // 名片
    img(char, char.imgs.party, "party.png");
    // img(char, char.imgs.char, "char.png");
    // 立绘-竖版
    img(char, char.imgs.gacha_card, "gacha_card.png");
    // 立绘
    img(char, char.imgs.gacha_splash, "gacha_splash.png");
    // 正面像
    img(char, char.imgs.face, "face.png");
    img(char, char.imgs.side, "face.png");

    // 天赋
    if (char.talent) {
      img(char, char.talent.a.icon, "talent_a.png");
      img(char, char.talent.e.icon, "talent_e.png");
      img(char, char.talent.q.icon, "talent_q.png");
    }
    // 被动天赋
    lodash.forEach(char.passive, (p, idx) => {
      img(char, p.icon, `passive_${idx}.png`);
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
      let stream = fs.createWriteStream(`${_cRoot}/${file.file}`);
      await request("https://genshin.honeyhunterworld.com/" + file.url).pipe(stream);

      return new Promise((resolve) => {
        stream.on('finish', resolve)
      });
    } catch (e) {
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
