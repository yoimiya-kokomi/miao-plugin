/*
* 面板公共方法及处理
* */
import lodash from 'lodash'
import { segment } from 'oicq'
import { profileList } from './profile-list.js'
import { Profile, Version } from '../../components/index.js'
import { Character } from '../../models/index.js'

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
    uid = await redis.get(`genshin:id-uid:${qq}`) || await redis.get(`genshin:uid:${qq}`)
    if (uid && uidReg.test(uid)) {
      return uid
    }
  }
  if (!Version.isV3) {
    let botQQ = global.BotConfig ? global.BotConfig.account.qq : false
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
    let MysApi = await e.getMysApi({
      auth: 'all',
      targetType: 'all',
      cookieType: 'all'
    })

    if (!MysApi || !e.targetUser) {
      return false
    }

    uid = e.targetUser.uid
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
  let data = await Profile.request(uid, e)
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

  let profile = Profile.get(uid, char.id)
  if (!profile || !profile.hasData) {
    if (await refresh()) {
      return { err: true }
    } else {
      e.reply(`请确认${char.name}已展示在【游戏内】的角色展柜中，并打开了“显示角色详情”。然后请使用 #更新面板\n命令来获取${char.name}的面板详情`)
    }
    return { err: true }
  } else if (!['enka', 'input2', 'miao'].includes(profile.dataSource)) {
    if (!await refresh()) {
      e.reply('由于数据格式升级，请重新获取面板信息后查看')
    }
    return { err: true }
  }

  return { profile, char, refresh }
}

export async function inputProfile (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  if (e.inputData.trim().length < 5) {
    e.reply('【输入示例】\n#录入夜兰面板 生命14450+25469, 攻击652+444, 防御548+144, 元素精通84, 暴击76.3, 爆伤194.2, 治疗0,充能112.3,元素伤害61.6,物伤0')
    return true
    // await profileHelp(e);
  }

  let ret = Profile.inputProfile(uid, e)
  let char = Character.get(e.avatar)
  if (lodash.isString(ret)) {
    e.reply(ret)
    return true
  } else if (ret) {
    e.reply(`${char.name}信息手工录入完成，你可以使用 #角色名+面板 / #角色名+伤害 来查看详细角色面板属性了`)
  } else {
    e.reply(`${char.name}信息手工录入失败，请检查录入格式。回复 #角色面板帮助 可查看录入提示`)
    e.reply('【输入示例】\n#录入夜兰面板 生命14450+25469, 攻击652+444, 防御548+144, 元素精通84, 暴击76.3, 爆伤194.2, 治疗0,充能112.3,元素伤害61.6,物伤0')
  }
  return true
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
  let data = await Profile.request(uid, e)
  if (!data) {
    return true
  }

  if (!data.chars) {
    e.reply('获取角色面板数据失败，请确认角色已在游戏内橱窗展示，并开放了查看详情。设置完毕后请5分钟后再进行请求~')
  } else {
    let ret = {}
    lodash.forEach(data.chars, (ds) => {
      let char = Character.get(ds.id)
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
* 获取面板列表
* */
export async function getProfileAll (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  let profiles = Profile.getAll(uid) || {}

  let chars = []
  lodash.forEach(profiles || [], (ds) => {
    if (!['enka', 'input2', 'miao'].includes(ds.dataSource)) {
      return
    }
    ds.name && chars.push(ds.name)
  })

  if (chars.length === 0) {
    if (await autoRefresh(e)) {
      await getProfileAll(e)
      return true
    } else {
      e.reply('尚未获取任何角色数据')
      await profileHelp(e)
    }
    return true
  }

  e.reply(`uid${uid} 已获取面板角色： ` + chars.join(', '))

  return true
}

/*
* 面板帮助
* */
export async function profileHelp (e) {
  e.reply(segment.image(`file://${process.cwd()}/plugins/miao-plugin/resources/character/imgs/help.jpg`))
  return true
}
