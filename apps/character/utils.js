import { segment } from 'oicq'

/** 获取角色卡片的原图 */
export async function getOriginalPicture (e) {
  if (!e.hasReply && !e.source) {
    return
  }
  // 引用的消息不是自己的消息
  if (e.source.user_id !== e.self_id) {
    return
  }
  // 引用的消息不是纯图片
  if (!/^\[图片]$/.test(e.source.message)) {
    return
  }
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
      e.reply([segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + imgPath)])
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
  let selfUser = await e.checkAuth({
    auth: 'self'
  })
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
