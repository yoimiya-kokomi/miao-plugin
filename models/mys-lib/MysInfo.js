import { Data } from '../../components/index.js'

let MysInfo = false

async function init () {
  let mys = await Data.importModule('plugins/genshin/model/mys/mysInfo.js', 'root')
  if (mys && mys.default) {
    MysInfo = mys.default
  }
}

await init()

if (!MysInfo) {
  // v2 MysInfo
  const apiCfg = {
    auth: 'all',
    targetType: 'all',
    cookieType: 'all',
  }
  MysInfo = class {
    constructor (e, uid, cookieUser) {
      if (e) {
        this.e = e
        this.userId = String(e.user_id)
      }
      this.uid = uid
      this.ckInfo = {
        ck: cookieUser.cookie,
        uid: cookieUser.uid
      }
    }

    static async init (e) {
      let MysApi = await e.getMysApi(apiCfg) // V2兼容
      let { targetUser, cookieUser } = MysApi
      let mys = new MysInfo(e, targetUser.id, cookieUser)
      mys._MysApi = MysApi
      return mys
    }

    // 检查当前UID是否有CK绑定
    static async checkUidBing (uid) {

    }

    static async getUid (e) {

    }

    static async getData (e, api, data) {
      let MysApi = await e.getMysApi(apiCfg) // V2兼容
      let ret = await MysApi.getData(api, data)
      if (ret) {
        return { data: ret }
      }
      return false
    }
  }
}

export default MysInfo
