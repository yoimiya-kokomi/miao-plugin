import { Common, Cfg, App } from '../components/index.js'
import { Character } from '../models/index.js'
import { renderAvatar } from './character/avatar-card.js'
// 角色图像上传
import { uploadCharacterImg } from './character/character-img-upload.js'

// 老婆
import { wife, wifeReg } from './character/avatar-wife.js'

import { getOriginalPicture } from './character/utils.js'

let app = App.init({
  id: 'character',
  name: '角色查询'
})

app.reg('character', character, {
  rule: /^#.+$/,
  name: '角色卡片'
})

app.reg('upload-img', uploadCharacterImg, {
  rule: /^#*(喵喵)?(上传|添加)(.+)(照片|写真|图片|图像)\s*$/,
  name: '上传角色写真'
})

app.reg('wife', wife, {
  rule: wifeReg,
  describe: '#老公 #老婆 查询'
})

app.reg('original-pic', getOriginalPicture, {
  rule: /^#?(获取|给我|我要|求|发|发下|发个|发一下)?原图(吧|呗)?$/,
  describe: '【#原图】 回复角色卡片，可获取原图'
})

export default app

// 查看当前角色
export async function character (e) {
  let msg = e.original_msg || e.msg
  if (!msg) {
    return
  }

  let uidRet = /[0-9]{9}/.exec(msg)
  if (uidRet) {
    e.uid = uidRet[0]
    msg = msg.replace(uidRet[0], '')
  }
  let name = msg.replace(/#|老婆|老公/g, '').trim()

  if (Common.isDisable(e, 'char.char')) {
    return
  }

  let char = Character.get(name.trim())

  if (!char) {
    return false
  }
  return renderAvatar(e, char.name)
}
