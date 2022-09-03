import { Data } from '../components/index.js'

let cacheMap = {}
let reFn = {}

export default class Base {

  toString () {
    return this?.name || ''
  }

  getData (arrList = '', cfg = {}) {
    arrList = arrList || this._dataKey || ''
    return Data.getData(this, arrList, cfg)
  }

  // 获取指定值数据，支持通过
  getVal (key, defaultValue) {
    return Data.getVal(this, key, defaultValue)
  }

  _expire (time = 10 * 60) {
    let id = this._uuid
    if (id) {
      reFn[id] && clearTimeout(reFn[id])
      delete reFn[id]
      reFn[id] = setTimeout(() => {
        reFn[id] && clearTimeout(reFn[id])
        delete reFn[id]
        delete cacheMap[id]
      }, time * 1000)
      cacheMap[id] = this
    }
    return this
  }
}
Base.get = (id, time = 10 * 60) => {
  if (cacheMap[id]) {
    return cacheMap[id]._expire(time)
  }
}
