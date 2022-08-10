import lodash from 'lodash'
import { autoRefresh, getTargetUid } from './profile-common.js'
import { Common, Profile } from '../../components/index.js'
import { Character } from '../../components/models.js'

export async function profileList (e, { render }) {
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
  lodash.forEach(profiles || [], (ds) => {
    if (!['enka', 'input2', 'miao-pre', 'miao'].includes(ds.dataSource)) {
      return
    }
    let { id } = ds
    let char = Character.get(id)
    let tmp = char.getData('id,name,abbr,element,star')
    if (tmp.name === '荧' || tmp.name === '空') {
      return
    }
    tmp.source = ds.dataSource
    tmp.level = ds.lv || 1
    tmp.isNew = 0
    if (newChar[char.name]) {
      tmp.isNew = 1
      newCount++
    }
    chars.push(tmp)
  })

  if (chars.length === 0) {
    if (await autoRefresh(e)) {
      await profileList(e, { render })
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
  }, { e, render, scale: 1.6 })
}
