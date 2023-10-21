/*
* Base Model
*
* 使用Proxy实现meta数据的getter
* 对Character等可复用设置实例缓存，提高性能
* */
import { Data } from '#miao'

let cacheMap = {}
let reFn = {}
let metaMap = {}

export default class Base {
  constructor () {
    this.game = 'gs'
    let proxy = new Proxy(this, {
      get (self, key, receiver) {
        if (self._uuid && key === 'meta') {
          return metaMap[self._uuid]
        }
        if (key in self) {
          return Reflect.get(self, key, receiver)
        }
        if (self._get) {
          return self._get.call(receiver, key)
        }
        if (self._uuid) {
          return (metaMap[self._uuid] || {})[key]
        } else {
          return (self.meta || {})[key]
        }
      },
      set (target, key, newValue) {
        if (target._uuid && key === 'meta') {
          metaMap[target._uuid] = newValue
          return true
        } else {
          return Reflect.set(target, key, newValue)
        }
      }
    })
    return proxy
  }

  getData (arrList = '', cfg = {}) {
    arrList = arrList || this._dataKey || this.constructor._dataKey || ''
    return Data.getData(this, arrList, cfg)
  }

  // 获取指定值数据，支持通过
  getVal (key, defaultValue) {
    return Data.getVal(this, key, defaultValue)
  }

  // 获取缓存
  _getCache (uuid = '', time = 10 * 60) {
    if (uuid && cacheMap[uuid]) {
      return cacheMap[uuid]._expire(time)
    }
    this._uuid = uuid
  }

  // 设置缓存
  _cache (time = 10 * 60) {
    let id = this._uuid
    if (id) {
      this._expire(time)
      cacheMap[id] = this
      return cacheMap[id]
    }
    return this
  }

  // 设置超时时间
  _expire (time = 10 * 60) {
    let id = this._uuid
    let self = this
    reFn[id] && clearTimeout(reFn[id])
    if (time > 0) {
      if (id) {
        reFn[id] = setTimeout(() => {
          self._delCache()
        }, time * 1000)
      }
      return cacheMap[id]
    }
  }

  _delCache () {
    let id = this._uuid
    reFn[id] && clearTimeout(reFn[id])
    delete reFn[id]
    delete cacheMap[id]
    delete metaMap[id]
  }

  get isSr () {
    return this.game === 'sr'
  }

  get isGs () {
    return !this.isSr
  }
}
