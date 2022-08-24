/*
* V3版Yunzai puppeteer
* */
import template from 'art-template'
import fs from 'fs'
import lodash from 'lodash'
import { segment } from 'oicq'

const _path = process.cwd()

let puppeteer = {}

let logger = global.logger || Bot.logger
logger.green = logger.green || ((t) => t)

class Puppeteer {
  constructor () {
    this.browser = false
    this.lock = false
    this.shoting = []
    /** 截图数达到时重启浏览器 避免生成速度越来越慢 */
    this.restartNum = 400
    /** 截图次数 */
    this.renderNum = 0
    this.config = {
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    }

    this.html = {}
    this.watcher = {}
    this.createDir('./data/html')
  }

  async initXlsx () {
    if (!lodash.isEmpty(puppeteer)) return puppeteer

    puppeteer = (await import('puppeteer')).default
  }

  createDir (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  /**
   * 初始化chromium
   */
  async browserInit () {
    await this.initXlsx()
    if (this.browser) return this.browser
    if (this.lock) return false
    this.lock = true

    logger.mark('puppeteer Chromium 启动中。。')

    /** 初始化puppeteer */
    this.browser = await puppeteer.launch(this.config).catch((err) => {
      logger.error(err.toString())
      if (String(err).includes('correct Chromium')) {
        logger.error('没有正确安装Chromium，可以尝试执行安装命令：node ./node_modules/puppeteer/install.js')
      }
    })

    this.lock = false

    if (!this.browser) {
      logger.error('puppeteer Chromium 启动失败')
      return false
    }

    logger.mark('puppeteer Chromium 启动成功')

    /** 监听Chromium实例是否断开 */
    this.browser.on('disconnected', (e) => {
      logger.error('Chromium实例关闭或崩溃！')
      this.browser = false
    })

    return this.browser
  }

  /**
   * `chromium` 截图
   * @param data 模板参数
   * @param data.tplFile 模板路径，必传
   * @param data.saveId  生成html名称，为空name代替
   * @param data.imgType  screenshot参数，生成图片类型：jpeg，png
   * @param data.quality  screenshot参数，图片质量 0-100，jpeg是可传，默认90
   * @param data.omitBackground  screenshot参数，隐藏默认的白色背景，背景透明。默认不透明
   * @param data.path   screenshot参数，截图保存路径。截图图片类型将从文件扩展名推断出来。如果是相对路径，则从当前路径解析。如果没有指定路径，图片将不会保存到硬盘。
   * @return oicq img
   */
  async screenshot (name, data = {}) {
    if (!await this.browserInit()) {
      return false
    }

    let savePath = this.dealTpl(name, data)
    if (!savePath) return false

    let buff = ''
    let start = Date.now()
    try {
      this.shoting.push(name)

      const page = await this.browser.newPage()
      await page.goto(`file://${_path}${lodash.trim(savePath, '.')}`)
      let body = await page.$('#container') || await page.$('body')

      let randData = {
        // encoding: 'base64',
        type: data.imgType || 'jpeg',
        omitBackground: data.omitBackground || false,
        quality: data.quality || 90,
        path: data.path || ''
      }

      if (data.imgType == 'png') delete randData.quality

      buff = await body.screenshot(randData)

      page.close().catch((err) => logger.error(err))

      this.shoting.pop()
    } catch (error) {
      logger.error(`图片生成失败:${name}:${error}`)
      /** 关闭浏览器 */
      if (this.browser) {
        await this.browser.close().catch((err) => logger.error(err))
      }
      this.browser = false
      buff = ''
      return false
    }

    if (!buff) {
      logger.error(`图片生成为空:${name}`)
      return false
    }

    this.renderNum++

    /** 计算图片大小 */
    let kb = (buff.length / 1024).toFixed(2) + 'kb'

    logger.mark(`[图片生成][${name}][${this.renderNum}次] ${kb} ${logger.green(`${Date.now() - start}ms`)}`)

    this.restart()

    return segment.image(buff)
  }

  /** 模板 */
  dealTpl (name, data) {
    let { tplFile, saveId = name } = data
    let savePath = `./data/html/${name}/${saveId}.html`

    /** 读取html模板 */
    if (!this.html[tplFile]) {
      this.createDir(`./data/html/${name}`)

      try {
        this.html[tplFile] = fs.readFileSync(tplFile, 'utf8')
      } catch (error) {
        logger.error(`加载html错误：${tplFile}`)
        return false
      }

      this.watch(tplFile)
    }

    data.resPath = `${_path}/resources/`

    /** 替换模板 */
    let tmpHtml = template.render(this.html[tplFile], data)

    /** 保存模板 */
    fs.writeFileSync(savePath, tmpHtml)

    logger.debug(`[图片生成][使用模板] ${savePath}`)

    return savePath
  }

  /** 监听配置文件 */
  watch (tplFile) {
    /*
    if (this.watcher[tplFile]) return

    const watcher = chokidar.watch(tplFile)
    watcher.on('change', path => {
      delete this.html[tplFile]
      logger.mark(`[修改html模板] ${tplFile}`)
    })

    this.watcher[tplFile] = watcher
     */
  }

  /** 重启 */
  restart () {
    /** 截图超过重启数时，自动关闭重启浏览器，避免生成速度越来越慢 */
    if (this.renderNum % this.restartNum == 0) {
      if (this.shoting.length <= 0) {
        setTimeout(async () => {
          this.browser.removeAllListeners('disconnected')
          await this.browser.close().catch((err) => logger.error(err))
          this.browser = false
          logger.mark('puppeteer 关闭重启')
        }, 100)
      }
    }
  }
}

export default new Puppeteer()
