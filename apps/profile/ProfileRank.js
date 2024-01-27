import ProfileDetail from './ProfileDetail.js'
import { Data, Common, Format, Cfg } from '#miao'
import { Character, ProfileRank, ProfileDmg, Player } from '#miao.models'
import lodash from 'lodash'

export async function groupRank (e) {
  const groupRank = Common.cfg('groupRank')
  let msg = e.original_msg || e.msg
  let type = ''
  if (/(排名|排行|列表)/.test(msg)) {
    type = 'list'
  } else if (/(最强|最高|最多|最高分|最牛|第一)/.test(msg)) {
    type = 'detail'
  } else if (/极限/.test(msg)) {
    type = 'super'
  }
  let groupId = e.group_id
  if (!type || (!groupId && type !== 'super')) {
    return false
  }
  let mode = /(分|圣遗物|遗器|评分|ACE)/.test(msg) ? 'mark' : 'dmg'
  mode = /(词条)/.test(msg) ? 'valid' : mode
  mode = /(双爆)/.test(msg) ? 'crit' : mode
  let name = msg.replace(/(#|星铁|最强|最高分|第一|词条|双爆|极限|最高|最多|最牛|圣遗物|评分|群内|群|排名|排行|面板|面版|详情|榜)/g, '')
  let char = Character.get(name)
  if (!char) {
    // 名字不存在或不为列表模式，则返回false
    if (name || type !== 'list') {
      return false
    }
  }
  if (/星铁/.test(msg) || char.isSr) {
    e.isSr = true
  }
  // 对鲸泽佬的极限角色文件增加支持
  if (type === 'super') {
    let player = Player.create(100000000)
    if (player.getProfile(char.id)) {
      e.uid = 100000000
      if (!char.isRelease && Cfg.get('notReleasedData') === false) {
        e.reply('未实装角色面板已禁用...')
        return true
      }
      return await ProfileDetail.render(e, char)
    } else {
      return true
    }
  }
  // 正常群排名
  let groupCfg = await ProfileRank.getGroupCfg(groupId)
  if (!groupRank) {
    e.reply('群面板排名功能已禁用，Bot主人可通过【#喵喵设置】启用...')
    return true
  }
  if (groupCfg.status === 1) {
    e.reply('本群已关闭群排名，群管理员或Bot主人可通过【#启用排名】启用...')
    return true
  }
  if (type === 'detail') {
    let uid = await ProfileRank.getGroupMaxUid(groupId, char.id, mode)
    if (uid) {
      e.uid = uid
      return await ProfileDetail.render(e, char)
    } else {
      if (mode === 'dmg' && !ProfileDmg.dmgRulePath(char.name, char.game)) {
        e.reply(`暂无排名：${char.name}暂不支持伤害计算，无法进行排名..`)
      } else {
        e.reply('暂无排名：请通过【#面板】查看角色面板以更新排名信息...')
      }
    }
  } else if (type === 'list') {
    if (mode === 'dmg' && char && !ProfileDmg.dmgRulePath(char.name, char.game)) {
      e.reply(`暂无排名：${char.name}暂不支持伤害计算，无法进行排名..`)
    } else {
      let uids = []
      if (char) {
        uids = await ProfileRank.getGroupUidList(groupId, char ? char.id : '', mode)
      } else {
        uids = await ProfileRank.getGroupMaxUidList(groupId, mode)
      }
      if (uids.length > 0) {
        return renderCharRankList({ e, uids, char, mode, groupId })
      } else {
        if (e.isSr) {
          e.reply('暂无排名：请通过【*面板】查看角色面板以更新排名信息...')
        } else {
          e.reply('暂无排名：请通过【#面板】查看角色面板以更新排名信息...')
        }
      }
    }
    return true
  }
}

export async function resetRank (e) {
  let groupId = e.group_id
  if (!groupId) {
    return true
  }
  if (!e.isMaster) {
    e.reply('只有管理员可重置排名')
    return true
  }
  let game = e.isSr ? 'sr' : 'gs'
  let msg = e.original_msg || e.msg
  let name = msg.replace(/(#|重置|重设|排名|排行|群|群内|面板|详情|面版)/g, '').trim()
  let charId = ''
  let charName = '全部角色'
  if (name) {
    let char = Character.get(name)
    if (!char) {
      e.reply(`重置排名失败，角色：${name}不存在`)
      return true
    }
    charId = char.id
    charName = char.name
  }
  await ProfileRank.resetRank(groupId, charId, game)
  e.reply(`本群${charName}排名已重置...`)
}

/**
 * 刷新群排名信息
 * @param e
 * @returns {Promise<boolean>}
 */
export async function refreshRank (e) {
  let groupId = e.group_id || ''
  if (!groupId) {
    return true
  }
  if (!e.isMaster && !this.e.member?.is_admin) {
    e.reply('只有主人及群管理员可刷新排名...')
    return true
  }
  e.reply('面板数据刷新中，等待时间可能较长，请耐心等待...')
  let game = e.isSr ? 'sr' : 'gs'
  await ProfileRank.resetRank({ groupId, game })
  let uidMap = await ProfileRank.getUserUidMap(e, game)
  let count = 0
  for (let uid in uidMap) {
    let { qq, type } = uidMap[uid]
    let player = new Player(uid, game)
    let profiles = player.getProfiles()
    // 刷新rankLimit
    await ProfileRank.setUidInfo({ uid, profiles, qq, uidType: type })
    let rank = await ProfileRank.create({ groupId, uid, qq })
    for (let id in profiles) {
      let profile = profiles[id]
      if (!profile.hasData) {
        continue
      }
      await rank.getRank(profile, true)
    }
    if (rank.allowRank) {
      count++
    }
  }
  e.reply(`本群排名已刷新，共刷新${count}个UID数据...`)
}

export async function manageRank (e) {
  let groupId = e.group_id
  if (!groupId) {
    return true
  }
  let isClose = /(关闭|禁用)/.test(e.msg)
  if (!e.isMaster && !this.e.member?.is_admin) {
    e.reply(`只有主人及群管理员可${isClose ? '禁用' : '启用'}排名...`)
    return true
  }
  await ProfileRank.setGroupStatus(groupId, isClose ? 1 : 0)
  if (isClose) {
    e.reply('当前群排名功能已禁用...')
  } else {
    e.reply('当前群排名功能已启用...\n如数据有问题可通过【#刷新排名】命令来刷新当前群内排名')
  }
}

async function renderCharRankList ({ e, uids, char, mode, groupId }) {
  let list = []
  for (let ds of uids) {
    let uid = ds.uid || ds.value
    let player = Player.create(uid, e.isSr ? 'sr' : 'gs')
    let avatar = player.getAvatar(ds.charId || char.id)
    if (!avatar) {
      continue
    }
    let profile = avatar.getProfile()

    if (profile) {
      let profileRank = await ProfileRank.create({ groupId, uid })
      let data = await profileRank.getRank(profile, true)
      let mark = data?.mark?.data
      let tmp = {
        uid,
        isMax: !char,
        ...avatar.getData('id,star,name,sName,level,fetter,cons,weapon,elem,talent,artisSet,imgs'),
        artisMark: Data.getData(mark, 'mark,markClass,valid,crit')
      }
      let dmg = data?.dmg?.data
      if (dmg && dmg.avg) {
        let title = dmg.title
        // 稍微缩短下title
        if (title.length > 10) {
          title = title.replace(/[ ·]*/g, '')
        }
        title = title.length > 10 ? title.replace(/伤害$/, '') : title
        tmp.dmg = {
          title,
          avg: Format.comma(dmg.avg, 1)
        }
      }
      if (uid) {
        let userInfo = await ProfileRank.getUidInfo(uid)
        try {
          if (userInfo?.qq && e?.group?.pickMember) {
            let member = e.group.pickMember(userInfo.qq)
            if (member?.getAvatarUrl) {
              let img = await member.getAvatarUrl()
              if (img) {
                tmp.qqFace = img
              }
            }
          }
        } catch (e) {
          // console.log(e)
        }
      }

      if (mode === 'crit') {
        tmp._mark = mark?._crit * 6.6044 || 0
      } else if (mode === 'valid') {
        tmp._mark = mark?._valid || 0
      } else {
        tmp._mark = mark?._mark || 0
      }
      tmp._formatmark = Format.comma(tmp._mark, 1)
      tmp._dmg = dmg?.avg || 0
      tmp._star = 5 - tmp.star
      list.push(tmp)
    }
  }
  let title
  if (char) {
    let modeTitleMap = {}
    if (e.isSr) {
      modeTitleMap = {
        dmg: '',
        mark: '遗器评分',
        crit: '双爆副词条',
        valid: '加权有效词条'
      }
    } else {
      modeTitleMap = {
        dmg: '',
        mark: '圣遗物评分',
        crit: '双爆副词条',
        valid: '加权有效词条'
      }
    }
    title = `${e.isSr ? '*' : '#'}${char.name}${modeTitleMap[mode]}排行`
    list = lodash.sortBy(list, mode === 'dmg' ? '_dmg' : '_mark').reverse()
  } else {
    title = `${e.isSr ? '*' : '#'}${mode === 'mark' ? '最高分' : '最强'}排行`
    list = lodash.sortBy(list, ['uid', '_star', 'id'])
  }

  const rankCfg = await ProfileRank.getGroupCfg(groupId)
  // 渲染图像
  return await Common.render('character/rank-profile-list', {
    save_id: char.id,
    game: e.isSr ? 'sr' : 'gs',
    list,
    title,
    elem: char.elem,
    bodyClass: `char-${char.name}`,
    rankCfg,
    mode
  }, { e, scale: 1.4 })
}
