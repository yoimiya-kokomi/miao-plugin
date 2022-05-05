import Base from "./Base.js";
import lodash from "lodash";
import fs from "fs";
import Data from "../Data.js";
import request from "request";
import path from "path";
import sizeOf from "image-size";

let characterMap = {};
const _path = process.cwd();
let genshin = await import(`file://${_path}/config/genshin/roleId.js`);

const metaPath = `${_path}/plugins/miao-plugin/resources/meta/character/`

class Character extends Base {
  constructor(name, id) {
    super();

    if (id * 1 === 10000005) {
      name = "空";
    } else if (id * 1 === 10000007) {
      name = "荧";
    }
    this.name = name;
    lodash.extend(this, getMeta(name));
    if (name === "主角" || name === "旅行者" || /.主/.test(name)) {
      this.id = 20000000;
    }
  }

  getCardImg(def = true) {
    let name = this.name;

    const charImgPath = `./plugins/miao-plugin/resources/character-img/${name}/`;

    if (!fs.existsSync(charImgPath)) {
      fs.mkdirSync(charImgPath);
    }

    let list = {};
    let imgs = fs.readdirSync(charImgPath);
    imgs = imgs.filter((img) => /\.(png|jpg|webp|jpeg)/i.test(img));

    lodash.forEach(imgs, (img) => {
      list[img] = `character-img/${name}/${img}`
    });

    const plusPath = `./plugins/miao-plugin/resources/miao-res-plus/`;
    if (fs.existsSync(plusPath)) {
      const charImgPlusPath = `${plusPath}/character-img/${name}/`;
      if (!fs.existsSync(charImgPlusPath)) {
        fs.mkdirSync(charImgPlusPath);
      }

      imgs = fs.readdirSync(charImgPlusPath);
      imgs = imgs.filter((img) => /\.(png|jpg|webp|jpeg)/i.test(img));

      lodash.forEach(imgs, (img) => {
        list[img] = `miao-res-plus/character-img/${name}/${img}`
      });
    }

    let img = lodash.sample(lodash.values(list));


    if (!img) {
      if (def) {
        img = "/character-img/default/01.jpg";
      } else {
        return false
      }
    }

    let ret = sizeOf(`./plugins/miao-plugin/resources/${img}`);
    ret.img = img;
    ret.mode = ret.width > ret.height ? "left" : "bottom";
    return ret;
  }

  checkAvatars(avatars) {

    if (!lodash.includes([20000000, 10000005, 10000007], this.id * 1)) {
      return;
    }
    let avatarIds = [];
    if (lodash.isArray(avatars)) {
      avatarIds = lodash.map(avatars, (a) => a.id * 1);
    } else {
      avatarIds = [avatars.id];
    }

    if (lodash.includes(avatarIds, 10000005)) {
      // 空
      lodash.extend(this, getMeta('空'));
    } else if (lodash.includes(avatarIds, 10000007)) {
      // 荧
      lodash.extend(this, getMeta('荧'));
    }
  }
}

let getMeta = function (name) {
  return Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/character/${name}/`, "data.json") || {};
}

Character.get = function (val) {
  let roleid, name;
  if (typeof (val) === "number" || /^\d*$/.test(val)) {
    roleid = val;
  } else if (val.id) {
    roleid = val.id;
    name = val.name || YunzaiApps.mysInfo['roleIdToName'](roleid, true);
  } else {
    roleid = YunzaiApps.mysInfo['roleIdToName'](val);

  }
  if (!name) {
    name = YunzaiApps.mysInfo['roleIdToName'](roleid, true);
  }
  if (!name) {
    return false;
  }


  return new Character(name, roleid);
};


Character.getAbbr = function () {
  return genshin.abbr;
}

Character.getRandomImg = function (type) {
  let chars = fs.readdirSync(metaPath);
  let ret = [];
  type = type === "party" ? "party" : "profile";
  lodash.forEach(chars, (char) => {
    if (fs.existsSync(`${metaPath}/${char}/${type}.png`)) {
      ret.push(`/meta/character/${char}/${type}.png`);
    }
  });
  return lodash.sample(ret);
}


let charPosIdx = {
  1: '宵宫,雷神,胡桃,甘雨,优菈,一斗,公子,绫人,魈,可莉,迪卢克,凝光,刻晴,辛焱,烟绯,雷泽',
  2: '夜兰,八重,九条,行秋,香菱,安柏,凯亚,丽莎,北斗,菲谢尔,重云,罗莎莉亚,埃洛伊',
  3: '申鹤,莫娜,早柚,云堇,久岐忍,五郎,砂糖,万叶,温迪',
  4: '班尼特,心海,琴,芭芭拉,七七,迪奥娜,托马,空,荧,阿贝多,钟离'
}

let idSort = {};
lodash.forEach(charPosIdx, (chars, pos) => {
  chars = chars.split(",");
  lodash.forEach(chars, (name, idx) => {
    if (global.YunzaiApps) {
      let id = YunzaiApps.mysInfo['roleIdToName'](name);
      if (id) {
        idSort[id] = pos * 100 + idx;
      }
    }
  })
})


Character.sortIds = function (arr) {
  return arr.sort((a, b) => (idSort[a] || 300) - (idSort[b] || 300));
}

export default Character;
