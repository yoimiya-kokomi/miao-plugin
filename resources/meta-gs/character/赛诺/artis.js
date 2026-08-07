import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({artis, weapon, def, rule}) {
    let title = []
    let particularAttr = {...usefulAttr['赛诺']}
    if (artis.names.includes('影中沉凝的幻灭')) {
        title.push('星超导')
        particularAttr.mastery = 100
        particularAttr.dmg = 0
        particularAttr.recharge = 40
        if (weapon.name === '赤沙之杖') {
            title.push('|专武')
            particularAttr.atk = 50
        }
    }
    if (title.length > 0) {
        return rule(`赛诺-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['赛诺'])
}
