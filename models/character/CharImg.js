/**
 * 角色照片及角色图像资源相关
 * */
import fs from 'node:fs'
import lodash from 'lodash'
import sizeOf from 'image-size'
import { Cfg } from '#miao'

const rPath = `${process.cwd()}/plugins/miao-plugin/resources`
const CharImg = {

  // 获取角色的插画
  getCardImg (names, se = false, def = true) {
    let list = []
    let addImg = function (charImgPath, disable = false) {
      let dirPath = `./plugins/miao-plugin/resources/${charImgPath}`

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      if (disable) {
        return
      }

      let imgs = fs.readdirSync(dirPath)
      imgs = imgs.filter((img) => /\.(png|jpg|webp|jpeg)/i.test(img))
      lodash.forEach(imgs, (img) => {
        list.push(`${charImgPath}/${img}`)
      })
    }
    if (!lodash.isArray(names)) {
      names = [names]
    }
    for (let name of names) {
      addImg(`character-img/${name}`)
      addImg(`character-img/${name}/upload`)
      addImg(`character-img/${name}/se`, !se)
      const plusPath = './plugins/miao-plugin/resources/miao-res-plus/'
      if (fs.existsSync(plusPath)) {
        addImg(`miao-res-plus/character-img/${name}`)
        addImg(`miao-res-plus/character-img/${name}/se`, !se)
      }
    }
    let img = lodash.sample(list)
    if (!img) {
      if (def) {
        // img = '/character-img/default/01.jpg'
        return false
      } else {
        return false
      }
    }
    let ret = sizeOf(`./plugins/miao-plugin/resources/${img}`)
    ret.img = img
    ret.mode = ret.width > ret.height ? 'left' : 'bottom'
    return ret
  },

  getRandomImg (imgPaths, defImgs = []) {
    for (let imgPath of imgPaths) {
      let ret = []
      for (let type of ['webp', 'png']) {
        if (fs.existsSync(`${rPath}/${imgPath}.${type}`)) {
          ret.push(imgPath + '.webp')
        }
      }
      if (fs.existsSync(`${rPath}/${imgPath}`)) {
        let imgs = fs.readdirSync(`${rPath}/${imgPath}`).filter((file) => {
          return /\.(png|webp)$/.test(file)
        })
        for (let img of imgs) {
          ret.push(`${imgPath}/${encodeURIComponent(img)}`)
        }
      }
      if (ret.length > 0) {
        return lodash.sample(ret)
      }
    }
    for (let defImg of defImgs) {
      if (fs.existsSync(`${rPath}/${defImg}`)) {
        return defImg
      }
    }
  },

  // 获取角色的图像资源数据
  getImgs (name, costumeIdx = '', travelerElem = '', weaponType = 'sword', talentCons) {
    let fileType = 'webp'
    costumeIdx = costumeIdx === '2' ? '2' : ''
    let imgs = {}
    if (!['空', '荧', '旅行者'].includes(name)) {
      travelerElem = ''
    }
    const nPath = `/meta-gs/character/${name}/`
    const tPath = `/meta-gs/character/旅行者/${travelerElem}/`
    let add = (key, path, path2) => {
      if (path2 && fs.existsSync(`${rPath}/${nPath}/${path2}.${fileType}`)) {
        imgs[key] = `${nPath}${path2}.${fileType}`
      } else {
        imgs[key] = `${nPath}${path}.${fileType}`
      }
    }
    let tAdd = (key, path) => {
      imgs[key] = `${travelerElem ? tPath : nPath}${path}.${fileType}`
    }
    add('face', 'imgs/face', `imgs/face${costumeIdx}`)
    add('qFace', 'imgs/face', 'imgs/face-q')
    add('side', 'imgs/side', `imgs/side${costumeIdx}`)
    add('gacha', 'imgs/gacha')
    add('splash', 'imgs/splash', `imgs/splash${costumeIdx}`)
    tAdd('card', 'imgs/card')
    tAdd('banner', 'imgs/banner')
    for (let i = 1; i <= 6; i++) {
      tAdd(`cons${i}`, `icons/cons-${i}`)
    }
    for (let i = 0; i <= 3; i++) {
      tAdd(`passive${i}`, `icons/passive-${i}`)
    }
    imgs.a = `/common/item/atk-${weaponType}.webp`
    for (let t of ['e', 'q']) {
      imgs[t] = talentCons[t] > 0 ? imgs[`cons${talentCons[t]}`] : `${nPath}icons/talent-${t}.webp`
    }
    return imgs
  },

  // 获取星铁角色图像资源
  getImgsSr (name, talentCons) {
    let fileType = 'webp'
    const nPath = `/meta-sr/character/${name}/`
    let imgs = {}
    let add = (key, path, path2) => {
      imgs[key] = `${nPath}${path}.${fileType}`
    }
    add('face', 'imgs/face')
    add('splash', 'imgs/splash')
    add('preview', 'imgs/preview')
    for (let i = 1; i <= 3; i++) {
      add(`tree${i}`, `imgs/tree-${i}`)
    }
    for (let key of ['a', 'e', 'q', 't', 'z', 'a2', 'e2']) {
      add(key, `imgs/talent-${key}`)
    }
    for (let i = 1; i <= 6; i++) {
      if (i !== 3 && i !== 5) {
        add(`cons${i}`, `imgs/cons-${i}`)
      }
    }
    imgs.banner = 'meta-sr/character/common/imgs/banner.webp'
    imgs.card = 'meta-sr/character/common/imgs/card.webp'
    imgs.cons3 = imgs[talentCons[3]]
    imgs.cons5 = imgs[talentCons[5]]
    return imgs
  }
}
export default CharImg
