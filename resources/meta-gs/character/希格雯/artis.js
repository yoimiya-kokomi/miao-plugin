import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
    if (cons === 6) {
        let particularAttr = JSON.parse(JSON.stringify(usefulAttr['希格雯']));
        particularAttr.dmg = 100;
        particularAttr.recharge = 75;
        particularAttr.heal = 90;
        return rule('希格雯-满命', particularAttr);
    }
    return def(usefulAttr['希格雯']);
}
