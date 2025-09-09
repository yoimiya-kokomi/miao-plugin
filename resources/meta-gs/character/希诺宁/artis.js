import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, rule, def}) {
    let title = []
    let particularAttr = {...usefulAttr['希诺宁']}
    if (attr.cpct * 2 + attr.cdmg > 240) {
        title.push('战斗')
        particularAttr.cpct = 100
        particularAttr.cdmg = 100
        particularAttr.recharge = 55
        particularAttr.heal = 70
    }
    if (title.length > 0) {
        return rule(`希诺宁-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['希诺宁'])
}
