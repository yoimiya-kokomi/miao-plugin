import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, cons, def, rule}) {
    let title = []
    let particularAttr = {...usefulAttr['爱可菲']}
    if (attr.recharge >= 200) {
        title.push('纯辅')
        particularAttr.atk = 75
        particularAttr.cpct = 0
        particularAttr.cdmg = 0
        particularAttr.dmg = 0
        particularAttr.recharge = 100
        if (cons > 1) {
            title.push('|高命')
            particularAttr.atk = 100
        }
    }
    if (title.length > 0) {
        return rule(`爱可菲-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['爱可菲'])
}
