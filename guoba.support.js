/**
 * miao-plugin 锅巴（Guoba）配置面板适配
 *
 * 【设计说明】
 * - 遵循 config/system 目录的约定，不修改任何系统配置文件；
 *   config/system/cfg_system.js 中的 cfgSchema 仅以只读方式引用，
 *   Guoba 专属的控件配置统一定义在本文件的 componentOverrides 中。
 * - 面板保存通过 Cfg.set() 写入，与 #喵喵设置 命令同路径：
 *   同时更新内存配置并重新生成 config/cfg.js，保存后实时生效，无需重启Yunzai。
 * - schema 中 miao: true 的项在喵喵系Yunzai核心（TRSS-Yunzai / miao-yunzai / A-Yunzai）下
 *   由 Cfg.get 强制返回 true，面板中对应开关置灰展示为始终开启。
 * - schema 由 cfgSchema 自动生成，上游新增配置项后无需修改本文件即可在面板展示。
 */
import path from 'node:path'
import lodash from 'lodash'
import { fileURLToPath } from 'node:url'
import { Cfg, Version } from '#miao'
import { cfgSchema } from './config/system/cfg_system.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 按 cfgKey 覆盖默认生成的控件（不修改 config/system 下的系统文件） */
const componentOverrides = {
  // ---- 排名相关 ----
  groupRankLimit: {
    component: 'Select',
    componentProps: {
      options: [
        { label: '1 - 无限制', value: 1 },
        { label: '2 - 有CK', value: 2 },
        { label: '3 - 有16个角色或有CK', value: 3 },
        { label: '4 - 有御三家(安柏&凯亚&丽莎)或有CK', value: 4 },
        { label: '5 - 有16个角色+御三家或有CK', value: 5 }
      ]
    }
  },
  rankNumber: {
    componentProps: { min: 5, max: 30, step: 1 }
  },
  // ---- 面板服务 ----
  profileServer: {
    component: 'Select',
    bottomHelpMessage: '面板服务选择：0:自动，1:喵Api(需具备Token)，2:Enka-API，3:MiniGG-Api，4:Hutao-Enka代理。如需分服务器设置（国服/B服/外服，如112），请使用【#喵喵设置面板服务112】命令',
    componentProps: {
      options: [
        { label: '0 - 自动', value: '0' },
        { label: '1 - 喵Api (需具备Token)', value: '1' },
        { label: '2 - Enka-API', value: '2' },
        { label: '3 - MiniGG-Api', value: '3' },
        { label: '4 - Hutao-Enka代理', value: '4' }
      ]
    }
  },
  srProfileServer: {
    component: 'Select',
    bottomHelpMessage: '星铁面板服务选择：0:自动，1:喵Api(需具备Token)，2:Mihomo，3:Avocado(鳄梨)，4:EnkaHSR。如需分服务器设置（国服/B服/外服，如114），请使用【#喵喵设置星铁面板服务114】命令',
    componentProps: {
      options: [
        { label: '0 - 自动', value: '0' },
        { label: '1 - 喵Api (需具备Token)', value: '1' },
        { label: '2 - Mihomo', value: '2' },
        { label: '3 - Avocado (鳄梨)', value: '3' },
        { label: '4 - EnkaHSR', value: '4' }
      ]
    }
  },
  teamCalc: {
    bottomHelpMessage: '伤害计算包含组队Buff。目前为测试阶段，数据可能不准确，请慎重开启。数据为固定Buff而非真实面板数据，最终计算数值可能有偏差'
  },
  artisNumber: {
    componentProps: { min: 4, max: 100, step: 1 }
  },
  // ---- 资料查询 ----
  roleCharInfoSource: {
    component: 'Select',
    componentProps: {
      options: [
        { label: '1 - HomDGCat数据库（已阵亡）', value: 1 },
        { label: '2 - BWiki数据库（不建议使用）', value: 2 },
        { label: '3 - hakush.in数据库（已阵亡）', value: 3 },
        { label: '4 - nanoka.cc数据库（默认）', value: 4 }
      ]
    }
  },
  // ---- 系统设置 ----
  renderScale: {
    componentProps: { min: 50, max: 200, step: 5 }
  },
  originalPic: {
    component: 'Select',
    componentProps: {
      options: [
        { label: '0 - 不允许', value: 0 },
        { label: '1 - 仅允许角色图', value: 1 },
        { label: '2 - 仅允许面板图', value: 2 },
        { label: '3 - 开启', value: 3 },
        { label: '4 - 仅不允许获取面板图列表', value: 4 }
      ]
    }
  },
  commaGroup: {
    componentProps: { min: 1, max: 6, step: 1 }
  }
}

/** 以 cfgKey 为键的 schema 映射 */
function buildCfgSchemaMap () {
  let map = {}
  lodash.forEach(cfgSchema, (group) => {
    lodash.forEach(group.cfg, (item, cfgKey) => {
      map[cfgKey] = item
    })
  })
  return map
}

const cfgSchemaMap = buildCfgSchemaMap()

/** 由 cfgSchema 自动生成 Guoba 表单 schema */
function buildSchemas () {
  let schemas = []
  lodash.forEach(cfgSchema, (group) => {
    schemas.push({
      component: 'SOFT_GROUP_BEGIN',
      label: group.title
    })
    lodash.forEach(group.cfg, (item, cfgKey) => {
      let field = {
        field: cfgKey,
        label: item.title || item.key
      }
      if (item.desc) {
        field.bottomHelpMessage = item.desc
      }
      if (item.type === 'num') {
        field.component = 'InputNumber'
        field.componentProps = {}
      } else if (item.type === 'str') {
        field.component = 'Input'
        field.componentProps = {}
      } else {
        field.component = 'Switch'
        field.componentProps = {}
      }
      let override = componentOverrides[cfgKey]
      if (override) {
        lodash.merge(field, override)
      }
      if (item.miao && Version.isMiao) {
        field.componentProps.disabled = true
        field.bottomHelpMessage = (item.desc ? `${item.desc}\n` : '') + '※ 喵喵系Yunzai核心下本项始终开启'
      }
      schemas.push(field)
    })
  })
  return schemas
}

export function supportGuoba () {
  return {
    pluginInfo: {
      name: 'miao-plugin',
      title: '喵喵插件',
      author: '@yoimiya-kokomi',
      authorLink: 'https://github.com/yoimiya-kokomi',
      link: 'https://github.com/yoimiya-kokomi/miao-plugin',
      isV3: true,
      isV2: false,
      description: '喵喵插件：提供角色面板、角色查询、练度统计、抽卡分析、角色百科、帮助配置等功能',
      icon: 'mdi:cat',
      iconColor: '#e9b16d',
      iconPath: path.join(__dirname, 'resources/common/icon.png')
    },
    configInfo: {
      schemas: buildSchemas(),
      // 获取配置数据（用于前端填充显示数据）
      async getConfigData () {
        let cfg = Cfg.getCfg() || {}
        let ret = {}
        lodash.forEach(cfgSchemaMap, (item, cfgKey) => {
          let val = cfg[cfgKey]
          if (lodash.isUndefined(val)) {
            val = item.def
          }
          if (item.miao && Version.isMiao) {
            val = true
          }
          ret[cfgKey] = val
        })
        return ret
      },
      // 设置配置（前端点确定后调用）：校验后经 Cfg.set 写入，实时生效
      async setConfigData (data, { Result }) {
        let count = 0
        let skipped = 0
        lodash.forEach(data || {}, (val, cfgKey) => {
          let item = cfgSchemaMap[cfgKey]
          if (!item) {
            return
          }
          // 喵喵系核心下始终开启的项不接受修改
          if (item.miao && Version.isMiao) {
            skipped++
            return
          }
          let ret
          if (item.input) {
            ret = item.input(val)
          } else if (item.type === 'num') {
            ret = val * 1 || item.def
          } else if (item.type === 'str') {
            ret = (lodash.isNil(val) || val === '') ? String(item.def) : String(val)
          } else {
            ret = !!val
          }
          Cfg.set(cfgKey, ret)
          count++
        })
        return Result.ok({}, `保存成功，配置已实时生效（更新${count}项${skipped ? `，${skipped}项在喵喵系核心下始终开启` : ''}）`)
      }
    }
  }
}
