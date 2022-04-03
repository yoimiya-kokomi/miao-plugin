import lodash from "lodash";
import fs from "fs";

let Data = {

  /*
  * 根据指定的path依次检查与创建目录
  * */
  createDir(rootPath = "", path = "", includeFile = false) {
    let pathList = path.split("/"),
      nowPath = rootPath;
    pathList.forEach((name, idx) => {
      name = name.trim();
      if (!includeFile && idx <= pathList.length - 1) {
        nowPath += name + "/";
        if (name) {
          if (!fs.existsSync(nowPath)) {
            fs.mkdirSync(nowPath);
          }
        }
      }
    })
  },

  /*
  * 读取json
  * */
  readJSON(root, path) {
    if (!/\.json$/.test(path)) {
      path = path + ".json";
    }
    // 检查并创建目录
    Data.createDir(root, path, true);

    let jsonRet = fs.readFileSync(`${root}/${path}`, "utf8");
    return JSON.parse(jsonRet);
  },

  /*
  * 写JSON
  * */
  writeJson(path, file, data, space = "\t") {
    if (!/\.json$/.test(file)) {
      file = file + ".json";
    }

    // 检查并创建目录
    Data.createDir(path, true);
    return fs.writeFileSync(`${path}/${file}`, JSON.stringify(data, null, space));
  },

  /*
  * 返回一个从 target 中选中的属性的对象
  *
  * keyList : 获取字段列表，逗号分割字符串
  *   key1, key2, toKey1:fromKey1, toKey2:fromObj.key
  *
  * defaultData: 当某个字段为空时会选取defaultData的对应内容
  * toKeyPrefix：返回数据的字段前缀，默认为空。defaultData中的键值无需包含toKeyPrefix
  *
  * */

  getData(target, keyList = "", cfg = {}) {
    target = target || {};
    let defaultData = cfg.defaultData || {};
    let ret = {};
    // 分割逗号
    if (typeof (keyList) === "string") {
      keyList = keyList.split(",");
    }

    lodash.forEach(keyList, (keyCfg) => {
      // 处理通过:指定 toKey & fromKey
      let _keyCfg = keyCfg.split(":");
      let keyTo = _keyCfg[0].trim(),
        keyFrom = (_keyCfg[1] || _keyCfg[0]).trim(),
        keyRet = keyTo;
      if (cfg.lowerFirstKey) {
        keyRet = lodash.lowerFirst(keyRet);
      }
      if (cfg.keyPrefix) {
        keyRet = cfg.keyPrefix + keyRet;
      }
      // 通过Data.getVal获取数据
      ret[keyRet] = Data.getVal(target, keyFrom, defaultData[keyTo], cfg);
    })
    return ret;
  },

  getVal(target, keyFrom, defaultValue) {
    return lodash.get(target, keyFrom, defaultValue);
  },





};
export default Data;
