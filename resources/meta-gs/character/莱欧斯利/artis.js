import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({artis, rule, def}) {
    let title = []
    let particularAttr = {...usefulAttr['莱欧斯利']}
    if (artis.names.includes('影中沉凝的幻灭')) {
        title.push('星超导')
        particularAttr.mastery = 100
        particularAttr.dmg = 0
    }
    if (title.length > 0) {
        return rule(`莱欧斯利-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['莱欧斯利'])
}
