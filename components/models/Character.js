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
    imgs = imgs.filter((img) => /\.(png|jpg|webp)/i.test(img));

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
      imgs = imgs.filter((img) => /\.(png|jpg|webp)/i.test(img));

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

export default Character;
