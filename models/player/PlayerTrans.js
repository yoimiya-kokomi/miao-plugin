import { Data } from '#miao'
import lodash from 'lodash'
import fs from 'node:fs'

let Trans = {
  init () {
    Data.createDir('temp/UserDataBAK')
    let uids = fs.readdirSync('./data/UserData')
    uids = uids.filter((uid) => /\.(json)/i.test(uid))
    let success = 0
    let count = 0
    if (uids.length === 0) {
      return
    }
    console.log('miao-plugin: 准备将面板数据迁移至data/PlayerData/gs...')
    lodash.forEach(uids, (uid) => {
      uid = uid.replace('.json', '')
      let ret = Trans.trans(uid)
      count++
      if (ret) {
        success++
      }

      if (count % 100 === 0) {
        console.log(`迁移成功: ${success}...`)
      }

      try {
        let src = `./data/UserData/${uid}.json`
        let dst = `./temp/UserDataBAK/${uid}.json`
        fs.existsSync(dst) && fs.unlinkSync(dst)
        fs.copyFileSync(src, dst)
        fs.unlinkSync(src)
      } catch (err) {
        console.log(err)
      }

    })
    console.log('Trans UID', success)
  },
  trans (uid) {
    let data = Trans.getData(uid)
    if (data) {
      Data.writeJSON(`data/PlayerData/gs/${uid}.json`, data, 'root', 0)
      return true
    }
    return false
  },
  getData (uid) {
    let ds = Data.readJSON(`data/UserData/${uid}.json`)
    let dst = Data.readJSON(`data/PlayerData/gs/${uid}.json`)
    if (!ds.uid || (lodash.isEmpty(ds.avatars) && lodash.isEmpty(ds.chars))) {
      return false
    }
    let ret = Data.getData(ds, 'uid,name,level,word,face,card,sign,_profile')
    ret.game = 'gs'
    let info = ds.info || dst.info
    if (info) {
      if (info?.stats?.fieldExtMap) {
        delete info.stats.fieldExtMap
      }
      ret.info = info
    }
    ret.avatars = {
      ...(dst.avatars || {}),
      ...Trans.getAvatars({ ...ds.chars, ...ds.avatars })
    }
    return ret
  },
  getAvatars (ds) {
    let ret = {}
    lodash.forEach(ds || {}, (avatar, id) => {
      avatar = Trans.getAvatar(avatar)
      if (avatar) {
        ret[id] = avatar
      }
    })
    return ret
  },
  getAvatar (ds) {
    if (!ds.id || !ds.name || !ds.level || !ds.weapon || !ds.promote) {
      return false
    }
    return {
      ...Data.getData(ds, 'id,name,elem,level,promote,fetter,costume,cons,talent,weapon'),
      ...Trans.getArtis(ds.artis),
      ...Data.getData(ds, '_source,_time,_talent')
    }
  },
  getArtis (artis) {
    let profile = {}
    let mys = {}
    lodash.forEach(artis, (ds, idx) => {
      if (ds.mainId && ds.attrIds) {
        profile[idx] = {
          level: ds._level || ds.level || 1,
          star: ds._star || ds.star || 1,
          name: ds._name || ds.name || '',
          mainId: ds.mainId,
          attrIds: ds.attrIds
        }
      }
      mys[idx] = {
        level: ds.level || 1,
        star: ds.star || 1,
        name: ds.name || '',
      }
    })
    let ret = {}
    if (lodash.isEmpty(profile)) {
      if (!lodash.isEmpty(mys)) {
        ret.mysArtis = mys
      }
    } else {
      ret.artis = profile
      let hasDiff = false
      let getKey = (d) => {
        return [d?.name || '', d?.level || '', d?.star || ''].join('|')
      }
      for (let idx = 1; idx <= 5; idx++) {
        if (getKey(profile[idx]) !== getKey(mys[idx])) {
          hasDiff = true
        }
      }
      if (hasDiff) {
        ret.mysArtis = mys
      }
    }
    return ret
  }
}
export default Trans
