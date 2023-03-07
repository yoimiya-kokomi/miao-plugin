import { Common } from '#miao'

const CharMaterial = {
  async render ({ e, char }) {
    let data = char.getData()
    return await Common.render('wiki/character-material', {
      // saveId: `info-${char.id}`,
      data,
      attr: char.getAttrList(),
      detail: char.getDetail(),
      imgs: char.getImgs(),
      materials: char.getMaterials(),
      elem: char.elem
    }, { e, scale: 1.4 })
  }
}

export default CharMaterial
