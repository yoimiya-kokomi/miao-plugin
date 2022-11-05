import { Data } from '../../components/index.js'

let YzMysApi = false

async function init () {
  let mys = await Data.importModule('plugins/genshin/model/mys/mysApi.js', 'root')
  if (mys && mys.default) {
    YzMysApi = mys.default
    return
  }
}

await init()
if (!YzMysApi) {
  // v2兼容处理
  YzMysApi = class {
    constructor (uid, ck, { e }) {
      this.e = e
    }

    async getData (api, data) {
      this.mysApi = this.mysApi || await this.e.getMysApi({
        auth: 'all',
        targetType: 'all',
        cookieType: 'all'
      })
      if (!this.mysApi) {
        return false
      }
      let ret = await this.mysApi.getData(api, data)
      if (ret) {
        return { data: ret }
      }
      return false
    }
  }
}
export default YzMysApi
