let Format = {
  int: function (d) {
    return parseInt(d)
  },
  comma: function (num, fix = 0) {
    num = parseFloat((num * 1).toFixed(fix))
    let [integer, decimal] = String.prototype.split.call(num, '.')
    integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,') // 正则先行断言
    return `${integer}${decimal ? '.' + decimal : ''}`
  },
  pct: function (num, fix = 1) {
    return (num * 1).toFixed(fix) + '%'
  },
  percent: function (num, fix = 1) {
    return Format.pct(num * 100, fix)
  }
}

export default Format
