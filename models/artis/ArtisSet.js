// 处理套装相关
import { ArtifactSet } from '#miao.models'

const ArtisSet = {
  /**
   * 获取套装统计
   * @param artis
   * @returns {{imgs: *[], names: *[], sets: {}, abbrs: *[], sName: string, name: (string|*)}}
   * @returns sets 套装个数， {套装名:2/4}
   * @returns names 套装名数组
   * @returns imgs 套装图像
   * @returns abbrs 套装组合
   * @returns name 套装展示名
   * @returns sName 套装精简名
   */
  getSetData (artis) {
    let setCount = {}
    artis.forEach((arti, idx) => {
      setCount[arti.set] = (setCount[arti.set] || 0) + 1
    })

    let sets = {}
    let names = []
    let imgs = []
    let abbrs = []
    let abbrs2 = []
    for (let set in setCount) {
      if (setCount[set] >= 2) {
        let count = setCount[set] >= 4 ? 4 : 2
        sets[set] = count
        let artiSet = ArtifactSet.get(set)
        names.push(artiSet.name)
        imgs.push(artiSet.img)
        abbrs.push(artiSet.abbr + count)
        abbrs2.push(artiSet.name + count)
      }
    }
    return {
      sets,
      names,
      imgs,
      abbrs: [...abbrs, ...abbrs2],
      name: (abbrs.length > 1 || abbrs2[0]?.length > 7) ? abbrs.slice(0, 2).join('+') : abbrs2[0],
      sName: abbrs.slice(0, 2).join('+')
    }
  }
}

export default ArtisSet
