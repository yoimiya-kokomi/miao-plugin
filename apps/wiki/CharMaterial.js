import lodash from 'lodash'
import { Common } from '#miao'

const CharMaterial = {
  async render ({ e, char }) {
    let data = char.getData()
    lodash.extend(data, char.getData('weaponTypeName,elemName'))
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
