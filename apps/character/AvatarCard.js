import { Character, MysApi, Player } from '../../models/index.js'
import { Cfg, Common } from '../../components/index.js'
import lodash from 'lodash'
import { segment } from 'oicq'
import moment from 'moment'

export async function renderAvatar (e, avatar, renderType = 'card') {
  // 如果传递的是名字，则获取
  if (typeof (avatar) === 'string') {
    // 检查角色
    let char = Character.get(avatar)
    if (!char) {
      return false
    }
    let mys = await MysApi.init(e)
    if (!mys) return true
    if (!char.isRelease) {
      avatar = { id: char.id, name: char.name, detail: false }
    } else {
      let player = Player.create(e)
      await player.refreshMys()
      await player.refreshTalent(char.id)
      avatar = player.getAvatar(char.id)
      if (!avatar) {
        avatar = { id: char.id, name: char.name, detail: false }
      }
    }
  }
  return await renderCard(e, avatar, renderType)
}

// 渲染角色卡片
async function renderCard (e, avatar, renderType = 'card') {
  let char = Character.get(avatar.id)
  if (!char) {
    return false
  }
  let bg = char.getCardImg(Cfg.get('charPicSe', false))
  if (renderType === 'photo') {
    e.reply(segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + bg.img))
    return true
  }
  let uid = e.uid || (e.targetUser && e.targetUser.uid)
  let data = {}
  let custom = char.isCustom
  let isRelease = char.isRelease
  if (isRelease) {
    data = avatar.getDetail()
    data.imgs = char.imgs
    data.source = avatar._source
    data.artis = avatar.getArtisDetail()
    data.updateTime = moment(new Date(avatar._time)).format('MM-DD HH:mm')
    if (data.hasTalent) {
      data.talent = avatar.talent
      data.talentMap = ['a', 'e', 'q']
      // 计算皇冠个数
      data.crownNum = lodash.filter(lodash.map(data.talent, (d) => d.original), (d) => d >= 10).length
    }
  } else {
    data = char.getData('id,name,sName')
  }

  let width = 600
  let imgCss = ''
  let scale = 1.2
  if (bg.mode === 'left') {
    const height = 480
    width = height * bg.width / bg.height
    imgCss = `img.bg{width:auto;height:${height}px;}`
    scale = 1.45
  }
  // 渲染图像
  let msgRes = await Common.render('character/character-card', {
    saveId: uid,
    uid,
    bg,
    widthStyle: `<style>html,body,#container{width:${width}px} ${imgCss}</style>`,
    mode: bg.mode,
    custom,
    isRelease,
    data
  }, { e, scale, retMsgId: true })
  if (msgRes && msgRes.message_id) {
    // 如果消息发送成功，就将message_id和图片路径存起来，3小时过期
    await redis.set(`miao:original-picture:${msgRes.message_id}`, bg.img, { EX: 3600 * 3 })
  }
  return true
}
