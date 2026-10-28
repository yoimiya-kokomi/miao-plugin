/**
 * moment 兼容层
 * TRSS-Yunzai 在 package.json 中把 moment 换成了 dayjs（"moment": "npm:dayjs@^1.11"），
 * 插件用到的 weekday、duration().humanize()、moment.min/max、按格式解析、中文 locale 以及
 * hours() 等复数写法 dayjs 默认都没有。检测到 dayjs 时补齐这些能力，仍是 moment 时原样导出
 */
import moment from 'moment'

if (typeof moment.extend === 'function') {
  for (const name of ['weekday', 'duration', 'relativeTime', 'minMax', 'customParseFormat']) {
    moment.extend((await import(`moment/plugin/${name}.js`)).default)
  }

  // moment 的复数取值 / 设值方法（hours() 等）在 dayjs 中只有单数形式
  moment.extend((option, Dayjs) => {
    for (const unit of ['millisecond', 'second', 'minute', 'hour', 'date', 'day', 'month', 'year']) {
      Dayjs.prototype[`${unit}s`] ??= function (...args) {
        return this[unit](...args)
      }
    }
  })

  // dayjs 自带的 locale 文件内部 require('dayjs')，以 moment 别名安装时找不到，这里直接注册中文 locale
  // 只注册不切换，与 moment 一致由 moment.locale('zh-cn') 切换；weekStart 为 1 时 weekday() 以周一为 0
  moment.locale({
    name: 'zh-cn',
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    ordinal: n => n,
    weekStart: 1,
    yearStart: 4,
    formats: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY年M月D日',
      LLL: 'YYYY年M月D日Ah点mm分',
      LLLL: 'YYYY年M月D日ddddAh点mm分'
    },
    relativeTime: {
      future: '%s后',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年'
    },
    meridiem: (hour, minute) => {
      const hm = hour * 100 + minute
      if (hm < 600) return '凌晨'
      if (hm < 900) return '早上'
      if (hm < 1100) return '上午'
      if (hm < 1300) return '中午'
      if (hm < 1800) return '下午'
      return '晚上'
    }
  }, null, true)
}

export default moment
