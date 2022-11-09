import { Character, ProfileRank, ProfileDmg } from '../../models/index.js'
import { renderProfile } from './ProfileDetail.js'
import { Data } from '../../components/index.js'

export async function groupMaxProfile (e) {
  let groupId = e.group_id
  if (!groupId) {
    return false
  }
  const cfg = await Data.importCfg('cfg')
  const groupRank = cfg?.diyCfg?.groupRank || false
  let msg = e.original_msg || e.msg
  if (!/(最强|最高|最高分|最牛|第一)/.test(msg)) {
    return false
  }
  let mode = /(分|圣遗物|评分|ACE)/.test(msg) ? 'mark' : 'dmg'
  if (!groupRank) {
    e.reply('群面板排名功能已禁用...')
    return true
  }
  let name = msg.replace(/(#|最强|最高分|第一|最高|最牛|圣遗物|评分|群内|群|排名|排行|面板|面版|详情)/g, '')
  let char = Character.get(name)
  if (!char) {
    return false
  }
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
