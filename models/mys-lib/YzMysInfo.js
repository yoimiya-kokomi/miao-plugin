import { Data } from '../../components/index.js'

let YzMysInfo = false
let MysUser = false

async function init () {
  let mys = await Data.importModule('plugins/genshin/model/mys/mysInfo.js', 'root')
  if (mys && mys.default) {
    YzMysInfo = mys.default
  } else {
    let module = await Data.importModule('lib/components/models/MysUser.js', 'root')
    if (module && module.default) {
      MysUser = module.default
    }
  }
}

await init()

if (!YzMysInfo) {
  // v2 MysInfo
  const apiCfg = {
    auth: 'all',
    targetType: 'all',
    cookieType: 'all'
  }
  YzMysInfo = class {
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
      let { selfUser, targetUser, cookieUser } = MysApi
      let mys = new YzMysInfo(e, targetUser.uid || selfUser.uid, cookieUser)
      mys._MysApi = MysApi
      return mys
    }

    // 检查当前UID是否有CK绑定
    static async checkUidBing (uid) {
      let user = await MysUser.get(uid)
      return user.cookie
    }

    static async getUid (e) {
      let user = await e.checkAuth({
        auth: 'all'
      })
      if (!user || !user.getMysUser) {
        return false
      }
      let mysUser = await user.getMysUser()
      return mysUser ? mysUser.uid : false
    }
  }
}

export default YzMysInfo
