import lodash from 'lodash'

const CharMeta = {
  getMeta ({ $, id, name, setIdx = '', elem = '', detail = {}, attr }) {
    return {
      keys: attr.keys,
      attrs: attr.details,
      talent: CharMeta.getTalentMeta(detail.talent)
    }
  },

  getTalentMeta (talentData) {
    let ret = {}
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let map = {}
      lodash.forEach(talentData[key].tables, (tr) => {
        if (tr.isSame) {
          return true
        }
        let name = tr.name
        map[name] = []

        lodash.forEach(tr.values, (val) => {
          // eslint-disable-next-line no-control-regex
          val = val.replace(/[^\x00-\xff]/g, '').trim()
          val = val.replace(/[a-zA-Z]/g, '').trim()
          let valArr = []
          let valArr2 = []
          lodash.forEach(val.split('/'), (v, idx) => {
            let valNum = 0
            lodash.forEach(v.split('+'), (v) => {
              v = v.split('*')
              let v1 = v[0].replace('%', '').trim()
              valNum += v1 * (v[1] || 1)
              valArr2.push(v1 * 1)
            })
            valArr.push(valNum)
          })

          let name = tr.name2 || tr.name
          if (isNaN(valArr[0])) {
            map[name].push(false)
          } else if (valArr.length === 1) {
            map[name].push(valArr[0])
          } else {
            map[name].push(valArr)
          }
          if (valArr2.length > 1) {
            map[name + '2'] = map[name + '2'] || []
            map[name + '2'].push(valArr2)
          }
        })
      })
      ret[key] = map
    })
    return ret
  }
}
export default CharMeta
