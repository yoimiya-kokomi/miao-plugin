import { Data } from '#miao'
import lodash from 'lodash'
import fs from 'node:fs'

const charPath = process.cwd() + '/plugins/miao-plugin/resources/meta-gs/character'
let cfgMap = {
  char: {},
  async init () {
    let chars = fs.readdirSync(charPath)
    for (let char of chars) {
      cfgMap.char[char] = {}
      let curr = cfgMap.char[char]
      // 评分规则
      if (cfgMap.exists(char, 'artis_user')) {
        curr.artis = await cfgMap.getCfg(char, 'artis_user', 'default')
      } else if (cfgMap.exists(char, 'artis')) {
        curr.artis = await cfgMap.getCfg(char, 'artis', 'default')
      }
      // 伤害计算
      if (cfgMap.exists(char, 'calc_user')) {
        curr.calc = await cfgMap.getCfg(char, 'calc_user')
      } else if (cfgMap.exists(char, 'calc')) {
        curr.calc = await cfgMap.getCfg(char, 'calc')
      }
    }
  },
  exists (char, file) {
    return fs.existsSync(`${charPath}/${char}/${file}.js`)
  },
  async getCfg (char, file, module = '') {
    let cfg = await Data.importModule(`resources/meta-gs/character/${char}/${file}.js`, 'miao')
    if (module) {
      return cfg[module]
    }
    return cfg
  }
}
await cfgMap.init()

/**
 * 角色相关配置
 */
let CharCfg = {
  // 获取角色伤害计算相关配置
  getCalcRule (char) {
    let cfg = cfgMap.char[char.isTraveler ? `旅行者/${char.elem}` : char.name]?.calc
    if (!cfg || lodash.isEmpty(cfg)) {
      return false
    }
    return {
      details: cfg.details || false, // 计算详情
      buffs: cfg.buffs || [], // 角色buff
      defParams: cfg.defParams || {}, // 默认参数，一般为空
      defDmgIdx: cfg.defDmgIdx || -1, // 默认详情index
      defDmgKey: cfg.defDmgKey || '',
      mainAttr: cfg.mainAttr || 'atk,cpct,cdmg', // 伤害属性
      enemyName: cfg.enemyName || '小宝' // 敌人名称
    }
  },
  getArtisCfg (char) {
    return cfgMap.char[char.isTraveler ? '旅行者' : char.name]?.artis || false
  }
}
export default CharCfg
