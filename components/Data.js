import lodash from 'lodash'
import fs from 'node:fs'
import util from 'node:util'

const _path = process.cwd()
const getRoot = (root = '') => {
  if (!root) {
    root = `${_path}/`
  } else if (root === 'root' || root === 'yunzai') {
    root = `${_path}/`
  } else if (root === 'miao') {
    root = `${_path}/plugins/miao-plugin/`
  } else {
    root = `${_path}/plugins/${root}/`
  }
  return root
}

let Data = {

  getRoot,

  /*
  * 根据指定的path依次检查与创建目录
  * */
  createDir (path = '', root = '', includeFile = false) {
    root = getRoot(root)
    let pathList = path.split('/')
    let nowPath = root
    pathList.forEach((name, idx) => {
      name = name.trim()
      if (!includeFile && idx <= pathList.length - 1) {
        nowPath += name + '/'
        if (name) {
          if (!fs.existsSync(nowPath)) {
            fs.mkdirSync(nowPath)
          }
        }
      }
    })
  },

  /*
  * 读取json
  * */
  readJSON (file = '', root = '') {
    root = getRoot(root)
    if (fs.existsSync(`${root}/${file}`)) {
      try {
        return JSON.parse(fs.readFileSync(`${root}/${file}`, 'utf8'))
      } catch (e) {
        console.error(`JSON数据错误: ${root}/${file}`)
        console.log(e)
      }
    }
    return {}
  },

  /*
  * 写JSON
  * */
  writeJSON (cfg, data, root = '', space = 2) {
    if (arguments.length > 1) {
      return Data.writeJSON({
        name: cfg,
        data,
        space,
        root
      })
    }
    // 检查并创建目录
    let name = cfg.path ? (cfg.path + '/' + cfg.name) : cfg.name
    Data.createDir(name, cfg.root, true)
    root = getRoot(cfg.root)
    data = cfg.data
    delete data._res
    data = JSON.stringify(data, null, cfg.space || 2)
    if (cfg.rn) {
      data = data.replaceAll('\n', '\r\n')
    }
    return fs.writeFileSync(`${root}/${name}`, data)
  },

  delFile (file, root = '') {
    root = getRoot(root)
    try {
      if (fs.existsSync(`${root}/${file}`)) {
        fs.unlinkSync(`${root}/${file}`)
      }
      return true
    } catch (error) {
      logger.error(`文件删除失败：${error}`)
    }
    return false
  },

  async getCacheJSON (key) {
    try {
      let txt = await redis.get(key)
      if (txt) {
        return JSON.parse(txt)
      }
    } catch (e) {
      console.log(e)
    }
    return {}
  },

  async setCacheJSON (key, data, EX = 3600 * 24 * 365) {
    await redis.set(key, JSON.stringify(data), { EX })
  },

  async redisGet (key, def = {}) {
    try {
      let txt = await redis.get(key)
      if (txt) {
        return JSON.parse(txt)
      }
    } catch (e) {
      console.log(e)
    }
    return def
  },

  async redisSet (key, data, EX = 3600 * 24 * 90) {
    await redis.set(key, JSON.stringify(data), { EX })
  },

  async importModule (file, root = '') {
    root = getRoot(root)
    if (!/\.js$/.test(file)) {
      file = file + '.js'
    }
    if (fs.existsSync(`${root}/${file}`)) {
      try {
        let data = await import(`file://${root}/${file}?t=${new Date() * 1}`)
        return data || {}
      } catch (e) {
        console.error(`import module错误: ${root}/${file}`)
        console.log(e)
      }
    }
    return {}
  },

  async importDefault (file, root) {
    let ret = await Data.importModule(file, root)
    return ret.default || {}
  },

  async importCfg (key) {
    let sysCfg = await Data.importModule(`config/system/${key}_system.js`, 'miao')
    let diyCfg = await Data.importModule(`config/${key}.js`, 'miao')
    if (diyCfg.isSys) {
      console.error(`miao-plugin: config/${key}.js无效，已忽略`)
      console.error(`如需配置请复制config/${key}_default.js为config/${key}.js，请勿复制config/system下的系统文件`)
      diyCfg = {}
    }
    return {
      sysCfg,
      diyCfg
    }
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

  getData (target, keyList = '', cfg = {}) {
    target = target || {}
    let defaultData = cfg.defaultData || {}
    let ret = {}
    // 分割逗号
    if (typeof (keyList) === 'string') {
      keyList = keyList.split(',')
    }

    lodash.forEach(keyList, (keyCfg) => {
      // 处理通过:指定 toKey & fromKey
      let _keyCfg = keyCfg.split(':')
      let keyTo = _keyCfg[0].trim()
      let keyFrom = (_keyCfg[1] || _keyCfg[0]).trim()
      let keyRet = keyTo
      if (cfg.lowerFirstKey) {
        keyRet = lodash.lowerFirst(keyRet)
      }
      if (cfg.keyPrefix) {
        keyRet = cfg.keyPrefix + keyRet
      }
      // 通过Data.getVal获取数据
      ret[keyRet] = Data.getVal(target, keyFrom, defaultData[keyTo], cfg)
    })
    return ret
  },

  getVal (target, keyFrom, defaultValue) {
    return lodash.get(target, keyFrom, defaultValue)
  },

  // 异步池，聚合请求
  async asyncPool (poolLimit, array, iteratorFn) {
    const ret = [] // 存储所有的异步任务
    const executing = [] // 存储正在执行的异步任务
    for (const item of array) {
      // 调用iteratorFn函数创建异步任务
      const p = Promise.resolve().then(() => iteratorFn(item, array))
      // 保存新的异步任务
      ret.push(p)

      // 当poolLimit值小于或等于总任务个数时，进行并发控制
      if (poolLimit <= array.length) {
        // 当任务完成后，从正在执行的任务数组中移除已完成的任务
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e) // 保存正在执行的异步任务
        if (executing.length >= poolLimit) {
          // 等待较快的任务执行完成
          await Promise.race(executing)
        }
      }
    }
    return Promise.all(ret)
  },

  // sleep
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  // 获取默认值
  def () {
    for (let idx in arguments) {
      if (!lodash.isUndefined(arguments[idx])) {
        return arguments[idx]
      }
    }
  },

  async forEach (data, fn) {
    if (lodash.isArray(data)) {
      for (let idx = 0; idx < data.length; idx++) {
        let ret = fn(data[idx], idx)
        ret = Data.isPromise(ret) ? await ret : ret
        if (ret === false) {
          break
        }
      }
    } else if (lodash.isPlainObject(data)) {
      for (const idx in data) {
        let ret = fn(data[idx], idx)
        ret = Data.isPromise(ret) ? await ret : ret
        if (ret === false) {
          break
        }
      }
    }
  },

  isPromise (data) {
    return util.types.isPromise(data)
  },

  // 循环字符串回调
  eachStr: (arr, fn) => {
    if (lodash.isString(arr)) {
      arr = arr.replace(/\s*(;|；|、|，)\s*/, ',')
      arr = arr.split(',')
    } else if (lodash.isNumber(arr)) {
      arr = [arr.toString()]
    }
    lodash.forEach(arr, (str, idx) => {
      if (!lodash.isUndefined(str)) {
        fn(str.trim ? str.trim() : str, idx)
      }
    })
  },

  regRet (reg, txt, idx) {
    if (reg && txt) {
      let ret = reg.exec(txt)
      if (ret && ret[idx]) {
        return ret[idx]
      }
    }
    return false
  }
}

export default Data
