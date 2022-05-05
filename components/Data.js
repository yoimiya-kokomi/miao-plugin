import lodash from "lodash";
import fs from "fs";
import request from "request";

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
    if (fs.existsSync(`${root}/${path}`)) {
      let jsonRet = fs.readFileSync(`${root}/${path}`, "utf8");
      return JSON.parse(jsonRet);
    }
    return {}
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

  getUrlPath(url) {
    let reg = /^https*:\/\/(.*)\/(\w+\.(png|jpg|jpeg|webp))(\?.*)?$/;
    let ret = reg.exec(url);
    if (!ret) {
      return false;
    }
    return {
      path: ret[1],
      filename: ret[2],
      type: ret[3],
      url
    }
  },
  pathExists(root, path) {
    if (fs.existsSync(root + "/" + path)) {
      return true;
    }
    path = path.replace("\\", "/");
    const dirList = path.split("/");
    let currentDir = root;

    for (let dir of dirList) {
      currentDir = currentDir + "/" + dir;
      if (!fs.existsSync(currentDir)) {
        fs.mkdirSync(currentDir);
      }
    }
    return true;
  },
  async asyncPool(poolLimit, array, iteratorFn) {
    const ret = []; // 存储所有的异步任务
    const executing = []; // 存储正在执行的异步任务
    for (const item of array) {
      // 调用iteratorFn函数创建异步任务
      const p = Promise.resolve().then(() => iteratorFn(item, array));
      // 保存新的异步任务
      ret.push(p);

      // 当poolLimit值小于或等于总任务个数时，进行并发控制
      if (poolLimit <= array.length) {
        // 当任务完成后，从正在执行的任务数组中移除已完成的任务
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e); // 保存正在执行的异步任务
        if (executing.length >= poolLimit) {
          // 等待较快的任务执行完成
          await Promise.race(executing);
        }
      }
    }
    return Promise.all(ret);
  },

  async cacheFile(fileList, cacheRoot) {

    let ret = {};
    let cacheFn = async function (url) {
      let path = Data.getUrlPath(url);
      if (fs.existsSync(`${cacheRoot}/${path.path}/${path.filename}`)) {
        console.log("已存在，跳过 " + path.path + "/" + path.filename);
        ret[url] = `${path.path}/${path.filename}`;
        return true;
      }

      Data.pathExists(cacheRoot, path.path);
      await request(url).pipe(fs.createWriteStream(`${cacheRoot}/${path.path}/` + path.filename));
      console.log("下载成功: " + path.path + "/" + path.filname);
      ret[url] = `${path.path}/${path.filename}`;
      return true;
    };

    await Data.asyncPool(10, fileList, cacheFn);
    return ret;

  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


}

export default Data;
