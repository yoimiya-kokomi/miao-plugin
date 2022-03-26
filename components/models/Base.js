import { Data } from "../index.js";

export default class Base {

  constructor() {
    this.name = "";
  }

  toString() {
    return this.name;
  }

  getData(arrList = "", cfg = {}) {
    return Data.getData(this, arrList, cfg);
  }

  // 获取指定值数据，支持通过
  getVal(key, defaultValue) {
    return Data.getVal(this, key, defaultValue);
  }


}