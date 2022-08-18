import { Data } from '../components/index.js'

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
}
