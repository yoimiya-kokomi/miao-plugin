import lodash from 'lodash'
import { Common } from '#miao'

const CharMaterial = {
  async render ({ e, char }) {
    let data = char.getData()
    lodash.extend(data, char.getData('weaponTypeName,elemName'))
    // 加强版角色展示原角色名，不暴露Pro
    data.name = char.displayName
    data.isSr = char.isSr
    return await Common.render('wiki/character-material', {
      // saveId: `info-${char.id}`,
      data,
      attr: char.getAttrList(),
      detail: char.getDetail(),
      imgs: char.getImgs(),
      materials: char.getMaterials(),
      elem: char.elem,
      bodyClass: char.isSr ? 'sr-wiki' : ''
    }, { e, scale: 1.4 })
  }
}

export default CharMaterial
