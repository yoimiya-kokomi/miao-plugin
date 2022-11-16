import { cfgSchema } from '../../config/system/cfg_system.js'
import lodash from 'lodash'
import { Data } from '../index.js'
import fs from 'node:fs'

let cfgData = {
  async loadOldData () {
    const _path = process.cwd()
    const _cfgPath = `${_path}/plugins/miao-plugin/components/`
    if (!fs.existsSync(_cfgPath + 'cfg.json')) {
      return false
    }
    let old = Data.readJSON('/components/cfg.json')
    let cfg = await Data.importModule('/config/cfg.js')
    let ret = {}
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgKey] = Data.def(cfg[cfgKey], cfgItem.oldCfgKey ? Data.getVal(old, cfgItem.oldCfgKey) : undefined, cfgItem.def)
      })
    })
    return ret
  },

  saveCfg (cfg) {
    let ret = []
    lodash.forEach(cfgSchema, (cfgGroup) => {
      ret.push(`/** ************ 【${cfgGroup.title}】 ************* */`)
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret.push(`// ${cfgItem.desc || cfgItem.title}`)
        let val = Data.def(cfg[cfgKey], cfgItem.def)
        if (cfgItem.input) {
          val = cfgItem.input(val)
        }
        ret.push(`export const ${cfgKey} = ${val.toString()}`, '')
      })
    })
    fs.writeFileSync(`${process.cwd()}/plugins/miao-plugin/config/cfg.js`, ret.join('\n'), 'utf8')
  },

  async getCfg () {
    return lodash.toPlainObject(await Data.importModule('/config/cfg.js'))
  },

  getCfgSchemaMap () {
    let ret = {}
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgItem.key] = cfgItem
        cfgItem.cfgKey = cfgKey
      })
    })
    return ret
  },
  getCfgSchema () {
    return cfgSchema
  }
}
export default cfgData
