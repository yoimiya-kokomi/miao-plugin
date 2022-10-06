/*
* 角色照片及角色图像资源相关
* */
import fs from 'fs'
import lodash from 'lodash'
import sizeOf from 'image-size'

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
        img = '/character-img/default/01.jpg'
      } else {
        return false
      }
    }
    let ret = sizeOf(`./plugins/miao-plugin/resources/${img}`)
    ret.img = img
    ret.mode = ret.width > ret.height ? 'left' : 'bottom'
    return ret
  },

  // 获取角色的图像资源数据
  getImgs (name, costumeId = '', travelerElem = '', fileType = 'webp') {
    let imgs = {}
    if (!['空', '荧', '旅行者'].includes(name)) {
      travelerElem = ''
    }
    const rPath = `${process.cwd()}/plugins/miao-plugin/resources`
    const nPath = `/meta/character/${name}/`
    const tPath = `/meta/character/旅行者/${travelerElem}/`
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
    add('face', 'imgs/face', `imgs/face${costumeId}`)
    add('side', 'imgs/side', `imgs/side${costumeId}`)
    add('gacha', 'imgs/gacha')
    add('splash', 'imgs/splash', `imgs/splash${costumeId}`)
    tAdd('card', 'imgs/card')
    tAdd('banner', 'imgs/banner')
    for (let i = 1; i <= 6; i++) {
      tAdd(`cons${i}`, `icons/cons-${i}`)
    }
    for (let i = 0; i <= 3; i++) {
      tAdd(`passive${i}`, `icons/passive-${i}`)
    }
    for (let k of ['a', 'e', 'q']) {
      tAdd(k, `icons/talent-${k}`)
    }
    return imgs
  }
}
export default CharImg
