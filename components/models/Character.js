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


class Character extends Base {
  constructor(name) {
    console.log('constructor', name)
    super();
    this.name = name;
    let data = Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/character/${this.name}/`, "data.json");
    lodash.extend(this, data);
  }

  getCardImg(def = true) {
    let name = this.name;

    if (!fs.existsSync(`./plugins/miao-plugin/resources/character-img/${name}/`)) {
      fs.mkdirSync(`./plugins/miao-plugin/resources/character-img/${name}/`);
    }

    let list = {};
    let imgs = fs.readdirSync(`./plugins/miao-plugin/resources/character-img/${name}/`);
    imgs = imgs.filter((img) => /\.(png|jpg|webp)/.test(img));

    lodash.forEach(imgs, (img) => {
      list[img] = `character-img/${name}/${img}`
    });

    const plusPath = `./plugins/miao-plugin/resources/miao-res-plus/`;
    if (fs.existsSync(plusPath)) {
      if (!fs.existsSync(`${plusPath}/character-img/${name}/`)) {
        fs.mkdirSync(`${plusPath}/character-img/${name}/`);
      }

      let imgs = fs.readdirSync(`${plusPath}/character-img/${name}/`);
      imgs = imgs.filter((img) => /\.(png|jpg|webp)/.test(img));
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
}


Character.get = function (val) {
  let roleid;
  if (typeof (val) === "number") {
    roleid = val;
  } else {
    roleid = YunzaiApps.mysInfo['roleIdToName'](val);
  }
  let name = YunzaiApps.mysInfo['roleIdToName'](roleid, true);
  if (!name) {
    return false;
  }
  return new Character(name);
};

Character.getAbbr = function () {
  return genshin.abbr;
}

export default Character;
