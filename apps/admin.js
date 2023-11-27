import fs from 'node:fs'
import lodash from 'lodash'
import { exec } from 'child_process'
import { Cfg, Common, Data, Version, App } from '#miao'
import fetch from 'node-fetch'

let keys = lodash.map(Cfg.getCfgSchemaMap(), (i) => i.key)
let app = App.init({
  id: 'admin',
  name: '喵喵设置',
  desc: '喵喵设置'
})

let sysCfgReg = new RegExp(`^#喵喵设置\\s*(${keys.join('|')})?\\s*(.*)$`)

app.reg({
  updateRes: {
    rule: /^#喵喵(强制)?(更新图像|图像更新)$/,
    fn: updateRes,
    desc: '【#管理】更新素材'
  },
  update: {
    rule: /^#喵喵(强制)?更新$/,
    fn: updateMiaoPlugin,
    desc: '【#管理】喵喵更新'
  },
  sysCfg: {
    rule: sysCfgReg,
    fn: sysCfg,
    desc: '【#管理】系统设置'
  },
  miaoApiInfo: {
    rule: /^#喵喵api$/,
    fn: miaoApiInfo,
    desc: '【#管理】喵喵Api'
  }
})

export default app

const _path = process.cwd()
const resPath = `${_path}/plugins/miao-plugin/resources/`
const plusPath = `${resPath}/miao-res-plus/`

const checkAuth = async function (e) {
  if (!e.isMaster) {
    e.reply(`只有主人才能命令喵喵哦~
    (*/ω＼*)`)
    return false
  }
  return true
}

async function sysCfg (e) {
  if (!await checkAuth(e)) {
    return true
  }

  let cfgReg = sysCfgReg
  let regRet = cfgReg.exec(e.msg)
  let cfgSchemaMap = Cfg.getCfgSchemaMap()

  if (!regRet) {
    return true
  }

  if (regRet[1]) {
    // 设置模式
    let val = regRet[2] || ''

    let cfgSchema = cfgSchemaMap[regRet[1]]
    if (cfgSchema.input) {
      val = cfgSchema.input(val)
    } else if (cfgSchema.type === 'str') {
      val = (val || cfgSchema.def) + ''
    } else {
      val = cfgSchema.type === 'num' ? (val * 1 || cfgSchema.def) : !/关闭/.test(val)
    }
    Cfg.set(cfgSchema.cfgKey, val)
  }

  let schema = Cfg.getCfgSchema()
  let cfg = Cfg.getCfg()
  let imgPlus = fs.existsSync(plusPath)

  // 渲染图像
  return await Common.render('admin/index', {
    schema,
    cfg,
    imgPlus,
    isMiao: Version.isMiao
  }, { e, scale: 1.4 })
}

async function updateRes (e) {
  if (!await checkAuth(e)) {
    return true
  }
  let isForce = e.msg.includes('强制')
  let command = ''
  if (fs.existsSync(`${resPath}/miao-res-plus/`)) {
    e.reply('开始尝试更新，请耐心等待~')
    command = 'git pull'
    if (isForce) {
      command = 'git  checkout . && git  pull'
    }
    exec(command, { cwd: `${resPath}/miao-res-plus/` }, function (error, stdout, stderr) {
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        e.reply('目前所有图片都已经是最新了~')
        return true
      }
      let numRet = /(\d*) files changed,/.exec(stdout)
      if (numRet && numRet[1]) {
        e.reply(`报告主人，更新成功，此次更新了${numRet[1]}个图片~`)
        return true
      }
      if (error) {
        e.reply('更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
      } else {
        e.reply('图片加量包更新成功~')
      }
    })
  } else {
    command = `git clone https://gitee.com/yoimiya-kokomi/miao-res-plus.git "${resPath}/miao-res-plus/" --depth=1`
    e.reply('开始尝试安装图片加量包，可能会需要一段时间，请耐心等待~')
    exec(command, function (error, stdout, stderr) {
      if (error) {
        e.reply('角色图片加量包安装失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
      } else {
        e.reply('角色图片加量包安装成功！您后续也可以通过 #喵喵更新图像 命令来更新图像')
      }
    })
  }
  return true
}

let timer

async function updateMiaoPlugin (e) {
  if (!await checkAuth(e)) {
    return true
  }
  let isForce = e.msg.includes('强制')
  let command = 'git  pull'
  if (isForce) {
    command = 'git  checkout . && git  pull'
    e.reply('正在执行强制更新操作，请稍等')
  } else {
    e.reply('正在执行更新操作，请稍等')
  }
  exec(command, { cwd: `${_path}/plugins/miao-plugin/` }, function (error, stdout, stderr) {
    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
      e.reply('目前已经是最新版喵喵了~')
      return true
    }
    if (error) {
      e.reply('喵喵更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
      return true
    }
    e.reply('喵喵更新成功，正在尝试重新启动Yunzai以应用更新...')
    timer && clearTimeout(timer)
    Data.setCacheJSON('miao:restart-msg', {
      msg: '重启成功，新版喵喵已经生效',
      qq: e.user_id
    }, 30)
    timer = setTimeout(function () {
      let command = 'npm run start'
      if (process.argv[1].includes('pm2')) {
        command = 'npm run restart'
      }
      exec(command, function (error, stdout, stderr) {
        if (error) {
          e.reply('自动重启失败，请手动重启以应用新版喵喵。\nError code: ' + error.code + '\n' + error.stack + '\n')
          Bot.logger.error(`重启失败\n${error.stack}`)
          return true
        } else if (stdout) {
          Bot.logger.mark('重启成功，运行已转为后台，查看日志请用命令：npm run log')
          Bot.logger.mark('停止后台运行命令：npm stop')
          process.exit()
        }
      })
    }, 1000)
  })
  return true
}

async function miaoApiInfo (e) {
  if (!await checkAuth(e)) {
    return true
  }
  let { diyCfg } = await Data.importCfg('profile')
  let { qq, token } = (diyCfg?.miaoApi || {})
  if (!qq || !token) {
    return e.reply('未正确填写miaoApi token，请检查miao-plugin/config/profile.js文件')
  }
  if (token.length !== 32) {
    return e.reply('miaoApi token格式错误')
  }
  let req = await fetch(`http://miao.games/api/info?qq=${qq}&token=${token}`)
  let data = await req.json()
  if (data.status !== 0) {
    return e.reply('token检查错误，请求失败')
  }
  e.reply(data.msg)
}
