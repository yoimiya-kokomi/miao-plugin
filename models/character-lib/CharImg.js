import fs from 'fs'
import lodash from 'lodash'
import sizeOf from 'image-size'

const CharImg = {
  getCardImg (name, se = false, def = true) {
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

    addImg(`character-img/${name}`)
    addImg(`character-img/${name}/upload`)
    addImg(`character-img/${name}/se`, !se)

    const plusPath = './plugins/miao-plugin/resources/miao-res-plus/'
    if (fs.existsSync(plusPath)) {
      addImg(`miao-res-plus/character-img/${name}`)
      addImg(`miao-res-plus/character-img/${name}/se`, !se)
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
    const path = `/meta/character/${name}/`
    const icon = elem ? `${elem}/icons` : 'icons'
    const img = elem ? `${elem}/imgs` : 'imgs'
    let add = (key, path1, type = 'webp') => {
      imgs[key] = `${path}${path1}.${type}`
    }
    add('face', `imgs/face${cId}`)
    add('side', 'imgs/side')
    add('gacha', 'imgs/gacha')
    add('splash', `imgs/splash${cId}`)
    add('card', `${img}/card`)
    add('banner', `${img}/banner`)
    for (let i = 1; i <= 6; i++) {
      add(`cons${i}`, `${icon}/cons-${i}`)
    }
    for (let i = 0; i <= 3; i++) {
      add(`passive${i}`, `${icon}/passive-${i}`)
    }
    for (let k of ['a', 'e', 'q']) {
      add(k, `${icon}/talent-${k}`)
    }
    return imgs
  }
}
export default CharImg
