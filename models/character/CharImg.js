/**
 * 角色照片及角色图像资源相关
 * */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import lodash from 'lodash'
import sizeOf from 'image-size'
import { Data } from '#miao'
import { miaoPath } from '#miao.path'

const rPath = `${miaoPath}/resources`
// 面板图（自定义立绘）支持的图片格式
const profileImgReg = /\.(png|webp|jpe?g)$/i
const profileImgExt = ['webp', 'png', 'jpg', 'jpeg']
let { sysCfg, diyCfg } = await Data.importCfg('profile')
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
          ret.push(imgPath + `.${type}`)
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

  /**
   * 获取自定义面板图（立绘）的图库源列表
   * 依次读取config/profile.js、config/system/profile_system.js的profileImgSrc配置
   * 相对路径以resources目录为基准，配置为空或无效时回落到系统默认源
   * @returns {string[]} 图库源的绝对路径列表
   */
  getProfileImgSrc () {
    for (let src of [diyCfg.profileImgSrc, sysCfg.profileImgSrc, ['profile']]) {
      if (!src) {
        continue
      }
      if (!lodash.isArray(src)) {
        src = [src]
      }
      let ret = []
      lodash.forEach(src, (ds) => {
        ds = lodash.isString(ds) ? lodash.trim(ds) : ''
        if (ds) {
          ret.push(path.isAbsolute(ds) ? ds : path.join(rPath, ds))
        }
      })
      if (ret.length > 0) {
        return ret
      }
    }
    return [path.join(rPath, 'profile')]
  },

  /**
   * 合并读取指定角色的面板图候选列表
   * 同层级的所有图库源合并，源不存在/无权限/为空时跳过，不影响其他源
   * 支持 {源}/{tier}/{角色名} 与平铺的 {源}/{角色名} 两种布局（目录或单文件均可）
   * @param name 角色名
   * @param isSuper 是否读取彩蛋立绘（满命/ACE/三皇冠）目录；平铺层仅在普通立绘时读取
   * @returns {string[]} 可被模板引用的图片路径（resources相对路径或file://绝对路径）
   */
  getProfileImgPool (name, isSuper = false) {
    let tier = isSuper ? 'super-character' : 'normal-character'
    let files = []
    lodash.forEach(CharImg.getProfileImgSrc(), (src) => {
      files = files.concat(CharImg.getProfileImgFiles(`${src}/${tier}`, name))
      // 平铺层：图库源下直接存放角色目录/文件（部分第三方图库没有tier层）
      if (!isSuper) {
        files = files.concat(CharImg.getProfileImgFiles(src, name))
      }
    })
    return lodash.map(files, (file) => CharImg.getProfileImgRes(file))
  },

  /**
   * 读取指定目录下某个角色的面板图文件
   * @param base 图库层目录，如 {源}/normal-character，或平铺时的图库源根目录
   * @param name 角色名
   * @returns {string[]} 图片的绝对路径列表（单文件形式在前，目录形式在后）
   */
  getProfileImgFiles (base, name) {
    let ret = []
    // 单文件形式：{base}/{角色名}.webp|png|jpg|jpeg
    lodash.forEach(profileImgExt, (type) => {
      let file = `${base}/${name}.${type}`
      if (fs.existsSync(file)) {
        ret.push(file)
      }
    })
    // 目录形式：{base}/{角色名}/
    let dir = `${base}/${name}`
    let files = []
    try {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        files = fs.readdirSync(dir)
      }
    } catch (e) {
      logger?.warn(`miao-plugin: 面板图目录读取失败 ${dir}`)
      return ret
    }
    lodash.forEach(files, (file) => {
      if (profileImgReg.test(file)) {
        ret.push(`${dir}/${file}`)
      }
    })
    return ret
  },

  /**
   * 将面板图绝对路径转为模板可引用的路径
   * resources目录内及可相对表示的路径返回相对路径，其余（如跨盘）返回file://绝对地址
   * @param file 图片绝对路径
   * @returns {string}
   */
  getProfileImgRes (file) {
    let name = encodeURIComponent(path.basename(file))
    let relative = path.relative(rPath, path.dirname(file)).replace(/\\/g, '/')
    if (!path.isAbsolute(relative)) {
      return relative ? `${relative}/${name}` : name
    }
    return pathToFileURL(file).href
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
    for (let i = 0; i <= 4; i++) {
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
      if (path2 && fs.existsSync(`${rPath}/${nPath}/${path2}.${fileType}`)) {
        imgs[key] = `${nPath}${path2}.${fileType}`
      } else {
        imgs[key] = `${nPath}${path}.${fileType}`
      }
    }
    add('face', 'imgs/face')
    add('qFace', 'imgs/face', 'imgs/face-q')
    add('splash', 'imgs/splash')
    add('preview', 'imgs/preview')
    for (let i = 1; i <= 4; i++) {
      add(`tree${i}`, `imgs/tree-${i}`)
    }
    for (let key of ['a', 'e', 'q', 't', 'z', 'a2', 'e2', 'q2', 'xe', 'me', 'mt']) {
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
