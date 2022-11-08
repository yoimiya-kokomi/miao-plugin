import { Character, ProfileRank, ProfileDmg } from '../../models/index.js'
import { renderProfile } from './ProfileDetail.js'

export async function groupMaxProfile (e) {
  let groupId = e.group_id
  if (!groupId) {
    return false
  }
  let msg = e.original_msg || e.msg
  if (!/(最强|最高|最高分|最牛|第一)/.test(msg)) {
    return false
  }
  let mode = /(分|圣遗物|评分|ACE)/.test(msg) ? 'mark' : 'dmg'
  let name = msg.replace(/(#|最强|最高分|第一|最高|最牛|圣遗物|评分|群内|群|排名|排行|面板|面版|详情)/g, '')
  let char = Character.get(name)
  if (!char) {
    return false
  }
  let uid = await ProfileRank.getGroupMaxUid(groupId, char.id, mode)
  if (uid && uid[0]) {
    e.uid = uid[0]
    return await renderProfile(e, char)
  } else {
    if (mode === 'dmg' && !ProfileDmg.dmgRulePath(char.name)) {
      e.reply(`${char.name}暂不支持伤害计算..`)
    } else {
      e.reply('暂无排名信息')
    }
  }
}
