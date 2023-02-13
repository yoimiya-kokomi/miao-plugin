import lodash from 'lodash'
import { getTargetUid } from './ProfileCommon.js'
import { ProfileRank, Player, Character } from '../../models/index.js'
import { Common, Data } from '../../components/index.js'

const ProfileList = {
  async refresh (e) {
    let uid = await getTargetUid(e)
    if (!uid) {
      return true
    }

    // 数据更新
    let player = Player.create(e)
    await player.refreshProfile(2)

    if (!player?._update?.length) {
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
        return await ProfileList.render(e)
      }
    }

    return true
  },
  async render (e) {
    let uid = await getTargetUid(e)
    if (!uid) {
      return true
    }
    let isSelfUid = false
    if (e.runtime) {
      let uids = e.runtime?.user?.ckUids || []
      isSelfUid = uids.join(',').split(',').includes(uid + '')
    }
    let rank = false
    let servName = Player.getProfileServName(uid)
    let hasNew = false
    let newCount = 0

    let chars = []
    let msg = ''
    let newChar = {}
    if (e.newChar) {
      msg = '获取角色面板数据成功'
      newChar = e.newChar
    }
    const cfg = await Data.importCfg('cfg')
    // 获取面板数据
    let player = Player.create(e)
    if (!player.hasProfile) {
      await player.refresh({ profile: true })
    }
    if (!player.hasProfile) {
      e.reply(`本地暂无uid${uid}的面板数据...`)
      return true
    }
    let profiles = player.getProfiles()

    // 检测标志位
    let qq = (e.at && !e.atBot) ? e.at : e.qq
    await ProfileRank.setUidInfo({ uid, profiles, qq, uidType: isSelfUid ? 'ck' : 'bind' })

    let groupId = e.group_id
    if (groupId) {
      rank = await ProfileRank.create({ groupId, uid, qq: e.user_id })
    }
    const rankCfg = await ProfileRank.getGroupCfg(groupId)
    const groupRank = rank && (cfg?.diyCfg?.groupRank || false) && rankCfg.status !== 1
    for (let id in profiles) {
      let profile = profiles[id]
      let char = profile.char
      let tmp = char.getData('id,face,name,abbr,element,star')
      tmp.face = char.getImgs(profile.costume).face
      tmp.level = profile.level || 1
      tmp.cons = profile.cons
      tmp.isNew = 0
      if (newChar[char.name]) {
        tmp.isNew = 1
        newCount++
      }
      if (rank) {
        tmp.groupRank = await rank.getRank(profile, !!tmp.isNew)
      }
      chars.push(tmp)
    }

    if (newCount > 0) {
      hasNew = newCount <= 8
    }

    chars = lodash.sortBy(chars, ['isNew', 'star', 'level', 'id'])
    chars = chars.reverse()

    player.save()
    // 渲染图像
    return await Common.render('character/profile-list', {
      save_id: uid,
      uid,
      chars,
      servName,
      hasNew,
      msg,
      groupRank,
      allowRank: rank && rank.allowRank,
      rankCfg
    }, { e, scale: 1.6 })
  }
}
export default ProfileList
