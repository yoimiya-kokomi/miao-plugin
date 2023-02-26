import Cfg from './Cfg.js'
import render from './common/Render.js'
import { Version } from './index.js'
import lodash from 'lodash'

const Common = {
  render,
  cfg: Cfg.get,
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  async downFile () {
    console.log('down file')
  },

  async getNoteQQUids (e) {
    let ret = {}
    if (Version.isV3) {
      if (e.runtime) {
        let noteCks = await e.runtime?.gsCfg?.getBingCk() || {}
        lodash.forEach(noteCks, (cks, qq) => {
          lodash.forEach(cks, (ck) => {
            let { qq, uid } = ck
            if (qq && uid) {
              ret[qq] = ret[qq] || []
              if (!ret[qq].includes(uid)) {
                ret[qq].push(uid)
              }
            }
          })
        })
      }
    } else {
      lodash.forEach(global.NoteCookie || {}, (ck) => {
        const { qq, uid } = ck
        if (qq && uid) {
          ret[qq] = ret[qq] || []
          ret[qq].push(uid)
        }
      })
    }
    return ret
  },

  async getBindUid (qq) {
    if (Version.isV3) {
      return await redis.get(`Yz:genshin:mys:qq-uid:${qq}`)
    } else {
      return await redis.get(`genshin:id-uid:${qq}`)
    }
  },

  async getGroupUids (e) {
    // 获取ck用户列表
    let noteUids = await Common.getNoteQQUids(e)
    let ret = {}
    let uidMap = {}

    let groupMemMap = await e.group?.getMemberMap()
    // 优先匹配ck uid
    for (let [qq] of groupMemMap) {
      if (noteUids[qq]) {
        for (let uid of noteUids[qq]) {
          ret[qq] = ret[qq] || []
          if (!uidMap[uid]) {
            ret[qq].push({
              uid,
              type: 'ck'
            })
            uidMap[uid] = qq
          }
        }
      }
    }
    // 获取绑定uid
    for (let [qq] of groupMemMap) {
      if (ret[qq]) {
        continue
      }
      let uid = await Common.getBindUid(qq)
      if (uid && !uidMap[uid]) {
        ret[qq] = [{
          uid,
          type: 'bind'
        }]
        uidMap[uid] = qq
      }
    }
    return ret
  }
}

export default Common
