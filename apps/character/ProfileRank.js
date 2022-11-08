import { Character, ProfileRank } from '../../models/index.js'
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
  let name = msg.replace(/(#|最强|最高分|第一|最高|最牛|圣遗物|评分|群|面板|面版|详情)/g, '')
  let char = Character.get(name)
  if (!char) {
    return false
  }
  let uid = await ProfileRank.getGroupMaxUid(groupId, char.id, mode)
  if (uid) {
    e.uid = uid
    return await renderProfile(e, char)
  }
}
