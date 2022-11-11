import { Character, ProfileRank, ProfileDmg } from '../../models/index.js'
import { renderProfile } from './ProfileDetail.js'
import { Data, Profile, Format, Common } from '../../components/index.js'

export async function groupRank (e) {
  let groupId = e.group_id
  if (!groupId) {
    return false
  }
  const cfg = await Data.importCfg('cfg')
  const groupRank = cfg?.diyCfg?.groupRank || false
  let msg = e.original_msg || e.msg
  let type = ''
  if (/(排名|排行|列表)/.test(msg)) {
    type = 'list'
  } else if (/(最强|最高|最高分|最牛|第一)/.test(msg)) {
    type = 'detail'
  }
  if (!type) {
    return false
  }
  let mode = /(分|圣遗物|评分|ACE)/.test(msg) ? 'mark' : 'dmg'
  let name = msg.replace(/(#|最强|最高分|第一|最高|最牛|圣遗物|评分|群内|群|排名|排行|面板|面版|详情|榜)/g, '')
  let char = Character.get(name)
  if (!char) {
    return false
  }
  if (!groupRank) {
    e.reply('群面板排名功能已禁用...')
    return true
  }
  if (type === 'detail') {
    let uid = await ProfileRank.getGroupMaxUid(groupId, char.id, mode)
    if (uid) {
      e.uid = uid
      return await renderProfile(e, char)
    } else {
      if (mode === 'dmg' && !ProfileDmg.dmgRulePath(char.name)) {
        e.reply(`${char.name}暂不支持伤害计算..`)
      } else {
        e.reply('暂无排名信息')
      }
    }
  } else if (type === 'list') {
    return true
    let uids = await ProfileRank.getGroupUidList(groupId, char.id, mode)
    return renderCharRankList({ e, uids, char, mode })
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
  await ProfileRank.resetRank(groupId, charId)
  e.reply(`本群${charName}排名已重置...`)
}

async function renderCharRankList ({ e, uids, char, mode }) {
  let list = []
  for (let ds of uids) {
    let uid = ds.value
    let profile = Profile.get(uid, char.id)
    if (profile) {
      list.push({
        uid,
        value: Format.comma(ds.score)
      })
    }
  }
  // 渲染图像
  return await Common.render('character/rank-profile-list', {
    save_id: char.id,
    char: char.getData('id,face,name,abbr,element,star'),
    list,
    elem: char.elem,
    bodyClass: `char-${char.name}`,
    mode
  }, { e, scale: 1.6 })
}
