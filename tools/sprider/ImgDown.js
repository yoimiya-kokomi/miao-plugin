import fs from 'fs'
import request from 'request'
import { Data } from '../../components/index.js'
import HttpsProxyAgent from 'https-proxy-agent'

let agent = new HttpsProxyAgent('http://localhost:4780')
request.defaults({
  agent
})

const _path = process.cwd()
const _root = _path + '/plugins/miao-plugin/'
const _cRoot = _root + 'resources/meta/character/'

export default class ImgDown {
  constructor (name) {
    this.name = name
    this.imgs = []
  }

  add (key, url) {
    this.imgs.push({
      url,
      file: `${this.name}/${key}.webp`
    })
  }

  add2 (name, type, url) {
    this.imgs.push({
      url,
      file: `../material/${type}/${name}.webp`
    })
  }

  async _down (ds) {
    if (fs.existsSync(`${_cRoot}/${ds.file}`)) {
      // console.log(`已存在，跳过 ${ds.file}`)
      return true
    }
    try {
      let stream = fs.createWriteStream(`${_cRoot}/${ds.file}`)
      await request('https://genshin.honeyhunterworld.com/' + ds.url).pipe(stream)
      return new Promise((resolve) => {
        stream.on('finish', () => {
          console.log(`图像下载成功: ${ds.file}`)
          resolve()
        })
      })
    } catch (e) {
      console.log(`图像下载失败: ${ds.file}`)
      console.log(e)
      return false
    }
  }

  async download () {
    await Data.asyncPool(5, this.imgs, this._down)
  }
}