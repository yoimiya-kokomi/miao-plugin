export default function (diyStyle, sysStyle, columnCount = 3) {
  let width = Math.min(1360, Math.max(800, columnCount * 266 + 30))
  let ret = [`body,.container{width:${width}px}.help-table .td,.help-table .th{width:${100 / columnCount}%}`]
  let css = function (sel, css, key, def, fn) {
    let val = diyStyle[key] || sysStyle[key] || def
    if (fn) {
      val = fn(val)
    }
    ret.push(`${sel}{${css}:${val}}`)
  }
  css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
  css('.help-title,.help-group', 'text-shadow', 'contBgColor', 'rgba(6, 21, 31, 0.5)', (c) => {
    c = c.replace(/,[^,]+\)/, ',1)')
    return `0 0 1px ${c};`
  })
  css('.help-desc', 'color', 'descColor', '#eee')
  css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
  css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => `blur(${n}px)`)
  css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
  css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
  css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
  return `<style>${ret.join('\n')}</style>`
}
