import { Data } from '../../components/index.js'
import lodash from 'lodash'

/**
 * 角色相关配置
 */
let CharCfg = {
  // 获取角色伤害计算相关配置
  async getCalcRule (char) {
    let cfg = await Data.importModule(`resources/meta/character/${char.name}/calc.js`)
    if (lodash.isEmpty(cfg)) {
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
  }
}
export default CharCfg
