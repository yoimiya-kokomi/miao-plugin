import { Cfg } from '#miao'
import { MysApi } from '#miao.models'

/** 获取角色卡片的原图 */
export async function getOriginalPicture (e) {
  if (!e.hasReply && !e.source) {
    return true
  }
  // 引用的消息不是自己的消息
  if (e.source.user_id !== e.self_id) {
    return true
  }
  // 引用的消息不是纯图片
  if (!/^\[图片]$/.test(e.source.message)) {
    return true
  }
  let originalPic = Cfg.get('originalPic') * 1
  // 获取原消息
  let source
  if (e.isGroup) {
    source = (await e.group.getChatHistory(e.source.seq, 1)).pop()
  } else {
    source = (await e.friend.getChatHistory(e.source.time, 1)).pop()
  }
  if (source) {
    let imgPath = await redis.get(`miao:original-picture:${source.message_id}`)
    if (imgPath) {
      try {
        if (imgPath[0] === '{') {
          imgPath = JSON.parse(imgPath)
        } else {
          imgPath = { img: imgPath, type: '' }
        }
      } catch (e) {
      }
      if (!e.isMaster) {
        if (imgPath.type === 'character' && [2, 0].includes(originalPic)) {
          e.reply('已禁止获取角色原图...')
          return true
        }
        if (imgPath.type === 'profile' && [1, 0].includes(originalPic)) {
          e.reply('已禁止获取面板原图...')
          return true
        }
      }
      if (imgPath && imgPath.img) {
        e.reply([segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + decodeURIComponent(imgPath.img))], false, { recallMsg: 30 })
      }
      return true
    }
    if (source.time) {
      let time = new Date()
      // 对at错图像的增加嘲讽...
      if (time / 1000 - source.time < 3600) {
        e.reply([segment.image(process.cwd() + '/plugins/miao-plugin/resources/common/face/what.jpg')])
        return true
      }
    }
  }
  e.reply('消息太过久远了，俺也忘了原图是啥了，下次早点来吧~')
  return true
}

/* #敌人等级 */
export async function enemyLv (e) {
  let selfUser = await MysApi.initUser(e)
  if (!selfUser || !e.msg) {
    return true
  }
  let ret = /(敌人|怪物)等级\s*(\d{1,3})\s*$/.exec(e.msg)
  if (ret && ret[2]) {
    let lv = ret[2] * 1
    await selfUser.setCfg('char.enemyLv', lv)
    lv = await selfUser.getCfg('char.enemyLv', 91)
    e.reply(`敌人等级已经设置为${lv}`)
    return true
  }
  return true
}
