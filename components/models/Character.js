import Base from "./Base.js";
import lodash from "lodash";
import fs from "fs";
import Data from "../Data.js";
import request from "request";
import path from "path";

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
/*
  get name() {
    if (this.roleId) {
      if (this.roleId * 1 === 10000005) {
        this.name = "空";
      } else if (this.roleId * 1 === 10000007) {
        this.name = "荧";
      }
    }
    return this._name;
  }

  set name(name) {
    this._name = name;
  }*/
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
