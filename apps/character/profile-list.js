import lodash from 'lodash'
import { autoRefresh, getTargetUid } from './profile-common.js'
import { Common, Profile } from '../../components/index.js'

export async function profileList (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  let profiles = Profile.getAll(uid) || {}
  let servName = Profile.getServName(uid)
  let hasNew = false
  let newCount = 0

  let chars = []
  let msg = ''
  let newChar = {}
  if (e.newChar) {
    msg = '获取角色面板数据成功'
    newChar = e.newChar
  }
  lodash.forEach(profiles || {}, (profile) => {
    if (!profile.hasData) {
      return
    }
    let char = profile.char
    let tmp = char.getData('id,name,abbr,element,star')
    tmp.source = profile.dataSource
    tmp.level = profile.level || 1
    tmp.isNew = 0
    if (newChar[char.name]) {
      tmp.isNew = 1
      newCount++
    }
    chars.push(tmp)
  })

  if (chars.length === 0) {
    if (await autoRefresh(e)) {
      await profileList(e)
      return true
    } else {
      e.reply('尚未获取任何角色数据')
    }
    return true
  }

  if (newCount > 0) {
    hasNew = newCount <= 8
  }

  chars = lodash.sortBy(chars, ['isNew', 'star', 'level', 'id'])
  chars = chars.reverse()

  // 渲染图像
  return await Common.render('character/profile-list', {
    save_id: uid,
    uid,
    chars,
    servName,
    hasNew,
    msg
  }, { e, scale: 1.6 })
}
