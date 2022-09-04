import fs from 'fs'
import lodash from 'lodash'
import sizeOf from 'image-size'

const CharImg = {
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

  getImgs (name, cId = '', elem = '') {
    let imgs = {}
    const nPath = `/meta/character/${name}/`
    const tPath = `/meta/character/旅行者/${elem}`

    let add = (key, path, traveler = false) => {
      imgs[key] = `${traveler ? tPath : nPath}${path}.webp`
    }
    let tAdd = (key, path) => {
      add(key, path, !!elem)
    }
    add('face', `imgs/face${cId}`)
    add('side', `imgs/side${cId}`)
    add('gacha', 'imgs/gacha')
    add('splash', `imgs/splash${cId}`)
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
