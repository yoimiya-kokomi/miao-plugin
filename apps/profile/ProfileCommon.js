/*
* 面板公共方法及处理
* */
import lodash from 'lodash'
import { segment } from 'oicq'
import { profileList } from './ProfileList.js'
import { Version } from '../../components/index.js'
import { Character, MysApi, Player } from '../../models/index.js'

/*
* 获取面板查询的 目标uid
* */
export async function getTargetUid (e) {
  let uidReg = /[1-9][0-9]{8}/

  if (e.uid && uidReg.test(e.uid)) {
    return e.uid
  }

  let uidRet = uidReg.exec(e.msg)
  if (uidRet) {
    return uidRet[0]
  }
  let uid = false
  let getUid = async function (qq) {
    let nCookie = global.NoteCookie || false
    if (nCookie && nCookie[qq]) {
      let nc = nCookie[qq]
      if (nc.uid && uidReg.test(nc.uid)) {
        return nc.uid
      }
    }
    uid = await redis.get(`genshin:id-uid:${qq}`) || await redis.get(`Yz:genshin:mys:qq-uid:${qq}`)
    if (uid && uidReg.test(uid)) {
      return uid
    }
  }
  if (!Version.isV3) {
    let botQQ = global?.Bot?.uin || global?.BotConfig?.account?.qq
    if (e.at && e.at !== botQQ) {
      uid = await getUid(e.at)
      if (uid) {
        return uid
      }
    }

    uid = await getUid(e.user_id)
    if (uid) {
      return uid
    }
  }

  try {
    let user = await MysApi.initUser(e)

    if (!user || !user.uid) {
      return false
    }
    uid = user.uid
    if (!uid || !uidReg.test(uid)) {
      e.reply('请先发送【#绑定+你的UID】来绑定查询目标')
      return false
    }
  } catch (err) {
    console.log(err)
  }
  return uid || false
}

/*
* 自动更新面板数据
* */
export async function autoRefresh (e) {
  let uid = await getTargetUid(e)
  if (!uid || e.isRefreshed) {
    return false
  }

  let refreshMark = await redis.get(`miao:profile-refresh-cd:${uid}`)
  let inCd = await redis.get(`miao:role-all:${uid}`)

  if (refreshMark || inCd) {
    return false
  }

  await redis.set(`miao:profile-refresh-cd:${uid}`, 'TRUE', { EX: 3600 * 12 })
  e.isRefreshed = true

  // 数据更新
  let player = Player.create(uid)
  let data = await player.refreshProfile(e)
  if (!data) {
    return false
  }

  if (!data.chars) {
    e.reply('请确认角色已在【游戏内】橱窗展示并开放了查看详情。请在设置完毕5分钟后使用 #面板更新 重新获取')
    return false
  } else {
    let ret = []
    lodash.forEach(data.chars, (ds) => {
      let char = Character.get(ds.id)
      if (char) {
        ret.push(char.name)
      }
    })
    if (ret.length === 0) {
      e.reply('请确认角色已在【游戏内】橱窗展示并开放了查看详情。请在设置完毕5分钟后使用 #面板更新 重新获取')
      return false
    } else {
      // e.reply(`本次获取成功角色: ${ret.join(", ")} `)
      return true
    }
  }
}

export async function autoGetProfile (e, uid, avatar, callback) {
  let refresh = async () => {
    let refreshRet = await autoRefresh(e)
    if (refreshRet) {
      await callback()
    }
    return refreshRet
  }

  let char = Character.get(avatar)
  if (!char) {
    return { err: true }
  }

  let profile = Player.getAvatar(uid, char.id)
  if (!profile || !profile.hasData) {
    if (await refresh()) {
      return { err: true }
    } else {
      e.reply(`请确认${char.name}已展示在【游戏内】的角色展柜中，并打开了“显示角色详情”。然后请使用 #更新面板\n命令来获取${char.name}的面板详情`)
    }
    return { err: true }
  } else if (!['enka', 'miao'].includes(profile.dataSource)) {
    if (!await refresh()) {
      e.reply('缓存数据错误，请重新获取面板信息后查看')
    }
    return { err: true }
  }

  return { profile, char, refresh }
}

/*
* 面板数据更新
* */
export async function getProfile (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  // 数据更新
  let player = Player.create(uid)
  let ret = await player.refreshProfile(e)
  if (!ret) {
    return true
  }

  if (!player._update.length === 0) {
    e.reply('获取角色面板数据失败，请确认角色已在游戏内橱窗展示，并开放了查看详情。设置完毕后请5分钟后再进行请求~')
  } else {
    let ret = {}
    lodash.forEach(player._update, (id) => {
      let char = Character.get(id)
      if (char) {
        ret[char.name] = true
      }
    })
    if (ret.length === 0) {
      e.reply('获取角色面板数据失败，未能请求到角色数据。请确认角色已在游戏内橱窗展示，并开放了查看详情。设置完毕后请5分钟后再进行请求~')
    } else {
      e.newChar = ret
      return await profileList(e)
    }
  }
  return true
}

/*
* 面板帮助
* */
export async function profileHelp (e) {
  e.reply(segment.image(`file://${process.cwd()}/plugins/miao-plugin/resources/character/imgs/help.jpg`))
  return true
}
