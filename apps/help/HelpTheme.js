import lodash from 'lodash'
import fs from 'node:fs'
import { Data } from '#miao'

let HelpTheme = {
  async getThemeCfg (theme, exclude) {
    let dirPath = './plugins/miao-plugin/resources/help/theme/'
    let ret = []
    let names = []
    let dirs = fs.readdirSync(dirPath)
    lodash.forEach(dirs, (dir) => {
      if (fs.existsSync(`${dirPath}${dir}/main.png`)) {
        names.push(dir)
      }
    })
    if (lodash.isArray(theme)) {
      ret = lodash.intersection(theme, names)
    } else if (theme === 'all') {
      ret = names
    }
    if (exclude && lodash.isArray(exclude)) {
      ret = lodash.difference(ret, exclude)
    }
    if (ret.length === 0) {
      ret = ['default']
    }
    let name = lodash.sample(ret)
    let resPath = '{{_res_path}}/help/theme/'
    return {
      main: `${resPath}${name}/main.png`,
      bg: fs.existsSync(`${dirPath}${name}/bg.jpg`) ? `${resPath}${name}/bg.jpg` : `${resPath}default/bg.jpg`,
      style: (await Data.importModule(`resources/help/theme/${name}/config.js`, 'miao')).style || {}
    }
  },
  async getThemeData (diyStyle, sysStyle) {
    let helpConfig = lodash.extend({}, sysStyle, diyStyle)
    let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
    let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265))
    let width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
    let theme = await HelpTheme.getThemeCfg(diyStyle.theme || sysStyle.theme, diyStyle.themeExclude || sysStyle.themeExclude)
    let themeStyle = theme.style || {}
    let ret = [`
    body{background-image:url(${theme.bg});width:${width}px;}
    .container{background-image:url(${theme.main});width:${width}px;}
    .help-table .td,.help-table .th{width:${100 / colCount}%}
    `]
    let css = function (sel, css, key, def, fn) {
      let val = Data.def(themeStyle[key], diyStyle[key], sysStyle[key], def)
      if (fn) {
        val = fn(val)
      }
      ret.push(`${sel}{${css}:${val}}`)
    }
    css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
    css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
    css('.help-desc', 'color', 'descColor', '#eee')
    css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
    css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
    css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
    css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
    css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
    return {
      style: `<style>${ret.join('\n')}</style>`,
      colCount
    }
  }
}
export default HelpTheme
