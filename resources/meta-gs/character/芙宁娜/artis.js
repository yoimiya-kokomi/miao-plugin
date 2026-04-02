import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, weapon, rule, def}) {
    let title = []
    let particularAttr = {...usefulAttr['芙宁娜']}
    if (cons >= 4) {
        title.push('高命')
        particularAttr.recharge = 60
        if (cons == 6) {
            particularAttr.mastery = 45
        }
    }
    if (title.length > 0) {
        return rule(`芙宁娜-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['芙宁娜'])
}
